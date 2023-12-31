import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Typography } from "@mui/material";
import { Author } from "../../interfaces/interfaces";
import { getUserCredentials, getUserData } from "../../utils/localStorageUtils";
import AuthorsList from "../author/AuthorsList";
import { remoteAuthorHosts } from "../../lists/lists";
import { Hosts, Username } from "../../enums/enums";
import Loading from "../ui/Loading";
import { getCodeFromObjectId } from "../../utils/responseUtils";

const APP_URI = process.env.REACT_APP_URI;

const DiscoverContent = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const loggedUserData = getUserData();

  useEffect(() => {
    const fetchAuthors = async () => {
      const remoteAuthorsUrls = remoteAuthorHosts.map(url => {
        if (url === Hosts.TRIET) {
          return `${url}/authors`;
        } else if (url === Hosts.NETNINJAS) {
          return `${Hosts.NETNINJASAPI}authors/`;
        } else {
          return `${url}authors/`;
        }
      });

      const fetchAuthorsPromises = remoteAuthorsUrls.map(url => {
        return axios.get(url, {
          auth: {
            username: Username.NOTFOUND,
            password: getCodeFromObjectId(url),
          },
        });
      });

      const userCredentials = getUserCredentials();
      const localAuthorsUrl = `${APP_URI}authors/`;

      if (userCredentials.username && userCredentials.password) {
        fetchAuthorsPromises.push(
          axios.get(localAuthorsUrl, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          })
        );
      }

      try {
        const results = await Promise.allSettled(fetchAuthorsPromises);
        const successfulResults = results
          .filter(result => result.status === "fulfilled")
          .map(result => (result as any).value.data.items)
          .flat();

        const filteredAuthors = successfulResults.filter(
          (author: Author) => author.id !== loggedUserData.id
        );

        filteredAuthors.sort((a, b) => {
            return a.displayName.localeCompare(b.displayName);
        });

        setAuthors(filteredAuthors);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };

    fetchAuthors();
  }, []);

  return (
    <Grid container direction={"row"}>
      <Grid
        container
        alignItems="center"
        sx={{
          borderBottom: "1px solid #dbd9d9",
          paddingX: 2,
          paddingY: 1,
        }}
      >
        <Grid item xs={12} textAlign="center">
          <Typography
            variant="h6"
            sx={{
              padding: 0,
              fontWeight: "bold"
            }}
          >
            Discover Authors
          </Typography>
        </Grid>
      </Grid>
      {isLoading ? (
        <Loading />
      ) : (
        <Grid container>
          {authors.length > 0 ? (
            <AuthorsList authors={authors} />
          ) : (
            <Typography
              variant="h6"
              align="center"
              sx={{
                marginTop: 5,
                marginLeft: "auto",
                marginRight: "auto",
                color: "#858585",
              }}
            >
              No authors to discover...
            </Typography>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default DiscoverContent;

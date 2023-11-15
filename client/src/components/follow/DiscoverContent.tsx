import React, { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { Avatar, Button, Card, CardHeader, Grid, Typography } from "@mui/material";
import { Author } from "../../interfaces/interfaces";
import { getAuthorId } from "../../utils/localStorageUtils";
import { getAuthorIdFromResponse } from "../../utils/responseUtils";
import { useNavigate } from "react-router-dom";

const APP_URI = process.env.REACT_APP_URI;

const DiscoverContent = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [user, setUser] = useState<Author | null>(null);
  const navigate = useNavigate();

  const fetchAuthors = useCallback(async () => {
    const AUTHOR_ID = getAuthorId();
    const url = `${APP_URI}authors/`;
    try {
      const response = await axios.get(url);
      const filtered_authors = response.data["items"].filter((author: Author) =>
        getAuthorIdFromResponse(author.id) !== AUTHOR_ID)
      const author_user = response.data["items"].find((author: Author) =>
        getAuthorIdFromResponse(author.id) === AUTHOR_ID)
      setAuthors(filtered_authors);
      setUser(author_user);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
    }
  }, []);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  const handleViewProfileClick = (author: Author) => {
    const authorId = getAuthorIdFromResponse(author.id);
    navigate(
      `/authors/${authorId}`,
      {
        state: {
          otherAuthorObject: author,
          userObject: user
        }
      }
    );
  };

  return (
    <Grid container direction={"row"}>
      <Grid container>
        <Grid item xs={12} textAlign="center">
          <Typography
            variant="h6"
            sx={{
              padding: 2,
              borderBottom: "1px solid #dbd9d9"
            }}
          >
            Discover Authors
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        {authors.length > 0 ?
          (authors.map((author) => (
          <Grid
            container
            key={author.id} 
            alignItems="center"
            sx={{
              borderBottom: "1px solid #dbd9d9"
            }}
            >
            <Grid item xs={6}>
              <Card
                style={{
                  margin: "auto",
                  width: "100%",
                  border:0
                }}
                variant="outlined"
              >
                <CardHeader
                  avatar={<Avatar src={author.profileImage} alt={author.displayName}/>}
                  title={author.displayName}
                />
              </Card>
            </Grid>
            <Grid container item xs={6} justifyContent="flex-end">
              <Button
                variant="contained"
                size="small"
                color="primary"
                sx={{
                  borderRadius: 20,
                  marginRight: 2,
                  paddingLeft: 2,
                  paddingRight: 2
                }}
                onClick={() => handleViewProfileClick(author)}
              >
                <Typography textTransform={"none"} variant="subtitle1">
                  View Profile
                </Typography>
              </Button>
            </Grid>
          </Grid>
        )))
          : (
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
          )
        }
      </Grid>
    </Grid>
  );
};

export default DiscoverContent;

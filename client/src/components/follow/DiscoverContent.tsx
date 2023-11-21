import React, { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { Grid, Typography } from "@mui/material";
import { Author } from "../../interfaces/interfaces";
import { getAuthorId, getUserData } from "../../utils/localStorageUtils";
import { getAuthorIdFromResponse } from "../../utils/responseUtils";
import { useNavigate } from "react-router-dom";
import AuthorsList from "../author/AuthorsList";

const APP_URI = process.env.REACT_APP_URI;

const DiscoverContent = () => {
  const [authors, setAuthors] = useState<Author[]>([]);

  const fetchAuthors = useCallback(async () => {
    const AUTHOR_ID = getAuthorId();
    const url = `${APP_URI}authors/`;
    try {
      const response = await axios.get(url);
      const filtered_authors = response.data["items"].filter((author: Author) =>
        getAuthorIdFromResponse(author.id) !== AUTHOR_ID)
      setAuthors(filtered_authors);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
    }
  }, []);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  return (
    <Grid container direction={"row"}>
      <Grid container>
        <Grid item xs={12} textAlign="center">
          <Typography
            variant="h6"
            sx={{
              padding: 2,
              borderBottom: "1px solid #dbd9d9",
              fontWeight: "bold"
            }}
          >
            Discover Authors
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        {authors.length > 0 ?
          (
            <AuthorsList authors={authors} />
          )
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

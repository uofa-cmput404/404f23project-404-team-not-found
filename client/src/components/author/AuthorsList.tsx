import React, { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { Avatar, Button, Card, CardHeader, Grid, Typography } from "@mui/material";
import { Author } from "../../interfaces/interfaces";
import { getAuthorId, getUserData } from "../../utils/localStorageUtils";
import { getAuthorIdFromResponse } from "../../utils/responseUtils";
import { useNavigate } from "react-router-dom";

const APP_URI = process.env.REACT_APP_URI;

const AuthorsList = ({
  authors,
}: {
  authors: Author[];
}) => {
  const navigate = useNavigate();
  const loggedUser = getUserData();

  const handleViewProfileClick = (author: Author) => {
    const authorId = getAuthorIdFromResponse(author.id);
    navigate(
      `/authors/${authorId}`,
      {
        state: {
          otherAuthorObject: author,
          userObject: loggedUser
        }
      }
    );
  };

  return (
    <Grid container>
      {authors.map((author) => (
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
                titleTypographyProps={{
                  fontSize: "1em",
                }}
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
      ))}
    </Grid>
  );
};

export default AuthorsList;
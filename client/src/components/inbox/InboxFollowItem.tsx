import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, CardHeader, Theme, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuthorIdFromResponse } from "../../utils/responseUtils";
import { makeStyles } from "@mui/styles";

const APP_URI = process.env.REACT_APP_URI;

const useStyles = makeStyles((theme: Theme) => ({
  avatar_button: {
    cursor: "pointer",
  },
}));

const InboxFollowItem = ({
  followItem,
}: {
  followItem: any;
}) => {
  const navigate = useNavigate();
  const [followButtonDisabled, setFollowButtonDisabled] = useState(false);
  const classes = useStyles();

  useEffect(() => {
  }, []);

  const handleAuthorProfileClick = () => {
    const authorId = getAuthorIdFromResponse(followItem.actor.id);
    navigate(`/authors/${authorId}`);
  };

  return (
    <Grid container alignItems="center">
      <Grid item xs={6}>
        <Card
          style={{
            margin: "auto",
            width: "100%",
            border: 0,
          }}
          variant="outlined"
          >
          <CardHeader
            avatar={
              <Avatar
                alt={followItem.actor.displayName}
                sx={{
                  cursor: "pointer",
                }}
                src={followItem.actor.profileImage}
                onClick={() => { handleAuthorProfileClick() }}
              />
            }
            title={`${followItem.actor.displayName} wants to follow you`}
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
          onClick={() => handleAuthorProfileClick()}
        >
          <Typography textTransform={"none"} variant="subtitle1">
            Accept
          </Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default InboxFollowItem;
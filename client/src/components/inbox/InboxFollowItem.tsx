import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, CardHeader, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuthorIdFromResponse } from "../../utils/responseUtils";
import axios from "axios";
import { getAuthorId, getUserData } from "../../utils/localStorageUtils";
import { toast } from "react-toastify";

const APP_URI = process.env.REACT_APP_URI;

const InboxFollowItem = ({
  followItem,
}: {
  followItem: any;
}) => {
  const navigate = useNavigate();
  const [followButtonDisabled, setFollowButtonDisabled] = useState(false);
  const loggedUserId = getAuthorId();
  const loggedUser = getUserData();

  useEffect(() => {
    const fetchIsUserFollowingAuthor = async () => {
      const authorId = getAuthorIdFromResponse(followItem.actor.id);
      const url = `${APP_URI}authors/${loggedUserId}/followers/${authorId}/`;

      try {
        const response = await axios.get(url);
        setFollowButtonDisabled(response.data.is_follower);
      } catch (error) {
        setFollowButtonDisabled(false);
      }
    };

    fetchIsUserFollowingAuthor();
  }, []);

  const handleAuthorProfileClick = () => {
    const authorId = getAuthorIdFromResponse(followItem.actor.id);
    navigate(
      `/authors/${authorId}`,
      {
        state: {
          otherAuthorObject: followItem.actor,
          userObject: loggedUser
        }
      }
    );
  };

  const handleAcceptFollow = async () => {
    // actor is the one who wants to follow and object is the author actor wants to follow
    const data = {
      actor:  followItem.actor,
      object: followItem.object
    };
    const authorId = getAuthorIdFromResponse(followItem.actor.id);
    const url = `${APP_URI}authors/${loggedUserId}/followers/${authorId}/`;

    try {
      const response = await axios.put(url, data);
      setFollowButtonDisabled(true);
    } catch (error) {
      toast.error("Failed to accept follow");
    }
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
          disabled={followButtonDisabled}
          variant="contained"
          size="small"
          color="primary"
          sx={{
            borderRadius: 20,
            marginRight: 2,
            paddingLeft: 2,
            paddingRight: 2
          }}
          onClick={() => { handleAcceptFollow() }}
        >
          <Typography textTransform={"none"} variant="subtitle1">
            { followButtonDisabled ? "Accepted" : "Accept" }
          </Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default InboxFollowItem;
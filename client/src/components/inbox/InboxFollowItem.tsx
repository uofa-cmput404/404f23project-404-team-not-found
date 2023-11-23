import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, CardHeader, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuthorIdFromResponse } from "../../utils/responseUtils";
import axios from "axios";
import { getAuthorId, getUserData } from "../../utils/localStorageUtils";
import { toast } from "react-toastify";
import Loading from "../ui/Loading";

const APP_URI = process.env.REACT_APP_URI;

const InboxFollowItem = ({
  followItem,
  removeFollowItem,
}: {
  followItem: any;
  removeFollowItem: (actorId: string, objectId: string) => void;
}) => {
  const navigate = useNavigate();
  const [followAccepted, setFollowAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const loggedUserId = getAuthorId();
  const loggedUser = getUserData();

  useEffect(() => {
    const fetchIsUserFollowingAuthor = async () => {
      const authorId = getAuthorIdFromResponse(followItem.actor.id);
      const url = `${APP_URI}authors/${loggedUserId}/followers/${authorId}/`;

      try {
        const response = await axios.get(url);
        setFollowAccepted(response.data.is_follower);
      } catch (error) {
        setFollowAccepted(false);
        console.error("Failed to fetch if user is following the author: ", error);
      } finally {
        setIsLoading(false);
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
      setFollowAccepted(true);
    } catch (error) {
      toast.error("Failed to accept follow");
    }
  };

  const handleDenyFollow = async () => {
    const authorId = getAuthorIdFromResponse(followItem.actor.id);
    const url = `${APP_URI}authors/${loggedUserId}/follows/${authorId}/`;

    try {
      const response = await axios.delete(url);
      removeFollowItem(followItem.actor.id, followItem.object.id);
    } catch (error) {
      toast.error("Failed to decline follow request");
    }
  };

  return isLoading ? (
    <Loading />
    ) : (
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
            titleTypographyProps={{
              fontSize: "1em",
            }}
          />
        </Card>
      </Grid>
      <Grid container item xs={6} justifyContent="flex-end">
        {!followAccepted &&
          <Button
            variant="contained"
            size="small"
            sx={{
              borderRadius: 20,
              marginRight: 2,
              paddingX: 2,
              background: "#CC2828",
              ":hover": {
                background: "#ad0e0e",
              },
              width: "8rem"
            }}
            onClick={() => { handleDenyFollow() }}
          >
            <Typography textTransform={"none"} variant="subtitle1">
              Decline
            </Typography>
          </Button>
        }
        <Button
          disabled={followAccepted}
          variant="contained"
          size="small"
          color="primary"
          sx={{
            borderRadius: 20,
            marginRight: 1.5,
            paddingX: 2,
            width: "8rem"
          }}
          onClick={() => { handleAcceptFollow() }}
        >
          <Typography textTransform={"none"} variant="subtitle1">
            { followAccepted ? "Accepted" : "Accept" }
          </Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default InboxFollowItem;
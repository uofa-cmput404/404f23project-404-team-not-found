import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuthorIdFromResponse } from "../../utils/responseUtils";
import axios from "axios";
import {
  getAuthorId,
  getUserCredentials,
  getUserData,
} from "../../utils/localStorageUtils";
import { toast } from "react-toastify";

const APP_URI = process.env.REACT_APP_URI;

const InboxFollowItem = ({
  followItem,
  isFollowAccepted,
  removeFollowItem,
}: {
  followItem: any;
  isFollowAccepted: boolean;
  removeFollowItem: (actorId: string, objectId: string) => void;
}) => {
  const navigate = useNavigate();
  const [followAccepted, setFollowAccepted] = useState(isFollowAccepted);
  const loggedUserId = getAuthorId();
  const loggedUser = getUserData();

  const handleAuthorProfileClick = () => {
    const authorId = getAuthorIdFromResponse(followItem.actor.id);
    navigate(`/authors/${authorId}`, {
      state: {
        otherAuthorObject: followItem.actor,
        userObject: loggedUser,
      },
    });
  };

  const handleAcceptFollow = async () => {
    // actor is the one who wants to follow and object is the author actor wants to follow
    const data = {
      actor: followItem.actor,
      object: followItem.object,
    };
    const authorId = getAuthorIdFromResponse(followItem.actor.id);
    const url = `${APP_URI}authors/${loggedUserId}/followers/${authorId}/`;

    try {
      const userCredentials = getUserCredentials();
      if (userCredentials.username && userCredentials.password) {
        const response = await axios.put(url, data, {
          auth: {
            username: userCredentials.username,
            password: userCredentials.password,
          },
        });
        setFollowAccepted(true);
      }
    } catch (error) {
      toast.error("Failed to accept follow");
    }
  };

  const handleDenyFollow = async () => {
    const authorId = getAuthorIdFromResponse(followItem.actor.id);
    const url = `${APP_URI}authors/${loggedUserId}/follows/${authorId}/`;

    try {
      const userCredentials = getUserCredentials();

      if (userCredentials.username && userCredentials.password) {
        const response = await axios.delete(url, {
          auth: {
            username: userCredentials.username,
            password: userCredentials.password,
          },
        });
        removeFollowItem(followItem.actor.id, followItem.object.id);
      }
    } catch (error) {
      toast.error("Failed to decline follow request");
    }
  };

  return (
    <Grid
      container
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
                onClick={() => {
                  handleAuthorProfileClick();
                }}
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
        {!followAccepted && (
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
              width: "8rem",
            }}
            onClick={() => {
              handleDenyFollow();
            }}
          >
            <Typography textTransform={"none"} variant="subtitle1">
              Decline
            </Typography>
          </Button>
        )}
        <Button
          disabled={followAccepted}
          variant="contained"
          size="small"
          color="primary"
          sx={{
            borderRadius: 20,
            marginRight: 1.5,
            paddingX: 2,
            width: "8rem",
          }}
          onClick={() => {
            handleAcceptFollow();
          }}
        >
          <Typography textTransform={"none"} variant="subtitle1">
            {followAccepted ? "Accepted" : "Accept"}
          </Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default InboxFollowItem;

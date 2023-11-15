import React, { useEffect, useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import { Author } from "../../interfaces/interfaces";
import axios from "axios";
import { toast } from "react-toastify";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { getAuthorId } from "../../utils/localStorageUtils";

const APP_URI = process.env.REACT_APP_URI;

const FollowAuthorButton = ({
  authorId,
  otherAuthorObject,
  setIsUserFollowingAuthor,
  userObject,
}: {
  authorId: string,
  otherAuthorObject: Author;
  setIsUserFollowingAuthor: (value : boolean) => void;
  userObject: Author;
}) => {
  const [followButtonText, setFollowButtonText] = useState("Follow");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const loggedUserId = getAuthorId();

  const sendFollowToInbox = async () => {
    // actor is the one who wants to follow and object is the author actor wants to follow
    const data = {
      type: "Follow",
      summary: `${userObject.displayName} wants to follow ${otherAuthorObject.displayName}`,
      actor:  userObject,
      object: otherAuthorObject
    };

    const url = `${APP_URI}author/${authorId}/inbox/`;

    try {
      await axios.post(url, data);
      setFollowButtonText("Requested");
      setIsRequested(true);
    } catch (error) {
      toast.error("Failed to send a follow request")
    }
  };

  useEffect(() => {
    const fetchFollowRequestExists = async () => {
      const url = `${APP_URI}author/${authorId}/inbox/`;

      try {
        const response = await axios.get(url);
        const items = response.data.items;
        const followRequestExists: boolean = items.some((item: any) =>
            item.type === 'Follow' && item.actor && item.actor.id === userObject.id
        );
        setIsRequested(followRequestExists);
      } catch (error) {
        console.error("Error fetching if user already requested: ", error);
      }
    };

    fetchFollowRequestExists();
  }, []);

    useEffect(() => {
      const fetchIsUserFollowingAuthor = async () => {
        const url = `${APP_URI}author/${authorId}/followers/${loggedUserId}/`;

        try {
          const response = await axios.get(url);
          if (response.data.is_follower) {
            setFollowButtonText("Following");
            setIsFollowing(true);
          } else if (isRequested) {
            setFollowButtonText("Requested");
            setIsFollowing(false);
          } else {
            setFollowButtonText("Follow");
            setIsFollowing(false);
          }
        } catch (error) {
          console.error("Error fetching is follower: ", error);
        }
      };

      fetchIsUserFollowingAuthor();
    }, [isRequested]);

  return (
    <Button
      disabled={isFollowing || isRequested}
      variant="outlined"
      size="small"
      style={{
        marginTop: 10,
        width: "auto",
        borderRadius: 100,
        paddingLeft: 20,
        paddingRight: 20,
        border: "1px solid #103f5b"
      }}
      onClick={sendFollowToInbox}
      endIcon={isFollowing ? <HowToRegIcon /> : <PersonAddIcon />}
    >
      <Typography
        textTransform="none"
        variant="subtitle1"
      >
        <strong>{followButtonText}</strong>
      </Typography>
    </Button>
  );
};

export default FollowAuthorButton;
import React, { useEffect, useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import { Author } from "../../interfaces/interfaces";
import axios from "axios";
import { toast } from "react-toastify";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { getAuthorId, getUserCredentials } from "../../utils/localStorageUtils";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import UnfollowAuthorModal from "./UnfollowAuthorModal";

const APP_URI = process.env.REACT_APP_URI;

const FollowAuthorButton = ({
  authorId,
  otherAuthorObject,
  setIsUserFollowingAuthor,
  userObject,
}: {
  authorId: string;
  otherAuthorObject: Author;
  setIsUserFollowingAuthor: (value: boolean) => void;
  userObject: Author;
}) => {
  const [followButtonText, setFollowButtonText] = useState("Follow");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [icon, setIcon] = useState(<PersonAddIcon />);
  const [IsUnfollowModalOpen, setIsUnfollowModalOpen] = useState(false);
  const loggedUserId = getAuthorId();

  const openUnfollowAuthorModal = () => {
    setIsUnfollowModalOpen(true);
  };

  const sendFollowToInbox = async () => {
    // actor is the one who wants to follow and object is the author actor wants to follow
    const data = {
      type: "Follow",
      summary: `${userObject.displayName} wants to follow ${otherAuthorObject.displayName}`,
      actor: userObject,
      object: otherAuthorObject,
    };

    const url = `${APP_URI}authors/${authorId}/inbox/`;

    try {
      const userCredentials = getUserCredentials();

      if (userCredentials.username && userCredentials.password) {
        await axios.post(url, data, {
          auth: {
            username: userCredentials.username,
            password: userCredentials.password,
          },
        });
        setFollowButtonText("Requested");
        setIsRequested(true);
      }
    } catch (error) {
      toast.error("Failed to send a follow request");
    }
  };

  useEffect(() => {
    const fetchFollowRequestExists = async () => {
      const url = `${APP_URI}authors/${authorId}/inbox/`;

      try {
        const userCredentials = getUserCredentials();

        if (userCredentials.username && userCredentials.password) {
          const response = await axios.get(url, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          });
          const items = response.data.items;
          const followRequestExists: boolean = items.some(
            (item: any) =>
              item.type === "Follow" &&
              item.actor &&
              item.actor.id === userObject.id
          );
          setIsRequested(followRequestExists);
        }
      } catch (error) {
        console.error("Error fetching if user already requested: ", error);
      }
    };

    fetchFollowRequestExists();
  }, []);

  useEffect(() => {
    const fetchIsUserFollowingAuthor = async () => {
      const url = `${APP_URI}authors/${authorId}/followers/${loggedUserId}/`;

      try {
        const userCredentials = getUserCredentials();

        if (userCredentials.username && userCredentials.password) {
          const response = await axios.get(url, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          });

          if (response.data.is_follower) {
            setFollowButtonText("Following");
            setIsFollowing(true);
            setIcon(<HowToRegIcon />);
          } else if (isRequested) {
            setFollowButtonText("Requested");
            setIsFollowing(false);
          } else {
            setFollowButtonText("Follow");
            setIsFollowing(false);
          }
          setIsUserFollowingAuthor(response.data.is_follower);
        }
      } catch (error) {
        console.error("Error fetching is follower: ", error);
      }
    };

    fetchIsUserFollowingAuthor();
  }, [isRequested]);

  const unfollowAuthor = async () => {
    const url = `${APP_URI}authors/${authorId}/followers/${loggedUserId}/`;

    try {
      const response = await axios.delete(url);
      setFollowButtonText("Follow");
      setIsRequested(false);
      setIsFollowing(false);
      setIsUserFollowingAuthor(false);
      setIcon(<PersonAddIcon />);
      toast.success("Successfully unfollowed");
    } catch (error) {
      toast.error("Failed to unfollow");
    }
  };

  return (
    <Grid>
      {isFollowing ? (
        <Button
          onMouseOver={() => {
            setFollowButtonText("Unfollow");
            setIcon(<PersonRemoveIcon />);
          }}
          onMouseOut={() => {
            setFollowButtonText("Following");
            setIcon(<HowToRegIcon />);
          }}
          variant="outlined"
          size="small"
          style={{
            marginTop: 10,
            width: "9rem",
            borderRadius: 100,
            paddingLeft: 20,
            paddingRight: 20,
          }}
          sx={{
            background: "#103f5b",
            color: "white",
            border: "1px solid #103f5b",
            ":hover": {
              background: "#CC282833",
              border: "1px solid #CC2828",
              transition: "all 50",
              color: "#CC2828",
            },
          }}
          onClick={
            followButtonText === "Unfollow"
              ? openUnfollowAuthorModal
              : sendFollowToInbox
          }
          endIcon={icon}
        >
          <Typography textTransform="none" variant="subtitle1">
            <strong>{followButtonText}</strong>
          </Typography>
        </Button>
      ) : (
        <Button
          disabled={isRequested}
          variant="outlined"
          size="small"
          style={{
            marginTop: 10,
            width: "auto",
            borderRadius: 100,
            paddingLeft: 20,
            paddingRight: 20,
            border: "1px solid #103f5b",
          }}
          sx={{
            "&.Mui-disabled": {
              background: "#103f5b",
              color: "white",
            },
          }}
          onClick={sendFollowToInbox}
          endIcon={icon}
        >
          <Typography textTransform="none" variant="subtitle1">
            <strong>{followButtonText}</strong>
          </Typography>
        </Button>
      )}
      <UnfollowAuthorModal
        authorName={otherAuthorObject.displayName}
        isModalOpen={IsUnfollowModalOpen}
        setIsModalOpen={setIsUnfollowModalOpen}
        unfollowAuthor={unfollowAuthor}
      />
    </Grid>
  );
};

export default FollowAuthorButton;

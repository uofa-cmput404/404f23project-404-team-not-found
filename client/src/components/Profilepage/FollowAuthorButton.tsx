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
import { Hosts, Username } from "../../enums/enums";
import { codes } from "../../objects/objects";

const APP_URI = process.env.REACT_APP_URI;

const FollowAuthorButton = ({
  authorId,
  isLocal,
  otherAuthorObject,
  setIsUserFollowingAuthor,
  userObject,
}: {
  authorId: string;
  isLocal: boolean;
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
    // actor is the one who wants to follow and object is the author whom actor wants to follow
    const data = {
      type: "Follow",
      summary: `${userObject.displayName} wants to follow ${otherAuthorObject.displayName}`,
      actor: userObject,
      object: otherAuthorObject,
    };

    const url = isLocal ?
      `${APP_URI}authors/${authorId}/inbox/` :
      `${otherAuthorObject.id}/inbox/`;

    try {
      const userCredentials = getUserCredentials();

      if (isLocal) {
        if (userCredentials.username && userCredentials.password) {
          await axios.post(url, data, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          });
        }
      } else {
        await axios.post(url, data, {
          auth: {
            username: Username.NOTFOUND,
            password: codes[otherAuthorObject.host],
          },
        });
      }

        setFollowButtonText("Requested");
        setIsRequested(true);
    } catch (error) {
      toast.error("Failed to send a follow request");
    }
  };

  useEffect(() => {
    const fetchFollowRequestExists = async () => {
      const url = isLocal ?
      `${APP_URI}authors/${authorId}/inbox/` :
      `${otherAuthorObject.id}/inbox/`;

      try {
        const userCredentials = getUserCredentials();
        let response: any;

        if (isLocal) {
          if (userCredentials.username && userCredentials.password) {
            response = await axios.get(url, {
              auth: {
                username: userCredentials.username,
                password: userCredentials.password,
              },
            });
          }
        } else {
          response = await axios.get(url, {
            auth: {
              username: Username.NOTFOUND,
              password: codes[otherAuthorObject.host],
            },
          });
        }

          const items = response!.data.items;
          const followRequestExists: boolean = items.some(
            (item: any) =>
              item.type === "Follow" &&
              item.actor &&
              item.actor.id === userObject.id
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
      const url = isLocal ?
        `${APP_URI}authors/${authorId}/followers/${loggedUserId}/` :
        `${otherAuthorObject.id}/followers/${loggedUserId}/`;

      try {
        const userCredentials = getUserCredentials();
        let isFollower = false;

        if (isLocal) {
          if (userCredentials.username && userCredentials.password) {
            const response = await axios.get(url, {
              auth: {
                username: userCredentials.username,
                password: userCredentials.password,
              },
            });

            isFollower = response.data.is_follower;
          }
        } else {
          const response = await axios.get(url, {
            auth: {
              username: Username.NOTFOUND,
              password: codes[otherAuthorObject.host],
            },
          });

          // TODO: adapt for every team
          if (otherAuthorObject.host === Hosts.CODEMONKEYS) {
            isFollower = response.status === 200;
          }
        }

        if (isFollower) {
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
        setIsUserFollowingAuthor(isFollower);
      } catch (error) {
        console.error("Error fetching is follower: ", error);
      }
    };

    fetchIsUserFollowingAuthor();
  }, [isRequested]);

  const unfollowAuthor = async () => {
    const url = isLocal ?
      `${APP_URI}authors/${authorId}/followers/${loggedUserId}/` :
      `${otherAuthorObject.id}/followers/${loggedUserId}/`;

    try {
      const userCredentials = getUserCredentials();

      if (isLocal) {
        if (userCredentials.username && userCredentials.password) {
          await axios.delete(url, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          });
        }
      } else {
        await axios.delete(url, {
          auth: {
            username: Username.NOTFOUND,
            password: codes[otherAuthorObject.host],
          },
        });
      }

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

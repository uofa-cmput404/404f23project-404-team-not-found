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
import { ApiPaths, Hosts, Username } from "../../enums/enums";
import { codes } from "../../objects/objects";
import { isApiPathNoSlash } from "../../utils/responseUtils";

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
    let actor: Author = {...userObject};

    if (otherAuthorObject.host === Hosts.TRIET) {
      actor = {
        ...userObject,
        id: `${actor.id}/`
      }
    }

    let data = {
      type: "Follow",
      summary: `${actor.displayName} wants to follow ${otherAuthorObject.displayName}`,
      actor: actor,
      object: otherAuthorObject,
    };

    try {
      if (isLocal) {
        const userCredentials = getUserCredentials();
        const url = `${APP_URI}authors/${authorId}/inbox/`;

        if (userCredentials.username && userCredentials.password) {
          await axios.post(url, data, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          });
        }
      } else {
        const url = isApiPathNoSlash(otherAuthorObject.host, ApiPaths.INBOX) ?
          `${otherAuthorObject.id}/inbox` :
          `${otherAuthorObject.id}/inbox/`;

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
    // only used in local check since a lot of teams don't have inbox for remote use
    const fetchFollowRequestExists = async () => {
      try {
        const userCredentials = getUserCredentials();
        const url = `${APP_URI}authors/${authorId}/inbox/`;

        if (userCredentials.username && userCredentials.password) {
          const response = await axios.get(url, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          });

          const items = response!.data.items;
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

    if (isLocal) {
      fetchFollowRequestExists();
    }
  }, []);

  useEffect(() => {
    const fetchIsUserFollowingAuthor = async () => {
      try {
        let isFollower = false;

        if (isLocal) {
          const userCredentials = getUserCredentials();
          const url = `${APP_URI}authors/${authorId}/followers/${loggedUserId}/`;

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
          let url = isApiPathNoSlash(otherAuthorObject.host, ApiPaths.FOLLOWER) ?
            `${otherAuthorObject.id}/followers/${loggedUserId}` :
            `${otherAuthorObject.id}/followers/${loggedUserId}/`;

          if (otherAuthorObject.host === Hosts.TRIET) {
            // Triet needs a foreign_host_name query param for this request
            url = `${url}?foreign_host_name=${Hosts.NOTFOUNDAPINOSLASH}`;
          }

          const response = await axios.get(url, {
            auth: {
              username: Username.NOTFOUND,
              password: codes[otherAuthorObject.host],
            },
          });

          // TODO: adapt for every team
          if (otherAuthorObject.host === Hosts.CODEMONKEYS) {
            isFollower = response.status === 200;
          } else if (otherAuthorObject.host === Hosts.WEBWIZARDS) {
            isFollower = response.data === "Yes";
          } else if (otherAuthorObject.host === Hosts.TRIET) {
            isFollower = response.data;
          } else {
            isFollower = response.data.is_follower;
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
    try {
      if (isLocal) {
        const userCredentials = getUserCredentials();
        const url = `${APP_URI}authors/${authorId}/followers/${loggedUserId}/`;

        if (userCredentials.username && userCredentials.password) {
          await axios.delete(url, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          });
        }
      } else {
        const url = isApiPathNoSlash(otherAuthorObject.host, ApiPaths.FOLLOWER) ?
          `${otherAuthorObject.id}/followers/${loggedUserId}` :
          `${otherAuthorObject.id}/followers/${loggedUserId}/`;

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

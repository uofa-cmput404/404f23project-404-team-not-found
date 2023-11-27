import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  Typography,
  CssBaseline,
  Button,
  Theme,
  Modal,
  Box,
  TextField,
  Grid,
  IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Post } from "../../interfaces/interfaces";
import "./styles.css";
import { toast } from "react-toastify";
import {
  getAuthorId,
  getUserCredentials,
  storeUserData,
} from "../../utils/localStorageUtils";
import HeadBar from "../template/AppBar";
import { Author } from "../../interfaces/interfaces";
import EditIcon from "@mui/icons-material/Edit";
import { Hosts, ImageLink, ShareType, ToastMessages, Username } from "../../enums/enums";
import { useParams, useLocation } from "react-router-dom";
import MakePostModal from "../post/MakePostModal";
import LeftNavBar from "../template/LeftNavBar";

import CloseIcon from "@mui/icons-material/Close";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FollowAuthorButton from "./FollowAuthorButton";
import Tooltip from "@mui/material/Tooltip";
import ProfileTabs from "./ProfileTabs";
import { codes } from "../../objects/objects";
import { localAuthorHosts } from "../../lists/lists";

const APP_URI = process.env.REACT_APP_URI;

const useStyles = makeStyles((theme: Theme) => ({
  picture: {
    maxWidth: 200,
    maxHeight: 200,
    minWidth: 200,
    minHeight: 200,
    borderRadius: "50%",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "20px",
    border: "1px solid #dbd9d9",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "8px",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 1.5, 2),
  },
  save_button: {
    position: "relative",
    top: "5px",
    bottom: "10px",
    left: "585px",
  },
}));

const ProfilePage = () => {
  const [authorData, setAuthorData] = useState<Author | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [open, setOpen] = useState(false);
  const [isMakePostModalOpen, setIsMakePostModalOpen] = useState(false);
  const { authorId } = useParams();
  const username = authorData?.displayName;
  const github = authorData?.github;
  const profilePic = authorData?.profileImage;
  const defaultSrc = ImageLink.DEFAULT_PROFILE_PIC;
  const [userinfo, setUserinfo] = useState({
    displayName: "",
    github: "",
    profileImage: "",
  });

  const location = useLocation();
  const { otherAuthorObject, userObject } = location.state || {};

  const loggedUserId = getAuthorId();
  const isLoggedUser = authorId === loggedUserId;

  const [isUserFollowingAuthor, setIsUserFollowingAuthor] = useState(false);
  const [isAuthorFollowingUser, setIsAuthorFollowingUser] = useState(false);

  const classes = useStyles();

  const userCredentials = getUserCredentials();

  const isLocal = () => {
    return (isLoggedUser ||
      !otherAuthorObject ||
      localAuthorHosts.includes(otherAuthorObject.host));
  }

  const fetchAuthor = useCallback(async () => {
    // this is also just for local calls, see on one of the useEffects that it's called when
    // it's from ProfilePage or if the profile being viewed is the logged in user
    // this is also called in handleSave (which can only be done by the logged in user)
    const url = `${APP_URI}authors/${authorId}/`;

    try {
      if (userCredentials.username && userCredentials.password) {
        const response = await axios.get(url, {
          auth: {
            username: userCredentials.username,
            password: userCredentials.password,
          },
        });
        setAuthorData(response.data);
        setUserinfo({
          displayName: response.data.displayName,
          github: response.data.github,
          profileImage: response.data.profileImage,
        });
      }
    } catch (error) {
      console.error("Error fetching author", error);
    }
  }, [authorId]);

  const openMakePostModal = () => {
    setIsMakePostModalOpen(true);
  };

  const fetchPosts = useCallback(async () => {
    const url = (isLocal()) ?
      `${APP_URI}authors/${authorId}/posts/` :
      `${otherAuthorObject.id}/posts/`;

    try {
      if (isLocal()) {
        if (userCredentials.username && userCredentials.password) {
          const response = await axios.get(url, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          });
          if (authorId !== loggedUserId) {
            const publicPosts = response.data.filter((post: Post) =>
              post.visibility === ShareType.PUBLIC);
            setPosts(publicPosts);
          } else {
            setPosts(response.data);
          }
        } else {
          toast.error(ToastMessages.NOUSERCREDS);
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
          const publicPosts = response.data["items"].filter((post: Post) =>
            post.visibility === ShareType.PUBLIC);
          setPosts(publicPosts);
        } else {
          setPosts(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }

  }, [authorId]);

  const deletePost = async (postId: string) => {
    // this should also be only for local authors, so we don't have to handle remote connections
    // local authors can delete their own posts
    try {
      const APIurl = `${postId}/`;
      if (userCredentials.username && userCredentials.password) {
        await axios.delete(APIurl, {
          auth: {
            username: userCredentials.username,
            password: userCredentials.password,
          },
        });
        setPosts((currentPosts) =>
          currentPosts.filter((post) => post.id !== postId)
        );
        toast.success("Post deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  useEffect(() => {
    if (isLoggedUser || !otherAuthorObject) {
      fetchAuthor();
    } else {
      // go in here when user is navigating from the Discovery page or Inbox
      setAuthorData(otherAuthorObject);
      setUserinfo({
        displayName: otherAuthorObject.displayName,
        github: otherAuthorObject.github,
        profileImage: otherAuthorObject.profileImage,
      });
    }
  }, [authorId, fetchAuthor]);

  useEffect(() => {
    const fetchIsAuthorFollowingUser = async () => {
      // this one is also for local use, it checks if the current author is following the logged in (local) use
      const url = `${APP_URI}authors/${loggedUserId}/followers/${authorId}/`;

      try {
        if (userCredentials.username && userCredentials.password) {
          const response = await axios.get(url, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          });
          setIsAuthorFollowingUser(response.data.is_follower);
        }
      } catch (error) {
        console.error("Error fetching is follower: ", error);
      }
    };

    fetchIsAuthorFollowingUser();
  }, [isAuthorFollowingUser]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    // Don't need to handle other remote authors here since this is only for local use
    // This is for editing one's profile, and we can technically only edit local authors
    const url = `${APP_URI}authors/${loggedUserId}/`;

    const formData = new FormData();

    if (userinfo.displayName) {
      formData.append("displayName", userinfo.displayName);
    } else {
      formData.append("displayName", username ?? "");
    }

    if (userinfo.github) {
      formData.append("github", userinfo.github);
    } else {
      formData.append("github", "");
    }

    if (userinfo.profileImage) {
      formData.append("profileImage", userinfo.profileImage);
    } else {
      formData.append("profileImage", defaultSrc);
    }

    try {
      if (userCredentials.username && userCredentials.password) {
        const response = await axios.post(url, formData, {
          auth: {
            username: userCredentials.username,
            password: userCredentials.password,
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 200) {
          toast.success("Profile updated successfully");
          handleClose();
          storeUserData(JSON.stringify(response.data));
          await fetchAuthor();
        }
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <>
      <CssBaseline />
      <HeadBar />
      <Grid
        container
        style={{
          width: "100%",
          margin: "0 auto",
          height: "100vh",
          marginTop: 60,
          overscrollBehavior: "none",
        }}
      >
        <Grid item xs={3.6} style={{ height: "80vh" }}>
          <LeftNavBar openMakePostModal={openMakePostModal} page={"profile"} />
        </Grid>
        <Grid
          item
          xs={4.8}
          justifyContent="flex-start"
          sx={{
            minHeight: "calc(100vh - 60px)",
            maxHeight: "auto",
            borderLeft: "1px solid #dbd9d9",
            borderRight: "1px solid #dbd9d9",
          }}
        >
          <Grid
            sx={{
              backgroundColor: "#FAF8F1",
              paddingTop: 2,
              paddingBottom: 5,
              borderBottom: "1px solid #dbd9d9",
            }}
          >
            <Box
              sx={{
                position: "relative",
                height: 200,
                width: 200,
                marginLeft: "auto",
                marginRight: "auto",
              }}
              onMouseOver={() => setShowEdit(true)}
              onMouseOut={() => setShowEdit(false)}
            >
              {showEdit && isLoggedUser && (
                <IconButton
                  sx={{
                    backgroundColor: "white",
                    position: "absolute",
                    right: 0,
                    boxShadow: 1,
                    transition: "all",
                  }}
                  onClick={handleOpen}
                >
                  <EditIcon />
                </IconButton>
              )}
              <img
                src={profilePic || defaultSrc}
                alt="profile-pic"
                className={classes.picture}
              />
            </Box>
            <Typography
              variant="h2"
              align="center"
              color="textPrimary"
              style={{ fontFamily: "Bree Serif, serif" }}
            >
              {username}
            </Typography>
            <a href={github ?? ""} target="_blank" rel="noopener noreferrer">
              <Typography align="center" variant="body2" color="primary">
                {github}
              </Typography>
            </a>
            {!isLoggedUser && (
              <Box display="flex" alignItems="center" justifyContent="center">
                <FollowAuthorButton
                  authorId={authorId!}
                  isLocal={isLocal()}
                  otherAuthorObject={otherAuthorObject}
                  setIsUserFollowingAuthor={setIsUserFollowingAuthor}
                  userObject={userObject}
                />
                {!isLoggedUser &&
                  isUserFollowingAuthor &&
                  isAuthorFollowingUser && (
                    <Tooltip
                      title={
                        <>
                          <Typography
                            color="inherit"
                            flexGrow={1}
                            textAlign={"center"}
                          >
                            True Friend
                          </Typography>
                          <em>{"You follow each other"}</em>
                        </>
                      }
                    >
                      <FavoriteRoundedIcon
                        sx={{
                          borderRadius: 100,
                          fontSize: "35px",
                          marginTop: "auto",
                          marginBottom: "0.5px",
                          marginLeft: 1,
                          padding: "4px",
                          paddingTop: "6px",
                          color: "#FAF8F1",
                          bgcolor: "#103F5B",
                        }}
                        color="primary"
                      />
                    </Tooltip>
                  )}
              </Box>
            )}
          </Grid>
          <ProfileTabs
            author={authorData!}
            deletePost={deletePost}
            isLocal={isLocal()}
            fetchPosts={fetchPosts}
            posts={posts}
          />
        </Grid>
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className={classes.modal}
          >
            <Box className={classes.paper}>
              <Grid container paddingBottom={1}>
                <Grid item xs={3}>
                  <IconButton
                    sx={{
                      marginRight: "auto",
                    }}
                    onClick={() => {
                      handleClose();
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Grid>
                <Grid item xs={6} textAlign="center">
                  <Typography variant="h6" sx={{ paddingTop: 0.2 }}>
                    Edit Profile
                  </Typography>
                </Grid>
                <Grid item xs={3}></Grid>
              </Grid>
              <img
                src={userinfo.profileImage || defaultSrc}
                alt="profile-pic"
                className={classes.picture}
              />
              <TextField
                id="outlined-basic"
                label="Display Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={userinfo.displayName}
                onChange={(e) =>
                  setUserinfo({ ...userinfo, displayName: e.target.value })
                }
              />
              <TextField
                id="outlined-basic"
                label="Github Link"
                variant="outlined"
                fullWidth
                margin="normal"
                value={userinfo.github}
                onChange={(e) =>
                  setUserinfo({ ...userinfo, github: e.target.value })
                }
              />
              <TextField
                id="outlined-basic"
                label="Image Link"
                variant="outlined"
                fullWidth
                margin="normal"
                value={userinfo.profileImage}
                onChange={(e) =>
                  setUserinfo({ ...userinfo, profileImage: e.target.value })
                }
              />
              <Button
                variant="contained"
                color="primary"
                className={classes.save_button}
                onClick={handleSave}
                sx={{ borderRadius: 100 }}
              >
                Save
              </Button>
            </Box>
          </Modal>
          {isMakePostModalOpen && (
            <MakePostModal
              isModalOpen={isMakePostModalOpen}
              onPostCreated={fetchPosts}
              setIsModalOpen={setIsMakePostModalOpen}
            />
          )}
        </div>
      </Grid>
    </>
  );
};

export default ProfilePage;

import React, { useEffect, useState, useContext } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Box, CssBaseline, Paper } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import { useNavigate } from "react-router-dom";
import { getAuthorId, removeToken } from "../../utils/localStorageUtils";
import MakePostModal from "../post/MakePostModal";
import PostsList from "../post/PostsList";
import axios from "axios";
import { Post } from "../../interfaces/interfaces";
import { toast } from "react-toastify";
import Person from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import ExploreIcon from "@mui/icons-material/Explore";

import UserContext from "../../contexts/UserContext";

const APP_URI = process.env.REACT_APP_URI;

export default function HomePage() {
  const [isMakePostModalOpen, setIsMakePostModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();
  const { userToken, setUserToken } = useContext(UserContext);

  const openMakePostModal = () => {
    setIsMakePostModalOpen(true);
  };

  const handleProfileClick = () => {
    navigate("/profile-page");
  };

  const fetchPosts = async () => {
    const AUTHOR_ID = getAuthorId();
    const url = `${APP_URI}author/${AUTHOR_ID}/posts/`;

    try {
      const response = await axios.get(url);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const APIurl = postId;
      await axios.delete(APIurl);
      setPosts((currentPosts) =>
        currentPosts.filter((post) => post.id !== postId)
      );
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  // https://react.dev/reference/react/useEffect
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSignOut = () => {
    removeToken();
    setUserToken(null);
    toast.success(
      "You have successfuly logged out! Please log in again to use our service!"
    );
  };

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        style={{
          color: "#FFFFFF",
          height: 60,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h4"
          align="left"
          style={{
            marginLeft: 20,
            color: "white",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          socialdistribution
        </Typography>
        <Button
          variant="contained"
          color="success"
          size="small"
          style={{
            color: "white",
            height: "70%",
            alignSelf: "center",
            marginRight: "5px",
          }}
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </AppBar>
      <Grid
        container
        style={{ width: "100%", margin: "0 auto", marginTop: 60 }}
      >
        <Grid item xs={3} style={{ height: "80vh" }}>
          <Grid
            container
            alignItems="flex-end"
            direction="column"
            sx={{
              position: "fixed",
              paddingTop: 5,
              paddingRight: 2,
              width: "30vw",
              height: "100vh",
              border: 1,
              borderTop: 0,
              borderColor: "#dbd9d9",
            }}
          >
            <Grid
              container
              direction="column"
              alignItems="flex-start"
              width={"50%"}
            >
              <Button
                style={{ marginTop: 10, width: "auto", borderRadius: 20 }}
                onClick={handleProfileClick}
              >
                <Person fontSize="large" />
                <Typography variant="h6" textTransform="none" paddingLeft={2}>
                  {" "}
                  Profile{" "}
                </Typography>
              </Button>
              <Button
                style={{ marginTop: 10, width: "auto", borderRadius: 20 }}
              >
                <MailIcon fontSize="large" />
                <Typography variant="h6" textTransform="none" paddingLeft={2}>
                  {" "}
                  Inbox{" "}
                </Typography>
              </Button>
              <Button
                style={{ marginTop: 10, width: "auto", borderRadius: 20 }}
              >
                <ExploreIcon fontSize="large" />
                <Typography variant="h6" textTransform="none" paddingLeft={2}>
                  {" "}
                  Discover{" "}
                </Typography>
              </Button>
              <Button
                variant="contained"
                size="large"
                style={{ marginTop: 20, width: "90%", borderRadius: 20 }}
                onClick={openMakePostModal}
              >
                Post
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} justifyContent="center">
          <PostsList posts={posts} deletePost={deletePost} />
        </Grid>
        <Grid item xs={3}>
          <Typography align="center">side</Typography>
        </Grid>
        <MakePostModal
          isModalOpen={isMakePostModalOpen}
          onPostCreated={fetchPosts}
          setIsModalOpen={setIsMakePostModalOpen}
        />
      </Grid>
    </>
  );
}

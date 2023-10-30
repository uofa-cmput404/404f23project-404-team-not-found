import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { CssBaseline } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuthorId } from "../../utils/localStorageUtils";
import MakePostModal from "../post/MakePostModal";
import PostsList from "../post/PostsList";
import axios from "axios";
import { Post } from "../../interfaces/interfaces";
import { toast } from "react-toastify";

import Person from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import ExploreIcon from "@mui/icons-material/Explore";
import HomeIcon from '@mui/icons-material/Home';
import HeadBar from "../template/AppBar";
import DiscoverModal from "../follow/DiscoveryModal";
import InboxModal from "../inbox/InboxModal";

const APP_URI = process.env.REACT_APP_URI;

export default function HomePage() {
  const [isMakePostModalOpen, setIsMakePostModalOpen] = useState(false);
  const [isDiscoveryModalOpen, setIsDiscoveryModalOpen] = useState(false);
  const [isInboxModalOpen, setIsInboxModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  const openMakePostModal = () => {
    setIsMakePostModalOpen(true);
  };

  const openInboxModal = () => {
    setIsInboxModalOpen(true);
  };

  const openDiscoveryModal = () => {
    setIsDiscoveryModalOpen(true);
  };

  const handleProfileClick = () => {
    navigate("/profile-page");
  };

  const handleHomeClick = () => {
    navigate("/home-page");
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
      const APIurl = `${postId}/`;
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

  return (
    <>
      <CssBaseline />
      <HeadBar />
      <Grid
        container
        style={{ 
          width: "100%",
          height: "100vh", 
          margin: "0 auto", 
          marginTop: 60, 
          overscrollBehavior: "none"
        }}
      >
        <Grid item xs={3.6} style={{ height: "80vh" }}>
          <Grid container 
            alignItems="flex-end"
            direction="column"
            sx={{
              position: "fixed",
              paddingTop: 5,
              paddingRight: 2,
              width:"30vw", 
              height: "100vh", 
            }}
            >
            <Grid container
              direction="column"
              alignItems="flex-start"
              width={"50%"}
              marginRight={2}
            >
              <Button onClick={handleHomeClick}>
                <HomeIcon fontSize="large" />
                <Typography variant="h6" textTransform="none" paddingLeft={2}>
                  <strong>Home</strong>
                </Typography>
              </Button>
              <Button onClick={handleProfileClick}
                style={{ marginTop: 10, width: "auto", borderRadius: 20 }}
              >
                <Person fontSize="large" />
                <Typography variant="h6" textTransform="none" paddingLeft={2}>
                  Profile
                </Typography>
              </Button>
              <Button
                style={{ marginTop: 10, width: "auto", borderRadius: 20 }}
                onClick={openInboxModal}
              >
                <MailIcon fontSize="large" />
                <Typography variant="h6" textTransform="none" paddingLeft={2}>
                  Inbox
                </Typography>
              </Button>
              <Button
                style={{ marginTop: 10, width: "auto", borderRadius: 20 }}
                onClick={openDiscoveryModal}
              >
                <ExploreIcon fontSize="large" />
                <Typography variant="h6" textTransform="none" paddingLeft={2}>
                  Discover
                </Typography>
              </Button>
              <Button
                variant="contained"
                size="large"
                style={{ marginTop: 20, width: "90%", borderRadius: 100 }}
                onClick={openMakePostModal}
              >
                <Typography 
                  textTransform="none" 
                  padding={0.5}
                  variant="subtitle1"
								>
									<strong>Post</strong>
								</Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4.8} justifyContent='center'
          sx={{
            minHeight: "calc(100vh - 60px)",
            maxHeight: "auto",
            borderLeft: "1px solid #dbd9d9",
            borderRight: "1px solid #dbd9d9",
          }}
        >
          <PostsList posts={posts} deletePost={deletePost} onPostEdited={fetchPosts} />
        </Grid>
        <MakePostModal
          isModalOpen={isMakePostModalOpen}
          onPostCreated={fetchPosts}
          setIsModalOpen={setIsMakePostModalOpen}
        />
        <InboxModal
          isModalOpen={isInboxModalOpen}
          setIsModalOpen={setIsInboxModalOpen}
        />
        <DiscoverModal
          isModalOpen={isDiscoveryModalOpen}
          setIsModalOpen={setIsDiscoveryModalOpen}
        />
      </Grid>
    </>
  );
}

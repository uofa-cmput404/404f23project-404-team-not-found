import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Box, CssBaseline, Paper } from "@mui/material";
import AppBar from "@mui/material/AppBar";

import MakePostModal from "../post/MakePostModal";
import PostsList from "../post/PostsList";
import axios from "axios";
import {Post} from "../../interfaces/interfaces";

const APP_URI = process.env.REACT_APP_URI;

export default function HomePage() {
  const [isMakePostModalOpen, setIsMakePostModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const openMakePostModal = () => {
    setIsMakePostModalOpen(true);
  };

  const fetchPosts = async () => {
    // TODO: replace hardcoded author id with AUTHOR_ID
    const url = `${APP_URI}author/5ba6d758-257f-4f47-b0b7-d3d5f5e32561/posts/`;

    try {
      const response = await axios.get(url);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // https://react.dev/reference/react/useEffect
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <CssBaseline />
      <AppBar position="relative" style={{ color: "#FFFFFF" }}>
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
      </AppBar>
      <Grid
        container
        style={{ width: "100%", margin: "0 auto" }}
      >
        <Grid item xs={3} style={{ height: "80vh" }}>
          <Paper style={{ height: "100vh" }} variant="outlined">
            <Typography
              variant="h5"
              align="center"
              style={{ marginTop: "50%" }}
            >
              {" "}
              Testing{" "}
            </Typography>
            <Box textAlign="center">
              <Button
                variant="contained"
                style={{ marginTop: 10, width: "60%" }}
                onClick={openMakePostModal}
              >
                Post
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <PostsList
            posts={posts}
          />
        </Grid>
        <Grid item xs={3}>
          <Typography align="center">side</Typography>
        </Grid>
        <MakePostModal
          isModalOpen={isMakePostModalOpen}
          setIsModalOpen={setIsMakePostModalOpen}
        />
      </Grid>
    </>
  );
}

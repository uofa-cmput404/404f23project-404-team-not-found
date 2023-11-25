import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { CssBaseline } from "@mui/material";
import { getAuthorId } from "../../utils/localStorageUtils";
import MakePostModal from "../post/MakePostModal";
import PostsList from "../post/PostsList";
import axios from "axios";
import { Post } from "../../interfaces/interfaces";
import { toast } from "react-toastify";

import HeadBar from "../template/AppBar";
import LeftNavBar from "../template/LeftNavBar";

const APP_URI = process.env.REACT_APP_URI;

export default function HomePage() {
  const [isMakePostModalOpen, setIsMakePostModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [inboxItems, setInboxItems] = useState<Post[]>([]);

  const openMakePostModal = () => {
    setIsMakePostModalOpen(true);
  };

  const fetchInboxItems = async () => {
    const AUTHOR_ID = getAuthorId();
    const url = `${APP_URI}authors/${AUTHOR_ID}/inbox/`;

    try {
      const response = await axios.get(url);
      const inboxPosts = response.data.items.filter(
        (item: any) => item && item.type === "post"
      );

      setPosts((prevPosts) => [...inboxPosts.reverse(), ...prevPosts]);
    } catch (error) {
      console.error("Error fetching inbox items:", error);
    }
  };

  const fetchPosts = async () => {
    const AUTHOR_ID = getAuthorId();
    const url = `${APP_URI}authors/${AUTHOR_ID}/posts/`;

    try {
      const response = await axios.get(url);
      const validPosts = response.data.filter((item: any) => item !== null);

      setPosts(validPosts);
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
    fetchInboxItems();
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
          <LeftNavBar
            openMakePostModal={openMakePostModal}
            page={"home"}
          />
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
      </Grid>
    </>
  );
}

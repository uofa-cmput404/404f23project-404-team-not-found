import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { CssBaseline } from "@mui/material";
import { getAuthorId, getUserCredentials } from "../../utils/localStorageUtils";
import MakePostModal from "../post/MakePostModal";
import PostsList from "../post/PostsList";
import axios from "axios";
import { Post } from "../../interfaces/interfaces";
import { toast } from "react-toastify";

import HeadBar from "../template/AppBar";
import LeftNavBar from "../template/LeftNavBar";
import Loading from "../ui/Loading";

const APP_URI = process.env.REACT_APP_URI;

export default function HomePage() {
  const [isMakePostModalOpen, setIsMakePostModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [inboxItems, setInboxItems] = useState<Post[]>([]);

  const openMakePostModal = () => {
    setIsMakePostModalOpen(true);
  };

  const fetchPosts = async () => {
    // this should also be local use only since it's getting posts of the logged-in user
    // and all the posts sent to the inbox
    const AUTHOR_ID = getAuthorId();
    const url = `${APP_URI}authors/${AUTHOR_ID}/posts/`;
    const inboxurl = `${APP_URI}authors/${AUTHOR_ID}/inbox/`;
    const allInboxPosts: Post[] = [];

    try {
      const userCredentials = getUserCredentials();

      if (userCredentials.username && userCredentials.password) {
        const response = await axios.get(url, {
          auth: {
            username: userCredentials.username,
            password: userCredentials.password,
          },
        });
        
        const inboxresponse = await axios.get(inboxurl, {
          auth: {
            username: userCredentials.username,
            password: userCredentials.password,
          },
        });
        
        const inboxPosts = inboxresponse.data.items.filter(
          (item: any) => item && item.type === "post"
        );
        
        const validPosts = response.data.filter((item: any) => item !== null);
        
        inboxPosts.forEach((item: any) => {
          if (!allInboxPosts.some((post) => post.id === item.id)) {
            allInboxPosts.push(item);
          }
        });
        
        const combinedPosts = [...allInboxPosts, ...validPosts];

        combinedPosts.sort((a, b) => {
          const dateA = new Date(a.published).getTime();
          const dateB = new Date(b.published).getTime();
        
          // Compare the dates
          return dateB - dateA; 
        });

        
        setPosts(combinedPosts);
      }

    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    // this is local use only for the logged-in user
    try {
      const userCredentials = getUserCredentials();

      const APIurl = `${postId}/`;
      if (userCredentials.username && userCredentials.password) {
        await axios.delete(APIurl, {
          auth: {
            username: userCredentials.username,
            password: userCredentials.password,
          },
        });
      }

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
          overscrollBehavior: "none",
        }}
      >
        <Grid item xs={3.6} style={{ height: "80vh" }}>
          <LeftNavBar openMakePostModal={openMakePostModal} page={"home"} />
        </Grid>
        <Grid
          item
          xs={4.8}
          justifyContent="center"
          sx={{
            minHeight: "calc(100vh - 60px)",
            maxHeight: "auto",
            borderLeft: "1px solid #dbd9d9",
            borderRight: "1px solid #dbd9d9",
          }}
        >
          {isLoading ? (
            <Loading />
          ): (
            <PostsList
              posts={posts}
              deletePost={deletePost}
              onPostEdited={fetchPosts}
            />
          )}
        </Grid>
        {isMakePostModalOpen && (
          <MakePostModal
            isModalOpen={isMakePostModalOpen}
            onPostCreated={fetchPosts}
            setIsModalOpen={setIsMakePostModalOpen}
          />
        )}
      </Grid>
    </>
  );
}

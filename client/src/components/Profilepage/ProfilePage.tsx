import axios from "axios";
import { useEffect, useState } from "react";
import { Typography, CssBaseline, Container } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Post } from "../../interfaces/interfaces";
import "./styles.css";
import PostsList from "../post/PostsList";
import { toast } from "react-toastify";
import { getAuthorId } from "../../utils/localStorageUtils";
import HeadBar from "../template/AppBar";

const APP_URI = process.env.REACT_APP_URI;

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "#FAF8F1",
    paddingTop: "2rem",
    paddingBottom: "2rem",
    display: "flex",
    flexDirection: "column",
  },
  picture: {
    width: "30%",
    height: "30%",
    borderRadius: "50%",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "20px",
    marginBottom: "20px",
  },
  cardGrid: {
    paddingTop: "2rem",
    paddingBottom: "2rem",
    dislpay: "flex",
    flexDirection: "column",
  },
  card: {
    width: "100%",
    height: "100%",
  },
  customLink: {
    color: "white",
    textDecoration: "none !important",
  },
}));

const ProfilePage = () => {
  const [AuthorData, setAuthorData] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchAuthors = async () => {
    const AUTHOR_ID = getAuthorId();
    const url = `${APP_URI}author/${AUTHOR_ID}/`;

    try {
      const response = await axios.get(url);
      setAuthorData(response.data.displayName);
    } catch (error) {
      console.error("Error fetching author", error);
    }
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

  useEffect(() => {
    fetchAuthors();
    fetchPosts();
  }, []);

  const username = AuthorData;
  const classes = useStyles();

  return (
    <>
      <CssBaseline />
      <HeadBar />
      <main>
        <div className={classes.container}>
          <Container maxWidth="sm">
            <img
              src={require("../../assets/defaultprofile.jpg")}
              alt="profile-pic"
              className={classes.picture}
            />
            <Typography
              variant="h2"
              align="center"
              color="black"
              style={{ fontFamily: "Bree Serif, serif" }}
            >
              {username}
            </Typography>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          <PostsList posts={posts} deletePost={deletePost} />
        </Container>
      </main>
    </>
  );
};

export default ProfilePage;

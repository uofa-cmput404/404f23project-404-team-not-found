import axios from "axios";
import { useEffect, useState } from "react";
import { Typography, CssBaseline, Container, Button, Theme, Modal, Box, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Post } from "../../interfaces/interfaces";
import "./styles.css";
import PostsList from "../post/PostsList";
import { toast } from "react-toastify";
import { getAuthorId } from "../../utils/localStorageUtils";
import HeadBar from "../template/AppBar";
import { Author } from "../../interfaces/interfaces";
import EditIcon from '@mui/icons-material/Edit';

const APP_URI = process.env.REACT_APP_URI;

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    backgroundColor: "#FAF8F1",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center", 
    alignItems: "center",
    position: "relative",
  },
  picture: {
    maxWidth: 200,
    maxHeight: 200,
    minWidth: 200,
    minHeight: 200,
    borderRadius: "50%",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "20px",
    marginBottom: "20px",
    border: "2px solid #000"
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
  content: {
      display: "flex",
      justifyContent: "column",
      alignItems: "center"
  }, 
  modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    }, 
    save_button: {
      position: "relative",
      top: "10px",
      bottom: "10px",
      right: "10px"
    }
}));

const ProfilePage = () => {
  const [authorData, setAuthorData] = useState<Author | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [open, setOpen] = useState(false);
  const username = authorData?.displayName;
  const github = authorData?.github;
  const profilePic = authorData?.profileImage;
  const defaultSrc = require('../../assets/defaultprofile.jpg')
  const [userinfo, setUserinfo] = useState({displayName: "", github: "", profileImage: ""});
  
  const classes = useStyles();

  const fetchAuthors = async () => {
    const AUTHOR_ID = getAuthorId();
    const url = `${APP_URI}author/${AUTHOR_ID}/`;

    try {
      const response = await axios.get(url);
      setAuthorData(response.data);
      setUserinfo({displayName: response.data.displayName, github: response.data.github, profileImage: response.data.profileImage});
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

  useEffect(() => {
    fetchAuthors();
    fetchPosts();
  }, []);

    const handleOpen = () => {
      setOpen(true);
    };
    
    const handleClose = () => {
      setOpen(false);
    };
    
    const handleSave = async () => {
      const AUTHOR_ID = getAuthorId();
      const url = `${APP_URI}author/${AUTHOR_ID}/`;

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
        const response = await axios.post(url, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 200) {
          toast.success("Profile updated successfully");
          handleClose();
          fetchAuthors();
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
      <main>
        <div className={classes.container}>
          <div className={classes.content}>
            <div>
            <img src={profilePic || defaultSrc} alt="profile-pic" className={classes.picture} />
              <Typography variant="h2" align="center" color="textPrimary" style={{ fontFamily: 'Bree Serif, serif' }}>
                {username}
              </Typography>
              <a href={github ?? ""} target="_blank" rel="noopener noreferrer">
                <Typography align="center" variant="body2" color="primary">
                  {github}
                </Typography>
              </a>
            </div>
          </div>
            <div>
              <Button variant="contained" style={{top: "10px"}} onClick={handleOpen}>
                <EditIcon />
                <Typography>. EDIT INFO</Typography>
              </Button>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  className={classes.modal}
                >
                  <Box className={classes.paper}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                      EDIT PROFILE
                    </Typography>
                    <img src={userinfo.profileImage || defaultSrc} alt="profile-pic" className={classes.picture} />
                    <TextField
                      id="outlined-basic"
                      label="Display Name"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={userinfo.displayName}
                      onChange={(e) => setUserinfo({...userinfo, displayName: e.target.value})}
                    />
                      <TextField
                        id="outlined-basic"
                        label="Github Link"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={userinfo.github}
                        onChange={(e) => setUserinfo({...userinfo, github: e.target.value})}
                      />
                      <TextField
                        id="outlined-basic"
                        label="Image Link"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={userinfo.profileImage}
                        onChange={(e) => setUserinfo({...userinfo, profileImage: e.target.value})}
                      />
                      <Button variant="contained" color="primary" className={classes.save_button} onClick={handleSave}>
                        Save
                      </Button>
                  </Box>
                </Modal>
            </div>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          <PostsList posts={posts} deletePost={deletePost} onPostEdited={fetchPosts} />
        </Container>
      </main>
    </>
  );
};

export default ProfilePage;

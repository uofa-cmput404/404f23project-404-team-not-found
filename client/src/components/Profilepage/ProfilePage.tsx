import axios from "axios";
import { useEffect, useState } from "react";
import { Typography, CssBaseline, Container, Button, Theme, Modal, Box, TextField } from "@mui/material"
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
    paddingTop: "2rem",
    paddingBottom: "2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center", 
    alignItems: "center"
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
  edit_button: {
      position: "relative",
      left: "1%",
  }, 
  content: {
      display: "flex",
      justifyContent: "space-between",
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
  const [displayName, setDisplayName] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [open, setOpen] = useState(false);
  const username = authorData?.displayName;
  const github = authorData?.github;
  
  const classes = useStyles();

  const fetchAuthors = async () => {
    const AUTHOR_ID = getAuthorId();
    const url = `${APP_URI}author/${AUTHOR_ID}/`;

    try {
      const response = await axios.get(url);
      setAuthorData(response.data);
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
        const updatedAuthorData = {
            displayName: displayName === "" ? authorData?.displayName : displayName,
            github: githubLink === "" ? authorData?.github : githubLink,
        };
    
        try {
            const response = await axios.put(url, updatedAuthorData);
            if (response.status === 200) {
                toast.success("Profile updated successfully");
                handleClose(); // Close the modal after a successful update
                fetchAuthors(); // Fetch the updated author data
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
                        <img src={require('../../assets/defaultprofile.jpg')} alt="profile-pic" className={classes.picture} />
                        <Typography variant="h2" align="center" color="textPrimary" style={{ fontFamily: 'Bree Serif, serif' }}>
                            {username}
                        </Typography>
                    </div>
                    <Button variant="contained" className={classes.edit_button} onClick={handleOpen}>
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
                            <img src={require('../../assets/defaultprofile.jpg')} alt="profile-pic" className={classes.picture} />
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Button variant="contained" className={classes.edit_button}>
                                    <EditIcon />
                                    <Typography>. Change Picture</Typography>
                                </Button>
                            </div>
                            <TextField
                                id="outlined-basic"
                                label="Display Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Github Link"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={githubLink}
                                onChange={(e) => setGithubLink(e.target.value)}
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

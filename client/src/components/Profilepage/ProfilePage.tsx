import axios from "axios";
import { useEffect, useState } from "react";
import { Typography, CssBaseline, Container, Button, Theme, Modal, Box, TextField, Grid, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Post } from "../../interfaces/interfaces";
import "./styles.css";
import PostsList from "../post/PostsList";
import { toast } from "react-toastify";
import { getAuthorId } from "../../utils/localStorageUtils";
import HeadBar from "../template/AppBar";
import { Author } from "../../interfaces/interfaces";
import EditIcon from '@mui/icons-material/Edit';
import { ImageLink } from "../../enums/enums";
import { useNavigate } from "react-router-dom";
import MakePostModal from "../post/MakePostModal";

import Person from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import ExploreIcon from "@mui/icons-material/Explore";
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from "@mui/icons-material/Close";

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
    marginBottom: "20px",
    border: "1px solid #dbd9d9"
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
		borderRadius: "8px",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(1, 1.5, 2),
	}, 
	save_button: {
		position: "relative",
		top: "5px",
		bottom: "10px",
		left: "585px"
	},
}));

const ProfilePage = () => {
  const [authorData, setAuthorData] = useState<Author | null>(null);
	const [showEdit, setShowEdit] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [open, setOpen] = useState(false);
  const [isMakePostModalOpen, setIsMakePostModalOpen] = useState(false);
  const username = authorData?.displayName;
  const github = authorData?.github;
  const profilePic = authorData?.profileImage;
  const defaultSrc = ImageLink.DEFAULT_PROFILE_PIC;
  const [userinfo, setUserinfo] = useState({displayName: "", github: "", profileImage: ""});
  const navigate = useNavigate();
  
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

  const handleProfileClick = () => {
    navigate("/profile-page");
  };

	const handleHomeClick = () => {
    navigate("/home-page");
  };

  const openMakePostModal = () => {
    setIsMakePostModalOpen(true);
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
      <Grid 
			container
			style={{ 
				width: "100%", 
				margin: "0 auto", 
				marginTop: 60, 
				overscrollBehavior: "none" }}
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
                  Home
                </Typography>
              </Button>
              <Button onClick={handleProfileClick}
								style={{ marginTop: 10, width: "auto", borderRadius: 20 }}
							>
                <Person fontSize="large" />
                <Typography variant="h6" textTransform="none" paddingLeft={2}>
                  <strong>Profile</strong>
                </Typography>
              </Button>
              <Button
                style={{ marginTop: 10, width: "auto", borderRadius: 20 }}
              >
                <MailIcon fontSize="large" />
                <Typography variant="h6" textTransform="none" paddingLeft={2}>
                  Inbox
                </Typography>
              </Button>
              <Button
                style={{ marginTop: 10, width: "auto", borderRadius: 20 }}
              >
                <ExploreIcon fontSize="large" />
                <Typography variant="h6" textTransform="none" paddingLeft={2}>
                  Discover
                </Typography>
              </Button>
              <Button
                variant="contained"
                size="large"
                style={{ 
									marginTop: 20, 
									width: "90%", 
									borderRadius: 100,
								}}
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
				<Grid item xs={4.8} 
					justifyContent='flex-start'
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
							paddingBottom:5,
							borderBottom: "1px solid #dbd9d9",
						}}
					>
						<Box sx={{
							position: "relative",
							height: 200,
							width: 200,
							marginLeft: "auto",
							marginRight: "auto",
						}}
						onMouseOver={() => setShowEdit(true)}
						onMouseOut={() => setShowEdit(false)}
						>
							{showEdit && <IconButton sx={{
								backgroundColor: "white",
								position: "absolute",
								right: 0,
								boxShadow: 1,
								transition: "all"
							}}
							onClick={handleOpen}
							>
								<EditIcon/>
							</IconButton>}
							<img src={profilePic || defaultSrc} alt="profile-pic" className={classes.picture} />
						</Box>
						<Typography variant="h2" align="center" color="textPrimary" style={{ fontFamily: 'Bree Serif, serif' }}>
							{username}
						</Typography>
						<a href={github ?? ""} target="_blank" rel="noopener noreferrer">
							<Typography align="center" variant="body2" color="primary">
								{github}
							</Typography>
						</a>
          </Grid>
          <PostsList posts={posts} deletePost={deletePost} onPostEdited={fetchPosts} />
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
											<Typography 
												variant="h6"
												sx={{paddingTop:0.2}}
											>
												Edit Profile
											</Typography>
									</Grid>
									<Grid item xs={3}></Grid>
								</Grid>
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
									<Button 
										variant="contained" 
										color="primary" 
										className={classes.save_button} 
										onClick={handleSave}
										sx={{borderRadius:100}}
										>
										Save
									</Button>
							</Box>
						</Modal>
						<MakePostModal
							isModalOpen={isMakePostModalOpen}
							onPostCreated={fetchPosts}
							setIsModalOpen={setIsMakePostModalOpen}
						/>
				</div>
        <Container className={classes.cardGrid} maxWidth="md">
        </Container>
      </Grid>
    </>
  );
};

export default ProfilePage;

import axios from "axios";
import Popup from "./popup";
import { useEffect, useState } from "react";
import { Typography, CssBaseline, AppBar, Toolbar, Container, Card, Grid, CardMedia, CardContent, CardActions, Button} from "@mui/material"
import { makeStyles } from "@mui/styles";
import {Post} from "../../interfaces/interfaces";
import "./styles.css";
import { Link } from "react-router-dom";
import { getAuthorId } from "../../utils/localStorageUtils";

const APP_URI = process.env.REACT_APP_URI;

const useStyles = makeStyles((theme) => ({
    container : {
        backgroundColor: "#FAF8F1",
        paddingTop: "2rem",
        paddingBottom: "2rem",
        display: 'flex',
        flexDirection: 'column',
    }, 
    picture :{
        width: '30%',
        height: '30%',
        borderRadius: '50%',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '20px',
        marginBottom: '20px' 
    }, 
    cardGrid: {
        paddingTop: "2rem",
        paddingBottom: "2rem", 
        dislpay: 'flex',
        flexDirection: 'column',
    },
    card: {
        width: '100%',
        height: '100%' 
    },
    customLink: {
        color: "white",
        textDecoration: "none !important"
    }
}));

const ProfilePage = () => {

    const [AuthorData, setAuthorData] = useState("");
    const [posts, setPosts] = useState<Post[]>([]);
    const [openPopups, setOpenPopups] = useState<boolean[]>(Array(posts.length).fill(false));

    const togglePopup = (index: number) => {
        const newOpenPopups = [...openPopups];
        newOpenPopups[index] = !newOpenPopups[index];
        setOpenPopups(newOpenPopups);
      };

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

    useEffect(() => {
        fetchAuthors();
        fetchPosts();
    }, []);

    const username = AuthorData;
    const classes = useStyles();
    
    function limitContentTo100Words(content: string): string {
        const words: string[] = content.split(' ');
      
        if (words.length > 100) {
          const limitedContent: string = words.slice(0, 100).join(' ');
          return limitedContent + ' ...';
        } else {
          return content;
        }
    }

    return (
    <>
        <CssBaseline />
        <AppBar position="relative">
            <Toolbar>
                <Link to="/home-page">
                    <Typography variant="h6" className={classes.customLink} style={{ textDecoration: 'none' }}>
                        SocialDistribution
                    </Typography>
                </Link> 
            </Toolbar>
        </AppBar>
        <main>
            <div className={classes.container}>
                <Container maxWidth="sm">
                    <img src={require("../../assets/defaultprofile.jpg")} alt="profile-pic" className={classes.picture}/>
                    <Typography variant="h2" align="center" color="black" style={{ fontFamily: "Bree Serif, serif" }}>
                        {username}
                    </Typography>
                </Container>
            </div>
            <Container className={classes.cardGrid} maxWidth="md">
                <Grid container spacing={4}>
                    {posts.map((post, index) => (
                        <Grid item key={index} xs={12} sm={12} md={12}>
                            <Card className={classes.card}>
                                <CardContent>
                                    <Typography variant="h3" style={{ fontFamily: "Bree Serif, serif" }}>
                                        {post.title}
                                    </Typography>
                                    <Typography variant="h5" style={{ fontFamily: "Bree Serif, serif" }}>
                                        {post.description} 
                                    </Typography>
                                    <Typography variant="body1" style={{ fontFamily: "Bree Serif, serif" }}>
                                        {limitContentTo100Words(post.content ? post.content : '')}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary" onClick={() => togglePopup(index)}>
                                        View
                                    </Button>
                                    <Popup trigger={openPopups[index]} setTrigger={() => togglePopup(index)}>
                                        <Typography variant="h3" style={{ fontFamily: "Bree Serif, serif" }}>
                                            {post.title}
                                        </Typography>
                                        <Typography variant="h5" style={{ fontFamily: "Bree Serif, serif" }}>
                                            {post.description} 
                                        </Typography>
                                        <Typography variant="body1" style={{ fontFamily: "Bree Serif, serif" }}>
                                            {post.content}
                                        </Typography>
                                    </Popup>
                                    <Button size="small" color="primary">Delete</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </main>
    </>
  )
}

export default ProfilePage
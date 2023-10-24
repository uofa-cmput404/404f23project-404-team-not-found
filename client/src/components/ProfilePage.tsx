import axios from "axios";
import { useEffect, useState } from "react";
import { Typography, CssBaseline, AppBar, Toolbar, Container, Card, Grid, CardMedia, CardContent, CardActions, Button} from "@mui/material"
import { makeStyles } from "@mui/styles";
import {Post} from "../interfaces/interfaces";
import "./styles.css";

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
}));

const ProfilePage = () => {

    const [AuthorData, setAuthorData] = useState("");
    const [posts, setPosts] = useState<Post[]>([]);

    const fetchAuthors = async () => {
        // TODO: replace hardcoded author id with AUTHOR_ID
        const url = `${APP_URI}author/5ba6d758-257f-4f47-b0b7-d3d5f5e32561/`;
    
        try {
            const response = await axios.get(url);
            setAuthorData(response.data.displayName);
        } catch (error) {
            console.error("Error fetching author", error);
        }
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

    useEffect(() => {
        fetchAuthors();
        fetchPosts();
    }, []);

    const username = AuthorData;
    const classes = useStyles();

    return (
    <>
        <CssBaseline />
        <AppBar position="relative">
            <Toolbar>
                <Typography variant="h6">
                Profile Page
                </Typography>
            </Toolbar>
        </AppBar>
        <main>
            <div className={classes.container}>
                <Container maxWidth="sm">
                    <img src={require("../assets/defaultprofile.jpg")} alt="profile-pic" className={classes.picture}/>
                    <Typography variant="h4" align="center" color="black" >
                        {username}
                    </Typography>
                </Container>
            </div>
            <Container className={classes.cardGrid} maxWidth="md">
                <Grid container spacing={4}>
                    {posts.map((post, index) => (
                        <Grid item key={index} xs={12} sm={12} md={12}>
                            <Card className={classes.card}>
                                <CardMedia>
                                </CardMedia>
                                <CardContent>
                                    <Typography variant="h1" style={{ fontFamily: "Inria Serif, serif" }}>
                                        {post.title}
                                    </Typography>
                                    <Typography variant="h3" style={{ fontFamily: "Bree Serif, serif" }}>
                                        {post.description} 
                                    </Typography>
                                    <Typography variant="body1" style={{ fontFamily: "Bree Serif, serif" }}>
                                        {post.content}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary">View</Button>
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
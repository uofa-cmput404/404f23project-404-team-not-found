import React, { Component, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import {createTheme, makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Box, Container, CssBaseline, Paper, RootRef } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import App from "../App";

import MakePostModal from "./post/MakePostModal";

const useStyles = makeStyles(theme => ({
    stretch: { height: "80vh" },
    wide: {width: "100%"},
    item: { display: "flex", flexDirection: "column" } // KEY CHANGES
}));



export default function HomePage() {
    const classes = useStyles();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMakePostModalOpen, setIsMakePostModalOpen] = useState(false);


    const openMakePostModal= () => {
        setIsMakePostModalOpen(true);
    };

    return (
        <>
        <CssBaseline/>
        <AppBar position="relative" style={{color: "#FFFFFF"}}>
            <Typography variant="h4" align="left" style={{marginLeft: 20, color:'white', marginTop: 10, marginBottom: 10}} >
                socialdistribution
            </Typography>
        </AppBar>
        <Grid container style={{width: '100%', margin: '0 auto'}}>
            <Grid item xs={3} className={classes.stretch}>
                <Paper 
                    style={{height: '100vh'}} 
                    elevation={4} 
                    align='center'
                    variant="outlined"
                >
                    <Typography variant="h5" align="center" style={{marginTop: "50%"}}> Testing </Typography>
                    <Box textAlign='center'>
                    <Button variant='contained' style={{ marginTop: 10, width: '60%'}} onClick={openMakePostModal}>
                        Post
                    </Button>
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={9}>
                <Typography align="center">main</Typography>
            </Grid>
            <MakePostModal
                isModalOpen={isMakePostModalOpen}
                setIsModalOpen={setIsMakePostModalOpen}
            />
        </Grid>
        </> 
    );
  }
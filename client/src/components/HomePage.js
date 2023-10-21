import React, { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Box, CssBaseline, Paper } from "@mui/material";
import AppBar from "@mui/material/AppBar";

import MakePostModal from "./post/MakePostModal";


export default function HomePage() {

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
            <Grid item xs={3} style={{height: "80vh"}}>
                <Paper 
                    style={{height: '100vh'}} 
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
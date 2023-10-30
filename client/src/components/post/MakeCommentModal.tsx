
import { getAuthorId } from "../../utils/localStorageUtils";
import React, { useState } from "react";

import { Modal, Box, Button, TextField, IconButton, Grid, Typography } from "@mui/material";



import CloseIcon from "@mui/icons-material/Close";

import SendIcon from '@mui/icons-material/Send';

import axios from "axios";



const style = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60vh",
    bgcolor: "background.paper",
    boxShadow: 20,
    p: 0.5,
    borderRadius: "8px",
};

const APP_URI = process.env.REACT_APP_URI;
const MakeCommentModal = ({
    isCmodalOpen,

    setIsCModalOpen,
}
    : {
        isCmodalOpen: boolean;

        setIsCModalOpen: (isOpen: boolean) => void;
    }) => {
    const [comment, setComment] = useState("");
    const [contentType, setContentType] = useState("text/plain");
    const handleClose = () => { setIsCModalOpen(false) };

    const AUTHOR_ID = getAuthorId();
    const POST_ID = getAuthorId();
    // (Need to change to getPositionOfLineAndCharacter(once implemented))
    const APIurl = `${APP_URI}author/${AUTHOR_ID}/posts/${POST_ID}`;

    const handleSubmit = () => {
        console.log(`Comment: ${comment}, Content Type: ${contentType}`);
        //TODO:POST COMMENT TO API
        //     Comment_content: string,
        //     contentType: 'text/plain',

        //   ) => {
        //     const payload = {
        //       comment : Comment_content,
        //       contentType: contentType,




        //     };
        //     const AUTHOR_ID = getAuthorId();
        //     //TODO CHANGE TO getPostId() once done
        //     const POST_ID = getAuthorId(); 

        //     const url = `${APP_URI}author/${AUTHOR_ID}/posts/`;

        //     try {
        //       await axios.post(url, payload);
        //       onCommentCreated();
        //       handleClose();
        //     } catch (error) {
        //       console.error("Failed to post comment", error);
        //     }
        //   };
    };




    return (
        <>
            <Modal open={isCmodalOpen} onClose={handleClose}>
                <Box sx={style}>
                    <Grid container>
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
                                sx={{ paddingTop: 0.2 }}
                            >
                                Write comment
                            </Typography>
                        </Grid>
                        <Grid item xs={3}></Grid>
                    </Grid>


                    <TextField
                        id="outlined-textarea"
                        label="Comment here"
                        placeholder="Comment..."
                        multiline
                        sx={{ paddingBottom: 2 }}
                        onChange={(e) => {
                            setComment(e.target.value);
                        }}
                    />





                    <Button
                        variant="contained"
                        color="primary"

                        sx={{
                            borderRadius: 20,
                            justifyContent: "center",
                            color: "white",
                            width: "20%",
                            marginLeft: "auto",
                            marginBottom: 1,
                            marginRight: 1,
                        }}
                        onClick={() => {
                            handleSubmit(

                            );
                            setIsCModalOpen(false);

                        }}
                        endIcon={<SendIcon />}
                    >
                        Submit
                    </Button>
                </Box>


            </Modal>
        </>

    )
};


export default MakeCommentModal;


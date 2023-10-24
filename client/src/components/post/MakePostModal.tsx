import React, { useState} from "react";
import { Modal, Box, Button, TextField, IconButton, Grid} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import NotesIcon from '@mui/icons-material/Notes';
import ImageIcon from '@mui/icons-material/Image';
import UploadIcon from '@mui/icons-material/Upload';
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

const MakePostModal = ({
  isModalOpen,
  onPostCreated,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  onPostCreated: () => void;
  setIsModalOpen: (isOpen: boolean) => void;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [textType, setTextType] = useState(true);
  const [imageType, setImageType] = useState(false);
  
  const handleClose = () => setIsModalOpen(false);

  const handleTextContent = () => {
    setTextType(true);
    setImageType(false);
  }

  const handleImageContent = () => {
    setImageType(true);
    setTextType(false);
  }


  const handleSubmit = async (
    title: string,
    description: string,
    content: string,
    contentType: string,
    visibility: string,
    unlisted: boolean
  ) => {
    const payload = {
      title: title,
      description: description,
      content: content,
      contentType: contentType,
      visibility: visibility,
      unlisted: unlisted,
    };
    // TODO: replace the hardcoded id with the one gotten from the API
    const url = `${APP_URI}author/5ba6d758-257f-4f47-b0b7-d3d5f5e32561/posts/`;

    try {
      await axios.post(url, payload);
      onPostCreated();
      handleClose();
    } catch (error) {
      console.error("Failed to post", error);
    }
  };

  return (
    <>
      <Modal open={isModalOpen} onClose={handleClose}>
        <Box sx={style}>
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

          <Grid container spacing={0} justifyContent="flex-end" > 
            <Grid item>
              <IconButton 
              id="txt"
              size="small"
              onClick={handleTextContent}
              >
                <NotesIcon fontSize="medium"/> 
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton 
              size="small"
              sx={{marginRight: 1}}
              onClick={handleImageContent}
              > 
                <ImageIcon fontSize="medium"/> 
              </IconButton>
            </Grid>
          </Grid>
          
          <TextField
            id="title-text"
            label="Title"
            defaultValue=""
            sx={{
              margin: 1,
            }}
            size="small"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <TextField
            id="description-text"
            label="Description"
            defaultValue=""
            sx={{
              marginLeft: 1,
              marginRight: 1,
            }}
            size="small"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />

          {textType &&           
            <TextField
            id="content-field"
            label="content"
            multiline
            rows={4}
            defaultValue=""
            sx={{
              margin: 1,
            }}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />}

          {imageType && 
            <Grid 
              container
              alignItems="center"
              spacing={1}
              >   
              <Grid item xs={9}>
                <TextField
                  disabled={content !== ""}
                  id="image-field"
                  label="image url"
                  defaultValue=""
                  size="small"
                  fullWidth
                  sx={{margin:1, }}

                />
              </Grid>
              <Grid item xs={3}>
                <Button 
                variant="outlined"
                color="primary"
                sx={{
                  margin:1,
                  height: "100%"
                }} 
                endIcon={<UploadIcon/>}
                >
                  Upload
                </Button>
              </Grid>
          </Grid>     
          }


          <Button
            variant="contained"
            color="success"
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
                title,
                description,
                content,
                "text/plain",
                "PUBLIC",
                false
              );
              setIsModalOpen(true);
            }}
            endIcon={<SendIcon/>}
          >
            Post
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default MakePostModal;

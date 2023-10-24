import React, { useState} from "react";
import { Modal, Box, Button, TextField, IconButton, Grid} from "@mui/material";
import { styled } from "@mui/material";

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

// For opening file upload prompt
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

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
  const [contentType, setContentType] = useState("text/plain");
  const [textType, setTextType] = useState(true);
  const [imageType, setImageType] = useState(false);
  const [imagePrev, setImagePrev] = useState("");
  const handleClose = () => setIsModalOpen(false);

  const handleFileRead = async (event:any) => {
    const file = event.target.files[0];
    const base64:any = await convertBase64(file);
    setImagePrev(base64);
    setContent(base64);
  };

  const convertBase64 = (file:any) => {
    setContentType(`${file.type};base64`);
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleTextContent = () => {
    setTextType(true);
    setImageType(false);
    setTitle("");
    setDescription("");
    setContent("");
    setImagePrev("")
  }

  const handleImageContent = () => {
    setImageType(true);
    setTextType(false);
    setTitle("");
    setDescription("");
    setContent("");
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
                  id="image-field"
                  label="image url"
                  defaultValue=""
                  size="small"
                  fullWidth
                  sx={{margin:1, }}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setImagePrev(e.target.value);
                    setContentType("text/plain");
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <Button 
                disabled={content !== ""}
                component="label"
                variant="outlined"
                color="primary"
                sx={{
                  margin:1,
                  height: "100%"
                }} 
                endIcon={<UploadIcon/>}>
                  Upload
                  <VisuallyHiddenInput
                    disabled={content !== ""}
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={handleFileRead}
                  />
                </Button>
              </Grid>
              <img
              alt=""
              src={imagePrev}
              style={{
                marginTop: 5,
                marginLeft: "auto",
                marginRight: "auto",
                maxHeight: 200,
                border: 0,
                borderRadius: "5px",
                borderColor: "gray",
              }}
            />
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
                contentType,
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

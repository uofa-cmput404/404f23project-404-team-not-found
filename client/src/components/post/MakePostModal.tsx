
import { getAuthorId } from "../../utils/localStorageUtils";
import React, { useState} from "react";
import { Modal, Box, Button, IconButton, Grid, Typography } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import NotesIcon from '@mui/icons-material/Notes';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';

import axios from "axios";

import VisibilityMenu from "./VisibilityMenu";
import TextPostView from "./TextPostView";
import ImagePostView from "./ImagePostView";
import PostCategoriesField from "./PostCategoriesField";

import { ShareType } from "../../enums/enums";

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
  const [categories, setCategories] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("text/plain");
  const [textType, setTextType] = useState(true);
  const [imageType, setImageType] = useState(false);
  const [imagePrev, setImagePrev] = useState("");
  const [visibility, setVisibility] = useState(ShareType.PUBLIC);
  const [unlisted, setUnlisted] = useState(false);
  const handleClose = () => {setIsModalOpen(false); setImagePrev(''); handleTextContent()};

  const handleTextContent = () => {
    setTextType(true);
    setImageType(false);
    setCategories([]);
    setContent("");
    setImagePrev("")
  }

  const handleImageContent = () => {
    setImageType(true);
    setTextType(false);
    setContent("");
  }

  const handleSubmit = async (
    title: string,
    description: string,
    categories: string[],
    content: string,
    contentType: string,
    visibility: string,
    unlisted: boolean,
  ) => {
    const payload = {
      title: title,
      description: description,
      categories: categories,
      content: content,
      contentType: contentType,
      visibility: visibility,
      unlisted: unlisted,
    };
    const AUTHOR_ID = getAuthorId();
    const url = `${APP_URI}author/${AUTHOR_ID}/posts/`;

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
                  sx={{paddingTop:0.2}}
                >
                  Create a Post 
                </Typography>
            </Grid>
            <Grid item xs={3}></Grid>
          </Grid>
          <VisibilityMenu
            visibility={visibility}
            setVisibility={setVisibility}
            unlisted={unlisted}
            setUnlisted={setUnlisted}
          />
          {textType &&           
            <TextPostView
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              content={content}
              setContent={setContent}
              contentType={contentType}
              setContentType={setContentType}
            />
          }
          {imageType && 
            <ImagePostView
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              content={content}
              setContent={setContent}
              contentType={contentType}
              setContentType={setContentType}
              imagePrev={imagePrev}
              setImagePrev={setImagePrev}
            />
          }
          <Grid container>
            <PostCategoriesField categories={categories} setCategories={setCategories} />
          </Grid>
          <Grid container spacing={0} justifyContent="flex-end" paddingLeft={0.5}> 
            <Grid item>
              <IconButton 
              color={textType ? "info" : "default"}
              id="txt"
              size="small"
              onClick={handleTextContent}
              >
                <NotesIcon fontSize="medium"/> 
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton 
              color={imageType ? "info" : "default"}
              size="small"
              sx={{marginRight: 1}}
              onClick={() => {
                handleImageContent();
              }}
              > 
                <ImageIcon fontSize="medium"/> 
              </IconButton>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              disabled={content === "" || title === "" || description === ""} 
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
                  categories,
                  content,
                  contentType,
                  visibility,
                  unlisted
                );
                setIsModalOpen(false);
                handleTextContent();
              }}
              endIcon={<SendIcon/>}
              >
              Post
            </Button>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default MakePostModal;

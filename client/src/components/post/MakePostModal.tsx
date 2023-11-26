
import { getAuthorId } from "../../utils/localStorageUtils";
import React, { useCallback, useEffect, useState } from "react";

import { Modal, Box, Button, IconButton, Grid, Typography, FormControlLabel, Checkbox } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import NotesIcon from '@mui/icons-material/Notes';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import { Follower, Author, Post } from "../../interfaces/interfaces";
import axios from "axios";

import VisibilityMenu from "./VisibilityMenu";
import TextPostView from "./TextPostView";
import ImagePostView from "./ImagePostView";
import PostCategoriesField from "./PostCategoriesField";

import { ShareType } from "../../enums/enums";
import { toast } from "react-toastify";

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
  onPostCreated?: () => void;
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

  const [followerIds, setFollowerIds] = useState<string[]>([]);
  const [authorData, setauthorData] = useState<string[]>([]);

  const [markdownCheckbox, setMarkdownCheckbox] = useState(false);
  const [visibility, setVisibility] = useState(ShareType.PUBLIC);
  const [unlisted, setUnlisted] = useState(false);

  const handleClose = () => {
    setIsModalOpen(false);
    setTextType(true);
    setImageType(false);
    setImagePrev("");
    setCategories([]);
    setContent("");
    setTitle("");
    setDescription("");
  };

  const fetchFirstPostData = async (authorId: string): Promise<Post | null> => {
    const postUrl = `${APP_URI}authors/${authorId}/posts/`;
  
    try {
      const response = await axios.get<Post[]>(postUrl);
  
      if (response.data.length > 0) {
        return response.data[0];
      } else {
        return null;
      }
    } catch (error) {
      throw new Error("Failed to fetch post data");
    }
  };
  
  const fetchAuthorData = async (authorId: string): Promise<Author> => {
    const authorUrl = `${APP_URI}authors/${authorId}/`;
  
    try {
      const response = await axios.get<Author>(authorUrl);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch author data");
    }
  };

  const fetchFollowers = async (authorId: string): Promise<string[]> => {
    const followersUrl = `${APP_URI}authors/${authorId}/followers/`;
  
    try {
      const response = await axios.get<{ items: Follower[] }>(followersUrl);
      const followerIds = response.data.items.map((follower) => {
        const parts = follower.id.split('/');
        return parts[parts.length - 1];
      });
  
      return followerIds;
    } catch (error) {
      console.error("Error fetching followers:", error);
      throw new Error("Failed to fetch followers");
    }
  };

  const handleTextContent = () => {
    // reset some vars when switching between image -> text
    if (imageType) {
      setTextType(true);
      setImageType(false);
      setContent("");
      setImagePrev("");
      setMarkdownCheckbox(false);
    }
  }

  const handleImageContent = () => {
    // reset some vars when switching between text -> image
    if (textType) {
      setImageType(true);
      setTextType(false);
      setMarkdownCheckbox(false);
      setContent("");
    }
  }

  const handleMarkdownContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMarkdownCheckbox(event.target.checked);
    if (event.target.checked) setContentType("text/markdown");
    else setContentType("text/plain");
  };

  const handleSubmit = async (
    title: string,
    description: string,
    categories: string[],
    content: string,
    contentType: string,
    visibility: string,
    unlisted: boolean,
  ) => {
    const data = {
      title: title,
      description: description,
      categories: categories,
      content: content,
      contentType: contentType,
      visibility: visibility,
      unlisted: unlisted,
    };
    const AUTHOR_ID = getAuthorId();
    const url = `${APP_URI}authors/${AUTHOR_ID}/posts/`;

    try {
      await axios.post(url, data);
      
      // const authorData = await fetchAuthorData(getAuthorId() ?? '');
      // console.log("Author data:", authorData.displayName);
      const authorFollowers = await fetchFollowers(getAuthorId() ?? '');
      console.log("Author followers:", authorFollowers);
      
      if (visibility === 'PUBLIC') { 
        const postData = await fetchFirstPostData(getAuthorId() ?? '');

        const inboxItemUrl = `${APP_URI}authors/`;

        for (const followerId of authorFollowers) {
          await axios.post(`${inboxItemUrl}${followerId}/inbox/`, postData);
        }
      }

      if (visibility === 'FRIENDS') {
        const postData = await fetchFirstPostData(getAuthorId() ?? '');
        console.log("Post data:", postData);

        const inboxItemUrl = `${APP_URI}authors/`;

        for (const followerId of authorFollowers) {
          const followerFollowers = await fetchFollowers(followerId ?? '');
          if (followerFollowers.includes(getAuthorId() ?? '')) {
            await axios.post(`${inboxItemUrl}${followerId}/inbox/`, postData);
          }
        }
      }
      
      if (onPostCreated) {
        onPostCreated()
      }
      
      handleClose();

    } catch (error) {
      toast.error("Failed to create post")
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
          <Grid container spacing={0} alignItems="center" justifyContent="flex-end" paddingLeft={0.5}>
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
            {textType &&
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={markdownCheckbox}
                      onChange={handleMarkdownContent}
                    />
                  }
                  label="Markdown"
                />
              </Grid>
            }
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

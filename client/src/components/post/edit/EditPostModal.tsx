import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import NotesIcon from "@mui/icons-material/Notes";
import ImageIcon from "@mui/icons-material/Image";

import axios from "axios";

import VisibilityMenu from "../VisibilityMenu";
import TextPostView from "../TextPostView";
import ImagePostView from "../ImagePostView";
import PostCategoriesField from "../PostCategoriesField";
import { Post } from "../../../interfaces/interfaces";
import { compareStringArray } from "../../../utils/postUtils";
import { ContentType } from "../../../enums/enums";
import { toast } from "react-toastify";
import { getUserCredentials } from "../../../utils/localStorageUtils";

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

const EditPostModal = ({
  isModalOpen,
  onPostEdited,
  setIsModalOpen,
  post,
  text,
  image,
}: {
  isModalOpen: boolean;
  onPostEdited: () => void;
  setIsModalOpen: (isOpen: boolean) => void;
  post: Post;
  text: boolean;
  image: boolean;
}) => {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [categories, setCategories] = useState<string[]>(post.categories);
  const [content, setContent] = useState(post.content);
  const [contentType, setContentType] = useState(post.contentType);
  const [textType, setTextType] = useState(text);
  const [imageType, setImageType] = useState(image);
  const [imagePrev, setImagePrev] = useState(post.content);
  const [visibility, setVisibility] = useState(post.visibility);
  const [unlisted, setUnlisted] = useState(post.unlisted);
  const [markdownCheckbox, setMarkdownCheckbox] = useState(
    post.contentType === ContentType.MARKDOWN
  );

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleTextContent = () => {
    setTextType(true);
    setImageType(false);
  };

  const handleImageContent = () => {
    setImageType(true);
    setTextType(false);
  };

  const handleMarkdownContent = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMarkdownCheckbox(event.target.checked);
    if (event.target.checked) setContentType(ContentType.MARKDOWN);
    else setContentType(ContentType.PLAIN);
  };

  const handleSubmit = async (
    title: string,
    description: string,
    categories: string[],
    content: string,
    contentType: string,
    visibility: string,
    unlisted: boolean
  ) => {
    if (textType &&
        contentType !== ContentType.PLAIN &&
        contentType !== ContentType.MARKDOWN) {
      contentType = ContentType.PLAIN
    }

    const data = {
      title: title,
      description: description,
      categories: categories,
      content: content,
      contentType: contentType,
      visibility: visibility,
      unlisted: unlisted,
    };
    const url = `${post.id}/`;

    try {
      const userCredentials = getUserCredentials();

      if (userCredentials.username && userCredentials.password) {
        await axios.post(url, data, {
          auth: {
            username: userCredentials.username,
            password: userCredentials.password,
          },
        });
        onPostEdited();
        handleClose();
        toast.success("Post edited successfully");
      }
    } catch (error) {
      toast.error("Failed to edit post");
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
              <Typography variant="h6" sx={{ paddingTop: 0.2 }}>
                Edit Post
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
          {textType && (
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
          )}
          {imageType && (
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
          )}
          <Grid container>
            <PostCategoriesField
              categories={categories}
              setCategories={setCategories}
            />
          </Grid>
          <Grid
            container
            spacing={0}
            alignItems="center"
            justifyContent="flex-end"
            paddingLeft={0.5}
          >
            <Grid item>
              <IconButton
                color={textType ? "info" : "default"}
                id="txt"
                size="small"
                onClick={handleTextContent}
              >
                <NotesIcon fontSize="medium" />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                color={imageType ? "info" : "default"}
                size="small"
                sx={{ marginRight: 1 }}
                onClick={() => {
                  handleImageContent();
                }}
              >
                <ImageIcon fontSize="medium" />
              </IconButton>
            </Grid>
            {textType && (
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
            )}
            <Button
              variant="contained"
              color="primary"
              disabled={
                content === post.content &&
                contentType === post.contentType &&
                title === post.title &&
                description === post.description &&
                visibility === post.visibility &&
                unlisted === post.unlisted &&
                compareStringArray(categories, post.categories)
              }
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
              }}
            >
              Save
            </Button>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default EditPostModal;

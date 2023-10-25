import React, { useState } from "react";
import { Modal, Box, Button, TextField, IconButton } from "@mui/material";
import { getAuthorId } from "../../utils/localStorageUtils";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const style = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "500pt",
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

  const handleClose = () => setIsModalOpen(false);

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
    const url = `${APP_URI}author/` + getAuthorId() + `/posts/`;

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
          />

          <Button
            variant="contained"
            color="success"
            sx={{
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
          >
            Post
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default MakePostModal;

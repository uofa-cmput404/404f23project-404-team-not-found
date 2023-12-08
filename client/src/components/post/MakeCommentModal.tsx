import {
  getAuthorId,
  getUserCredentials,
  getUserData,
} from "../../utils/localStorageUtils";
import React, { useCallback, useEffect, useState } from "react";

import {
  Modal,
  Box,
  TextField,
  IconButton,
  Grid,
  Typography,
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import axios, { AxiosRequestConfig } from "axios";
import { Post, Comment, CommentPostRequest } from "../../interfaces/interfaces";
import { getAuthorIdFromResponse, isApiPathNoSlash, isHostLocal } from "../../utils/responseUtils";
import PostComments from "./comment/PostComments";
import { makeStyles } from "@mui/styles";
import { toast } from "react-toastify";
import { ApiPaths, ContentType, Hosts, ToastMessages, Username } from "../../enums/enums";
import { codes } from "../../objects/objects";
import { v4 as uuidv4 } from "uuid";

const style = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "35vw",
  bgcolor: "background.paper",
  boxShadow: 20,
  p: 0.5,
  borderRadius: "8px",
};

const useStyles = makeStyles((theme) => ({
  root: {
    "&::-webkit-scrollbar": {
      width: 7,
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: `inset 0 0 6px rgba(0, 0, 0, 0.3)`,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "darkgrey",
      outline: `1px solid slategrey`,
    },
  },
}));

const APP_URI = process.env.REACT_APP_URI;

const MakeCommentModal = ({
  isCmodalOpen,
  post,
  setIsCModalOpen,
}: {
  isCmodalOpen: boolean;
  post: Post;
  setIsCModalOpen: (isOpen: boolean) => void;
}) => {
  const [comment, setComment] = useState("");
  const [contentType, setContentType] = useState("text/plain");
  const authorId = getAuthorIdFromResponse(post.author.id);
  const postId = getAuthorIdFromResponse(post.id);
  const isPostLocal = isHostLocal(post.author.host);
  const loggedUserId = getAuthorId();
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const userData = getUserData();
  const [value, setValue] = useState("");
  const [markdownCheckbox, setMarkdownCheckbox] = useState(false);
  const classes = useStyles();

  const handleClose = () => {
    setIsCModalOpen(false);
  };

  const handleMarkdownContent = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMarkdownCheckbox(event.target.checked);
    if (event.target.checked) setContentType("text/markdown");
    else setContentType("text/plain");
  };

  const fetchComments = useCallback(async () => {
    try {
      if (isPostLocal) {
        const userCredentials = getUserCredentials();
        const url = `${post.id}/comments/`;

        if (userCredentials.username && userCredentials.password) {
          const response = await axios.get(url, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          });

          setPostComments(response.data["comments"]);
        } else {
          toast.error(ToastMessages.NOUSERCREDS);
        }
      } else {
        let comments: any;
        let url = isApiPathNoSlash(post.id, ApiPaths.COMMENTS) ?
          `${post.id}/comments` :
          `${post.id}/comments/`;
        let config: AxiosRequestConfig = {
          auth: {
            username: Username.NOTFOUND,
            password: codes[post.author.host],
          },
        };

        if (post.author.host === Hosts.CODEMONKEYS) {
          // code monkeys require page & size query params
          config = {
            ...config,
            params: {
              page: 1,
              size: 50
            }
          }
        } else if (post.author.host === Hosts.TRIET) {
          // Triet needs a query parameter when we're fetching comments
          config = {
            ...config,
            headers: {
              "x-client-id": userData.id,
            },
          }
        }

        const response = await axios.get(url, config);

        if (!("comments" in response.data) &&
          (post.author.host === Hosts.WEBWIZARDS || post.author.host === Hosts.NETNINJAS)) {
          // edge case where if a post has no comments, web wizards and net ninjas only return {}
          comments = [];
        } else {
          comments = response.data["comments"];
        }

        setPostComments(comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, []);

  const handleClear = () => {
    setValue("");
  };

  const handleSubmit = async (comment: string, contentType: string) => {
    let data: CommentPostRequest = {
      comment: comment,
      contentType: contentType as ContentType,
      author: userData,
    };

    try {
      if (isPostLocal) {
        const userCredentials = getUserCredentials();
        const url = `${post.id}/comments/`;

        if (userCredentials.username && userCredentials.password) {
          const response = await axios.post(url, data, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          });

          post.count = post.count + 1;
          await fetchComments();
          if (loggedUserId !== authorId) {
            await sendCommentToInbox(comment, contentType, response.data["id"], response.data["published"]);
          }
        } else {
          toast.error(ToastMessages.NOUSERCREDS);
        }
      } else {
        if (post.author.host === Hosts.CODEMONKEYS) {
          data = {
            ...data,
            id: `${post.id}/comments/${uuidv4()}`,
            published: new Date().toString(),
          };
        }
        const url = isApiPathNoSlash(post.id, ApiPaths.COMMENTS) ?
          `${post.id}/comments` :
          `${post.id}/comments/`;

        const response = await axios.post(url, data,{
          auth: {
            username: Username.NOTFOUND,
            password: codes[post.author.host],
          },
        });

        post.count = post.count + 1;
        await fetchComments();
        // from their API, it seems like creating a comment already sends it to their inbox
        // we don't need to do this, and they don't allow sending type=comment to their inbox (based from their API)
        if (post.author.host !== Hosts.WEBWIZARDS) {
            await sendCommentToInbox(comment, contentType, response.data["id"], response.data["published"]);
        }
      }

      handleClear();
    } catch (error) {
      toast.error("Error posting comment");
    }
  };

  const sendCommentToInbox = async (
    comment: string,
    contentType: string,
    id: string,
    published: string,
  ) => {
    let data: Comment = {
      type: "comment",
      author: userData,
      id: id,
      comment: comment,
      contentType: contentType as ContentType,
      published: published,
    };

    try {
      if (isPostLocal) {
        const userCredentials = getUserCredentials();
        const url = `${post.author.id}/inbox/`;

        if (userCredentials.username && userCredentials.password) {
          await axios.post(url, data, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          });
        }
      } else {
        const url = isApiPathNoSlash(post.author.host, ApiPaths.INBOX) ?
          `${post.author.id}/inbox` :
          `${post.author.id}/inbox/`;

        if (post.author.host === Hosts.TRIET) {
          data = {
            ...data,
            "id": `${data.id}/`,
          }
        }

        await axios.post(url, data, {
          auth: {
            username: Username.NOTFOUND,
            password: codes[post.author.host],
          },
        });
      }
    } catch (error) {
      console.error("Failed to send comment to inbox");
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <Modal open={isCmodalOpen} onClose={handleClose}>
      <Box sx={style}>
        <Grid container direction="row">
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
            <Typography variant="h6" sx={{ paddingTop: 0.2 }} fontSize="18px">
              Comments
            </Typography>
          </Grid>
        </Grid>
        <Box
          sx={{
            width: "100%",
            overflowY: "auto",
            maxHeight: "40vh",
            display: "flex",
            flexGrow: 1,
            flexDirection: "column",
            paddingX: 1,
          }}
          className={classes.root}
        >
          <PostComments
            comments={postComments}
            postId={postId}
          />
        </Box>
        <Grid sx={{ marginLeft: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                size="medium"
                sx={{ paddingRight: "0px" }}
                checked={markdownCheckbox}
                onChange={handleMarkdownContent}
              />
            }
            label={
              <Typography sx={{ fontSize: "15px", color: "text.secondary" }}>
                Markdown
              </Typography>
            }
          />
        </Grid>
        <TextField
          size="small"
          label="Write a comment"
          multiline
          value={value}
          sx={{ marginX: 1, marginBottom: 1 }}
          onChange={(e) => {
            setComment(e.target.value);
            setValue(e.target.value);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  color="primary"
                  disabled={value === ""}
                  onClick={() => {
                    handleSubmit(comment, contentType);
                  }}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Modal>
  );
};

export default MakeCommentModal;

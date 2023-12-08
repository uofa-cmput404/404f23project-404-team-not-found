import { getAuthorId, getUserCredentials, getUserData } from "../../utils/localStorageUtils";
import React, { useState, useEffect } from "react";

import {
  Modal,
  Box,
  Button,
  IconButton,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import NotesIcon from "@mui/icons-material/Notes";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import { Author } from "../../interfaces/interfaces";
import axios from "axios";

import VisibilityMenu from "./VisibilityMenu";
import TextPostView from "./TextPostView";
import ImagePostView from "./ImagePostView";
import PostCategoriesField from "./PostCategoriesField";

import { ApiPaths, ShareType, ToastMessages, Username } from "../../enums/enums";
import { toast } from "react-toastify";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { getCodeFromObjectId, isApiPathNoSlash, isObjectFromTriet, isUrlIdLocal } from "../../utils/responseUtils";

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
  const [markdownCheckbox, setMarkdownCheckbox] = useState(false);
  const [visibility, setVisibility] = useState(ShareType.PUBLIC);
  const [unlisted, setUnlisted] = useState(false);
  const [showAdditionalMenu, setShowAdditionalMenu] = useState(false);
  const [selectedFollower, setSelectedFollower] = useState('');
  const [followersData, setFollowersData] = useState<Author[]>([]);

  const loggedUserData = getUserData();

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

  const fetchAuthorData = async (authorUrlId: string): Promise<Author> => {
    const isAuthorLocal = isUrlIdLocal(authorUrlId);
  
    try {
      if (isAuthorLocal) {
        const userCredentials = getUserCredentials();
        const authorUrl = `${authorUrlId}/`;

        if (userCredentials.username && userCredentials.password) {
          const response = await axios.get<Author>(authorUrl, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          });
          return response.data;
        }
      } else {
        const authorUrl = isApiPathNoSlash(authorUrlId, ApiPaths.AUTHOR) ?
          `${authorUrlId}` :
          `${authorUrlId}/`;

        const response = await axios.get<Author>(authorUrl, {
          auth: {
            username: Username.NOTFOUND,
            password: getCodeFromObjectId(authorUrlId),
          },
        });
        return response.data;
      }
    } catch (error) {
      throw new Error("Failed to fetch author data");
    }
    return {} as Author;
  };

  const fetchFollowers = async (authorUrlId: string): Promise<string[]> => {
    const isAuthorLocal = isUrlIdLocal(authorUrlId);
    const followersUrl = `${authorUrlId}/followers/`;
  
    try {
      if (isAuthorLocal) {
        const userCredentials = getUserCredentials();
        const followersUrl = `${authorUrlId}/followers/`;

        if (userCredentials.username && userCredentials.password) {
          const response = await axios.get<{ items: Author[] }>(followersUrl, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          });

          // need this to be the author url id for remote connections
          return response.data.items.map((follower) => {
            return follower.id
          });
        }
      } else {
        const followersUrl = isApiPathNoSlash(authorUrlId, ApiPaths.FOLLOWERS) ?
          `${authorUrlId}/followers` :
          `${authorUrlId}/followers/`;

        const response = await axios.get<{ items: Author[] }>(followersUrl, {
          auth: {
            username: Username.NOTFOUND,
            password: getCodeFromObjectId(authorUrlId),
          },
        });

        return response.data.items.map((follower) => {
            return follower.id
          });
      }
    } catch (error) {
      console.error("Error fetching followers:", error);
      throw new Error("Failed to fetch followers");
    }
    return [] as string[];
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
  };

  const handleImageContent = () => {
    // reset some vars when switching between text -> image
    if (textType) {
      setImageType(true);
      setTextType(false);
      setMarkdownCheckbox(false);
      setContent("");
    }
  };

  const handleMarkdownContent = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    unlisted: boolean
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

    try {
      const userCredentials = getUserCredentials();
      const url = `${APP_URI}authors/${AUTHOR_ID}/posts/`;

      if (userCredentials.username && userCredentials.password) {
        const response = await axios.post(url, data, {
          auth: {
            username: userCredentials.username,
            password: userCredentials.password,
          },
        });

        // this will contain a list of the followers' author url ids: "apiurl/authors/uuid"
        const authorFollowers = await fetchFollowers(loggedUserData.id ?? '');
        let postData = response.data;

        if (visibility === ShareType.PUBLIC && !unlisted) {
          for (const followerId of authorFollowers) {
            if (isUrlIdLocal(followerId)) {
              await axios.post(`${followerId}/inbox/`, postData, {
                auth: {
                  username: userCredentials.username,
                  password: userCredentials.password,
                },
              });
            } else {
              const url = isApiPathNoSlash(followerId, ApiPaths.INBOX) ?
                `${followerId}/inbox` :
                `${followerId}/inbox/`;

              if (isObjectFromTriet(followerId)) {
                // triet requires / at the end for ids
                postData = {
                  ...postData,
                  "author": {
                    ...postData.author,
                    "id": `${postData.author.id}/`,
                  },
                  "id": `${postData.id}/`
                }
              }

              await axios.post(url, postData, {
                auth: {
                  username: Username.NOTFOUND,
                  password: getCodeFromObjectId(followerId),
                },
              });
            }
          }
        } else if (visibility === ShareType.FRIENDS) {
          for (const followerId of authorFollowers) {
            const followerFollowers = await fetchFollowers(followerId ?? '');
            if (followerFollowers.includes(loggedUserData.id ?? '')) {
              if (isUrlIdLocal(followerId)) {
                await axios.post(`${followerId}/inbox/`, postData, {
                  auth: {
                    username: userCredentials.username,
                    password: userCredentials.password,
                  },
                });
              } else {
                const url = isApiPathNoSlash(followerId, ApiPaths.INBOX) ?
                  `${followerId}/inbox` :
                  `${followerId}/inbox/`;

                if (isObjectFromTriet(followerId)) {
                  // triet requires / at the end for ids
                  postData = {
                    ...postData,
                    "author": {
                      ...postData.author,
                      "id": `${postData.author.id}/`,
                    },
                    "id": `${postData.id}/`
                  }
                }

                await axios.post(url, postData, {
                  auth: {
                    username: Username.NOTFOUND,
                    password: getCodeFromObjectId(followerId),
                  },
                });
              }
            }
          }
        } else if (visibility === ShareType.PRIVATE && authorFollowers.length > 0) {
          if (isUrlIdLocal(selectedFollower)) {
            await axios.post(`${selectedFollower}/inbox/`, postData, {
              auth: {
                username: userCredentials.username,
                password: userCredentials.password,
              },
            });
          } else {
            const url = isApiPathNoSlash(selectedFollower, ApiPaths.INBOX) ?
            `${selectedFollower}/inbox` :
            `${selectedFollower}/inbox/`;

            if (isObjectFromTriet(selectedFollower)) {
              // triet requires / at the end for ids
              postData = {
                ...postData,
                "author": {
                  ...postData.author,
                  "id": `${postData.author.id}/`,
                },
                "id": `${postData.id}/`
              }
            }

            await axios.post(url, postData, {
              auth: {
                username: Username.NOTFOUND,
                password: getCodeFromObjectId(selectedFollower),
              },
            });
          }
        }

        if (onPostCreated) {
          onPostCreated()
        }
      } else {
        toast.error(ToastMessages.NOUSERCREDS)
      }
      
      handleClose();
    } catch (error) {
      toast.error("Failed to create post");
    }
  };

  useEffect(() => {
    setShowAdditionalMenu(visibility === ShareType.PRIVATE);

    if (visibility === ShareType.PRIVATE) {
      const fetchFollowersData = async () => {
        try {
          const followerIds = await fetchFollowers(loggedUserData.id ?? '');
          const followersData = await Promise.all(
            followerIds.map(async (followerId) => await fetchAuthorData(followerId))
          );
          setFollowersData(followersData);
          if (followersData.length > 0) {
            setSelectedFollower(followersData[0].id);
          }
        } catch (error) {
          console.error("Error fetching followers data:", error);
        }
      };

      fetchFollowersData();
    }
  }, [visibility]);

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
          {showAdditionalMenu && visibility === ShareType.PRIVATE && followersData.length > 0 && (
            <Box>
              <FormControl fullWidth size="small">
                <InputLabel id="follower-selection-label" sx={{marginLeft: 1}}>Select a Follower to send to...</InputLabel>
                <Select
                  labelId="follower-selection-label"
                  id="follower-selection"
                  sx={{
                    marginX: 1
                  }}
                  value={selectedFollower}
                  label="Select a Follower to send to..."
                  onChange={(event: SelectChangeEvent) => setSelectedFollower(event.target.value as string)}
                >
                  {followersData.map((follower) => (
                    <MenuItem key={follower.id} value={`${follower.id}`}>
                      {follower.displayName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
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
              endIcon={<SendIcon />}
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

import { Box, Grid, Typography, IconButton, Button, Modal, Card, Avatar, CardHeader, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { Author, Post } from "../../interfaces/interfaces";
import { useState } from "react";
import axios from "axios";
import { getUserCredentials } from "../../utils/localStorageUtils";
import LinkIcon from '@mui/icons-material/Link';
import { getAuthorIdFromResponse, isApiPathNoSlash } from "../../utils/responseUtils";
import { isHostLocal } from "../../utils/responseUtils";
import { ApiPaths, ToastMessages, Username } from "../../enums/enums";
import { codes } from "../../objects/objects";

interface SharePostModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  followers: Author[];
  post: Post;
}

const SharePostModal = ({ isModalOpen, setIsModalOpen, followers, post }: SharePostModalProps) => {
  const [sharedFollowers, setSharedFollowers] = useState<string[]>([]);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const copyLink = () => {
    const authorID = getAuthorIdFromResponse(post.author.id);
    const postID = getAuthorIdFromResponse(post.id);
    const url = window.location.href;
    const path = window.location.pathname;
    const uri = url.replace(path, '');
    const link = `${uri}/${authorID}/posts/${postID}/`
    navigator.clipboard.writeText(link);
    toast.success("Copied to clipboard");
  };

  const handleShare = async (follower: Author) => {
    try {
      if (post) {
        if (isHostLocal(follower.host)) {
          const userCredentials = getUserCredentials();
          if (userCredentials.username && userCredentials.password) {
            await axios.post(`${follower.id}/inbox/`, post, {
              auth: {
                username: userCredentials.username,
                password: userCredentials.password,
              },
            });

            setSharedFollowers([...sharedFollowers, follower.id]);
            toast.success(`Shared with ${follower.displayName} successfully!`);
          } else {
            toast.error(ToastMessages.NOUSERCREDS);
          }
        } else {
          const url = isApiPathNoSlash(follower.id, ApiPaths.INBOX) ?
            `${follower.id}/inbox` :
            `${follower.id}/inbox/`;

          await axios.post(url, post, {
            auth: {
              username: Username.NOTFOUND,
              password: codes[follower.host],
            },
          });

          setSharedFollowers([...sharedFollowers, follower.id]);
          toast.success(`Shared with ${follower.displayName} successfully!`);
        }

        handleClose();
      } else {
        console.error("Post object is null.");
      }
    } catch (error) {
      console.error("Failed to share:", error);
      toast.error("Failed to share");
    }
  };

  return (
    <>
    <Modal open={isModalOpen} onClose={handleClose}>
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40vh",
            bgcolor: "white",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            p: 0.5,
            borderRadius: "8px",
            backdropFilter: "blur(10px)",
            zIndex: 9999,
          }}
        >
          <Grid container>
            <Grid item xs={3}>
              <IconButton 
                sx={{ marginRight: "auto" }} 
                onMouseDown={event => event.stopPropagation()}
                onClick={event => {
                  event.stopPropagation();
                  event.preventDefault();
                  handleClose();
                }}
                >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Grid>
            <Grid item xs={6} textAlign="center">
              <Typography variant="h6" sx={{ paddingTop: 0.2 }}>
                Share
              </Typography>
            </Grid>
            <Grid container item xs={3} justifyContent="flex-end">
              <Tooltip title="Copy Link" placement="left">
                <IconButton onClick={copyLink}>
                  <LinkIcon
                  fontSize="medium"
                  sx={{
                    transform: "rotate(-45deg)"
                  }}
                  />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>

          { followers.length === 0 ? (
            <Grid 
              container
              justifyContent="center"
              sx={{
                marginY:2,
                width: "100%"
              }}
              >
              <Typography variant="subtitle1">
                You have no followers...
              </Typography>
            </Grid>
          ) : (
            <Box
              sx={{
                width: "100%",
                overflowY: "auto",
                maxHeight: "40vh",
                display: "flex",
                flexGrow: 1,
                flexDirection: "column",
              }}
            >
              <Grid container direction="column">
                {followers.map((follower) => (
                  <Grid container 
                    key={follower.id}
                    alignItems="center"
                    sx={{
                      // borderBottom: "1px solid #dbd9d9"
                    }}
                  >
                    <Grid item xs={6}>
                      <Card
                        variant="outlined"
                        sx={{
                          margin: "auto",
                          width: "100%",
                          border:0,
                        }}
                      >
                        <CardHeader
                          avatar={<Avatar src={follower.profileImage} alt={follower.displayName}/>}
                          title={follower.displayName}
                          titleTypographyProps={{
                            fontSize: "1em",
                          }}
                          sx={{
                            paddingY: 1
                          }}
                        />
                      </Card>
                    </Grid>
                    <Grid container item xs={6} justifyContent="flex-end" paddingRight={1}>
                      {!sharedFollowers.includes(follower.id) ? (
                        <Button
                          onClick={() => handleShare(follower)}
                          variant="contained"
                          color="primary"
                          sx={{ 
                            width: "6rem",
                            borderRadius: 20,
                          }}
                        >
                          <Typography textTransform="none">Send</Typography>
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ 
                            width: "6rem",
                            borderRadius: 20,
                          }}
                          disabled
                        >
                          <Typography textTransform="none">Sent</Typography>
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            
            </Box>
          )}


        </Box>
    </Modal>
    </>
  );
};

export default SharePostModal;

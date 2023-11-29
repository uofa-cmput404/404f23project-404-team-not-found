import { Box, Grid, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { Author, Post } from "../../interfaces/interfaces";
import { useState } from "react";
import axios from "axios";
import { getUserCredentials } from "../../utils/localStorageUtils";
import LinkIcon from '@mui/icons-material/Link';
import { getAuthorIdFromResponse } from "../../utils/responseUtils";
import { isHostLocal } from "../../utils/responseUtils";
import { ToastMessages, Username } from "../../enums/enums";
import { codes } from "../../objects/objects";

interface SharePostModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  followers: Author[];
  post: Post | null;
}

const SharePostModal = ({ isModalOpen, setIsModalOpen, followers, post }: SharePostModalProps) => {
  const [sharedFollowers, setSharedFollowers] = useState<string[]>([]);

  const handleClose = () => {
    setIsModalOpen(false);
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
          await axios.post(`${follower.id}/inbox/`, post, {
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
      {isModalOpen && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60vh",
            bgcolor: "rgba(255, 255, 255, 0.95)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            p: 0.5,
            borderRadius: "8px",
            backdropFilter: "blur(10px)",
            zIndex: 9999,
          }}
        >
          <Grid container>
            <Grid item xs={3}>
              <IconButton sx={{ marginRight: "auto" }} onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Grid>
            <Grid item xs={6} textAlign="center">
              <Typography variant="h6" sx={{ paddingTop: 0.2 }}>
                Share
              </Typography>
            </Grid>
            <Grid item xs={3}></Grid>
          </Grid>

          {/* Display followers with shared design */}
          <Grid container spacing={2} justifyContent="center">
            {followers.map((follower) => (
              <Grid item key={follower.id} xs={6}>
                <Box
                  sx={{
                    margin: "auto",
                    width: "100%",
                    border: 0,
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={8}>
                      <Typography variant="subtitle1">{follower.displayName}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      {!sharedFollowers.includes(follower.id) ? (
                        <Button
                          onClick={() => handleShare(follower)}
                          variant="contained"
                          color="primary"
                          sx={{ width: "100%" }}
                        >
                          Send
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ width: "100%" }}
                          disabled
                        >
                          Sent
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </>
  );
};

export default SharePostModal;

import React, {useEffect, useState} from "react";
import axios from 'axios';
import { Avatar, Box, Button, Card, CardHeader, Grid, IconButton, Modal, Theme, Typography } from "@mui/material";
import { getAuthorId } from "../../utils/localStorageUtils";
import { makeStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";

const APP_URI = process.env.REACT_APP_URI;

const useStyles = makeStyles((theme: Theme) => ({
  modal_box: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60vh",
    height: "60vh",
    backgroundColor: theme.palette.background.paper,
    borderRadius: "8px",
    overflow: "hidden",
  },
  content: {
    overflow: "auto",
  },
}));

const InboxModal = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}) => {
  const [inboxItems, setInboxItems] = useState<any[]>([]);
  const styles = useStyles();

  const fetchInboxItems = async () => {
    const AUTHOR_ID = getAuthorId();
    const url = `${APP_URI}author/${AUTHOR_ID}/inbox/`;
    try {
      const response = await axios.get(url);
      setInboxItems(response.data["items"]);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
    }
  };

  useEffect(() => {
    fetchInboxItems();
  }, []);

  return (
    <Modal open={isModalOpen} onClose={setIsModalOpen}>
      <Box className={styles.modal_box}>
        <Grid container className={styles.content} direction={"row"}>
          <Grid container>
            <Grid item xs={3}>
              <IconButton
                sx={{
                  marginRight: "auto",
                }}
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                <CloseIcon fontSize="small"/>
              </IconButton>
            </Grid>
            <Grid item xs={6} textAlign="center">
              <Typography
                variant="h6"
                sx={{paddingTop: 0.2}}
              >
                Inbox
              </Typography>
            </Grid>
            <Grid item xs={3}></Grid>
          </Grid>
          <Grid container>
            {inboxItems.map((inboxItem) => (
              <Grid container item xs={12} key={inboxItem.id} alignItems="center">
                <Grid item xs={12}>
                  <Card
                    style={{
                      margin: "auto",
                      width: "100%",
                      borderRadius: 0,
                    }}
                    variant="outlined"
                  >
                    <CardHeader
                      avatar={<Avatar src={inboxItem.actor.profileImage}/>}
                      action={
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{borderRadius: 20}}
                        >
                          <Typography textTransform={"none"}>
                            Accept
                          </Typography>
                        </Button>
                      }
                      title={`${inboxItem.actor.displayName} wants to follow you`}
                    />
                  </Card>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default InboxModal;

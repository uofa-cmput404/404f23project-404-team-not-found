import React, {useEffect, useState} from "react";
import axios from 'axios';
import { Avatar, Box, Button, Card, CardHeader, Grid, IconButton, Modal, Theme, Typography } from "@mui/material";
import { Author } from "../../interfaces/interfaces";
import { getAuthorId } from "../../utils/localStorageUtils";
import { makeStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";
import { getAuthorIdFromResponse } from "../../utils/responseUtils";
import { useNavigate } from "react-router-dom";

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

const DiscoverModal = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}) => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const styles = useStyles();
  const navigate = useNavigate();

  const fetchAuthors = async () => {
    const AUTHOR_ID = getAuthorId();
    const url = `${APP_URI}authors/`;
    try {
      const response = await axios.get(url);
      const filtered_authors = response.data["items"].filter((author: Author) =>
        getAuthorIdFromResponse(author.id) !== AUTHOR_ID)
      setAuthors(filtered_authors);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleViewProfileClick = (authorIdUrl: string) => {
    const authorId = getAuthorIdFromResponse(authorIdUrl);
    setIsModalOpen(false);
    navigate(`/authors/${authorId}`);
  };

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
                Discover Authors
              </Typography>
            </Grid>
            <Grid item xs={3}></Grid>
          </Grid>
          <Grid container>
            {authors.map((author) => (
              <Grid container item xs={12} key={author.id} alignItems="center">
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
                      avatar={<Avatar src={author.profileImage} alt={author.displayName}/>}
                      action={
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{borderRadius: 20}}
                          onClick={() => handleViewProfileClick(author.id)}
                        >
                          <Typography textTransform={"none"}>
                            View
                          </Typography>
                        </Button>
                      }
                      title={author.displayName}
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

export default DiscoverModal;

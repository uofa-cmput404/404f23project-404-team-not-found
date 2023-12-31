import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { Post } from "../../../interfaces/interfaces";
import { Divider, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  button: {
    width: "150px",
    height: "40px",
    borderRadius: "20px",
    margin: "4px 0",
  },
  dialog: {
    borderRadius: "8px",
    width: "15vw",
    maxWidth: "15vw",
  }
}));

const DeletePostModal = ({
  isModalOpen,
  deletePost,
  setIsModalOpen,
  post,
}: {
  isModalOpen: boolean;
  deletePost: (postId: string) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  post: Post;
}) => {

  const handleClose = () => {
    setIsModalOpen(false)
  };

  const styles = useStyles();

  return (
    <Dialog
      open={isModalOpen}
      onClose={handleClose}
      aria-labelledby="delete-post"
      maxWidth="xs"
      fullWidth
      PaperProps={{ className: styles.dialog }}
    >
      <DialogTitle>
        Delete Post?
      </DialogTitle>
      <Divider />
      <Typography
        variant="body2"
        color="textSecondary"
        sx = {{ paddingX: 3, paddingY: 2 }}
      >
        This can't be undone and it will be removed from your profile.
      </Typography>
      <DialogActions
        sx={{
          flexDirection: "column",
          "& > :not(style) ~ :not(style)": {
            marginLeft: 0,
          }, }}>
        <Button
          variant="contained"
          onClick={() => {
            deletePost(post.id);
            handleClose();
          }}
          color="error"
          className={styles.button}>
          Delete
        </Button>
        <Button
          variant="outlined"
          onClick={handleClose}
          color="primary"
          className={styles.button}
          sx={{ margin: 0 }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeletePostModal;

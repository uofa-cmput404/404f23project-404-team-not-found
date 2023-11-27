import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
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

const UnfollowAuthorModal = ({
  authorName,
  isModalOpen,
  setIsModalOpen,
  unfollowAuthor,
}: {
  authorName: string;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  unfollowAuthor: () => void;
}) => {

  const handleClose = () => {
    setIsModalOpen(false)
  };

  const styles = useStyles();

  return (
    <Dialog
      open={isModalOpen}
      onClose={handleClose}
      aria-labelledby="unfollow-author"
      maxWidth="xs"
      fullWidth
      PaperProps={{ className: styles.dialog }}
    >
      <DialogTitle>
        { `Unfollow ${authorName}` }
      </DialogTitle>
      <Divider />
      <Typography
        variant="body2"
        color="textSecondary"
        sx = {{ paddingX: 3, paddingY: 2 }}
      >
        {  `Are you sure you want to unfollow ${authorName}?` }
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
            unfollowAuthor();
            handleClose();
          }}
          color="error"
          className={styles.button}>
          Unfollow
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

export default UnfollowAuthorModal;
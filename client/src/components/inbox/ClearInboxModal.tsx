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

const ClearInboxModal = ({
  isModalOpen,
  setIsModalOpen,
  clearInbox,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  clearInbox: () => void;
}) => {

  const handleClose = () => {
    setIsModalOpen(false)
  };

  const styles = useStyles();

  return (
    <Dialog
      open={isModalOpen}
      onClose={handleClose}
      aria-labelledby="clear-inbox"
      maxWidth="xs"
      fullWidth
      PaperProps={{ className: styles.dialog }}
    >
      <DialogTitle>
        Clear inbox?
      </DialogTitle>
      <Divider />
      <Typography
        variant="body2"
        color="textSecondary"
        sx = {{ paddingX: 3, paddingY: 2 }}
      >
        This can't be undone and will delete all your inbox items.
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
            clearInbox();
            handleClose();
          }}
          color="error"
          className={styles.button}>
          Clear
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

export default ClearInboxModal;
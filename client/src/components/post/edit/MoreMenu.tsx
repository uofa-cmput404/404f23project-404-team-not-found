import * as React from 'react';
import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Grid, IconButton } from '@mui/material';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Post } from '../../../interfaces/interfaces';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditPostModal from './EditPostModal';
import DeletePostModal from "./DeletePostModal";
import { isImage, isText } from "../../../utils/postUtils";


const MoreMenu = ({
    post,
    deletePost,
    onPostEdited
}:{
    post: Post;
    deletePost: (postId: string) => void;
    onPostEdited: () => void;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [IsEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [IsDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openDeletePostModal = () => {
    setIsDeletePostModalOpen(true);
  }

  const openEditPostModal = () => {
    setIsEditPostModalOpen(true);
  }

  return (
    <Grid container direction="column">
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{marginLeft: 1, marginRight: "auto"}}
        size="medium"
      >
        <MoreHorizIcon/>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'visibility-menu-button',
        }}
      >
        <MenuItem 
          onClick={() => {
            openEditPostModal();
            handleClose();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            openDeletePostModal();
            handleClose();
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{color: "#ef5350"}} />
          </ListItemIcon>
          <ListItemText sx={{color: "#ef5350"}}>Delete</ListItemText>
        </MenuItem>
      </Menu>
      {IsEditPostModalOpen && (
        <EditPostModal
          isModalOpen={IsEditPostModalOpen}
          onPostEdited={onPostEdited}
          setIsModalOpen={setIsEditPostModalOpen}
          post={post}
          image={isImage(post)}
          text={isText(post)}
        />
      )}
      {IsDeletePostModalOpen && (
        <DeletePostModal
          isModalOpen={IsDeletePostModalOpen}
          deletePost={deletePost}
          setIsModalOpen={setIsDeletePostModalOpen}
          post={post}
        />
      )}
    </Grid>
  );
}

export default MoreMenu;
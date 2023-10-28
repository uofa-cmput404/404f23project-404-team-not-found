import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Grid, Typography, IconButton } from '@mui/material';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Post } from '../../../interfaces/interfaces';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditPostModal from './EditPostModal';

import { ShareType } from '../../../enums/enums';

const MoreMenu = ({
    post, deletePost, onPostEdited
}:{
    post: Post;
    deletePost: (postId: string) => void;
    onPostEdited: () => void;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [IsEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


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
        sx={{marginLeft:1, marginRight: "auto"}}
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
            deletePost(post.id)
            handleClose();
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{color: "#ef5350"}} />
          </ListItemIcon>
          <ListItemText sx={{color: "#ef5350"}}>Delete</ListItemText>
        </MenuItem>
      </Menu>
      <EditPostModal
        isModalOpen={IsEditPostModalOpen}
        onPostEdited={onPostEdited}
        setIsModalOpen={setIsEditPostModalOpen}
        post={post}
        image={(post.content.slice(0, 4) === "http" && post.contentType === "text/plain") || post.contentType.includes("base64")}
        text={(post.content.slice(0, 4) != "http" && post.contentType === "text/plain")}
        copyPost={post}
      />
    </Grid>
  );
}

export default MoreMenu;
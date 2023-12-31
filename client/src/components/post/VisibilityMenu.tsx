import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Grid, Typography } from '@mui/material';

import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GroupIcon from '@mui/icons-material/Group';

import { ShareType } from "../../enums/enums";

const VisibilityMenu = (props:any) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [text, setText] = useState("Public")
  const [icon, setIcon] = useState(<PublicIcon/>)
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container direction="column">
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        startIcon={icon}
        sx={{marginLeft:1, marginRight: "auto"}}
        size="medium"
      >
        <Typography textTransform="none">{text}</Typography>
      </Button>
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
            props.setVisibility(ShareType.PUBLIC);
            props.setUnlisted(false);
            setText("Public");
            setIcon(<PublicIcon/>);
            handleClose();
          }}
        >
          <ListItemIcon>
            <PublicIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Public</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            props.setVisibility(ShareType.PRIVATE);
            props.setUnlisted(false)
            setText("Private");
            setIcon(<LockIcon/>);
            handleClose();
          }}
        >
          <ListItemIcon>
            <LockIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Private</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            props.setVisibility(ShareType.FRIENDS);
            props.setUnlisted(false)
            setText("Friends");
            setIcon(<GroupIcon/>)
            handleClose();
          }}
        >
          <ListItemIcon>
            <GroupIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Friends</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            props.setVisibility(ShareType.PUBLIC);
            props.setUnlisted(true)
            setText("Unlisted");
            setIcon(<VisibilityOffIcon/>)
            handleClose();
          }}
        >
          <ListItemIcon>
            <VisibilityOffIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Unlisted</ListItemText>
        </MenuItem>
      </Menu>
    </Grid>
  );
}

export default VisibilityMenu;
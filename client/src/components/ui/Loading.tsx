import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Grid } from "@mui/material";

const Loading = () => {
  return (
    <Grid container justifyContent="center" marginTop="2rem">
      <CircularProgress sx={{color: "#c7c7c7"}} thickness={5}/>
    </Grid>
  );
};

export default Loading;
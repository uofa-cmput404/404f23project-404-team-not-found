import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Grid } from "@mui/material";

const Loading = () => {
  return (
    <Grid container justifyContent="center" marginTop="2rem">
      <CircularProgress color="inherit" />
    </Grid>
  );
};

export default Loading;
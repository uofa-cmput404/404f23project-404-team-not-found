import React from "react";
import { Grid, TextField } from "@mui/material";


const TextPostView = (props: any) => {
  return (
    <Grid container direction="column">
      <TextField
        id="title-text"
        required
        label="Title"
        defaultValue=""
        sx={{
          margin: 1,
        }}
        size="small"
        onChange={(e) => {
          props.setTitle(e.target.value);
        }}
      />
      <TextField
        id="description-text"
        required
        label="Description"
        defaultValue=""
        sx={{
          marginLeft: 1,
          marginRight: 1,
        }}
        size="small"
        onChange={(e) => {
          props.setDescription(e.target.value);
        }}
      />
      <TextField
        id="content-field"
        required
        label="content"
        multiline rows={4}
        defaultValue=""
        sx={{
          margin: 1,
        }}
        onChange={(e) => {
          props.setContent(e.target.value);
          props.setContentType("text/plain");
        }}
      />
    </Grid>
  );
}

export default TextPostView;
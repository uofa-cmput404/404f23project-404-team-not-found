import React from "react";
import { Grid, TextField } from "@mui/material";
import { isText } from "../../utils/postUtils";


const TextPostView = (props: any) => {
  return (
    <Grid container direction="column">
      <TextField
        id="title-text"
        required
        label="Title"
        defaultValue={props.title}
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
        defaultValue={props.description}
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
        label="Content"
        multiline rows={4}
        defaultValue={isText(props) ? props.content : ""}
        sx={{
          margin: 1,
        }}
        onChange={(e) => {
          props.setContent(e.target.value);
        }}
      />
    </Grid>
  );
}

export default TextPostView;
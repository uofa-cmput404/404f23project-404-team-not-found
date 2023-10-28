import React from "react";
import { Grid, TextField, Button } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import { styled } from "@mui/material";


// For opening file upload prompt
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ImagePostView = (props: any) => {
  const handleFileRead = async (event: any) => {
      const file = event.target.files[0];
      const base64:any = await convertBase64(file);
      console.log(file);
      props.setImagePrev(base64);
      props.setContent(base64);
    };
  
    const convertBase64 = (file: any) => {
      props.setContentType(`${file.type};base64`);
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
          reject(error);
        };
      });
    };

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
      <Grid 
        container
        alignItems="center"
        spacing={1}
        >   
        <Grid item xs={9}>
          <TextField
            id="image-field"
            label="Image url"
            defaultValue={props.content.slice(0, 4) === "http" ? props.content : ""}
            size="small"
            fullWidth
            sx={{margin:1, }}
            onChange={(e) => {
              props.setContent(e.target.value);
              props.setImagePrev(e.target.value);
              props.setContentType("text/plain");
            }}
          />
        </Grid>
        <Grid item xs={3} display="inline-flex">
          <Button 
            disabled={props.content !== ""}
            component="label"
            color="primary"
            sx={{
              margin:1,
              height: "100%",
              marginRight: 0,
            }} 
            endIcon={<UploadIcon/>}>
            Upload
            <VisuallyHiddenInput
              disabled={props.content !== ""}
              accept="image/*"
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleFileRead}
            />
          </Button>
        </Grid>
        <img
          alt=""
          src={props.content}
          style={{
              marginTop: 5,
              marginBottom: 10,
              marginLeft: "auto",
              marginRight: "auto",
              maxHeight: 200,
              maxWidth:"80%",
              border: 0,
              borderRadius: "5px",
              alignSelf:"center"
          }}
        />
      </Grid>
    </Grid>
  );
}

export default ImagePostView;
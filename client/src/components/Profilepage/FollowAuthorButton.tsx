import React, { useEffect, useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import { Author } from "../../interfaces/interfaces";
import axios from "axios";
import { toast } from "react-toastify";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const APP_URI = process.env.REACT_APP_URI;

const FollowAuthorButton = ({
  authorId,
  otherAuthorObject,
  userObject,
}: {
  authorId: string,
  otherAuthorObject: Author;
  userObject: Author;
}) => {
  const [followButtonText, setFollowButtonText] = useState("Follow");

  const sendFollowToInbox = async () => {
    // actor is the one who wants to follow and object is the author actor wants to follow
    const data = {
      type: "Follow",
      summary: `${userObject.displayName} wants to follow ${otherAuthorObject.displayName}`,
      actor:  userObject,
      object: otherAuthorObject
    };

    const url = `${APP_URI}author/${authorId}/inbox/`;

    try {
      await axios.post(url, data);
      setFollowButtonText("Requested");
    } catch (error) {
      toast.error("Failed to send a follow request")
    }
  };

  return (
    <Grid container justifyContent="center">
      <Button
        variant="outlined"
        size="small"
        style={{
          marginTop: 20,
          width: "auto",
          borderRadius: 100,
          paddingLeft: 20,
          paddingRight: 20,
          border: "1px solid #103f5b"
        }}
        onClick={sendFollowToInbox}
        endIcon={<PersonAddIcon/>}
      >
        <Typography
          textTransform="none"
          variant="subtitle1"
        >
          <strong>{followButtonText}</strong>
        </Typography>
      </Button>
    </Grid>
  );
};

export default FollowAuthorButton;
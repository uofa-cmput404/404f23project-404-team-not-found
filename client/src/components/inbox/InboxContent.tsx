import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Avatar, Button, Card, CardHeader, Grid, Typography } from "@mui/material";
import { getAuthorId } from "../../utils/localStorageUtils";

const APP_URI = process.env.REACT_APP_URI;

const InboxContent = () => {
  const [inboxItems, setInboxItems] = useState<any[]>([]);

  const fetchInboxItems = async () => {
    const AUTHOR_ID = getAuthorId();
    const url = `${APP_URI}author/${AUTHOR_ID}/inbox/`;
    try {
      const response = await axios.get(url);
      setInboxItems(response.data["items"]);
    } catch (error) {
      console.error('Failed to fetch inbox items:', error);
    }
  };

  useEffect(() => {
    fetchInboxItems();
  }, []);

  return (
    <Grid container direction={"row"}>
      <Grid container>
        <Grid item xs={3}>
        </Grid>
        <Grid item xs={6} textAlign="center">
          <Typography
            variant="h6"
            sx={{paddingTop: 0.2}}
          >
            Inbox
          </Typography>
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
      <Grid container>
        {inboxItems.map((inboxItem) => (
          <Grid container item xs={12} key={inboxItem.id} alignItems="center">
            <Grid item xs={12}>
              <Card
                style={{
                  margin: "auto",
                  width: "100%",
                  borderRadius: 0,
                }}
                variant="outlined"
              >
                <CardHeader
                  avatar={<Avatar src={inboxItem.actor.profileImage}/>}
                  action={
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{borderRadius: 20}}
                    >
                      <Typography textTransform={"none"}>
                        Accept
                      </Typography>
                    </Button>
                  }
                  title={`${inboxItem.actor.displayName} wants to follow you`}
                />
              </Card>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default InboxContent;

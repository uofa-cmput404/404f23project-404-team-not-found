import React, { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { Grid, Typography } from "@mui/material";
import { getAuthorId } from "../../utils/localStorageUtils";
import { InboxItemType } from "../../enums/enums";
import InboxFollowItem from "./InboxFollowItem";
import InboxCommentItem from "./InboxCommentItem";

const APP_URI = process.env.REACT_APP_URI;

const InboxContent = () => {
  const [inboxItems, setInboxItems] = useState<any[]>([]);

  const fetchInboxItems = useCallback(async () => {
    const AUTHOR_ID = getAuthorId();
    const url = `${APP_URI}authors/${AUTHOR_ID}/inbox/`;
    try {
      const response = await axios.get(url);
      setInboxItems(response.data["items"]);
    } catch (error) {
      console.error('Failed to fetch inbox items:', error);
    }
  }, []);

  useEffect(() => {
    fetchInboxItems();
  }, [fetchInboxItems]);

  return (
    <Grid container direction={"row"}>
      <Grid container>
        <Grid item xs={12} textAlign="center">
          <Typography
            variant="h6"
            sx={{
              padding: 2,
              borderBottom: "1px solid #dbd9d9",
              fontWeight: "bold"
            }}
          >
            Inbox
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        {inboxItems.length > 0 ?
          (inboxItems.map((inboxItem, index) => (
            <Grid
              container
              key={index}
              alignItems="center"
              sx={{
                borderBottom: "1px solid #dbd9d9"
              }}
            >
              {inboxItem.type === InboxItemType.FOLLOW &&
                <InboxFollowItem followItem={inboxItem} />
              }
              {inboxItem.type === InboxItemType.COMMENT &&
                <InboxCommentItem commentItem={inboxItem}/>
              }
            </Grid>
          )))
          : (
            <Typography
              variant="h6"
              align="center"
              sx={{
                marginTop: 5,
                marginLeft: "auto",
                marginRight: "auto",
                color: "#858585",
              }}
            >
              No inbox items available...
            </Typography>
          )
        }
      </Grid>
    </Grid>
  );
};

export default InboxContent;

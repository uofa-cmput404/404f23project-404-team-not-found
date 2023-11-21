import React, { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { Grid, Typography } from "@mui/material";
import { getAuthorId } from "../../utils/localStorageUtils";
import { InboxItemType } from "../../enums/enums";
import InboxFollowItem from "./InboxFollowItem";
import InboxCommentItem from "./InboxCommentItem";
import Loading from "../ui/Loading";

const APP_URI = process.env.REACT_APP_URI;

const InboxContent = () => {
  const [inboxItems, setInboxItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const removeFollowItem = (actorId: string, objectId: string) => {
    setInboxItems(currentItems =>
      currentItems.filter(item =>
        item.actor.id !== actorId && item.object.id !== objectId
      )
    );
  };

  useEffect(() => {
    const fetchInboxItems = async () => {
      const AUTHOR_ID = getAuthorId();
      const url = `${APP_URI}authors/${AUTHOR_ID}/inbox/`;

      try {
        const response = await axios.get(url);
        setInboxItems(response.data["items"]);
      } catch(error) {
        console.error("Failed to fetch errors: ", error)
      } finally {
        setIsLoading(false);
      }
    };

    fetchInboxItems();
  }, []);

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
      {isLoading ?
        (<Loading />)
        : (
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
                    <InboxFollowItem
                      followItem={inboxItem}
                      removeFollowItem={removeFollowItem}
                    />
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
        )
      }
    </Grid>
  );
};

export default InboxContent;

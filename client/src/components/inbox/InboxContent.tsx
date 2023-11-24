import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Typography } from "@mui/material";
import { getAuthorId, getUserData, getUserCredentials } from "../../utils/localStorageUtils";
import { InboxItemType } from "../../enums/enums";
import InboxFollowItem from "./InboxFollowItem";
import InboxCommentItem from "./InboxCommentItem";
import Loading from "../ui/Loading";
import InboxLikeItem from "./InboxLikeItem";

const APP_URI = process.env.REACT_APP_URI;

const InboxContent = () => {
  const [inboxItems, setInboxItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userData = getUserData();

  const removeFollowItem = (actorId: string, objectId: string) => {
    setInboxItems((currentItems) =>
      currentItems.filter(
        (item) => item.type !== "Follow" || item.actor.id !== actorId
      )
    );
  };

  useEffect(() => {
    const fetchInboxItems = async () => {
      const AUTHOR_ID = getAuthorId();
      const url = `${APP_URI}authors/${AUTHOR_ID}/inbox/`;

      try {
        const userCredentials = getUserCredentials();
        if (userCredentials.username && userCredentials.password) {
          const response = await axios.get(url, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          });
          setInboxItems(response.data["items"]);
        }
      } catch (error) {
        console.error("Failed to fetch inbox items: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInboxItems();
  }, []);

  const getInboxItemKey = (inboxItem: any, index: number) => {
    let key;
    switch (inboxItem.type) {
      case InboxItemType.COMMENT:
        key = `comment-${inboxItem.id}`;
        break;
      case InboxItemType.FOLLOW:
        key = `follow-${inboxItem.actor.id}-${inboxItem.object.id}`;
        break;
      case InboxItemType.LIKE:
        key = `like-${inboxItem.author.id}-${inboxItem.object}`;
        break;
      case InboxItemType.POST:
        key = `post-${inboxItem.id}`;
        break;
      default:
        key = `item-${inboxItem.type}-${index}`;
    }

    return key;
  };

  return (
    <Grid container direction={"row"}>
      <Grid container>
        <Grid item xs={12} textAlign="center">
          <Typography
            variant="h6"
            sx={{
              padding: 2,
              borderBottom: "1px solid #dbd9d9",
              fontWeight: "bold",
            }}
          >
            Inbox
          </Typography>
        </Grid>
      </Grid>
      {isLoading ? (
        <Loading />
      ) : (
        <Grid container>
          {inboxItems.length > 0 ?
            (inboxItems.map((inboxItem, index) => (
              <Grid
                container
                key={getInboxItemKey(inboxItem, index)}
                alignItems="center"
              >
                {inboxItem.type === InboxItemType.FOLLOW && (
                  <InboxFollowItem
                    followItem={inboxItem}
                    removeFollowItem={removeFollowItem}
                  />
                )}
                {inboxItem.type === InboxItemType.COMMENT && (
                  <InboxCommentItem commentItem={inboxItem} />
                )}
                {inboxItem.type === InboxItemType.LIKE
                  && inboxItem.author.id !== userData.id && (
                  <InboxLikeItem likeItem={inboxItem} />
                )}
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
      )}
    </Grid>
  );
};

export default InboxContent;

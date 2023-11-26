import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Typography } from "@mui/material";
import { getAuthorId, getUserData, getUserCredentials } from "../../utils/localStorageUtils";
import { getAuthorIdFromResponse } from "../../utils/responseUtils";
import { InboxItemType } from "../../enums/enums";
import InboxFollowItem from "./InboxFollowItem";
import InboxCommentItem from "./InboxCommentItem";
import InboxLikeItem from "./InboxLikeItem";
import Loading from "../ui/Loading";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ClearInboxModal from "./ClearInboxModal";

const APP_URI = process.env.REACT_APP_URI;

const InboxContent = () => {
  const [inboxItems, setInboxItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followData, setFollowData] = useState<any>({});
  const [isClearInboxModalOpen, setIsClearInboxModalOpen] = useState<boolean>(false);
  const userData = getUserData();
  const loggedUserId = getAuthorId();

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
          const items = response.data["items"];
          const filteredItems = items.filter(
            (item: any) => item !== null
          );
          setInboxItems(filteredItems);

          const followItems = filteredItems.filter((item: any) =>
            item.type === InboxItemType.FOLLOW);
          const followDataPromises = followItems.map(async (followItem: any) => {
            const authorId = getAuthorIdFromResponse(followItem.actor.id);
            const url = `${APP_URI}authors/${loggedUserId}/followers/${authorId}/`;

            try {
              const response = await axios.get(url, {
                auth: {
                  username: userCredentials.username!,
                  password: userCredentials.password!,
                },
              });

              return { [`follow-${followItem.actor.id}-${followItem.object.id}`]: response.data.is_follower };
            } catch (error) {
              console.error("Error fetching follow data", error);
              return { [`follow-${followItem.actor.id}-${followItem.object.id}`]: false };
            }
          });

          const results = await Promise.all(followDataPromises);
          const combinedFollowData = results.reduce((acc, data) => ({ ...acc, ...data }), {});
          setFollowData(combinedFollowData);
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

  const openClearInboxModal = () => {
    setIsClearInboxModalOpen(true);
  };

  const handleInboxClear = async () => {
    const url = `${APP_URI}authors/${loggedUserId}/inbox/`;

    try {
      const userCredentials = getUserCredentials();

      if (userCredentials.username && userCredentials.password) {
        const response = await axios.delete(url, {
          auth: {
            username: userCredentials.username,
            password: userCredentials.password,
          },
        });
        setInboxItems([]);
      }
    } catch (error) {
      toast.error("Failed to clear the inbox");
    }
  };

  return (
    <Grid container direction={"row"}>
      <Grid
        container
        alignItems="center"
        sx={{
          borderBottom: "1px solid #dbd9d9",
          paddingX: 2,
          paddingY: 1,
        }}
      >
        <Grid item xs={9} textAlign="left">
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
            }}>
            Inbox
          </Typography>
        </Grid>
        <Grid item xs={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            size="small"
            sx={{
              color: "black",
              padding: 0
            }}
            onClick={openClearInboxModal}
            endIcon={<RemoveCircleOutlineIcon />}
          >
            <Typography
              variant="subtitle1"
              textTransform="none"
            >
              Clear
            </Typography>
          </Button>
        </Grid>
      </Grid>
      {isLoading ? (
        <Loading />
      ) : (
        <Grid container>
          {inboxItems.length > 0 ? (
            inboxItems.map((inboxItem, index) => (
              <Grid
                container
                key={getInboxItemKey(inboxItem, index)}
                alignItems="center"
              >
                {inboxItem.type === InboxItemType.FOLLOW && (
                  <InboxFollowItem
                    followItem={inboxItem}
                    isFollowAccepted={followData[getInboxItemKey(inboxItem, index)]}
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
            ))
          ) : (
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
          )}
        </Grid>
      )}
      {isClearInboxModalOpen && (
        <ClearInboxModal
          isModalOpen={isClearInboxModalOpen}
          setIsModalOpen={setIsClearInboxModalOpen}
          clearInbox={handleInboxClear}
        />
      )}
    </Grid>
  );
};

export default InboxContent;

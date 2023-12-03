import { getUserCredentials, getUserData } from "../../../utils/localStorageUtils";
import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import axios from "axios";
import { Like } from "../../../interfaces/interfaces";
import { getAuthorIdFromResponse, getCodeFromObjectId, isUrlIdLocal } from "../../../utils/responseUtils";
import { toast } from "react-toastify";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Tooltip from "@mui/material/Tooltip";
import { Comment } from "../../../interfaces/interfaces";
import { Hosts, ToastMessages, Username } from "../../../enums/enums";
import { codes } from "../../../objects/objects";

const CommentLikes = ({
  comment,
  postId,
}: {
  comment: Comment,
  postId: string,
}) => {
  const [commentLikes, setCommentLikes] = useState<Like[]>([]);
  const [isUserLiked, setIsUserLiked] = useState<boolean>(false);
  const isLocal = isUrlIdLocal(comment.id);
  const commentId = getAuthorIdFromResponse(comment.id);
  const userData = getUserData();

  const handleLike = async () => {
    const data = {
      "type": "Like",
      "author": userData,
      "object": comment.id,
      "context": "https://www.w3.org/ns/activitystreams",
      "summary": `${userData.displayName} Likes your post`
    }

    try {
      if (isLocal) {
        const userCredentials = getUserCredentials();
        const url = `${comment.author.id}/inbox/`;

        if (userCredentials.username && userCredentials.password) {
          const response = await axios.post(url, data, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          });
          setCommentLikes([...commentLikes, response.data]);
          setIsUserLiked(true);
        } else {
          toast.error(ToastMessages.NOUSERCREDS);
        }
      } else {
        const url = comment.author.host === Hosts.WEBWIZARDS ?
          `${comment.author.id}/inbox` :
          `${comment.author.id}/inbox/`;

        const response = await axios.post(url, data, {
          auth: {
            username: Username.NOTFOUND,
            password: codes[comment.author.host],
          },
        });

        setCommentLikes([...commentLikes, response.data]);
        setIsUserLiked(true);
      }
    } catch(error) {
      toast.error("Unable to like this comment");
    }
  };

  useEffect(() => {
    const fetchLikes = async () => {

      try {
        if (isLocal) {
          const userCredentials = getUserCredentials();
          const url = `${comment.id}/likes/`;

          if (userCredentials.username && userCredentials.password) {
            const response = await axios.get(url, {
              auth: {
                username: userCredentials.username,
                password: userCredentials.password,
              },
            });
            const dataLikes = response.data;
            setCommentLikes(response.data);
            const isAuthorLiked = dataLikes.some((like: Like) =>
              like !== null && like.author?.id === userData.id
            );
            setIsUserLiked(isAuthorLiked);
          } else {
            toast.error(ToastMessages.NOUSERCREDS);
          }
        } else {
          // TODO: currently not working as comment.id is not well-formed from webwizards,
          // should automatically work when they fix it, but should double check
          const url = `${comment.id}/likes/`;

          const response = await axios.get(url, {
            auth: {
              username: Username.NOTFOUND,
              password: getCodeFromObjectId(comment.id),
            },
          });
          let dataLikes: any;

          // TODO: adapt for every team
          if ("items" in response.data) {
            dataLikes = response.data["items"];
          } else {
            dataLikes = response.data;
          }

          setCommentLikes(dataLikes);
          const isAuthorLiked = dataLikes.some((like: Like) =>
            like !== null && like.author?.id === userData.id
          );
          setIsUserLiked(isAuthorLiked);
        }
      } catch(error) {
        console.error("Error fetching likes", error);
      }
    };

    fetchLikes();
  }, []);

  return (
    <Tooltip title="Like" placement="bottom-end">
      <Button
        disabled={isUserLiked}
        size="small"
        sx={{
          borderRadius: 100,
          minWidth: 0,
          color: "text.secondary",
          "&.Mui-disabled": {
            background: "white",
            color: "#CC2828"
          }
        }}
        onClick={() => {
          handleLike();
        }}
      >
        {isUserLiked ? (
          <FavoriteIcon fontSize="small" />
        ) : (
         <FavoriteBorderIcon fontSize="small" />
        )}
        <Typography sx={{ marginLeft: 1 }}>
          {commentLikes.length}
        </Typography>
      </Button>
    </Tooltip>
  )
};


export default CommentLikes;
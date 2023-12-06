import { getUserCredentials, getUserData } from "../../../utils/localStorageUtils";
import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import axios from "axios";
import { Like, LikePostRequest, Post } from "../../../interfaces/interfaces";
import {
  getAuthorIdFromResponse,
  getCodeFromObjectId,
  isApiPathNoSlash,
  isHostLocal
} from "../../../utils/responseUtils";
import { toast } from "react-toastify";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Tooltip from "@mui/material/Tooltip";
import { ApiPaths, Hosts, Links, ToastMessages, Username } from "../../../enums/enums";
import { codes } from "../../../objects/objects";

const PostLikes = ({
  post,
}: {
  post: Post;
}) => {
  const [postLikes, setPostLikes] = useState<Like[]>([]);
  const [isUserLiked, setIsUserLiked] = useState<boolean>(false);
  const postId = getAuthorIdFromResponse(post.id);
  const isLocal = isHostLocal(post.author.host);
  const userData = getUserData();

  const handleLike = async () => {
    let data: LikePostRequest = {
      "type": "Like",
      "author": userData,
      "object": post.id,
      "summary": `${userData.displayName} Likes your post`
    }

    try {
      if (isLocal) {
        const userCredentials = getUserCredentials();
        const url = `${post.author.id}/inbox/`;

        if (userCredentials.username && userCredentials.password) {
          const response = await axios.post(url, data, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          });
          setPostLikes([...postLikes, response.data]);
          setIsUserLiked(true);
        } else {
          toast.error(ToastMessages.NOUSERCREDS);
        }
      } else {
        const url = isApiPathNoSlash(post.author.host, ApiPaths.INBOX) ?
          `${post.author.id}/inbox` :
          `${post.author.id}/inbox/`;

        if (post.author.host === Hosts.TRIET) {
          data = {
            ...data,
            "@context": Links.LIKECONTEXT,
            "object": `${data.object}/`,
          }
        } else {
          data = {
            ...data,
            "context": Links.LIKECONTEXT,
          }
        }

        const response = await axios.post(url, data, {
          auth: {
            username: Username.NOTFOUND,
            password: codes[post.author.host],
          },
        });

        setPostLikes([...postLikes, response.data]);
        setIsUserLiked(true);
      }
    } catch(error) {
      toast.error("Unable to like this post");
    }
  };

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        if (isLocal) {
          const userCredentials = getUserCredentials();
          const url = `${post.id}/likes/`;

          if (userCredentials.username && userCredentials.password) {
            const response = await axios.get(url, {
              auth: {
                username: userCredentials.username,
                password: userCredentials.password,
              },
            });
            const dataLikes = response.data;
            setPostLikes(response.data);
            const isAuthorLiked = dataLikes.some((like: Like) =>
              like !== null && like.author?.id === userData.id
            );
            setIsUserLiked(isAuthorLiked);
          } else {
            toast.error(ToastMessages.NOUSERCREDS);
          }
        } else {
          const url = isApiPathNoSlash(post.id, ApiPaths.POSTLIKES) ?
            `${post.id}/likes` :
            `${post.id}/likes/`;

          const response = await axios.get(url, {
            auth: {
              username: Username.NOTFOUND,
              password: getCodeFromObjectId(post.id),
            },
          });
          let dataLikes: any;

          if ("items" in response.data) {
            dataLikes = response.data["items"];
          } else {
            dataLikes = response.data;
          }

          setPostLikes(dataLikes);
          const isAuthorLiked = dataLikes.some((like: Like) =>
            like !== null && like.author?.id === userData.id
          );
          setIsUserLiked(isAuthorLiked);
        }
      } catch (error) {
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
          {postLikes.length}
        </Typography>
      </Button>
    </Tooltip>
  )
};


export default PostLikes;
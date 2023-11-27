import { getUserCredentials, getUserData } from "../../../utils/localStorageUtils";
import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import axios from "axios";
import { Like, Post } from "../../../interfaces/interfaces";
import { getAuthorIdFromResponse } from "../../../utils/responseUtils";
import { toast } from "react-toastify";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Tooltip from "@mui/material/Tooltip";
import { Hosts, ToastMessages, Username } from "../../../enums/enums";
import { codes } from "../../../objects/objects";
import { localAuthorHosts } from "../../../lists/lists";

const PostLikes = ({
  post,
}: {
  post: Post;
}) => {
  const [postLikes, setPostLikes] = useState<Like[]>([]);
  const [isUserLiked, setIsUserLiked] = useState<boolean>(false);
  const postId = getAuthorIdFromResponse(post.id);
  const isLocal = localAuthorHosts.includes(post.author.host);
  const userData = getUserData();

  const handleLike = async () => {
    const data = {
      "type": "Like",
      "author": userData,
      "object": post.id,
      "context": "https://www.w3.org/ns/activitystreams",
      "summary": `${userData.displayName} Likes your post`
    }
    const url = `${post.author.id}/inbox/`

    try {
      if (isLocal) {
        const userCredentials = getUserCredentials();
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
      const url = `${post.author.id}/posts/${postId}/likes/`

      try {
        if (isLocal) {
          const userCredentials = getUserCredentials();
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
          const response = await axios.get(url, {
            auth: {
              username: Username.NOTFOUND,
              password: codes[post.author.host],
            },
          });
          let dataLikes: any;

          if (post.author.host === Hosts.CODEMONKEYS) {
            dataLikes = response.data["items"];
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
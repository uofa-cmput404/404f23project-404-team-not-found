import { getUserData } from "../../../utils/localStorageUtils";
import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import axios from "axios";
import { Like, Post } from "../../../interfaces/interfaces";
import { getAuthorIdFromResponse } from "../../../utils/responseUtils";
import { toast } from "react-toastify";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Tooltip from "@mui/material/Tooltip";

const APP_URI = process.env.REACT_APP_URI;

const PostLikes = ({
  post,
}: {
  post: Post;
}) => {
  const [postLikes, setPostLikes] = useState<Like[]>([]);
  const [isUserLiked, setIsUserLiked] = useState<boolean>(false);
  const authorId = getAuthorIdFromResponse(post.author.id);
  const postId = getAuthorIdFromResponse(post.id);
  const userData = getUserData();

  const handleLike = async () => {
    const data = {
      "type": "Like",
      "author": userData,
      "object": post.id
    }
    const url = `${APP_URI}authors/${authorId}/inbox/`

    try {
      const response = await axios.post(url, data);
      setPostLikes([...postLikes, response.data]);
      setIsUserLiked(true);
    } catch(error) {
      toast.error("Error posting likes");
    }
  };

  useEffect(() => {
    const fetchLikes = async () => {
      const url = `${APP_URI}authors/${authorId}/posts/${postId}/likes/`

      try {
        const response = await axios.get(url);
        const dataLikes = response.data;
        setPostLikes(dataLikes);
        const isAuthorLiked = dataLikes.some((like: Like) =>
          like.author.id === userData.id
        );
        setIsUserLiked(isAuthorLiked);
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
          {postLikes.length}
        </Typography>
      </Button>
    </Tooltip>
  )
};


export default PostLikes;
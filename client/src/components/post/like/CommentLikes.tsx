import { getUserData } from "../../../utils/localStorageUtils";
import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import axios from "axios";
import { Like } from "../../../interfaces/interfaces";
import { getAuthorIdFromResponse } from "../../../utils/responseUtils";
import { toast } from "react-toastify";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Tooltip from "@mui/material/Tooltip";
import { Comment } from "../../../interfaces/interfaces";

const APP_URI = process.env.REACT_APP_URI;

const CommentLikes = ({
  comment,
  postAuthorId,
  postId,
}: {
  comment: Comment,
  postAuthorId: string,
  postId: string,
}) => {
  const [commentLikes, setCommentLikes] = useState<Like[]>([]);
  const [isUserLiked, setIsUserLiked] = useState<boolean>(false);
  const commentAuthorId = getAuthorIdFromResponse(comment.author.id);
  const commentId = getAuthorIdFromResponse(comment.id);
  const userData = getUserData();

  const handleLike = async () => {
    const data = {
      "type": "Like",
      "author": userData,
      "object": comment.id
    }
    const url = `${APP_URI}authors/${commentAuthorId}/inbox/`

    try {
      const response = await axios.post(url, data);
      setCommentLikes([...commentLikes, response.data]);
      setIsUserLiked(true);
    } catch(error) {
      toast.error("Unable to like this comment");
    }
  };

  useEffect(() => {
    const fetchLikes = async () => {
      const url = `${APP_URI}authors/${postAuthorId}/posts/${postId}/comments/${commentId}/likes/`

      try {
        const response = await axios.get(url);
        const dataLikes = response.data;
        setCommentLikes(dataLikes);
        console.log(dataLikes)
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
          {commentLikes.length}
        </Typography>
      </Button>
    </Tooltip>
  )
};


export default CommentLikes;
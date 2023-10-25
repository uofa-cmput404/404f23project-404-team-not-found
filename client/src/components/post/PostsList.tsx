import React from 'react';
import { Post } from "../../interfaces/interfaces";
import { Avatar, Card, CardContent, CardHeader, Typography, IconButton } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { theme } from "../../index";
import { formatDateTime } from "../../utils/dateUtils";
import { getAuthorId } from "../../utils/localStorageUtils";
import DeleteIcon from '@mui/icons-material/Delete';

const PostsList = ({
  posts, deletePost
}: {
  posts: Post[];
  deletePost: (postId: string) => void;
}) => {
    return (
      <>
        { posts.length > 0 ? (posts.map(post => (
          <Card key={post.id} 
            style={{ 
              margin: "auto", 
              width: "40vw", 
              borderRadius: 0, 
              borderBottom: 0
            }} 
              variant='outlined'>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }} aria-label="recipe">
                    {post.author.displayName[0]}
                </Avatar>
              }
              action={
                (post.author.id === getAuthorId() && post.visibility === 'PUBLIC') && (
                <IconButton onClick={() => deletePost(post.id)} aria-label="settings">
                  <DeleteIcon />
                </IconButton>
              )}
              title={post.author.displayName}
              subheader={formatDateTime(post.published)}
              sx = {{marginTop:2}}
            />
            <CardContent sx={{marginBottom:10}}>
              <Typography variant="h6">{post.title}</Typography>
              <Typography variant="body1">{post.description}</Typography>
              <Typography variant="body1">{post.content}</Typography>
            </CardContent>
          </Card>
        ))): (
          <Typography variant="body1">No posts available.</Typography>
        )}
      </>
    );
};

export default PostsList;
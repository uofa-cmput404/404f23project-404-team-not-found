import React from 'react';
import { Post } from "../../interfaces/interfaces";
import { Avatar, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { theme } from "../../index";
import { formatDateTime } from "../../utils/dateUtils";

const PostsList = ({
  posts,
}: {
  posts: Post[];
}) => {
    return (
      <>
        { posts.map(post => (
          <Card key={post.id} style={{ margin: 10 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }} aria-label="recipe">
                    {post.author.displayName[0]}
                </Avatar>
              }
              title={post.author.displayName}
              subheader={formatDateTime(post.published)}
            />
            <CardContent>
              <Typography variant="h6">{post.title}</Typography>
              <Typography variant="body1">{post.description}</Typography>
              <Typography variant="body1">{post.content}</Typography>
            </CardContent>
          </Card>
        ))}
      </>
    );
};

export default PostsList;
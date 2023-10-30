import React, { useState } from 'react';
import { Post } from "../../interfaces/interfaces";
import { Avatar, Card, CardContent, CardHeader, Typography, CardMedia, Link, IconButton } from "@mui/material";
import { theme } from "../../index";
import { formatDateTime } from "../../utils/dateUtils";
import { getAuthorId } from "../../utils/localStorageUtils";
import DeleteIcon from '@mui/icons-material/Delete';
import { renderVisibility }from '../../utils/visibilityRenderUtils';
import { MuiMarkdown } from 'mui-markdown';
import PostCategories from "./PostCategories";
import { getAuthorIdFromResponse } from "../../utils/responseUtils";

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreMenu from './edit/MoreMenu';


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
              width: "100%", 
              borderRadius: 0, 
            }} 
              variant='outlined'>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }} aria-label="recipe">
                    {post.author.displayName[0]}
                </Avatar>
              }
              action={
                (getAuthorIdFromResponse(post.author.id) === getAuthorId() && post.visibility === 'PUBLIC') && (
                  <MoreMenu/>
              )}
              title={post.author.displayName}
              subheader={`${formatDateTime(post.published)} • ${renderVisibility(post)}`}
              sx = {{margin:0}}
            />
            <CardContent sx={{paddingTop: 0, paddingLeft: 9}}>
              <Typography variant="h6">{post.title}</Typography>
              <Typography variant="body1" marginBottom={1}>{post.description}</Typography>
              {post.contentType === "text/plain" && post.content?.slice(0, 4) === "http" ? (
              <div>
              <Link href={post.content} target="_blank" noWrap> 
                <Typography noWrap sx={{marginTop:1, marginBottom:0.5}}>
                  {post.content}
                </Typography> 
              </Link>
              <CardContent sx={{ padding: 0 }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <CardMedia
                    component="img"
                    style={{
                      maxWidth: "100%",
                      width: "auto",
                      borderRadius: 12,
                    }}
                    image={post.content}
                  />
                </div>
              </CardContent>
              </div>
            ):(
              post.contentType === "text/plain" && (
                <Typography variant="body1">{post.content}</Typography>)
            )}
            {post.contentType === "text/markdown" && (
                <CardContent sx={{ padding: 0}}>
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>

                   {/* https://www.npmjs.com/package/mui-markdown */}
                  <MuiMarkdown>{`${post.content}`}</MuiMarkdown>
                </div>
                </CardContent>
            )}
            {post.contentType.includes("base64") && (
              <CardContent sx={{ padding: 0}}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <CardMedia
                    component="img"
                    style={{
                      maxWidth: "100%",
                      width: "auto",
                      borderRadius: 12,
                    }}
                    image={post.content}
                  />
                </div>
              </CardContent>
            )}
            </CardContent>
            <CardContent>
              <PostCategories categories={post.categories}/>
            </CardContent>
          </Card>
        ))): (
          <Typography variant="body1">No posts available.</Typography>
        )}
      </>
    );
};

export default PostsList;
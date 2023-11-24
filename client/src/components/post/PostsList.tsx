import React from 'react';
import { Post } from "../../interfaces/interfaces";
import { Avatar, Card, CardContent, CardHeader, Typography, CardMedia, Link ,Grid , Button,IconButton} from "@mui/material";
import { formatDateTime } from "../../utils/dateUtils";
import { getAuthorId } from "../../utils/localStorageUtils";
import { renderVisibility }from '../../utils/postUtils';
import { MuiMarkdown } from 'mui-markdown';
import PostCategories from "./PostCategories";
import { getAuthorIdFromResponse } from "../../utils/responseUtils";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MakeCommentModal from "../post/MakeCommentModal";
import ShareIcon from '@mui/icons-material/Share';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import MoreMenu from './edit/MoreMenu';
import styled from '@emotion/styled';

const CardContentNoPadding = styled(CardContent)(`
  padding: 0;
  &:last-child {
    padding-bottom: 0;
  }
`);

const PostsList = ({
  posts, deletePost, onPostEdited
}: {
  posts: Post[];
  deletePost: (postId: string) => void;
  onPostEdited: () => void;
}) => {
  const [isMakeCommentModalOpen, setIsMakeCommentModalOpen] = useState(false);
  const [postToComment, setPostToComment] = useState<Post>();
  const handlelike = () => { };
  const handleShare = () => { };

  const openMakeCommentModal = (post: Post) => {
    setPostToComment(post);
    setIsMakeCommentModalOpen(true);
  };
  
  return (
    <Grid>
      { posts.length > 0 ? (posts.map(post => (
        <Card key={post.id}
          style={{
            margin: "auto",
            width: "100%",
            borderRadius: 0,
            borderLeft: 0,
            borderRight: 0,
            borderTop: 0
          }}
            variant='outlined'>
          <CardHeader
            avatar={<Avatar src={post.author.profileImage} alt={post.author.displayName} />}
            action={
              (getAuthorIdFromResponse(post.author.id) === getAuthorId() && post.visibility === 'PUBLIC') && (
                <MoreMenu
                  post={post}
                  deletePost={deletePost}
                  onPostEdited={onPostEdited}
                />
            )}
            title={post.author.displayName}
            subheader={post.updatedAt === null ? `${formatDateTime(post.published)} • ${renderVisibility(post)}` :
            `${formatDateTime(post.published)} • ${renderVisibility(post)} • Edited`
            }
            sx = {{margin:0}}
          />
          <CardContent
            sx={{
              paddingTop: 0,
              paddingLeft: 9,
              paddingBottom: 0,
              }}>
            <Typography variant="h6">{post.title}</Typography>
            <Typography variant="body1" marginBottom={1}>{post.description}</Typography>
            {post.contentType === "text/plain" && post.content?.slice(0, 4) === "http" ? (
            <div style={{paddingBottom: 0}}>
              <Link href={post.content} target="_blank" noWrap>
                <Typography noWrap sx={{marginTop:1, marginBottom:0.5}}>
                  {post.content}
                </Typography>
              </Link>
              <CardContentNoPadding sx={{ padding: 0, paddingBottom:0 }}>
                <div style={{ paddingBottom: 0 }}>
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
              </CardContentNoPadding>
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
            <CardContentNoPadding sx={{ padding: 0}}>
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
            </CardContentNoPadding>
          )}
          </CardContent>
          <CardContent sx={{paddingLeft: 8.5, paddingTop: 1, paddingBottom: 0}}>
            <PostCategories categories={post.categories}/>
          </CardContent>
          <CardContent sx={{paddingTop: 0.5, paddingBottom: 0, paddingLeft: 7.5}}>
            <Grid container
              justifyContent="space-between"
              paddingLeft={0.5}
              sx={{
                width: "100%"
              }}
            >
              <Grid item xs={4}>
                <Tooltip title="Like" placement="bottom-end">
                <Button
                  id="like"
                  size="small"
                  onClick={handlelike}
                  sx={{
                    maxWidth: "auto",
                    minWidth:0 ,
                    borderRadius: 100,
                    color: "text.secondary"
                  }}
                >
                  <FavoriteBorderIcon fontSize='small' sx={{paddingBottom:0}}/>
                </Button>
                </Tooltip>
              </Grid>
              <Grid item xs={4} container justifyContent="center">
                <Tooltip title="Comment" placement="bottom-end">
                <Button
                  size="small"
                  sx={{
                    borderRadius: 100,
                    minWidth:0 ,
                    color: "text.secondary"
                  }}
                  onClick={
                    () => {
                      openMakeCommentModal(post);
                    }
                  }
                >
                  <ChatBubbleOutlineIcon fontSize="small" />
                  <Typography sx={{marginLeft: 1}}>
                    {post.count}
                  </Typography>
                </Button>
                </Tooltip>
              </Grid>
              <Grid item xs={4} container justifyContent="flex-end">
                <Tooltip title="Share" placement="bottom-end">
                <IconButton
                  size="small"
                  sx={{ marginRight: 1 }}
                  onClick={handleShare}
                >
                  <ShareIcon fontSize="medium" />
                </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )))
      : (
          <Typography variant="h6"
            align='center'
            sx={{
              marginTop: 5,
              color: "#858585"
            }}
          >
            No posts available...
          </Typography>
      )}
      {isMakeCommentModalOpen &&
        <MakeCommentModal
          isCmodalOpen={isMakeCommentModalOpen}
          post={postToComment!}
          setIsCModalOpen={setIsMakeCommentModalOpen}
        />
      }
    </Grid>
  );
};

export default PostsList;
import React from 'react';
import { Post, Author } from "../../interfaces/interfaces";
import { Avatar, Card, CardContent, CardHeader, Typography, CardMedia, Link, 
  Grid, Button, IconButton, CardActionArea, ButtonBase } from "@mui/material";
import { formatDateTime } from "../../utils/dateUtils";
import { getAuthorId } from "../../utils/localStorageUtils";
import { renderVisibility }from '../../utils/postUtils';
import { MuiMarkdown } from 'mui-markdown';
import PostCategories from "./PostCategories";
import { getAuthorIdFromResponse } from "../../utils/responseUtils";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MakeCommentModal from "../post/MakeCommentModal";
import ShareIcon from '@mui/icons-material/Share';
import Tooltip from '@mui/material/Tooltip';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SharePostModal from './SharePostModal';
import { getUserCredentials } from '../../utils/localStorageUtils';

import MoreMenu from './edit/MoreMenu';
import styled from '@emotion/styled';
import PostLikes from "./like/PostLikes";

const APP_URI = process.env.REACT_APP_URI;

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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharedPost, setSharedPost] = useState<Post | null>(null);
  const [isShareButtonDisabled, setIsShareButtonDisabled] = useState(false);
  const navigate = useNavigate();

  const useFollowers = () => {
    const [followers, setFollowers] = useState<Author[]>([]);
  
    useEffect(() => {
      const fetchFollowers = async (): Promise<void> => {
        const AUTHOR_ID = getAuthorId();
        const url = `${APP_URI}authors/${AUTHOR_ID}/followers/`;
  
        try {
          const userCredentials = getUserCredentials();
          if (userCredentials.username && userCredentials.password) {
            const response = await axios.get(url, {
              auth: {
                username: userCredentials.username,
                password: userCredentials.password,
              },
            });
            const followersData = response.data.items as Author[];
            setFollowers(followersData);
          }
        } catch (error) {
          console.error('Error fetching followers:', error);
          setFollowers([]);
        }
      };
  
      fetchFollowers();
  
    }, []);
  
    return { followers };
  };

  const { followers } = useFollowers();


  const handleShare = (post: Post) => {
    const shouldDisableShareButton =
      post.visibility === 'PRIVATE' ||
      (post.visibility === 'FRIENDS' && post.contentType === 'image/png;base64');
  
    if (shouldDisableShareButton) {
      return; // Exit early if sharing is disabled
    }
  
    setIsShareButtonDisabled(true);
    setIsShareModalOpen(true);
    setSharedPost(post);
  };

  const openMakeCommentModal = (post: Post) => {
    setPostToComment(post);
    setIsMakeCommentModalOpen(true);
  };

  const handlePostClick = (authorId:string, postId:string, postArg: Post) => {
    navigate(
      `/${authorId}/posts/${postId}`,
      {
        state: {
          post: postArg
        }
      }
      )
  }
  
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
            borderTop: 0,
            position: "relative"
          }}
          variant='outlined'
        >
          <CardActionArea
            component="span"
            disableRipple
            onClick={event => {
              handlePostClick(
                getAuthorIdFromResponse(post.author.id),
                getAuthorIdFromResponse(post.id),
                post
                );
            }} 
          >
            <CardHeader
              avatar={<Avatar src={post.author.profileImage} alt={post.author.displayName} />}
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
            <CardContent sx={{paddingTop: 0.5, paddingLeft: 7.5}}>
              <Grid container
                justifyContent="space-between"
                paddingLeft={0.5}
                sx={{
                  width: "100%"
                }}
              >
                <Grid item xs={4}>
                  <ButtonBase
                    component="span"
                    onMouseDown={event => event.stopPropagation()}
                    sx={{borderRadius: 100}}
                    disableRipple
                    onClick={event => {
                      event.stopPropagation();
                      event.preventDefault();
                    }}  
                  >
                    <PostLikes post={post} />
                  </ButtonBase>
                </Grid>
                <Grid item xs={4} container justifyContent="center">
                  <Tooltip title="Comment" placement="bottom-end">
                  <Button
                    size="small"
                    sx={{
                      borderRadius: 100,
                      minWidth: 0,
                      color: "text.secondary"
                    }}
                    onMouseDown={event => event.stopPropagation()}
                    onClick={event => {
                      event.stopPropagation();
                      event.preventDefault();
                      openMakeCommentModal(post);
                    }}
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
                      onMouseDown={event => event.stopPropagation()}
                      onClick={event => {
                        event.stopPropagation();
                        event.preventDefault();
                        handleShare(post);
                      }}
                      disabled={isShareButtonDisabled}
                    >
                      <ShareIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                  <SharePostModal
                    isModalOpen={isShareModalOpen}
                    setIsModalOpen={setIsShareModalOpen}
                    followers={followers}
                    post={sharedPost}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
          { 
          (getAuthorIdFromResponse(post.author.id) === getAuthorId() && 
          post.visibility === 'PUBLIC') && 
          (<Grid
            sx={{
              position: "absolute",
              zIndex: 1000,
              right: 0,
              top: 0,
              marginRight: 1,
              marginTop: 1
            }}
          >
            <MoreMenu
              post={post}
              deletePost={deletePost}
              onPostEdited={onPostEdited}
            />
          </Grid>)
        }
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
import {
  CssBaseline, Grid, Card, Avatar, CardContent, Typography, CardHeader,
  CardMedia, Link, Tooltip, IconButton, Button, TextField, InputAdornment, Chip
} from "@mui/material";
import HeadBar from "../../template/AppBar";
import LeftNavBar from "../../template/LeftNavBar";
import MakePostModal from "../MakePostModal";
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import MuiMarkdown from "mui-markdown";
import { getAuthorId, getUserCredentials, getUserData } from "../../../utils/localStorageUtils";
import { getAuthorIdFromResponse, isHostLocal } from "../../../utils/responseUtils";
import { formatDateTime } from "../../../utils/dateUtils";
import { renderVisibility } from "../../../utils/postUtils";
import { Post, Comment, Author } from "../../../interfaces/interfaces";
import axios from "axios";
import PostComments from "../comment/PostComments";
import Loading from "../../ui/Loading";
import PostCategories from "../PostCategories";
import PostLikes from "../like/PostLikes";
import ShareIcon from '@mui/icons-material/Share';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import styled from "@emotion/styled";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-toastify";
import MoreMenu from "../edit/MoreMenu";
import SharePostModal from "../SharePostModal";
import { localAuthorHosts, remoteAuthorHosts } from "../../../lists/lists";
import { Hosts, ToastMessages, Username } from "../../../enums/enums";
import { codes } from "../../../objects/objects";
import LinkIcon from '@mui/icons-material/Link';

const CardContentNoPadding = styled(CardContent)(`
  padding: 0;
  &:last-child {
    padding-bottom: 0;
  }
`);

const APP_URI = process.env.REACT_APP_URI;

const PostPage = () => {
  const location = useLocation();
  const [post, setPost] = useState<Post>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [postHost, setPostHost] = useState<string>("");
  const [isMakePostModalOpen, setIsMakePostModalOpen] = useState(false);
  const { authorId, postId } = useParams();
  const [comments, setComments] = useState<Comment[]>([]);
  const [value, setValue] = useState("");
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const userData = getUserData();
  const loggedUserId = getAuthorId();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharedPost, setSharedPost] = useState<Post | null>(null);

  const isLocal = (host: string): boolean => {
    return localAuthorHosts.includes(host);
  };

  const fetchPost = async (): Promise<string[]> => {
    const endpoint = `authors/${authorId}/posts/${postId}/`;
    const localUrl = `${APP_URI}${endpoint}`;

    // check if this post is a local post
    try {
      const userCredentials = getUserCredentials();

      if (userCredentials.username && userCredentials.password) {
        const response = await axios.get(localUrl, {
          auth: {
            username: userCredentials.username,
            password: userCredentials.password,
          },
        });
        setPost(response.data);
        setPostHost(response.data.author.host);
        return [response.data.id!, response.data.author.host];
      }
    } catch (error) {
    }

    // if it's not a local post, then it must be a remote host
    // go through every remote host and see if it's their post
    for (const remoteHost of remoteAuthorHosts) {
      const url = `${remoteHost}${endpoint}`
      try {
        const response = await axios.get(url, {
          auth: {
            username: Username.NOTFOUND,
            password: codes[remoteHost],
          },
        });
        setPost(response.data);
        setPostHost(remoteHost);
        return [response.data.id, remoteHost];
      } catch (error) {
      }
    }

    // if it reaches here, postId and authorId cannot be found
    console.error("Unable to fetch post");
    return [];
  };

  const fetchComments = async (postUrlId: string, host: string) => {
    const isPostLocal = isHostLocal(host);
    const url = `${postUrlId}/comments/`

    try {
      if (isPostLocal) {
        const userCredentials = getUserCredentials();

        if (userCredentials.username && userCredentials.password) {
          const response = await axios.get(url, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          });

          setComments(response.data["comments"]);
        } else {
          toast.error(ToastMessages.NOUSERCREDS);
        }
      } else {
        const response = await axios.get(url, {
          auth: {
            username: Username.NOTFOUND,
            password: codes[host],
          },
          params: {
            page: 1,
            size: 10
          }
        });

        setComments(response.data["comments"]);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      let isHostFound = false;

      // If location.state exists, used the passed post object
      // otherwise, fetch the post object
      if (location.state?.post) {
        setPost(location.state.post);
        setPostHost(location.state.post.author.host);
        await fetchComments(location.state.post.id, location.state.post.author.host);
        isHostFound = true;
      } else {
        try {
          const results = await fetchPost();
          if (results.length > 0) {
            await fetchComments(results[0], results[1]);
            isHostFound = true;
          }
        } catch (error) {
          toast.error("Unable to load post.");
        }
      }

      if (isHostFound) {
        setIsLoading(false);
      } else if (!location.state?.post) {
        toast.error("Unable to load post.");
      }
    };

  initialize();
  }, []);

  const openMakePostModal = () => {
    setIsMakePostModalOpen(true);
  };

  const handleSubmit = async (comment: string, contentType: string, post: Post) => {
    const data = {
      comment: comment,
      contentType: contentType,
      author: userData,
    };

    const url = `${post.id}/comments/`;
    const isPostLocal = isHostLocal(postHost);

    try {
      if (isPostLocal) {
        const userCredentials = getUserCredentials();
        if (userCredentials.username && userCredentials.password) {
          const response = await axios.post(url, data, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          });

          post.count = post.count + 1;
          await fetchComments(post.id, post.author.id);
          if (loggedUserId !== authorId) {
            await sendCommentToInbox(comment, contentType, response.data["id"]);
          }
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

        post.count = post.count + 1;
        await fetchComments(post.id, post.author.id);
        await sendCommentToInbox(comment, contentType, response.data["id"]);
      }

      handleClear();
    } catch (error) {
      toast.error("Error posting comment");
    }
  };

  const sendCommentToInbox = async (
    comment: string,
    contentType: string,
    commentId: string
  ) => {
    const data = {
      type: "comment",
      author: userData,
      id: commentId,
      comment: comment,
      contentType: contentType,
    };

    const url = `${postHost}authors/${authorId}/inbox/`;
    const isPostLocal = isHostLocal(postHost);

    try {
      if (isPostLocal) {
        const userCredentials = getUserCredentials();

        if (userCredentials.username && userCredentials.password) {
          await axios.post(url, data, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          });
        }
      } else {
        await axios.post(url, data, {
          auth: {
            username: Username.NOTFOUND,
            password: codes[postHost],
          },
        });
      }
    } catch (error) {
      console.error("Failed to send comment to inbox");
    }
  };

  const handleClear = () => {
    setValue("");
  };

  const deletePost = async (postId: string) => {
    // no need to update, this can only be done by the logged in (local) user
    try {
      const userCredentials = getUserCredentials();

      const APIurl = `${postId}/`;
      if (userCredentials.username && userCredentials.password) {
        await axios.delete(APIurl, {
          auth: {
            username: userCredentials.username,
            password: userCredentials.password,
          },
        });
        navigate(`/home-page`)
      }
      toast.success("Post deleted successfully, redirected to home page.");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

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
    setIsShareModalOpen(true);
    setSharedPost(post);
  };

  return (
    <>
    <CssBaseline/>
    <HeadBar/>
    <Grid
      container
      style={{ 
        width: "100%",
        height: "100vh", 
        margin: "0 auto", 
        marginTop: 60, 
        overscrollBehavior: "none"
      }}
    >
      <Grid item xs={3.6} style={{ height: "80vh" }}>
        <LeftNavBar
          openMakePostModal={openMakePostModal}
        />
      </Grid>
      {(isLoading || !post) ? (
          <Loading />
        ) : (
          <Grid item xs={4.8} justifyContent='center'
            sx={{
              minHeight: "calc(100vh - 60px)",
              maxHeight: "auto",
              borderLeft: "1px solid #dbd9d9",
              borderRight: "1px solid #dbd9d9",
            }}
          >
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
                      onPostEdited={fetchPost}
                    />
                )}
                title={
                  <Grid container direction="row">
                    <Typography>
                      {`${post.author.displayName}`}
                    </Typography>
                    <Chip
                      label={
                        <Typography sx={{fontSize: "1em", color: "text.secondary"}}>
                          {`${isHostLocal(postHost) ? "Local" : "Remote"}`}
                        </Typography>
                      }
                      size="small"
                      variant="filled"
                      sx={{ marginLeft: 0.5 }}
                    />
                  </Grid>
                }
                subheader={(post.updatedAt === undefined || post.updatedAt === null) ?
                  `${formatDateTime(post.published)} • ${renderVisibility(post)}` :
                  `${formatDateTime(post.published)} • ${renderVisibility(post)} • Edited`
                }
                sx = {{margin:0}}
              />
              <CardContent
                sx={{
                  paddingTop: 0,
                  paddingLeft: 9,
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
                  <CardContentNoPadding>
                    <div>
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
                <CardContentNoPadding>
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
              <CardContent sx={{paddingBottom: 0, paddingTop: 0}}>
                <PostCategories categories={post.categories}/>
              </CardContent>
              <Grid
                sx={{
                  borderTop: "1px solid #dbd9d9",
                  paddingTop: 0.5,
                  paddingBottom: 0.5,
                  marginTop: 1,
                  paddingLeft: 1
                }}>
              <Grid container
                justifyContent="space-between"
                sx={{
                  width: "100%"
                }}
              >
                <Grid item xs={4}>
                  <PostLikes post={post} />
                </Grid>
                <Grid item xs={4} container justifyContent="center">
                  <Button
                    size="small"
                    disabled
                    sx={{
                      borderRadius: 100,
                      minWidth: 0,
                      "&.Mui-disabled": {
                        background: "white",
                        color: "text.secondary",
                      },
                    }}
                  >
                    <ChatBubbleOutlineIcon fontSize="small" />
                    <Typography sx={{marginLeft: 1}}>
                      {post.count}
                    </Typography>
                  </Button>
                </Grid>
                <Grid item xs={4} container justifyContent="flex-end">
                  <Tooltip title="Share" placement="bottom-end">
                  <IconButton
                    size="small"
                    sx={{ marginRight: 1 }}
                    onClick={() => {
                      handleShare(post);
                    }}
                  >
                    <ShareIcon fontSize="medium" />
                  </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
            </Card>
            <Grid container
              sx={{
                width: "100%",
                borderBottom: "1px solid #dbd9d9",
                paddingLeft: 2,
                paddingRight: 3,
                paddingBottom: 1.5,
              }}
            >
              <TextField
                variant="standard"
                label={value ? " " : "Write a comment..."}
                InputLabelProps={{ shrink: false }}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setComment(e.target.value);
                }}
                InputProps={{
                  disableUnderline: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        color="primary"
                        disabled={value === ""}
                        onClick={() => {
                        handleSubmit(comment, "text/plain", post);
                        }}
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </Grid>
            <Grid>
              <PostComments
                comments={comments}
                postId={postId!}
              />
            </Grid>
          </Grid>
      )}
    </Grid>
    {isMakePostModalOpen && (
      <MakePostModal
        isModalOpen={isMakePostModalOpen}
        setIsModalOpen={setIsMakePostModalOpen}
      />
    )}
    { isShareModalOpen && 
      <SharePostModal
        isModalOpen={isShareModalOpen}
        setIsModalOpen={setIsShareModalOpen}
        followers={followers}
        post={sharedPost!}
      />
    }
  </>
  );
};

export default PostPage;
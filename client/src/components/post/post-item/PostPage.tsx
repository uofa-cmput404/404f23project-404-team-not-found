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
import {
  configureImageEncoding,
  getAuthorIdFromResponse, isApiPathNoSlash,
  isHostLocal, isPostImage, isPostMarkdown,
  isPostPlainText
} from "../../../utils/responseUtils";
import { Post, Comment, Author, CommentPostRequest } from "../../../interfaces/interfaces";
import axios, { AxiosRequestConfig } from "axios";
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
import { remoteAuthorHosts } from "../../../lists/lists";
import { ApiPaths, ContentType, Hosts, ToastMessages, Username } from "../../../enums/enums";
import { codes } from "../../../objects/objects";
import { v4 as uuidv4 } from "uuid";
import { getFormattedPostSubheader } from "../../../utils/formattingUtils";

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
  const [isShareButtonDisabled, setIsShareButtonDisabled] = useState(false);

  const fetchPost = async (): Promise<string[]> => {
    const endpoint = `authors/${authorId}/posts/${postId}`;

    // check if this post is a local post
    try {
      const userCredentials = getUserCredentials();
      const localUrl = `${APP_URI}${endpoint}/`;

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
      const url = isApiPathNoSlash(remoteHost, ApiPaths.POST) ?
        `${remoteHost}${endpoint}` :
        `${remoteHost}${endpoint}/`;

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

    try {
      if (isPostLocal) {
        const userCredentials = getUserCredentials();
        const url = `${postUrlId}/comments/`;


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
        let comments: any;
        let url = isApiPathNoSlash(postUrlId, ApiPaths.COMMENTS) ?
        `${postUrlId}/comments` :
        `${postUrlId}/comments/`;

        let config: AxiosRequestConfig = {
          auth: {
            username: Username.NOTFOUND,
            password: codes[host],
          },
        };

        if (host === Hosts.CODEMONKEYS) {
          // code monkeys require page & size query params
          config = {
            ...config,
            params: {
              page: 1,
              size: 50
            }
          }
        } else if (host === Hosts.TRIET) {
          // Triet needs a query parameter when we're fetching comments
          config = {
            ...config,
            headers: {
              "x-client-id": userData.id,
            },
          }
        }

        const response = await axios.get(url, config);

          if (!("comments" in response.data) &&
            (host === Hosts.WEBWIZARDS || host === Hosts.NETNINJAS)) {
            // edge case where if a post has no comments, web wizards only return {}
            // net ninjas only return []
            comments = [];
          } else {
            comments = response.data["comments"];
          }

        setComments(comments);
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

  const handleCommentSubmit = async (comment: string, contentType: string, post: Post) => {
    let data: CommentPostRequest = {
      comment: comment,
      contentType: contentType as ContentType,
      author: userData,
    };

    const isPostLocal = isHostLocal(postHost);

    try {
      if (isPostLocal) {
        const userCredentials = getUserCredentials();
        const url = `${post.id}/comments/`;

        if (userCredentials.username && userCredentials.password) {
          const response = await axios.post(url, data, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          });

          post.count = post.count + 1;
          await fetchComments(post.id, post.author.host);
          if (loggedUserId !== authorId) {
            await sendCommentToInbox(comment, contentType, response.data["id"], post.author.id, response.data["published"]);
          }
        } else {
          toast.error(ToastMessages.NOUSERCREDS);
        }
      } else {
        if (post.author.host === Hosts.CODEMONKEYS) {
          data = {
            ...data,
            id: `${post.id}/comments/${uuidv4()}`,
            published: new Date().toString(),
          };
        }
        const url = isApiPathNoSlash(post.id, ApiPaths.COMMENTS) ?
          `${post.id}/comments` :
          `${post.id}/comments/`;

        const response = await axios.post(url, data, {
          auth: {
            username: Username.NOTFOUND,
            password: codes[post.author.host],
          },
        });

        post.count = post.count + 1;
        await fetchComments(post.id, post.author.host);
        await sendCommentToInbox(comment, contentType, response.data["id"], post.author.id, response.data["published"]);
      }

      handleClear();
    } catch (error) {
      toast.error("Error posting comment");
    }
  };

  const sendCommentToInbox = async (
    comment: string,
    contentType: string,
    commentId: string,
    authorUrlId: string,
    published: string,
  ) => {
    const data = {
      type: "comment",
      author: userData,
      id: commentId,
      comment: comment,
      contentType: contentType,
      published: published,
    };
    const isPostLocal = isHostLocal(postHost);

    try {
      if (isPostLocal) {
        const userCredentials = getUserCredentials();
        const url = `${authorUrlId}/inbox/`;

        if (userCredentials.username && userCredentials.password) {
          await axios.post(url, data, {
            auth: {
              username: userCredentials.username,
              password: userCredentials.password,
            },
          });
        }
      } else {
        const url = isApiPathNoSlash(postHost, ApiPaths.INBOX) ?
          `${authorUrlId}/inbox` :
          `${authorUrlId}/inbox/`;

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
      // used only for local authors, this is getting all the followers of the logged-in user
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
      (post.visibility === 'FRIENDS' && post.contentType.includes("base64"));
  
    if (shouldDisableShareButton) {
      return; // Exit early if sharing is disabled
    }

    setIsShareModalOpen(true);
    setSharedPost(post);
  };

  const handleAuthorProfileClick = () => {
    const authorId = getAuthorIdFromResponse(post!.author.id);
    navigate(
      `/authors/${authorId}`,
      {
        state: {
          otherAuthorObject: post!.author,
          userObject: userData
        }
      }
    );
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

          <Grid item xs={4.8} justifyContent='center'
            sx={{
              minHeight: "calc(100vh - 60px)",
              maxHeight: "auto",
              borderLeft: "1px solid #dbd9d9",
              borderRight: "1px solid #dbd9d9",
            }}
          >
          {(isLoading || !post) ? (
            <Loading />
          ) : (
            <>
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
                  avatar={
                    <Avatar 
                      src={post.author.profileImage}
                      alt={post.author.displayName}
                      sx={{
                        cursor: "pointer",
                      }}
                      onClick={event => { 
                        event.stopPropagation();
                        event.preventDefault();
                        handleAuthorProfileClick() 
                      }} 
                      />
                  }
                  action={
                    (getAuthorIdFromResponse(post.author.id) === getAuthorId() && post.visibility === 'PUBLIC') && (
                      <MoreMenu
                        post={post}
                        deletePost={deletePost}
                        onPostEdited={fetchPost}
                      />
                  )}
                  title={
                    <Grid container direction="row" alignItems="center">
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
                        sx={{ marginLeft: 0.5, height: 1 }}
                      />
                    </Grid>
                  }
                  subheader={getFormattedPostSubheader(post)}
                  sx = {{margin:0}}
                />
                <CardContent
                  sx={{
                    paddingTop: 0,
                    paddingLeft: 9,
                    }}>
                  <Typography variant="h6">{post.title}</Typography>
                  <Typography variant="body1" marginBottom={1}>{post.description}</Typography>
                  {isPostPlainText(post) && post.content?.slice(0, 4) === "http" ? (
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
                  isPostPlainText(post) && (
                    <Typography variant="body1">{post.content}</Typography>)
                )}
                {isPostMarkdown(post) && (
                    <CardContent sx={{ padding: 0}}>
                      <div style={{ display: "flex", justifyContent: "flex-start" }}>

                      {/* https://www.npmjs.com/package/mui-markdown */}
                      <MuiMarkdown>{`${post.content}`}</MuiMarkdown>
                    </div>
                    </CardContent>
                )}
                {isPostImage(post) && (
                  <CardContentNoPadding>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <CardMedia
                        component="img"
                        style={{
                          maxWidth: "100%",
                          width: "auto",
                          borderRadius: 12,
                        }}
                        image={configureImageEncoding(post)}
                      />
                    </div>
                  </CardContentNoPadding>
                )}
                </CardContent>
                {post.categories !== undefined && post.categories !== null && (
                  <CardContent sx={{paddingBottom: 0, paddingTop: 0}}>
                    <PostCategories categories={post.categories}/>
                  </CardContent>
                )}
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
                      disabled={isShareButtonDisabled}
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
                          handleCommentSubmit(comment, "text/plain", post);
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
            </>
          )}
          </Grid>
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
import { CssBaseline, Grid, Card, Avatar, CardContent, Typography, CardHeader,
  CardMedia, ButtonBase, Link, Tooltip, IconButton, Button, TextField, InputAdornment } from "@mui/material";
import HeadBar from "../../template/AppBar";
import LeftNavBar from "../../template/LeftNavBar";
import MakePostModal from "../MakePostModal";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import MuiMarkdown from "mui-markdown";
import { getAuthorId, getUserCredentials, getUserData } from "../../../utils/localStorageUtils";
import { getAuthorIdFromResponse } from "../../../utils/responseUtils";
import { formatDateTime } from "../../../utils/dateUtils";
import { renderVisibility } from "../../../utils/postUtils";
import { Post, Comment } from "../../../interfaces/interfaces";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isMakePostModalOpen, setIsMakePostModalOpen] = useState(false);
  const { authorId, postId } = useParams();
  const [comments, setComments] = useState<Comment[]>([]);
  const [value, setValue] = useState("");
  const userData = getUserData();
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const fetchPost = async () => {
    const url = `${APP_URI}authors/${authorId}/posts/${postId}/`;

    try {
      const userCredentials = getUserCredentials();

      if (userCredentials.username && userCredentials.password) {
        const response = await axios.get(url, {
          auth: {
            username: userCredentials.username,
            password: userCredentials.password,
          },
        });
        setPost(response.data);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const fetchComments = async () => {
    const url = `${APP_URI}authors/${authorId}/posts/${postId}/comments/`;

    try {
      const userCredentials = getUserCredentials();

      if (userCredentials.username && userCredentials.password) {
        const response = await axios.get(url, {
          auth: {
            username: userCredentials.username,
            password: userCredentials.password,
          },
        });
        setComments(response.data["comments"]);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    // If location.state exists, used the passed post object
    // otherwise, fetch the post object
    if (location.state?.postObject) {
      setPost(location.state.postObject);
    } else {
      fetchPost();
    }
    fetchComments();
    setIsLoading(false);
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

    const url = `${APP_URI}authors/${authorId}/posts/${postId}/comments/`;

    const userCredentials = getUserCredentials();

    if (userCredentials.username && userCredentials.password) {
      axios
        .post(url, data, {
          auth: {
            username: userCredentials.username,
            password: userCredentials.password,
          },
        })
        .then((response: any) => {
          fetchComments();
          handleClear();
          post.count = post.count + 1;
          fetchComments();
          if (getAuthorId() !== authorId) {
            sendCommentToInbox(comment, contentType, response.data["id"]);
          }
        })
        .catch((error) => {
          toast.error("Error posting comment", error);
        });
    }
  };

  const sendCommentToInbox = async (
    comment: string,
    contentType: string,
    id: string
  ) => {
    const data = {
      type: "comment",
      author: userData,
      id: id,
      comment: comment,
      contentType: contentType,
    };

    const url = `${APP_URI}authors/${authorId}/inbox/`;

    try {
      const userCredentials = getUserCredentials();

      if (userCredentials.username && userCredentials.password) {
        await axios.post(url, data, {
          auth: {
            username: userCredentials.username,
            password: userCredentials.password,
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
                postAuthorId={authorId!}
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
  </>
  );
};

export default PostPage;
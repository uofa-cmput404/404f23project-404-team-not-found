import { CssBaseline, Grid, Card, Avatar, CardContent, Typography, CardHeader,
  CardMedia, ButtonBase, Link } from "@mui/material";
import HeadBar from "../../template/AppBar";
import LeftNavBar from "../../template/LeftNavBar";
import MakePostModal from "../MakePostModal";
import {useEffect, useState} from "react";
import { useParams, useLocation } from "react-router-dom";
import MoreMenu from "../edit/MoreMenu";
import MuiMarkdown from "mui-markdown";
import {getAuthorId, getUserCredentials} from "../../../utils/localStorageUtils";
import { getAuthorIdFromResponse } from "../../../utils/responseUtils";
import { formatDateTime } from "../../../utils/dateUtils";
import { renderVisibility } from "../../../utils/postUtils";
import axios from "axios";
import { Post } from "../../../interfaces/interfaces";
import Loading from "../../ui/Loading";

const APP_URI = process.env.REACT_APP_URI;

const PostPage = () => {
  const [isMakePostModalOpen, setIsMakePostModalOpen] = useState(false);
  const location = useLocation();
  const [post, setPost] = useState<Post>();
  const [isLoading, setIsLoading] = useState(true);
  const { authorId, postId} = useParams();

  const fetchPost = async () => {
    const AUTHOR_ID = getAuthorId();
    const url = `${APP_URI}authors/${AUTHOR_ID}/posts/${postId}/`;

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

  useEffect(() => {
    setIsLoading(true);
    // If location.state exists, used the passed post object
    // otherwise, fetch the post object
    if (location.state?.postObject) {
      setPost(location.state.postObject);
    } else {
      fetchPost();
    }

    setIsLoading(false);
  }, []);

  const openMakePostModal = () => {
    setIsMakePostModalOpen(true);
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
                  <ButtonBase
                  onMouseDown={event => event.stopPropagation()}
                  sx={{borderRadius: 100}}
                  disableRipple
                  onClick={event => {
                    event.stopPropagation();
                    event.preventDefault();
                  }}
                  >
                    {/* <MoreMenu
                      post={post}
                      deletePost={deletePost}
                      onPostEdited={onPostEdited}
                    /> */}
                  </ButtonBase>

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
                <CardContent sx={{ padding: 0, paddingBottom:0 }}>
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
            </Card>
        )}
      </Grid>
    </Grid>
    <MakePostModal
        isModalOpen={isMakePostModalOpen}
        setIsModalOpen={setIsMakePostModalOpen}
    />
  </>
  );
};

export default PostPage;
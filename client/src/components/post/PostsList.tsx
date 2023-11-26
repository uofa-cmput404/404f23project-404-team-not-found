import { Post, Author } from "../../interfaces/interfaces";
import { Avatar, Card, CardContent, CardHeader, Typography, CardMedia, Link ,Grid , Button,IconButton} from "@mui/material";
import { theme } from "../../index";
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
import { useState, useEffect } from 'react';
import axios from 'axios';
import SharePostModal from './SharePostModal';

import MoreMenu from './edit/MoreMenu';

const APP_URI = process.env.REACT_APP_URI;

const PostsList = ({
  posts, deletePost, onPostEdited
}: {
  posts: Post[];
  deletePost: (postId: string) => void;
  onPostEdited: () => void;
}) => {

  const [isMakeCommentModalOpen, setIsMakeCommentModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharedPost, setSharedPost] = useState<Post | null>(null);


  const useFollowers = () => {
    const [followers, setFollowers] = useState<Author[]>([]);
  
    useEffect(() => {
      const fetchFollowers = async (): Promise<void> => {
        const AUTHOR_ID = getAuthorId();
        const url = `${APP_URI}authors/${AUTHOR_ID}/followers/`;
  
        try {
          const response = await axios.get(url);
          const followersData = response.data.items as Author[];
          setFollowers(followersData);
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

  // TODO : implement like modal
  const handlelike = () => { };

  const handleShare = (post: Post) => {
    setIsShareModalOpen(true);
    setSharedPost(post);
  };

  const openMakeCommentModal = () => {
    setIsMakeCommentModalOpen(true);
  };
  

    return (
      <>
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
            <CardContent sx={{paddingLeft: 3, paddingTop: 0, paddingBottom: 0}}>
              <PostCategories categories={post.categories}/>
            </CardContent>
            <CardContent sx={{paddingTop: 0.5, paddingBottom: 0}}>
              <Grid container spacing={0} justifyContent="flex-row" paddingLeft={0.5} >
                <Grid item>
                  <Tooltip title="Like" placement="bottom-end">
                  <IconButton
                    id="like"
                    size="small"
                    onClick={handlelike}
                  >
                    <FavoriteBorderIcon fontSize="medium" />
                  </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Comment" placement="bottom-end">
                  <IconButton
                    size="small"
                    onClick={openMakeCommentModal}
                  >
                    <ChatBubbleOutlineIcon fontSize="medium" />
                  </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Share" placement="bottom-end">
                    <IconButton
                      size="small"
                      sx={{ marginRight: 1 }}
                      onClick={() => handleShare(post)}
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
            <CardContent sx={{paddingTop: 0}}>
              <Button size="small">View all comments</Button>
            </CardContent>

          </Card>
        ))): (

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
         <MakeCommentModal
        isCmodalOpen={isMakeCommentModalOpen}

        setIsCModalOpen={setIsMakeCommentModalOpen}
      />
      </>
    );
};

export default PostsList;
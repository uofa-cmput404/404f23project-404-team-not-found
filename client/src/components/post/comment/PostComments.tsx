import { Comment } from "../../../interfaces/interfaces";
import { Avatar, Card, CardContent, CardHeader, CardMedia, Grid, Typography } from "@mui/material";
import { formatDateTime } from "../../../utils/dateUtils";
import MuiMarkdown from "mui-markdown";
import CommentLikes from "../like/CommentLikes";

const PostComments = ({
  comments,
  postId
}:{
  comments: Comment[],
  postId: string,
}) => {

  return (
    <Grid container direction="row" 
      sx={{
        width: "100%"
      }}
    >
      { comments.length > 0 ? (comments.map(comment => (
        <Card 
          key={comment.id}
          variant="outlined"
          sx={{
            borderRadius: 0,
            borderLeft: 0,
            borderRight: 0,
            borderTop: 0,
            boxShadow: 0,
            BorderBottom: 1,
            width: "100%",
          }}>
          <CardHeader
            avatar={<Avatar src={comment.author.profileImage}/>}
            title={`${comment.author.displayName}`}
            subheader={`${formatDateTime(comment.published)}`}
          />
          <CardContent sx={{paddingTop:0, paddingBottom: 0}}>
            {comment.contentType === "text/plain" && (
              <Typography>{comment.comment}</Typography>
            )}
            {comment.contentType === "text/markdown" && (
              <MuiMarkdown>
                {`${comment.comment}`}
              </MuiMarkdown>
            )}

          </CardContent>
          <Grid container 
            justifyContent="flex-start"
            sx={{
              paddingLeft: 1,
              paddingBottom: 1,
              paddingTop: 1
            }}
          >
            <CommentLikes
              comment={comment}
              postId={postId}
            />
          </Grid>
        </Card>
      )))
    : (
      <Grid container justifyContent={"center"}>
        <Typography 
          color="#8C8C8C" 
          textAlign="center"
          marginY={1}
        >
          No comments yet...
        </Typography>
      </Grid>
    )}
    </Grid>
  );
};

export default PostComments;
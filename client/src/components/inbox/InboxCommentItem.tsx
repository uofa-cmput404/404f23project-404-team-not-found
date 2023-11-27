import { Avatar, Card, CardHeader, Grid, CardActionArea } from "@mui/material";
import { getUserData } from "../../utils/localStorageUtils";
import { getAuthorIdFromResponse } from "../../utils/responseUtils";
import { useNavigate } from "react-router-dom";

const InboxCommentItem = ({
  commentItem
}:{
  commentItem: any
}) => {
  const navigate = useNavigate();
  const loggedUser = getUserData();
  const url = commentItem.id;
  const splitObject = url.split("/");
  const authorId = splitObject[5];
  const postId = splitObject[7];

  const handleAuthorProfileClick = () => {
    const authorId = getAuthorIdFromResponse(commentItem.author.id);
    navigate(
      `/authors/${authorId}`,
      {
        state: {
          otherAuthorObject: commentItem.author,
          userObject: loggedUser
        }
      }
    );
  };

  const handleViewPostClick = () => {
    navigate(
      `/${authorId}/posts/${postId}/`
    )
  };

  return(
    <Grid
      container
      alignItems="center"
      sx={{
        borderBottom: "1px solid #dbd9d9"
      }}
    >
      <Grid item xs={12}>
        <Card
          style={{
            margin: "auto",
            width: "100%",
            border: 0,
          }}
          variant="outlined"
        >
          <CardActionArea
            component="span"
            disableRipple
            onClick={() => {
              handleViewPostClick();
            }} 
          >
            <CardHeader
              sx={{
                display: "flex",
                overflow: "hidden",
                "& .MuiCardHeader-content": {
                  overflow: "hidden"
                }
              }}
              avatar={
                <Avatar
                  alt={commentItem.author.displayName}
                  sx={{
                    cursor: "pointer",
                  }}
                  src={commentItem.author.profileImage}
                  onClick={event => { 
                    event.stopPropagation();
                    event.preventDefault();
                    handleAuthorProfileClick() 
                  }}
                />
              }
              title={`${commentItem.author.displayName} commented on your post`}
              titleTypographyProps={{
                fontSize: "1em",
              }}
              subheaderTypographyProps={{ noWrap: true }}
              subheader={`${commentItem.comment}`}
            />
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  );
};

export default InboxCommentItem;
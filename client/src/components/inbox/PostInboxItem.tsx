import { Button, Grid, Typography, CardActionArea } from "@mui/material";
import { Card, CardHeader, Avatar } from "@mui/material";
import { InboxItem } from "../../interfaces/interfaces";
import { getAuthorIdFromResponse } from "../../utils/responseUtils";
import { getUserData } from "../../utils/localStorageUtils";
import { useNavigate } from "react-router-dom";

const PostInboxItem = ({ inboxItem }: { inboxItem: InboxItem }) => {
  const navigate = useNavigate();
  const loggedUser = getUserData();
  const authorId = getAuthorIdFromResponse(inboxItem.author.id);
  const postId = getAuthorIdFromResponse(inboxItem.id);

  const handleAuthorProfileClick = () => {
    navigate(
      `/authors/${authorId}`,
      {
        state: {
          otherAuthorObject: inboxItem.author,
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

  return (
    <Grid container alignItems="center" sx={{ borderBottom: "1px solid #dbd9d9" }}>
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
              avatar={
                <Avatar
                  alt={inboxItem.author.displayName}
                  sx={{
                    cursor: "pointer",
                  }}
                  src={inboxItem.author.profileImage}
                  onClick={event => { 
                    event.stopPropagation();
                    event.preventDefault();
                    handleAuthorProfileClick() 
                  }}                />
              }
              title={`New post from ${inboxItem.author.displayName}`}
              titleTypographyProps={{
                fontSize: "1em",
              }}
            />
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PostInboxItem;

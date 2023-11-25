import { Avatar, Card, CardHeader, Grid } from "@mui/material";
import { getUserData } from "../../utils/localStorageUtils";
import { getAuthorIdFromResponse } from "../../utils/responseUtils";
import { useNavigate } from "react-router-dom";
import { Like } from "../../interfaces/interfaces";

const InboxLikeItem = ({
  likeItem
}:{
  likeItem: Like
}) => {
  const navigate = useNavigate();
  const loggedUser = getUserData();
  const isCommentLiked = likeItem.object.includes("comments");

  const handleAuthorProfileClick = () => {
    const authorId = getAuthorIdFromResponse(likeItem.author.id);
    navigate(
      `/authors/${authorId}`,
      {
        state: {
          otherAuthorObject: likeItem.author,
          userObject: loggedUser
        }
      }
    );
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
                alt={likeItem.author.displayName}
                sx={{
                  cursor: "pointer",
                }}
                src={likeItem.author.profileImage}
                onClick={() => { handleAuthorProfileClick() }}
              />
            }
            title={`${likeItem.author.displayName} liked your ${isCommentLiked ? "comment" : "post"}`}
            titleTypographyProps={{
              fontSize: "1em",
            }}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default InboxLikeItem;
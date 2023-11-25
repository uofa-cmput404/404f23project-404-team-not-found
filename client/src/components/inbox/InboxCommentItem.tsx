import { Avatar, Card, CardHeader, Grid } from "@mui/material";
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

  return(
    <Grid container alignItems="center">
      <Grid item xs={6}>
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
                alt={commentItem.author.displayName}
                sx={{
                  cursor: "pointer",
                }}
                src={commentItem.author.profileImage}
                onClick={() => { handleAuthorProfileClick() }}
              />
            }
            title={`${commentItem.author.displayName} commented on your post`}
            titleTypographyProps={{
              fontSize: "1em",
            }}
            subheaderTypographyProps={{ noWrap: true }}
            subheader={`${commentItem.comment}`}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default InboxCommentItem;
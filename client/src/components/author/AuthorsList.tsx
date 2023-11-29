import { Avatar, Button, Card, CardHeader, Grid, Typography } from "@mui/material";
import { Author } from "../../interfaces/interfaces";
import { getUserData } from "../../utils/localStorageUtils";
import { getAuthorIdFromResponse, isHostLocal } from "../../utils/responseUtils";
import { useNavigate } from "react-router-dom";
import { authorsListSubheader } from "../../objects/objects";

const AuthorsList = ({
  authors,
}: {
  authors: Author[];
}) => {
  const navigate = useNavigate();
  const loggedUser = getUserData();

  const getSubheader = (host: string) => {
    if (isHostLocal(host)) {
      return "Local";
    } else if (Object.keys(authorsListSubheader).includes(host)) {
      return authorsListSubheader[host];
    } else {
      return "Remote";
    }
  };

  const handleViewProfileClick = (author: Author) => {
    const authorId = getAuthorIdFromResponse(author.id);
    navigate(
      `/authors/${authorId}`,
      {
        state: {
          otherAuthorObject: author,
          userObject: loggedUser
        }
      }
    );
  };

  return (
    <Grid container>
      {authors.map((author) => (
        <Grid
          container
          key={author.id}
          alignItems="center"
          sx={{
            borderBottom: "1px solid #dbd9d9"
          }}
          >
          <Grid item xs={6}>
            <Card
              style={{
                margin: "auto",
                width: "100%",
                border:0
              }}
              variant="outlined"
            >
              <CardHeader
                avatar={<Avatar src={author.profileImage} alt={author.displayName}/>}
                title={author.displayName}
                titleTypographyProps={{
                  fontSize: "1em",
                }}
                subheader={getSubheader(author.host)}
              />
            </Card>
          </Grid>
          <Grid container item xs={6} justifyContent="flex-end">
            <Button
              variant="contained"
              size="small"
              color="primary"
              sx={{
                borderRadius: 20,
                marginRight: 2,
                paddingLeft: 2,
                paddingRight: 2,
                width: "8rem"
              }}
              onClick={() => handleViewProfileClick(author)}
            >
              <Typography textTransform={"none"} variant="subtitle1">
                View Profile
              </Typography>
            </Button>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default AuthorsList;
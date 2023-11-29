import Person from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import ExploreIcon from "@mui/icons-material/Explore";
import HomeIcon from '@mui/icons-material/Home';
import Button from "@mui/material/Button";
import DraftsIcon from '@mui/icons-material/Drafts';

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useNavigate, useParams } from "react-router-dom";
import { getAuthorId } from "../../utils/localStorageUtils";

const LeftNavBar = ({
  openMakePostModal,
  page
}:{
  openMakePostModal: () => void;
  page?: String;
}) => {
  const navigate = useNavigate();
  const { authorId } = useParams();
  const loggedUserId = getAuthorId();
  const isLoggedUser = authorId === loggedUserId;

  const handleProfileClick = () => {
    navigate(`/authors/${loggedUserId}`);
  };

  const handleHomeClick = () => {
    navigate("/home-page");
  };

  const handleDiscoverClick = () => {
    navigate("/discover")
  }

  const handleInboxClick = () => {
    navigate("/inbox")
  }

  return (
    <Grid container 
      alignItems="flex-end"
      direction="column"
      sx={{
        position: "fixed",
        paddingTop: 5,
        paddingRight: 2,
        width:"30vw", 
        height: "100vh", 
      }}
    >
      <Grid container
        direction="column"
        alignItems="flex-start"
        width={"50%"}
        marginRight={2}
      >
        <Button onClick={handleHomeClick} style={{borderRadius: 20}}>
          <HomeIcon fontSize="large" />
          <Typography variant="h6" textTransform="none" paddingLeft={2}>
            {page==="home" ? <strong>Home</strong> : <>Home</>}
          </Typography>
        </Button>
        <Button onClick={handleProfileClick}
          style={{ marginTop: 10, width: "auto", borderRadius: 20 }}
        >
          <Person fontSize="large" />
          <Typography variant="h6" textTransform="none" paddingLeft={2}>
          {page==="profile" && isLoggedUser ? <strong>Profile</strong> : <>Profile</>}
          </Typography>
        </Button>
        <Button onClick={handleInboxClick}
          style={{ marginTop: 10, width: "auto", borderRadius: 20 }}
        >
          {page==="inbox" ? <DraftsIcon fontSize="large"/> : <MailIcon fontSize="large" />}
          <Typography variant="h6" textTransform="none" paddingLeft={2}>
          {page==="inbox" ? <strong>Inbox</strong> : <>Inbox</>}
          </Typography>
        </Button>
        <Button
          style={{ marginTop: 10, width: "auto", borderRadius: 20 }}
          onClick={handleDiscoverClick}
        >
          <ExploreIcon fontSize="large"/> 
          <Typography variant="h6" textTransform="none" paddingLeft={2}>
          {page==="discover" ? <strong>Discover</strong> : <>Discover</>}
          </Typography>
        </Button>
        <Button
          variant="contained"
          size="large"
          style={{ marginTop: 20, width: "80%",borderRadius: 100, maxWidth: "250px" }}
          onClick={openMakePostModal}
        >
          <Typography 
            textTransform="none" 
            padding={0.5}
            variant="subtitle1"
          >
            <strong>Post</strong>
          </Typography>
        </Button>
      </Grid>
    </Grid>
  ); 
};

export default LeftNavBar;
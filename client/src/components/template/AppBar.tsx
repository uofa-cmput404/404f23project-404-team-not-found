import { useContext } from "react";

import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

import {
  removeToken,
  removeAuthorId,
  removeUserData,
  removeUserCredentials,
} from "../../utils/localStorageUtils";
import UserContext from "../../contexts/UserContext";
import { Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

const HeadBar = () => {
  const { userToken, setUserToken } = useContext(UserContext);

  const handleSignOut = () => {
    removeToken();
    removeAuthorId();
    removeUserData();
    setUserToken(null);

    // those variables are to use for HTTP basic auth
    removeUserCredentials();

    toast.success(
      "You have successfuly logged out! Please log in again to use our service!"
    );
  };

  return (
    <AppBar
      position="fixed"
      style={{
        height: 60,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        background: "transparent",
        backdropFilter: "blur(15px)",
        boxShadow: "none",
        borderBottom: "1px solid #dbd9d9",
      }}
    >
      <Link to="/home-page" 
        style={{ 
          textDecoration: "none" ,
          marginLeft: "calc(15vw - 16px)",
        }}
      >
        <Typography
          variant="h4"
          align="left"
          color="primary"
          style={{
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          distributed
        </Typography>
      </Link>

      <Button
        size="small"
        sx={{
          color: "#787878",
          height: "70%",
          alignSelf: "center",
          marginRight: 1,
          borderRadius: 20,
          paddingX: 2
        }}
        onClick={handleSignOut}
        endIcon={<LogoutIcon />}
      >
        <Typography textTransform="none">Sign Out</Typography>
      </Button>
    </AppBar>
  );
};

export default HeadBar;

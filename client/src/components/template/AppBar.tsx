import { useContext } from "react";

import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import HomePage from "../feed/HomePage";

import { removeToken, removeAuthorId } from "../../utils/localStorageUtils";
import UserContext from "../../contexts/UserContext";
import { Link } from "react-router-dom";


const HeadBar = () => {
  const { userToken, setUserToken } = useContext(UserContext);

  const handleSignOut = () => {
    removeToken();
    removeAuthorId();
    setUserToken(null);
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
      <Link to="/home-page" style={{ textDecoration: "none"}}>
        <Typography
          variant="h4"
          align="left"
          color="primary"
          style={{
            marginLeft: 20,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          distributed
        </Typography>
      </Link>

      <Button
        variant="contained"
        color="success"
        size="small"
        style={{
          color: "white",
          height: "70%",
          alignSelf: "center",
          marginRight: "5px",
        }}
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </AppBar>
  );
};

export default HeadBar;

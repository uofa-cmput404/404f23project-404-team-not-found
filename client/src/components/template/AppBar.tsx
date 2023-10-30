import { useContext } from "react";

import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

import { removeToken } from "../../utils/localStorageUtils";
import UserContext from "../../contexts/UserContext";

const HeadBar = () => {
  const { userToken, setUserToken } = useContext(UserContext);

  const handleSignOut = () => {
    removeToken();
    setUserToken(null);
    toast.success(
      "You have successfuly logged out! Please log in again to use our service!"
    );
  };

  return (
    <AppBar
      position="fixed"
      style={{
        color: "#FFFFFF",
        height: 60,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Typography
        variant="h4"
        align="left"
        style={{
          marginLeft: 20,
          color: "white",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        socialdistribution
      </Typography>
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

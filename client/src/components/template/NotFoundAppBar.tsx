import { Box } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import { Link } from "react-router-dom";

const NotFoundHeadBar = () => {
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
      <Link
        to="/home-page"
        style={{
          textDecoration: "none",
          marginLeft: "calc(15vw - 16px)",
        }}
      >
        <Box
          component="img"
          sx={{
            height: 55,
            width: "auto",
            maxHeight: 55,
            maxWidth: "auto",
          }}
          alt="App Logo"
          src="https://i.postimg.cc/Kvg7sSNK/logo-distributed.jpg"
        />
      </Link>
    </AppBar>
  );
};

export default NotFoundHeadBar;

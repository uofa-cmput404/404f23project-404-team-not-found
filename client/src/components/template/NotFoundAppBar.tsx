import AppBar from "@mui/material/AppBar";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";

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
    </AppBar>
  );
};

export default NotFoundHeadBar;

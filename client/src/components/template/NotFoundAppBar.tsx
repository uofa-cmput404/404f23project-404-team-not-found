import AppBar from "@mui/material/AppBar";
import Image from "mui-image";
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
        <Image
          src="https://i.postimg.cc/wjZxRjXw/Frame-1.png"
          width={160}
          style={{
            marginBottom: 10,
          }}
        />
      </Link>
    </AppBar>
  );
};

export default NotFoundHeadBar;

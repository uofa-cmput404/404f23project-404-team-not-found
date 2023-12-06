import { AppBar, Box, CssBaseline, Typography, Link } from "@mui/material";
import NotFoundHeadBar from "./template/NotFoundAppBar";

const NotFound = () => {
  return (
    <>
      <CssBaseline />
      <NotFoundHeadBar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h1" style={{ color: "black" }}>
          404
        </Typography>
        <Typography variant="h4" style={{ color: "black" }}>
          The page you’re looking for doesn’t exist.
        </Typography>
        <Typography variant="h4" style={{ color: "black" }}>
          Click <Link href="/sign-up">here</Link> to go back to home page!
        </Typography>
      </Box>
    </>
  );
};

export default NotFound;

import { CssBaseline } from "@mui/material";
import HeadBar from "../template/AppBar";
import { Grid } from "@mui/material";
import LeftNavBar from "../template/LeftNavBar";
import { useState } from "react";
import DiscoverContent from "./DiscoverContent";
import MakePostModal from "../post/MakePostModal";

const DiscoverPage = () => {
  const [isMakePostModalOpen, setIsMakePostModalOpen] = useState(false);

  const openMakePostModal = () => {
    setIsMakePostModalOpen(true);
  };

  return(
    <>
      <CssBaseline/>
      <HeadBar/>
      <Grid
        container
        style={{ 
          width: "100%",
          height: "100vh", 
          margin: "0 auto", 
          marginTop: 60, 
          overscrollBehavior: "none"
        }}
      >
        <Grid item xs={3.6} style={{ height: "80vh" }}>
          <LeftNavBar
            openMakePostModal={openMakePostModal}
            page={"discover"}
          />
        </Grid>
        <Grid item xs={4.8} justifyContent='center'
          sx={{
            minHeight: "calc(100vh - 60px)",
            maxHeight: "auto",
            borderLeft: "1px solid #dbd9d9",
            borderRight: "1px solid #dbd9d9",
          }}
        >
          <DiscoverContent/>
        </Grid>
      </Grid>
      {isMakePostModalOpen && (
        <MakePostModal
          isModalOpen={isMakePostModalOpen}
          setIsModalOpen={setIsMakePostModalOpen}
        />
      )}
    </>
  );
};

export default DiscoverPage;
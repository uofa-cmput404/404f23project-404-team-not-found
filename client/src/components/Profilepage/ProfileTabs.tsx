import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Grid, styled, Tab, Tabs, Typography } from "@mui/material";
import { Author, Post } from "../../interfaces/interfaces";
import AuthorsList from "../author/AuthorsList";
import PostsList from "../post/PostsList";

const APP_URI = process.env.REACT_APP_URI;

const CustomTab = styled(Tab) ({
  width: "50%",
  textTransform: "none",
  fontWeight: "bold",
  fontSize: 17,
});

const ProfileTabs = ({
  authorId,
  deletePost,
  fetchPosts,
  posts,
}: {
  authorId: string;
  deletePost: (posId: string) => void;
  fetchPosts: () => void;
  posts: Post[];
}) => {
  const [followers, setFollowers] = useState<Author[]>([]);
  const [tabValue, setTabValue] = React.useState<string>("posts");

  useEffect(() => {
    const fetchFollowers = async () => {
      const url = `${APP_URI}authors/${authorId}/followers/`;

      await axios
        .get(url)
        .then((response: any) => {
          setFollowers(response.data["items"])
        })
        .catch((error) => {
          console.log("Unable to fetch followers: ", error)
        });
    };

    if (tabValue === "posts") {
      fetchPosts();
    } else {
      fetchFollowers();
    }
  }, [authorId, tabValue]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <Grid container>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="Profile Tabs"
        variant="fullWidth"
        sx={{
          width: "100%",
          borderBottom: "1px solid #dbd9d9",
          '& .MuiTabs-flexContainer': {
            justifyContent: 'space-between',
          }
        }}
      >
        <CustomTab value={"posts"} label="Posts" />
        <CustomTab value={"followers"} label="Followers" />
      </Tabs>
      <Grid item sx={{ width: "100%" }}>
        {tabValue === "posts" &&
        <PostsList posts={posts} deletePost={deletePost} onPostEdited={fetchPosts} />
        }
        {tabValue === "followers" &&
          (
            followers.length > 0 ?
              (
                <AuthorsList authors={followers}/>
              )
              : (
                <Typography
                  variant="h6"
                  align="center"
                  sx={{
                    marginTop: 5,
                    marginLeft: "auto",
                    marginRight: "auto",
                    color: "#858585",
                  }}
                >
                No followers...
              </Typography>
              )
          )
        }
      </Grid>
    </Grid>
  );
};

export default ProfileTabs;

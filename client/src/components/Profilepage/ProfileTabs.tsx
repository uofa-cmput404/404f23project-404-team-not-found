import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, styled, Tab, Tabs, Typography } from "@mui/material";
import { Author, Post } from "../../interfaces/interfaces";
import AuthorsList from "../author/AuthorsList";
import PostsList from "../post/PostsList";
import { getUserCredentials } from "../../utils/localStorageUtils";
import { Username } from "../../enums/enums";
import { codes } from "../../objects/objects";

const CustomTab = styled(Tab)({
  width: "50%",
  textTransform: "none",
  fontWeight: "bold",
  fontSize: 17,
});

const ProfileTabs = ({
  author,
  deletePost,
  isLocal,
  fetchPosts,
  posts,
}: {
  author: Author;
  deletePost: (posId: string) => void;
  isLocal: boolean;
  fetchPosts: () => void;
  posts: Post[];
}) => {
  const [followers, setFollowers] = useState<Author[]>([]);
  const [tabValue, setTabValue] = React.useState<string>("posts");

  useEffect(() => {
    const fetchFollowers = async () => {
      const url = `${author.id}/followers/`;
      const userCredentials = getUserCredentials();

      try {
        let followers: any;

        if (isLocal) {
          if (userCredentials.username && userCredentials.password) {
            const response = await axios.get(url, {
              auth: {
                username: userCredentials.username,
                password: userCredentials.password,
              },
            });

            followers = response.data["items"];
          }
        } else {
          const response = await axios.get(url, {
            auth: {
              username: Username.NOTFOUND,
              password: codes[author.host],
            },
          });

          followers = response.data["items"];
        }

        const filteredFollowers = followers.filter(
          (follower: Author) => follower !== null
        );
        setFollowers(filteredFollowers);
      } catch(error) {
        console.error("Unable to fetch followers: ", error);
      }
    };

    if (tabValue === "posts") {
      fetchPosts();
    } else {
      fetchFollowers();
    }
  }, [author, tabValue]);

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
          "& .MuiTabs-flexContainer": {
            justifyContent: "space-between",
          },
        }}
      >
        <CustomTab value={"posts"} label="Posts" />
        <CustomTab value={"followers"} label="Followers" />
      </Tabs>
      <Grid item sx={{ width: "100%" }}>
        {tabValue === "posts" && (
          <PostsList
            posts={posts}
            deletePost={deletePost}
            onPostEdited={fetchPosts}
          />
        )}
        {tabValue === "followers" &&
          (followers.length > 0 ? (
            <AuthorsList authors={followers} />
          ) : (
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
          ))}
      </Grid>
    </Grid>
  );
};

export default ProfileTabs;

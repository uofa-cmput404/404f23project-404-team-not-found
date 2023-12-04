import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, styled, Tab, Tabs, Typography } from "@mui/material";
import { Author, Post } from "../../interfaces/interfaces";
import AuthorsList from "../author/AuthorsList";
import PostsList from "../post/PostsList";
import { getUserCredentials } from "../../utils/localStorageUtils";
import { ApiPaths, Hosts, Username } from "../../enums/enums";
import { codes } from "../../objects/objects";
import Loading from "../ui/Loading";
import { isApiPathNoSlash } from "../../utils/responseUtils";

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
  isPostLoading
}: {
  author: Author;
  deletePost: (posId: string) => void;
  isLocal: boolean;
  fetchPosts: () => void;
  posts: Post[];
  isPostLoading: boolean;
}) => {
  const [followers, setFollowers] = useState<Author[]>([]);
  const [tabValue, setTabValue] = React.useState<string>("posts");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        let followers: any;

        if (isLocal) {
          const userCredentials = getUserCredentials();
          const url = `${author.id}/followers/`;

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
          const url = isApiPathNoSlash(author.host, ApiPaths.FOLLOWERS) ?
            `${author.id}/followers` :
            `${author.id}/followers/`;

          const response = await axios.get(url, {
            auth: {
              username: Username.NOTFOUND,
              password: codes[author.host],
            },
          })

          if (!("items" in response.data) && author.host === Hosts.WEBWIZARDS) {
            // edge case, if author has no followers, webwizards returns {}
            followers = []
          } else {
            followers = response.data["items"];
          }
        }

        const filteredFollowers = followers.filter(
          (follower: Author) => follower !== null
        );
        setFollowers(filteredFollowers);
        setIsLoading(false);
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
          <>
          {isPostLoading ? (
            <Loading/>
          ) : (
            <PostsList
              posts={posts}
              deletePost={deletePost}
              onPostEdited={fetchPosts}
            />
          )}
          </>
        )}

        {tabValue === "followers" && (
          isLoading ? (
            <Loading/>
          ): (followers.length > 0 ? (
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
          ))
        )
}
      </Grid>
    </Grid>
  );
};

export default ProfileTabs;

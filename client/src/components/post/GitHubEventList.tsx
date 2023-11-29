import { GitHubEvent } from "../../interfaces/interfaces";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Paper,
  Box
} from "@mui/material";

import { makeStyles } from "@mui/styles";

import { formatDateTime } from "../../utils/dateUtils";

import { useState, useEffect } from "react";

import axios from "axios";

import GitHubIcon from '@mui/icons-material/GitHub';

const extractUsernameFromUrl = (url: string): string | null => {
  try {
    const urlObject = new URL(url);

    if (
      urlObject.hostname === "github.com" &&
      urlObject.pathname.split("/").length >= 2
    ) {
      return urlObject.pathname.split("/")[1];
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    "&::-webkit-scrollbar": {
      width: 0,
    },
  },
}));

const GitHubEventsList = ({ githubUrl }: { githubUrl: string }) => {
  const [githubEvents, setGitHubEvents] = useState<GitHubEvent[]>([]);
  const username = extractUsernameFromUrl(githubUrl);
  const gitehubUrl = `https://api.github.com/users/${username}/events`;
  const classes = useStyles();

  useEffect(() => {
    const fetchGitHubEvents = async (): Promise<void> => {
      try {
        const response = await axios.get(gitehubUrl);
        const eventsData = response.data as Array<any>;

        const filteredEvents = eventsData
          .map((event: any) => ({
            id: event.id,
            type: event.type,
            created_at: event.created_at,
            username: username,
            repoName: event.repo.name,
            repoUrl: event.repo.url,
            actor: {
              display_login: event.actor.display_login,
              avatar_url: event.actor.avatar_url,
            },
            payload: {
              size: event.payload?.size,
              action: event.payload?.action,
              title: event.payload?.title,
              issue: {
                title: event.payload?.issue?.title,
              },
            },
          }))
          .filter((event: any): event is GitHubEvent => {
            return (
              event.type === "PushEvent" ||
              event.type === "PullRequestEvent" ||
              event.type === "ForkEvent" ||
              event.type === "CreateEvent" ||
              event.type === "IssuesEvent"
            );
          });

        setGitHubEvents(
          filteredEvents.map((event: any) => ({
            ...event,
          }))
        );
      } catch (error) {
        console.error("Error fetching GitHub events:", error);
        setGitHubEvents([]);
      }
    };

    fetchGitHubEvents();
  }, [githubUrl, username, gitehubUrl]);

  const renderEventContent = (event: GitHubEvent) => {
    switch (event.type) {
      case "PushEvent":
        console.log(event.payload.size);
        return (
          <>
            <Typography>
              {event.actor.display_login} <strong> pushed </strong>{" "}
              {event.payload.size} commit/s to <strong>{event.repoName}</strong>
            </Typography>
          </>
        );
      case "PullRequestEvent":
        return (
          <>
            <Typography>
              {event.actor.display_login}{" "}
              <strong>{event.payload.action}</strong> a Pull Request in{" "}
              <strong>{event.repoName}</strong>
            </Typography>
          </>
        );
      case "ForkEvent":
        return (
          <>
            <Typography>
              {event.actor.display_login} <strong> forked </strong> a repository
              from <strong>{event.repoName}</strong>
            </Typography>
          </>
        );
      case "CreateEvent":
        return (
          <>
            <Typography>
              {event.actor.display_login} <strong> created </strong> a
              repository at <strong>{event.repoName}</strong>
            </Typography>
          </>
        );
      case "IssuesEvent":
        return (
          <>
            <Typography>
              {event.actor.display_login}{" "}
              <strong>{event.payload.action}</strong> "
              <strong> {event.payload?.issue?.title} </strong>" issue in{" "}
              <strong>{event.repoName}</strong>
            </Typography>
          </>
        );
      default:
        return null;
    }
  };

  if (username !== null) {
    return (
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
        </Grid>
        <Grid
          item
          container
          direction="column"
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "25vw",
            backgroundColor: "white",
            position: "fixed",
            right: "2.5vw",
            top: 60
          }}
        >
          <Grid container 
            direction="row" 
            alignItems="center" 
            justifyContent="center"
            sx={{
              marginBottom: 1
            }}
            >
            <GitHubIcon fontSize="medium"/>
            <Typography variant="h6">
              Github
            </Typography>
          </Grid>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: "auto",
              maxHeight: "85vh",
              width: "100%"
            }}
            className={classes.root}
          >
            {githubEvents.length > 0 ? (
              githubEvents.map((event) => (
                <Card
                  key={event.id}
                  sx={{ 
                    boxShadow: "none", 
                    borderBottom: "2px solid white", 
                    backgroundColor: "#f7f8fa"
                  }}
                >
                  <CardHeader
                    avatar={<Avatar src={event.actor.avatar_url} />}
                    title={<strong>{event.actor.display_login}</strong>}
                    subheader={formatDateTime(event.created_at)}
                    sx={{ margin: 0 }}
                  />
                  <CardContent sx={{paddingTop: 0}}>{renderEventContent(event)}</CardContent>
                </Card>
              ))
            ) : (
              <Typography
                variant="subtitle1"
                align="center"
                sx={{ fontWeight: "bold" }}
              >
                GitHub activity unavailable, please check username
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    );
  } else {
    return <Typography variant="h6" align="center"></Typography>;
  }
};

export default GitHubEventsList;

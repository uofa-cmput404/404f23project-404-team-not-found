import { GitHubEvent } from "../../interfaces/interfaces";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Paper,
} from "@mui/material";

import { formatDateTime } from "../../utils/dateUtils";

import { useState, useEffect } from "react";

import axios from "axios";

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

const GitHubEventsList = ({ githubUrl }: { githubUrl: string }) => {
  const [githubEvents, setGitHubEvents] = useState<GitHubEvent[]>([]);
  const username = extractUsernameFromUrl(githubUrl);
  const gitehubUrl = `https://api.github.com/users/${username}/events`;

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
          <img
            src="https://static.vecteezy.com/system/resources/previews/016/833/880/non_2x/github-logo-git-hub-icon-with-text-on-white-background-free-vector.jpg"
            style={{ width: "30%", maxWidth: "400px", borderRadius: "8px" }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper
            sx={{
              borderRadius: 4,
              overflow: "auto",
              maxHeight: 400,
              width: "80%",
              backgroundColor: (theme) => theme.palette.background.paper,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            {githubEvents.length > 0 ? (
              githubEvents.map((event) => (
                <Card
                  key={event.id}
                  sx={{ boxShadow: "none", borderBottom: "1px solid #e0e0e0" }}
                >
                  <CardHeader
                    avatar={<Avatar src={event.actor.avatar_url} />}
                    title={event.actor.display_login}
                    subheader={formatDateTime(event.created_at)}
                    sx={{ margin: 0 }}
                  />
                  <CardContent>{renderEventContent(event)}</CardContent>
                </Card>
              ))
            ) : (
              <Typography
                variant="h6"
                align="center"
                sx={{ fontWeight: "bold" }}
              >
                GitHub activity unavailable please check username
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

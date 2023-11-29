import { GitHubEvent } from "../../interfaces/interfaces";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
  CardMedia,
  Link,
  Grid,
  Button,
  IconButton,
  CardActionArea,
  ButtonBase,
} from "@mui/material";
import { formatDateTime } from "../../utils/dateUtils";

import { useState, useEffect } from "react";

import axios from "axios";

const APP_URI = process.env.REACT_APP_URI;

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
        {githubEvents.length > 0 ? (
          githubEvents.map((event) => (
            <Grid item key={event.id} xs={12}>
              <Card sx={{ boxShadow: "none" }}>
                <CardHeader
                  avatar={
                    <Avatar
                      src={event.actor.avatar_url}
                      alt={
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrprp_DOK2iC4a7I9bFJ01YUn_Cri-SdLTaQ&usqp=CAU"
                      }
                    />
                  }
                  title={event.actor.display_login}
                  subheader={formatDateTime(event.created_at)}
                  sx={{ margin: 0 }}
                />
                <CardContent>{renderEventContent(event)}</CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" align="center">
            No GitHub events available...
          </Typography>
        )}
      </Grid>
    );
  } else {
    return (
      <Typography variant="h6" align="center">
        Invalid GitHub URL...
      </Typography>
    );
  }
};

export default GitHubEventsList;

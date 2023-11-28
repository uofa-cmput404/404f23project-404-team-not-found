import React from 'react';
import { Post, Author,GitHubEvent } from "../../interfaces/interfaces";
import { Avatar, Card, CardContent, CardHeader, Typography, CardMedia, Link, 
    Grid, Button, IconButton, CardActionArea, ButtonBase } from "@mui/material";
import { formatDateTime } from "../../utils/dateUtils";
import { getAuthorId } from "../../utils/localStorageUtils";
import { renderVisibility }from '../../utils/postUtils';
import { MuiMarkdown } from 'mui-markdown';
import PostCategories from "./PostCategories";
import { getAuthorIdFromResponse } from "../../utils/responseUtils";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MakeCommentModal from "./MakeCommentModal";
import ShareIcon from '@mui/icons-material/Share';
import Tooltip from '@mui/material/Tooltip';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import SharePostModal from './SharePostModal';
import { getUserCredentials } from '../../utils/localStorageUtils';


import MoreMenu from './edit/MoreMenu';
import styled from '@emotion/styled';
import PostLikes from "./like/PostLikes";

const APP_URI = process.env.REACT_APP_URI;

const extractUsernameFromUrl = (url: string): string => {
  // Split the URL by '/' and get the last segment
  const segments = url.split('/');
  return segments[segments.length - 1];
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
              action : event.payload?.action,
            }
          }))
          .filter((event: any): event is GitHubEvent => {
            
            return (
              event.type === 'PushEvent' ||
              event.type === 'PullRequestEvent' ||
              event.type === 'ForkEvent' ||
              event.type === 'CreateEvent' ||
              event.type === 'IssueEvent'
            );
          });

        setGitHubEvents(filteredEvents.map((event: any) => ({
          ...event,
           
        })));
      } catch (error) {
        console.error('Error fetching GitHub events:', error);
        setGitHubEvents([]);
      }
    };

    fetchGitHubEvents();
  }, [githubUrl, username,gitehubUrl]);

  const renderEventContent = (event: GitHubEvent) => {
    switch (event.type) {
      case 'PushEvent':
        console.log(event.payload.size);
        return (
          <>
            <Typography>

              {event.actor.display_login} <strong> pushed </strong> {event.payload.size} commits to <strong>{event.repoName}</strong>
            </Typography>
          </>
        );
      case 'PullRequestEvent':
        return (
          <>
            <Typography>
            {event.actor.display_login}<strong>{event.payload.size}</strong> a Pull Request.
            </Typography>
          </>
        );
      case 'ForkEvent':
        return (
          <>
            <Typography>
              <strong>Fork Event Specific Content:</strong> .
            </Typography>
          </>
        );
      case 'CreateEvent':
        return (
          <>
            <Typography>
              <strong>Create Event Specific Content:</strong> .
            </Typography>
          </>
        );
      case 'IssueEvent':
        return (
          <>
            <Typography>
              <strong>Issue Event Specific Content:</strong> Y.
            </Typography>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Grid container spacing={2}>
      {githubEvents.length > 0 ? (
        githubEvents.map((event) => (
          <Grid item key={event.id} xs={12}>
            <Card>
            <CardHeader
              avatar={<Avatar src={event.actor.avatar_url} alt={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrprp_DOK2iC4a7I9bFJ01YUn_Cri-SdLTaQ&usqp=CAU'} />}
              title={event.actor.display_login}
              subheader={formatDateTime(event.created_at)}
              sx = {{margin:0}}
            />
              <CardContent>
                <Typography variant="h6">{event.type}</Typography>
                
                
                
                {renderEventContent(event)}
              </CardContent>
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
};

export default GitHubEventsList;













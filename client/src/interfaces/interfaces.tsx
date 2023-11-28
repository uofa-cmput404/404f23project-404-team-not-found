import { ContentType } from "../enums/enums";

export interface Author {
  id: string;
  createdAt: string;
  displayName: string;
  github?: string | null;
  host: string;
  profileImage: string;
  url: string;
}

export interface InboxItem {
  type: string;
  id: string;
  author: {
    type: string;
    id: string;
    displayName: string;
    github: string | null;
    host: string;
    profileImage: string;
    url: string;
  };
  categories: string[];
  content: string;
  contentType: string;
  description: string;
  title: string;
  source: string;
  origin: string;
  published: string;
  updatedAt: string | null;
  visibility: string;
  unlisted: boolean;
  count: number;
  comments: string;
}

export interface Follower {
  type: string;
  id: string;
  displayName: string;
  github: string | null;
  host: string;
  profileImage: string;
  url: string;
}

export interface Like {
  context: string;
  summary: string;
  author: Author;
  object: string;
}

export interface Post {
  id: string;
  author: Author;
  categories: string[];
  content: string;
  contentType: ContentType;
  description: string;
  title: string;
  source: string;
  origin: string;
  published: string;
  updatedAt?: string | null;
  visibility: string;
  unlisted: boolean;
  count: number;
  comments: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repoUrl: string;
  repoName: string;
  actor: {
    display_login: string;
    avatar_url: string;
  };
  payload: {
    size?: number;
    action?: string;
    
  };
}


export interface Comment {
  id: string;
  author: Author;
  comment: string;
  contentType: ContentType;
  published: string;
}
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
}

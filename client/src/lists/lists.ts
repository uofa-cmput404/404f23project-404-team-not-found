import { ApiPaths, Hosts } from "../enums/enums";

export const localAuthorHosts: string[] = [
  Hosts.NOTFOUND,
];

export const remoteAuthorHosts: string[] = [
  Hosts.CODEMONKEYS,
  Hosts.NETNINJAS,
  Hosts.TRIET,
  Hosts.WEBWIZARDS,
];

export const webWizardsNoSlashApiPath: string[] = [
  ApiPaths.FOLLOWER,
  ApiPaths.FOLLOWERS,
  ApiPaths.IMAGE,
  ApiPaths.INBOX,
  ApiPaths.POSTLIKES,
  ApiPaths.POST,
]

export const trietNoSlashApiPath: string[] = [
  ApiPaths.COMMENT,
  ApiPaths.COMMENTS,
  ApiPaths.FOLLOWER,
  ApiPaths.FOLLOWERS,
  ApiPaths.IMAGE,
  ApiPaths.POST,
  ApiPaths.COMMENTLIKES,
  ApiPaths.POSTLIKES,
]

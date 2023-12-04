import { ApiPaths, Hosts } from "../enums/enums";

export const localAuthorHosts: string[] = [
  Hosts.NOTFOUND,
];

export const remoteAuthorHosts: string[] = [
  Hosts.CODEMONKEYS,
  Hosts.TRIET,
  Hosts.WEBWIZARDS,
];

export const webWizardsNoSlashApiPath: string[] = [
  ApiPaths.FOLLOWER,
  ApiPaths.FOLLOWERS,
  ApiPaths.INBOX,
  ApiPaths.POSTLIKES,
  ApiPaths.POST,
]

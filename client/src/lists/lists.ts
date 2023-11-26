import { Hosts } from "../enums/enums";

export const localAuthorHosts = [
  process.env.REACT_APP_URI,
  Hosts.NOTFOUND,
];

export const remoteAuthorHosts = [
  Hosts.CODEMONKEYS,
];

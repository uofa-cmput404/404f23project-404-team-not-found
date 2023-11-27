import { Hosts } from "../enums/enums";

export const localAuthorHosts = [
  process.env.REACT_APP_URI,
  Hosts.NOTFOUND,
  "http://localhost:8000/",
];

export const remoteAuthorHosts = [
  Hosts.CODEMONKEYS,
];

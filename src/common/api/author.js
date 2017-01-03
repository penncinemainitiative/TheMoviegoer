import {http, authHeader} from "./utils"
import jwt_decode from "jwt-decode"

export const getWriter = (writer) => {
  return http
    .get(`/api/author/${writer}`)
    .then(({data}) => data);
};

export const getMyUnpublishedArticles = (token) => {
  const writer = jwt_decode(token).username;
  return http
    .get(`/api/author/${writer}/unpublished`, authHeader(token))
    .then(({data}) => data);
};
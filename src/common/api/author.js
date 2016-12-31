import {http, authHeader} from "./utils"
import jwt_decode from "jwt-decode"

export const getWriter = (writer) => {
  return http
    .get(`/api/author/${writer}`)
    .then(({data}) => data);
};

export const getMyUnpublishedArticles = (store) => {
  const writer = jwt_decode(store.getState().authToken).username;
  return http
    .get(`/api/author/${writer}/unpublished`, authHeader(store))
    .then(({data}) => data);
};
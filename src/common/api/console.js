import {http, authHeader} from "./utils"

export const getAllUnpublishedArticles = (token) => {
  return http
    .get(`/api/console/unpublished`, authHeader(token))
    .then(({data}) => data);
};
import {http, authHeader} from "./utils"

export const getAllUnpublishedArticles = (store) => {
  return http
    .get(`/api/console/unpublished`, authHeader(store))
    .then(({data}) => data);
};
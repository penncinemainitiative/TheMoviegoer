import {http, authHeader} from "./utils"

export const getDraft = (store, id) => {
  return http
    .get(`/api/article/${id}/draft`, authHeader(store))
    .then(({data}) => data);
};

export const getArticle = (year, month, day, slug) => {
  return http
    .get(`/api/article/${year}/${month}/${day}/${slug}`)
    .then(({data}) => data);
};
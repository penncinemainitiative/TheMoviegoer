import {http, authHeader} from "./utils"

export const getDraft = (token, id) => {
  return http
    .get(`/api/article/${id}/draft`, authHeader(token))
    .then(({data}) => data);
};

export const getArticle = (year, month, day, slug) => {
  return http
    .get(`/api/article/${year}/${month}/${day}/${slug}`)
    .then(({data}) => data);
};

export const changeArticleAuthor = (token, id, author) => {
  return http
    .post(`/api/article/${id}/author`, {
      author
    }, authHeader(token))
    .then(({data}) => data);
};
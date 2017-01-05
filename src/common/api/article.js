import {http, authHeader} from "./utils"

export const getDraft = (token, id) => {
  return http
    .get(`/api/article/${id}/draft`, authHeader(token))
    .then(({data}) => data);
};

export const newArticle = (token) => {
  return http
    .get(`/api/article`, authHeader(token));
};

export const deleteArticle = (token, id) => {
  return http
    .get(`/api/article/${id}/delete`, authHeader(token));
};

export const saveArticle = (token, id, title, text, excerpt) => {
  return http
    .post(`/api/article/${id}`, {
      title,
      text,
      excerpt
    }, authHeader(token));
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
    }, authHeader(token));
};
import {http, authHeader} from "./utils"
import axios from "axios"

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

export const publishArticle = (token, id) => {
  return http
    .post(`/api/article/${id}/publish`, {}, authHeader(token));
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

export const setCoverPhoto = (token, id, image) => {
  return http
    .post(`/api/article/${id}/cover`, {
      image
    }, authHeader(token));
};

export const retractArticle = (token, id) => {
  return http
    .post(`/api/article/${id}/retract`, {}, authHeader(token));
};

export const updatePhoto = (token, id, file) => {
  return http
    .post(`/api/article/${id}/photos`, {
      filename: file.name,
      filetype: file.type
    }, authHeader(token))
    .then(({data}) => {
      const signedURL = data.signedURL;
      const options = {
        headers: {
          'Content-Type': file.type
        }
      };
      return axios.put(signedURL, file, options);
    });
};
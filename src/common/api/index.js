import {http} from "./utils"

export const login = (username, password) => {
  return http
    .post('/api/login', {username, password});
};

export const signup = (name, username, password, email) => {
  return http
    .post('/api/signup', {
      name,
      username,
      password,
      email
    });
};

export const getRecentArticles = (offset) => {
  return http
    .get(`/api/recent?offset=${offset}`)
    .then(({data}) => data);
};

export const getWriters = () => {
  return http
    .get('/api/writers')
    .then(({data}) => data);
};

export const getFeaturedWriter = () => {
  return http
    .get('/api/random/author')
    .then(({data}) => data);
};

export const getArchiveFront = () => {
  return http
    .get('/api/random/articles?n=2&useCache=true')
    .then(({data}) => data);
};

export const getArchiveArticle = () => {
  return http
    .get('/api/random/articles?n=3')
    .then(({data}) => data);
};
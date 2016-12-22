import {http} from "./http"

const authHeader = (store) => {
  return {
    headers: {
      'Authorization': store.getState().authToken
    }
  }
};

export const login = (username, password) => {
  return http
    .post('/api/login', {username, password});
};

export const getRecentArticles = () => {
  return http
    .get('/api/recent')
    .then(({data}) => data);
};

export const getArticle = (year, month, day, slug) => {
  return http
    .get(`/api/${year}/${month}/${day}/${slug}`)
    .then(({data}) => data);
};

export const protectedContent = (store) => {
  return http
    .get('/api/protected', authHeader(store))
    .then(({data}) => data);
};

export const getWriters = () => {
  return http
    .get('/api/writers')
    .then(({data}) => data);
};
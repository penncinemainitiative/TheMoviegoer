import {http} from "./utils"

export const login = (username, password) => {
  return http
    .post('/api/login', {username, password});
};

export const getRecentArticles = () => {
  return http
    .get('/api/recent')
    .then(({data}) => data);
};

export const getWriters = () => {
  return http
    .get('/api/writers')
    .then(({data}) => data);
};
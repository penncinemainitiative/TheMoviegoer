import axios from 'axios'

const baseURL = 'http://localhost:8000/';

const http = axios.create({ baseURL });

export const getRecentArticles = () => {
  return http
    .get('/article/recent')
    .then(({ data }) => data);
};
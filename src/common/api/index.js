import axios from "axios"

const baseURL = 'http://localhost:8000/';

const http = axios.create({baseURL});

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
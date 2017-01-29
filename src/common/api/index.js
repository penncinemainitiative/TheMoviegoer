import {http} from "./utils"
import {receiveMoreRecentArticles} from "../actions/articles"
import {receiveMoreRecentPodcasts} from "../actions/podcasts"

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

export const getFrontPageArticles = () => {
  return http
    .get(`/api/recent?offset=0`)
    .then(({data}) => data);
};

export const getRecentArticles = () => {
  return (dispatch, getState) => {
    const offset = getState().recentArticles.offset;
    return http
      .get(`/api/recent?offset=${offset}`)
      .then(({data}) => dispatch(receiveMoreRecentArticles(data)));
  };
};

export const getRecentPodcasts = () => {
  return (dispatch, getState) => {
    const offset = getState().recentPodcasts.offset;
    return http
      .get(`/api/recent/podcasts?offset=${offset}`)
      .then(({data}) => dispatch(receiveMoreRecentPodcasts(data)));
  };
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

export const getStaff = (order) => {
  return http
    .get('/api/staff')
    .then(({data}) => {
      return data.sort((a, b) => {
        return order.indexOf(a.position) - order.indexOf(b.position);
      });
    });
};

export const searchArticles = (input) => {
  if (input === '') {
    return Promise.resolve({
      options: []
    });
  }
  return http
    .get(`/api/search?q=${input}`)
    .then(({data}) => {
      const json = data.map((obj) => {
        if ('title' in obj) {
          return {
            value: obj.url,
            label: obj.title.replace(/(<([^>]+)>)/ig, "")
          };
        } else {
          const url = `/writer/${obj.name.replace(/\s+/g, '')}`;
          return {value: url, label: `Author: ${obj.name}`};
        }
      });
      return {
        options: json
      };
    });
};

export const allAuthors = () => {
  return http
    .get(`/api/search/authors?q=`)
    .then(({data}) => {
      return data.map((obj) => {
        return {value: obj.username, label: obj.name};
      });
    });
};
import {http} from "./http"

export const getSearchResults = (query) => {
  return http
    .get('/api/search?query=' + query);
};
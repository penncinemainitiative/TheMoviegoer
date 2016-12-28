import {http} from "./utils"

export const getSearchResults = (query) => {
  return http
    .get('/api/search?query=' + query);
};
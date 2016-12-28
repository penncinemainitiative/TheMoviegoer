import {http} from "./utils"

export const getWriter = (writer) => {
  return http
    .get('/api/author/' + writer)
    .then(({data}) => data);
};
import {http, authHeader} from "./utils"

export const getAboutText = () => {
  return http
    .get(`/api/about/text`)
    .then(({data}) => data);
};

export const getStaff = (order) => {
  return http
    .get(`/api/about/positions`)
    .then(({data}) => {
      return data.sort((a, b) => {
        return order.indexOf(a.position) - order.indexOf(b.position);
      });
    });
};
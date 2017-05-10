import {http, authHeader} from "./utils"
import {receiveAboutText, receiveStaffPositions} from "../actions/about"

export const getAboutText = () => {
  return (dispatch, getState) => {
    return http
      .get(`/api/about/text`)
      .then(({data}) => {
        return dispatch(receiveAboutText(data));
      });
  };
};

export const getStaff = (order) => {
  return (dispatch, getState) => {
    return http
      .get(`/api/about/positions`)
      .then(({data}) => {
        const sorted = data.sort((a, b) => {
          return order.indexOf(a.position) - order.indexOf(b.position);
        });
        return dispatch(receiveStaffPositions(sorted));
      });
  };
};

export const saveAboutText = (about, contact, token) => {
  return http
    .post(`/api/about/text`, {
      about,
      contact
    }, authHeader(token));
};

export const saveAboutPosition = (author, position, token) => {
  return http
    .post(`/api/about/positions`, {
      author,
      position
    }, authHeader(token));
};
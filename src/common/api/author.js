import {http, authHeader} from "./utils"
import jwt_decode from "jwt-decode"
import {receiveMyUnpublishedArticles} from "../actions/console"

export const getWriter = (writer) => {
  return http
    .get(`/api/author/${writer}`)
    .then(({data}) => data);
};

export const getMyUnpublishedArticles = () => {
  return (dispatch, getState) => {
    const token = getState().token;
    const writer = jwt_decode(token).username;
    return http
      .get(`/api/author/${writer}/unpublished`, authHeader(token))
      .then(({data}) => dispatch(receiveMyUnpublishedArticles(data)));
  };
};
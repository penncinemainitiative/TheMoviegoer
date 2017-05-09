import {http, authHeader} from "./utils"
import {receiveAllUnpublishedArticles} from "../actions/console"
import browserHistory from "react-router/lib/browserHistory"

export const getAllUnpublishedArticles = () => {
  return (dispatch, getState) => {
    const token = getState().token;
    return http
      .get(`/api/console/unpublished`, authHeader(token))
      .then(({data}) => {
        if (data.err) {
          browserHistory.push('/login');
        } else {
          return dispatch(receiveAllUnpublishedArticles(data));
        }
      });
  };
};

export const getRoles = (token) => {
  return http
    .get(`/api/console/roles`, authHeader(token))
    .then(({data}) => data);
};

export const getUsers = (token) => {
  return http
    .get(`/api/console/users`, authHeader(token))
    .then(({data}) => data);
};

export const changeRole = (token, username, role) => {
  return http
    .post(`/api/console/change_role`, {
      username,
      role
    }, authHeader(token))
    .then(({data}) => data);
};
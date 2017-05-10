import {http, authHeader} from "./utils"
import {receiveRoles, receiveUsers, receiveAllUnpublishedArticles} from "../actions/console"
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

export const getUsers = () => {
  return (dispatch, getState) => {
    const token = getState().token;
    return http
      .get(`/api/console/users`, authHeader(token))
      .then(({data}) => {
        return dispatch(receiveUsers(data));
      });
  };
};

export const getRoles = () => {
  return (dispatch, getState) => {
    const token = getState().token;
    return http
      .get(`/api/console/roles`, authHeader(token))
      .then(({data}) => {
        return dispatch(receiveRoles(data));
      });
  };
};

export const changeUserRole = (token, username, role) => {
  return http
    .post(`/api/console/users`, {
      username,
      role
    }, authHeader(token))
    .then(({data}) => data);
};

export const changePermission = (token, role, permission, enabled) => {
  return http
    .post(`/api/console/roles`, {
      role,
      permission,
      enabled
    }, authHeader(token))
    .then(({data}) => data);
};
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
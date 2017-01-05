import {http, authHeader} from "./utils"
import {receiveAllUnpublishedArticles} from "../actions/console"

export const getAllUnpublishedArticles = () => {
  return (dispatch, getState) => {
    const token = getState().token;
    return http
      .get(`/api/console/unpublished`, authHeader(token))
      .then(({data}) => dispatch(receiveAllUnpublishedArticles(data)));
  };
};
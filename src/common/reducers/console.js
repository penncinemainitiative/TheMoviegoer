import {
  RECEIVE_ALL_UNPUBLISHED_ARTICLES,
  RECEIVE_MY_UNPUBLISHED_ARTICLES
} from "../actions/console"

export const console = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_ALL_UNPUBLISHED_ARTICLES:
      return Object.assign({}, state, {
        allUnpublishedArticles: action.articles
      });
    case RECEIVE_MY_UNPUBLISHED_ARTICLES:
      return Object.assign({}, state, {
        myUnpublishedArticles: action.articles
      });
    default:
      return state;
  }
};
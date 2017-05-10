import {
  RECEIVE_ALL_UNPUBLISHED_ARTICLES,
  RECEIVE_MY_UNPUBLISHED_ARTICLES,
  RECEIVE_ROLES,
  RECEIVE_USERS
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
    case RECEIVE_ROLES:
      return Object.assign({}, state, {
        roles: action.roles
      });
    case RECEIVE_USERS:
      return Object.assign({}, state, {
        users: action.users
      });
    default:
      return state;
  }
};
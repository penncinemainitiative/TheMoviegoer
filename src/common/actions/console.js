export const RECEIVE_MY_UNPUBLISHED_ARTICLES = 'RECEIVE_MY_UNPUBLISHED_ARTICLES';
export const RECEIVE_ALL_UNPUBLISHED_ARTICLES = 'RECEIVE_ALL_UNPUBLISHED_ARTICLES';
export const RECEIVE_ROLES = 'RECEIVE_ROLES';
export const RECEIVE_USERS = 'RECEIVE_USERS';

export const receiveMyUnpublishedArticles = (articles) => ({
  type: RECEIVE_MY_UNPUBLISHED_ARTICLES,
  articles
});

export const receiveAllUnpublishedArticles = (articles) => ({
  type: RECEIVE_ALL_UNPUBLISHED_ARTICLES,
  articles
});

export const receiveRoles = (roles) => ({
  type: RECEIVE_ROLES,
  roles
});

export const receiveUsers = (users) => ({
  type: RECEIVE_USERS,
  users
});
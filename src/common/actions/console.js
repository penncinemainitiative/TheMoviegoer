export const RECEIVE_MY_UNPUBLISHED_ARTICLES = 'RECEIVE_MY_UNPUBLISHED_ARTICLES';
export const RECEIVE_ALL_UNPUBLISHED_ARTICLES = 'RECEIVE_ALL_UNPUBLISHED_ARTICLES';

export const receiveMyUnpublishedArticles = (articles) => ({
  type: RECEIVE_MY_UNPUBLISHED_ARTICLES,
  articles
});

export const receiveAllUnpublishedArticles = (articles) => ({
  type: RECEIVE_ALL_UNPUBLISHED_ARTICLES,
  articles
});
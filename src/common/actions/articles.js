export const RECEIVE_MORE_RECENT_ARTICLES = 'RECEIVE_MORE_RECENT_ARTICLES';

export const receiveMoreRecentArticles = (articles) => ({
  type: RECEIVE_MORE_RECENT_ARTICLES,
  articles
});
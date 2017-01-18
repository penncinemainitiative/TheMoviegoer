import {RECEIVE_MORE_RECENT_ARTICLES} from "../actions/articles"

const initialState = {
  offset: 0,
  articles: []
};

export const recentArticles = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_MORE_RECENT_ARTICLES:
      return Object.assign({}, state, {
        offset: state.offset + 10,
        articles: state.articles.concat(action.articles)
      });
    default:
      return state;
  }
};
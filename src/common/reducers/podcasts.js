import {RECEIVE_MORE_RECENT_PODCASTS} from "../actions/podcasts"

const initialState = {
  offset: 0,
  podcasts: []
};

export const recentPodcasts = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_MORE_RECENT_PODCASTS:
      return Object.assign({}, state, {
        offset: state.offset + 10,
        podcasts: state.podcasts.concat(action.podcasts)
      });
    default:
      return state;
  }
};
export const RECEIVE_MORE_RECENT_PODCASTS = 'RECEIVE_MORE_RECENT_PODCASTS';

export const receiveMoreRecentPodcasts = (podcasts) => ({
  type: RECEIVE_MORE_RECENT_PODCASTS,
  podcasts
});
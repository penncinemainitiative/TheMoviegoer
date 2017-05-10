export const RECEIVE_STAFF_POSITIONS = 'RECEIVE_STAFF_POSITIONS';
export const RECEIVE_ABOUT_TEXT = 'RECEIVE_ABOUT_TEXT';

export const receiveStaffPositions = (positions) => ({
  type: RECEIVE_STAFF_POSITIONS,
  positions
});

export const receiveAboutText = (texts) => ({
  type: RECEIVE_ABOUT_TEXT,
  texts
});
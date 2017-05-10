import {RECEIVE_ABOUT_TEXT, RECEIVE_STAFF_POSITIONS} from "../actions/about"

const initialState = {
  contactText: "",
  aboutText: "",
  staff: []
};

export const about = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_ABOUT_TEXT:
      return Object.assign({}, state, {
        contactText: action.texts.find((obj) => obj.field === "contact"),
        aboutText: action.texts.find((obj) => obj.field === "about")
      });
    case RECEIVE_STAFF_POSITIONS:
      return Object.assign({}, state, {
        staff: action.positions
      });
    default:
      return state;
  }
};
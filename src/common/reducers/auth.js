import {LOGIN, LOGOUT} from "../actions/auth"

export const token = (state = false, action) => {
  switch (action.type) {
    case LOGIN:
      if (action.token) {
        return action.token;
      }
      return false;
    case LOGOUT:
      return false;
    default:
      return state;
  }
};
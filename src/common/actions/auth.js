export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const loginWithToken = (token) => {
  return {
    type: LOGIN,
    token
  };
};

export const logout = () => {
  return {
    type: LOGOUT
  };
};
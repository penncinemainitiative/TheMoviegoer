export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const loginWithToken = (token) => ({
  type: LOGIN,
  token
});

export const logout = () => ({
  type: LOGOUT
});
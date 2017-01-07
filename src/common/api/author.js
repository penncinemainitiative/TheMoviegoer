import {http, authHeader} from "./utils"
import axios from "axios"
import jwt_decode from "jwt-decode"
import {receiveMyUnpublishedArticles} from "../actions/console"

export const getWriter = (writer) => {
  return http
    .get(`/api/author/${writer}`)
    .then(({data}) => data);
};

export const getWriterByName = (writerName) => {
  const writer = writerName.replace(" ", "");
  return http
    .get(`/api/author/${writer}`)
    .then(({data}) => data);
};

export const getMyUnpublishedArticles = () => {
  return (dispatch, getState) => {
    const token = getState().token;
    const writer = jwt_decode(token).username;
    return http
      .get(`/api/author/${writer}/unpublished`, authHeader(token))
      .then(({data}) => dispatch(receiveMyUnpublishedArticles(data)));
  };
};

export const updateBio = (token, writer, name, email, bio) => {
  return http
    .post(`/api/author/${writer}/description`, {
      name,
      email,
      bio
    }, authHeader(token))
    .then(({data}) => data);
};

export const updatePassword = (token, writer, oldPassword, newPassword) => {
  return http
    .post(`/api/author/${writer}/password`, {
      oldPassword,
      newPassword
    }, authHeader(token))
    .then(({data}) => data);
};

export const updatePhoto = (token, writer, file) => {
  return http
    .post(`/api/author/${writer}/photo/url`, {
      filename: file.name,
      filetype: file.type
    }, authHeader(token))
    .then(({data}) => {
      const signedURL = data.signedURL;
      const options = {
        headers: {
          'Content-Type': file.type
        }
      };
      return axios.put(signedURL, file, options);
    });
};
import {http, authHeader} from "./utils"
import axios from "axios"
import jwt_decode from "jwt-decode"
import {receiveMyUnpublishedArticles} from "../actions/console"
import browserHistory from "react-router/lib/browserHistory"

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
      .then(({data}) => {
        if (data.err) {
          browserHistory.push('/login');
        } else {
          return dispatch(receiveMyUnpublishedArticles(data));
        }
      });
  };
};

export const updateBio = (token, writer, name, email, bio, hometown, allow_featured_writer, accent_color) => {
  return http
    .post(`/api/author/${writer}/description`, {
      name,
      email,
      bio,
      hometown,
      accent_color,
      allow_featured_writer
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
          'Content-Type': file.type,
          'Cache-Control': 'public ,max-age= 31536000'
        }
      };
      return axios.put(signedURL, file, options);
    });
};
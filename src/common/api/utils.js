import axios from "axios"

axios.defaults.baseURL = process.env.HOST_NAME ?
  process.env.HOST_NAME :
  'http://localhost:8000/';

export const http = axios.create();

export const authHeader = (token) => {
  return {
    headers: {
      'Authorization': token
    }
  }
};
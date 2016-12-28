import axios from "axios"

const baseURL = 'http://localhost:8000/';

export const http = axios.create({baseURL});

export const authHeader = (store) => {
  return {
    headers: {
      'Authorization': store.getState().authToken
    }
  }
};
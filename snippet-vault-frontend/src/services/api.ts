import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000", // Backend URL
  headers: {
    'Content-Type': 'application/json'
  }
});

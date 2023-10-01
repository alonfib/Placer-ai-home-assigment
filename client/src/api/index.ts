import axios from "axios";

const port = 5005;
const baseUrl = `http://localhost:${port}/`;

export const get = async (url: string, params: any = {}) => {
  try {
    const res = await axios.get(`${baseUrl}${url}`, params);
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export const post = async (url: string, params: any = {}) => {
  try{
  const res = await axios.post(`${baseUrl}${url}`, params);
  return res.data;
  } catch (err) {
    console.log(err);
  }
}

export const put = async (url: string, params: any = {}) => {
  try{
  const res = await axios.put(`${baseUrl}${url}`, params);
  return res.data;
  } catch (err) {
    console.log(err);
  }
}

export const del = async (url: string, params: any = {}) => {
  try{
  const res = await axios.delete(`${baseUrl}${url}`, params);
  return res.data;
  } catch (err) {
    console.log(err);
  }
}

// Path: client/src/api/user.ts

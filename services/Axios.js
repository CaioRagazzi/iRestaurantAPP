import axios from "axios";
import Constants from "expo-constants";
const { manifest } = Constants;

const url = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
    ? manifest.debuggerHost.split(`:`).shift().concat(`:5001`)
    : `api.example.com`;

console.log(url);

const api = axios.create({
    baseURL: `https://192.168.1.82:5001/`,
    headers: { 'X-Custom-Header': 'foobar' }
});

export default api;
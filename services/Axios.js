import axios from "axios";
import Constants from "expo-constants";
const { manifest } = Constants;

const url = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
    ? manifest.debuggerHost.split(`:`).shift().concat(`:5001`)
    : `api.example.com`;

console.log(url);

const api = axios.create({
    baseURL: `http://10.0.2.2:5000/`,
    headers: { 'X-Custom-Header': 'foobar' }
});

export default api;
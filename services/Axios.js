import axios from "axios";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { manifest } = Constants;

const url = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
    ? manifest.debuggerHost.split(`:`).shift().concat(`:5001`)
    : `api.example.com`;

let jwt = ''
AsyncStorage.getItem('jwt').then(d => jwt = d);

const api = axios.create({
    baseURL: `http://10.0.2.2:5000/api/`
});

api.interceptors.request.use(function (config) {
    config.headers.Authorization =  `Bearer ${jwt}`;

    return config;
});

export default api;
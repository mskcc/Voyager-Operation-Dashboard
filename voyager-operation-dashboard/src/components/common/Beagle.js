import axios from "axios";
import {
  BEAGLE_URL,
  BEAGLE_ACCESS_SESSION,
  BEAGLE_REFRESH_SESSION,
  BEAGLE_USERNAME_SESSION,
} from "./config";

export const beagle_authenticated_axios = axios.create({
  baseURL: BEAGLE_URL,
});

export const beagle_public_axios = axios.create({
  baseURL: BEAGLE_URL,
});

beagle_authenticated_axios.interceptors.request.use(
  async (config) => {
    const access_token = localStorage.getItem("Beagle_access");
    config.headers = {
      ...config.headers,
      Authorization: "Bearer " + access_token,
    };
    return config;
  },
  (error) => Promise.reject(error)
);

beagle_authenticated_axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    console.log(error.response);

    if (error.response.status === 401 && !config._retry) {
      config._retry = true;

      await refresh_token();
      const token = localStorage.getItem(BEAGLE_ACCESS_SESSION);
      console.log(token);

      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: "Bearer " + token,
        };
      }

      return beagle_authenticated_axios(config);
    }
    return Promise.reject(error);
  }
);

async function refresh_token() {
  const refresh = localStorage.getItem(BEAGLE_REFRESH_SESSION);
  const promise = beagle_public_axios.post("/api-token-refresh/", {
    refresh: refresh,
  });
  promise
    .then((response) => {
      localStorage.removeItem(BEAGLE_ACCESS_SESSION);
      localStorage.removeItem(BEAGLE_REFRESH_SESSION);
      localStorage.setItem(BEAGLE_ACCESS_SESSION, response.data.access);
      localStorage.setItem(BEAGLE_REFRESH_SESSION, response.data.refresh);
    })
    .catch((error) => {
      const data = error.response.data;
      const status = error.response.status;
      console.log("Unexpected error to refresh token: ");
      console.log("status: " + status);
      console.log("data: " + data);
      localStorage.removeItem(BEAGLE_ACCESS_SESSION);
      localStorage.removeItem(BEAGLE_REFRESH_SESSION);
      localStorage.removeItem(BEAGLE_USERNAME_SESSION);
      window.location.reload();
    });
  return promise;
}

export function beagle_get(query) {
  const promise = beagle_authenticated_axios.get(query);
  return promise;
}

export function beagle_post(query, payload) {
  const promise = beagle_authenticated_axios.post(query, payload);
  return promise;
}

export function beagle_patch(query, payload) {
  const promise = beagle_authenticated_axios.patch(query, payload);
  return promise;
}

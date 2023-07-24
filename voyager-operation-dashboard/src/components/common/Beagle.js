import axios from "axios";

const BEAGLE_URL = process.env.REACT_APP_BEAGLE_URL;

function get_header() {
  const headers = {
    Authorization: "Bearer " + localStorage.getItem("Beagle_access"),
  };
  return headers;
}

export function beagle_get(query) {
  const headers = get_header();
  const URL = BEAGLE_URL + query;
  const promise = axios.get(URL, { headers: headers });
  return promise;
}

export function beagle_post(query, payload) {
  const headers = get_header();
  const URL = BEAGLE_URL + query;
  const promise = axios.post(URL, payload, { headers: headers });
  return promise;
}

export function beagle_patch(query, payload) {
  const headers = get_header();
  const URL = BEAGLE_URL + query;
  const promise = axios.patch(URL, payload, { headers: headers });
  return promise;
}

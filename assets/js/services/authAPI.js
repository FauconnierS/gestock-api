import Axios from "axios";
import jwtDecode from "jwt-decode";

function setup() {
  const token = window.localStorage.getItem("authToken");

  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
      console.log("connexion établie avec axios ");
      return true;
    }
  }
  return false;
}

function logout() {
  window.localStorage.removeItem("authToken");
  delete Axios.defaults.headers["Authorization"];
}

function authenticate(credentials) {
  return Axios.post("http://localhost:8000/api/login_check", credentials)
    .then((response) => response.data.token)
    .then((token) => {
      window.localStorage.setItem("authToken", token);
      setAxiosToken(token);
    });
}

function setAxiosToken(token) {
  Axios.defaults.headers["Authorization"] = "Bearer " + token;
}

export default {
  authenticate,
  logout,
  setup,
};

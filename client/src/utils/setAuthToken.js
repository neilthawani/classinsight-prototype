import axios from "axios";

const setAuthToken = token => {
  console.log("setAuthToken", token);
  if (token) {
    // Apply authorization token to every request if logged in
    axios.defaults.headers.common["Authorization"] = token;
    console.log("set token");
  } else {
    // Delete auth header
    delete axios.defaults.headers.common["Authorization"];
    console.log("deleted");
  }
};

export default setAuthToken;

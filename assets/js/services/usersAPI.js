import Axios from "axios";

function create(user) {
  return Axios.post("http://localhost:8000/api/users", user).then(
    (response) => response.data
  );
}

export default {
  register: create,
};

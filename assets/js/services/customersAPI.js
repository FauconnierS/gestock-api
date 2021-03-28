import axios from "axios";
const urlApi = "http://localhost:8000/api/customers";

function findAll() {
  return axios.get(urlApi).then((response) => response.data["hydra:member"]);
}

function findById(id) {
  return axios.get(urlApi + "/" + id).then((response) => response.data);
}

function remove(id) {
  return axios.delete("http://localhost:8000/api/custommers/" + id);
}

function create(customer) {
  return axios.post(urlApi, customer).then(console.log());
}

function edit(customer, id) {
  return axios
    .put(urlApi + "/" + id, customer)
    .then((response) => response.data);
}
export default {
  create,
  findAll,
  edit,
  findOne: findById,
  delete: remove,
};

import axios from "axios";

const urlApi = "http://localhost:8000/api/invoices";

function findAll() {
  return axios.get(urlApi).then((response) => response.data["hydra:member"]);
}

function findById(id) {
  return axios.get(urlApi + "/" + id).then((response) => response.data);
}

function remove(id) {
  return axios.delete("http://localhost:8000/api/invoices/" + id);
}

function edit(invoice, id) {
  return axios
    .put(urlApi + "/" + id, {
      ...invoice,
      customer: `/api/customers/${invoice.customer}`,
    })
    .then((response) => response.data);
}

function create(invoice) {
  return axios
    .post(urlApi, {
      ...invoice,
      customer: `/api/customers/${invoice.customer}`,
    })
    .then(console.log);
}

export default {
  create,
  findAll,
  findOne: findById,
  update: edit,
  delete: remove,
};

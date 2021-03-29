import axios from "axios";
import Cache from "./cache";
import { CUSTOMERS_API } from "../config";

async function findAll() {
  const cachedCustomers = await Cache.get("customers");

  if (cachedCustomers) return cachedCustomers;
  return axios.get(CUSTOMERS_API).then((response) => {
    const customers = response.data["hydra:member"];
    Cache.set("customers", customers);
    return customers;
  });
}

function findById(id) {
  return axios.get(CUSTOMERS_API + "/" + id).then((response) => response.data);
}

function remove(id) {
  return axios.delete(CUSTOMERS_API + "/" + id).then(async (response) => {
    Cache.invalidate("customers");
    return response;
  });
}

function create(customer) {
  return axios
    .post(CUSTOMERS_API, customer)
    .then(console.log())
    .then(async (response) => {
      Cache.invalidate("customers");
      return response;
    });
}

function edit(customer, id) {
  return axios.put(CUSTOMERS_API + "/" + id, customer).then((response) => {
    Cache.invalidate("customers");
    return response;
  });
}
export default {
  create,
  findAll,
  edit,
  findOne: findById,
  delete: remove,
};

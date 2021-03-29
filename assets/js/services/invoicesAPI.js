import axios from "axios";
import Cache from "./cache";
import { INVOICES_API } from "../config";

async function findAll() {
  const cachedInvoices = await Cache.get("invoices");

  if (cachedInvoices) return cachedInvoices;
  return axios.get(INVOICES_API).then((response) => {
    const invoices = response.data["hydra:member"];
    Cache.set("invoices", invoices);
    return invoices;
  });
}

function findById(id) {
  return axios.get(INVOICES_API + "/" + id).then((response) => response.data);
}

function remove(id) {
  return axios.delete(INVOICES_API + "/" + id).then((response) => {
    Cache.invalidate("invoices");
    return response;
  });
}

function edit(invoice, id) {
  return axios
    .put(INVOICES_API + "/" + id, {
      ...invoice,
      customer: `/api/customers/${invoice.customer}`,
    })
    .then((response) => {
      Cache.invalidate("invoices");
      return response;
    });
}

function create(invoice) {
  return axios
    .post(INVOICES_API, {
      ...invoice,
      customer: `/api/customers/${invoice.customer}`,
    })
    .then((response) => {
      Cache.invalidate("invoices");
      return response;
    });
}

export default {
  create,
  findAll,
  findOne: findById,
  update: edit,
  delete: remove,
};

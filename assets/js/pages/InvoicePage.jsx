import React, { useState, useEffect } from "react";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import CustomersApi from "../services/customersAPI";
import { Link } from "react-router-dom";
import Axios from "axios";
import invoicesAPI from "../services/invoicesAPI";
import { toast } from "react-toastify";
import FormContentLoader from "../components/loaders/FormContentLoader";

const InvoicePage = ({ history, match }) => {
  const { id = "new" } = match.params;
  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "SENT",
  });
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: "",
  });
  const [loading, setLoading] = useState(true);

  const [customers, setCustomers] = useState([]);

  const fetchInvoice = async (id) => {
    try {
      const { amount, status, customer } = await invoicesAPI.findOne(id);
      setInvoice({ amount, status, customer: customer.id });
      setLoading(false);
    } catch (error) {
      toast.error("Erreur chargement de la facture");
      history.replace("/invoices");
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await CustomersApi.findAll();
      setCustomers(data);
      setLoading(false);

      if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
    } catch (error) {
      toast.error("Erreur chargement Client");
      history.replace("/invoices");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (id !== "new") {
      setLoading(true);
      setEditing(true);
      fetchInvoice(id);
    }
  }, [id]);

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editing) {
        await invoicesAPI.update(invoice, id);
        toast.success("La facture ?? ??t?? modifi??e");
      } else {
        await invoicesAPI.create(invoice);
        toast.success("La facture ?? bien ??t?? cr????e");
        history.replace("/invoices");
      }
      setErrors({});
    } catch ({ response }) {
      const { violations } = response.data;

      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
        toast.error("Oups ! Certaines erreurs dans le formulaire");
      }
    }
  };

  return (
    <>
      {editing ? <h1>Modification facture</h1> : <h1>Cr??ation facture</h1>}
      {loading && <FormContentLoader />}
      {!loading && (
        <form onSubmit={handleSubmit}>
          <Field
            label="Montant"
            name="amount"
            type="number"
            value={invoice.amount}
            error={errors.amount}
            placeholder="Montant de la facture"
            onChange={handleChange}
          />

          <Select
            label="Client"
            value={invoice.customer}
            error={errors.customer}
            name="customer"
            onChange={handleChange}
            error=""
          >
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {" "}
                {customer.firstName} {customer.lastName}{" "}
              </option>
            ))}
          </Select>

          <Select
            label="Status"
            value={invoice.status}
            name="status"
            onChange={handleChange}
            error={errors.status}
          >
            <option value="SENT">Envoy??e</option>
            <option value="PAID">Pay??e</option>
            <option value="CANCELLED">Annul??e</option>
          </Select>

          <div className="form-group">
            <button type="submit" className="btn btn-success">
              Enregirstrer
            </button>
            <Link to="/invoices" className="btn btn-link">
              Retour factures
            </Link>
          </div>
        </form>
      )}
    </>
  );
};

export default InvoicePage;

import React, { useState, useEffect } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import customersAPI from "../services/customersAPI";
import { toast } from "react-toastify";
import FormContentLoader from "../components/loaders/FormContentLoader";

const CustomerPage = ({ match, history }) => {
  const { id = "new" } = match.params;

  const [customer, setCustomer] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
  });
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
  });

  const fetchCustomer = async (id) => {
    try {
      const data = await customersAPI.findOne(id);
      const { firstName, lastName, email, company } = data;
      setCustomer({ firstName, lastName, email, company });
      setLoading(false);
    } catch (error) {
      toast.error("Le client n'a pas pu être chargé");
    }
  };

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (id !== "new") {
      setLoading(true);
      setEditing(true);
      fetchCustomer(id);
    } else {
      setEditing(false);
      setCustomer({ firstName: "", lastName: "", email: "", company: "" });
    }
  }, [id]);

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;

    setCustomer({ ...customer, [name]: value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editing) {
        const response = await customersAPI.edit(customer, id);
        toast.success("Le cient à bien été modifié");
      } else {
        const response = await customersAPI.create(customer);
        toast.success("le client à bien été créé");
      }
      setErrors({});
      history.replace("/customers");
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
        toast.error("Des erreurs dans votre formulaire");
      }
    }
  };

  return (
    <>
      {editing ? <h1>Modification du Client</h1> : <h1>Creation Client</h1>}
      {loading && <FormContentLoader />}

      {!loading && (
        <form onSubmit={handleSubmit}>
          <Field
            name="lastName"
            label="Nom"
            value={customer.lastName}
            onChange={handleChange}
            placeholder="Dupont, Augier..."
            error={errors.lastName}
          />
          <Field
            name="firstName"
            label="Prénom"
            placeholder="Audrey, Charles..."
            value={customer.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
          <Field
            name="email"
            label="Email"
            type="email"
            placeholder="fanta@live.fr ..."
            value={customer.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Field
            name="company"
            label="Entreprise"
            placeholder="SAS AutoSud"
            value={customer.company}
            onChange={handleChange}
            error={errors.company}
          />

          <div className="form-group">
            <button type="submit" className="btn btn-success">
              Enregistrer
            </button>
            <Link to="/customers" className="btn btn-link">
              Retour à la Liste
            </Link>
          </div>
        </form>
      )}
    </>
  );
};

export default CustomerPage;

import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import usersAPI from "../services/usersAPI";

const RegisterPage = ({ history }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const apiErrors = {};
    if (user.password != user.passwordConfirm) {
      apiErrors.passwordConfirm =
        "Votre Mot de passe doit correspondre à la Confirmation";
      setErrors(apiErrors);
      return;
    }

    try {
      await usersAPI.register(user);
      setErrors({});
      history.replace("/login");
    } catch ({ response }) {
      const { violations } = response.data;

      if (violations) {
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
      }
    }
  };

  return (
    <>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Patrick, Arnaud .."
          error={errors.firstName}
          value={user.firstName}
          onChange={handleChange}
        />

        <Field
          name="lastName"
          label="Nom"
          placeholder="Dupon, Verstapen .."
          error={errors.lastName}
          value={user.lastName}
          onChange={handleChange}
        />

        <Field
          name="email"
          label="Adresse Email"
          placeholder="tori@symfony.com"
          type="email"
          error={errors.email}
          value={user.email}
          onChange={handleChange}
        />

        <Field
          name="password"
          label="Mot de passe"
          type="password"
          error={errors.password}
          value={user.password}
          onChange={handleChange}
        />

        <Field
          name="passwordConfirm"
          label="Confirmation"
          type="password"
          error={errors.passwordConfirm}
          value={user.passwordConfirm}
          onChange={handleChange}
        />

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            S'enregistrer
          </button>
          <Link to="/login" className="btn btn-link">
            Je suis déja inscrit
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterPage;

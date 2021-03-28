import React, { useState, useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import authAPI from "../services/authAPI";
import Field from "../components/forms/Field";

const LoginPage = ({ history }) => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;

    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await authAPI.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      history.replace("/customers");
    } catch (error) {
      setError("Vos Informations de connexion sont incorrects");
    }
  };
  return (
    <>
      <h1>Connexion à L'application</h1>
      <form onSubmit={handleSubmit}>
        <Field
          label="Adresse Email"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          placeholer="Adresse email de connexion"
          type="email"
          error={error}
        />

        <Field
          name="password"
          label="Mot de passe"
          value={credentials.password}
          onChange={handleChange}
          type="password"
          error={error}
        />

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Se connecter
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;

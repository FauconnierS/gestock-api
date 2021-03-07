import React, { useState, useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import authAPI from "../services/authAPI";

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
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Email</label>
          <input
            type="text"
            value={credentials.username}
            onChange={handleChange}
            placeholer="Adresse Email ..."
            name="username"
            className={"form-control " + (error && "is-invalid")}
            id="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            value={credentials.password}
            onChange={handleChange}
            name="password"
            id="password"
            className={"form-control" + (error && " is-invalid")}
          />
        </div>
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

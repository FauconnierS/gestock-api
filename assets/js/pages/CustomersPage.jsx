import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import customersAPI from "../services/customersAPI";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const CustomersPage = (props) => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;

  // Récupération des Customers
  const fecthCustomers = async () => {
    try {
      const data = await customersAPI.findAll();
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      toast.error("Erreur chargement Clients");
    }
  };

  // Filtrage des Customers en fonction de la recherche de l'utilisateur
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      (customer.company &&
        customer.company.toLowerCase().includes(search.toLowerCase()))
  );

  // Supression d'un Customer
  const handleDelete = async (id) => {
    const originalCustomers = [...customers];
    setCustomers(customers.filter((customer) => customer.id != id));

    try {
      await customersAPI.delete(id);
      toast.success("Client : " + id + " supprimé");
    } catch (error) {
      toast.error("Erreur lors de la suppresssion du client : " + id);
      setCustomers(originalCustomers);
    }
  };

  // Récupération de chaque page avec les Customers correspondant au nombre d'élement par page
  const paginatedCustomers = Pagination.getData(
    filteredCustomers,
    currentPage,
    itemsPerPage
  );

  // Modification du numéro de la page actuelle
  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  // Ajout de chaque valeur taper dans la barre de recherche
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    fecthCustomers();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Liste des clients</h1>
        <Link to="/customers/new" className="btn btn-primary">
          Créer un client
        </Link>
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={handleSearch}
          className="form-control"
        />
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nom</th>
            <th>email</th>
            <th>Company</th>
            <th className="text-center">Factures</th>
            <th className="text-center">Montant Total</th>
            <th></th>
          </tr>
        </thead>
        {!loading && (
          <tbody>
            {paginatedCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <Link to={"/customers/" + customer.id}>
                    {customer.firstName} {customer.lastName}
                  </Link>
                </td>
                <td>{customer.email}</td>
                <td>{customer.company}</td>
                <td className="text-center">
                  <span className="badge badge-info">
                    {customer.invoices.length}
                  </span>
                </td>
                <td className="text-center">
                  {customer.totalAmount.toLocaleString()}
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm "
                    disabled={customer.invoices.length > 0}
                    onClick={() => {
                      handleDelete(customer.id);
                    }}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {loading && <TableLoader />}

      {filteredCustomers.length > itemsPerPage && (
        <Pagination
          dataLength={filteredCustomers.length}
          itemsPerPage={itemsPerPage}
          onPageChanged={handleChangePage}
          currentPage={currentPage}
        />
      )}
    </>
  );
};

export default CustomersPage;

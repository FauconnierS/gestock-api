import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";
import Pagination from "../components/Pagination";
import invoicesAPI from "../services/invoicesAPI";
import utils from "../services/utils";

const STATUS_CLASSES = {
  PAID: "success",
  SENT: "warning",
  CANCELLED: "danger",
};

const STATUS_LABEL = {
  PAID: "Payée",
  SENT: "Envoyée",
  CANCELLED: "Annulée",
};

const InvoicesPage = (props) => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 20;

  // Récupération des Invoices
  const fecthInvoices = async () => {
    try {
      const data = await invoicesAPI.findAll();
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      toast.error("Erreur chargement de facture");
    }
  };

  //Filtre les Invoices selon La recherche
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      invoice.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      STATUS_LABEL[invoice.status]
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      invoice.amount.toString().includes(search) ||
      utils.formatDate(invoice.sentAt).includes(search.toLowerCase())
  );

  // Récuperation de chaque page avec les factures correspondantes aux nombre d'element par page
  const paginatedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPage
  );

  // Ajout chaque valeurs tapée au clavier dans la variable Search et l'affiche
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
  };

  // Changement de la page actuelle
  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  //Surpression d'une facture
  const handleDelete = async (id) => {
    const orignalInvoices = [...invoices];
    setInvoices(invoices.filter((invoice) => invoice.id != id));

    try {
      await invoicesAPI.delete(id);
      toast.success("La facture " + id + " c'est envolée");
    } catch (error) {
      toast.error("Oups ! Une erreur est survenue");
      setInvoices(orignalInvoices);
    }
  };

  useEffect(() => {
    fecthInvoices();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Liste des factures</h1>
        <Link className=" btn btn-secondary" to="/invoices/new">
          Créer une facture
        </Link>
      </div>

      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher..."
          onChange={handleSearch}
          value={search}
        />
      </div>
      <table className="table table-hover text-center">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th>Date D'envoi</th>
            <th>Montant</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        {!loading && (
          <tbody>
            {paginatedInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.chrono}</td>
                <td>
                  <Link to={"/customers/" + invoice.customer.id}>
                    {invoice.customer.firstName} {invoice.customer.lastName}
                  </Link>
                </td>
                <td>{utils.formatDate(invoice.sentAt)}</td>
                <td>{invoice.amount.toLocaleString()}</td>
                <td>
                  <span
                    className={
                      "badge p-2 badge-" + STATUS_CLASSES[invoice.status]
                    }
                  >
                    {STATUS_LABEL[invoice.status]}
                  </span>
                </td>
                <td>
                  <Link
                    to={"/invoices/" + invoice.id}
                    className="btn btn-sm mx-1 btn-warning"
                  >
                    Editer
                  </Link>
                  <button
                    onClick={() => handleDelete(invoice.id)}
                    className="btn btn-sm mx-1 btn-danger"
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
      <Pagination
        currentPage={currentPage}
        dataLength={filteredInvoices.length}
        itemsPerPage={itemsPerPage}
        onPageChanged={handleChangePage}
      />
    </>
  );
};

export default InvoicesPage;

import React from "react";

const Pagination = ({
  dataLength,
  itemsPerPage,
  currentPage,
  onPageChanged,
}) => {
  const pageCount = Math.ceil(dataLength / itemsPerPage);
  const pages = [];

  for (let i = 1; i <= pageCount; i++) {
    pages.push(i);
  }
  return (
    <>
      <div>
        <ul className="pagination pagination-sm">
          <li className={"page-item " + (currentPage === 1 && "disabled")}>
            <button
              className="page-link"
              onClick={() => onPageChanged(currentPage - 1)}
            >
              &laquo;
            </button>
          </li>
          {pages.map((page) => (
            <li
              key={page}
              className={"page-item " + (currentPage === page && "active")}
            >
              <a
                className="page-link"
                onClick={() => {
                  onPageChanged(page);
                }}
              >
                {page}
              </a>
            </li>
          ))}
          <li
            className={"page-item " + (currentPage === pageCount && "disabled")}
          >
            <button
              className="page-link"
              onClick={() => {
                onPageChanged(currentPage + 1);
              }}
            >
              &raquo;
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

Pagination.getData = (items, currentPage, itemsPerPage) => {
  const start = itemsPerPage * currentPage - itemsPerPage;
  return items.slice(start, start + itemsPerPage);
};

export default Pagination;

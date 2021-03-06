import React from "react";

const Field = ({
  name,
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  error = "",
}) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder || label}
      name={name}
      className={"form-control " + (error && "is-invalid")}
      id={name}
    />
    {error && <p className="invalid-feedback">{error}</p>}
  </div>
);

export default Field;

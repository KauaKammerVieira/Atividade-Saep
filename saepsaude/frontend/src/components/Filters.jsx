import React from "react";

export default function Filters({ active, onChange }) {
  const options = [
    ["", "Todos"],
    ["corrida", "Corrida"],
    ["caminhada", "Caminhada"],
    ["trilha", "Trilha"]
  ];

  return (
    <nav className="filters">
      {options.map(([value, label]) => (
        <button
          key={value || "todos"}
          className={active === value ? "selected" : ""}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

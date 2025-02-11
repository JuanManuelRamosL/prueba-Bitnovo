"use client";
import { useState, useEffect } from "react";
import { getCurrencies } from "../utils/api";
import "./CryptoSelector.css"; // Importamos los estilos

export default function CryptoSelector({ onSelect }) {
  const [currencies, setCurrencies] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getCurrencies().then(setCurrencies);
  }, []);

  const filteredCurrencies = currencies.filter((cur) =>
    cur.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="crypto-selector">
      <div className="selector-box" onClick={() => setOpen(!open)}>
        {selected ? (
          <div className="selected">
            <img src={selected.image} alt={selected.name} />
            <span>
              {selected.name} ({selected.symbol})
            </span>
          </div>
        ) : (
          <span>Seleccionar criptomoneda</span>
        )}
      </div>

      {open && (
        <div className="dropdown">
          <input
            type="text"
            placeholder="Buscar..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ul className="crypto-list">
            {filteredCurrencies.map((cur) => (
              <li
                key={cur.symbol}
                className="crypto-item"
                onClick={() => {
                  setSelected(cur);
                  onSelect(cur.symbol);
                  setOpen(false);
                }}
              >
                <img src={cur.image} alt={cur.name} />
                <span>
                  {cur.name} ({cur.symbol})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

"use client";
import React from "react";
import "./fail.css"; // Importa el archivo CSS

export default function Failed() {
  return (
    <div className="failed-container">
      <h1>¡Pago cancelado! ❌</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur. Laoreet blondit auctor et varius
        dolor elit facilis! enim. Nulla ut ut eu nunc.
      </p>
      <button onClick={() => (window.location.href = "/crear-pago")}>
        Crear nuevo pago
      </button>
    </div>
  );
}

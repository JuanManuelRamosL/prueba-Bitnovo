"use client";
import React from "react";
import "./success.css"; // Importa el archivo CSS

export default function Success() {
  return (
    <div className="success-container">
      <h1>¡Pago completado! 🎉</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur. Looreet blondit auctor et varius
        dolor elit facilisi enim. Nulla ut ut eu nunc.
      </p>
      <button onClick={() => (window.location.href = "/index")}>
        Crear nuevo pago
      </button>
    </div>
  );
}

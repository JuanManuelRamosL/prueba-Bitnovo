"use client"; // ✅ Importante en Next.js 15 (App Router)

import { useState, useEffect } from "react";
import { getCurrencies, createOrder } from "../utils/api";
import { useRouter } from "next/navigation"; // ✅ Usa next/navigation
import "./payment.css"; // Importa el archivo CSS

export default function PaymentForm() {
  const [amount, setAmount] = useState("");
  const [concept, setConcept] = useState("");
  const [currency, setCurrency] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getCurrencies().then(setCurrencies);
  }, []);

  // Verifica si todos los campos están completos
  const isFormValid = amount && concept && currency;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const order = await createOrder(amount, concept, currency);
    router.push(`/payment?id=${order.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h1>Crear un Pago</h1>
      <input
        type="number"
        placeholder="Monto"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Concepto"
        value={concept}
        onChange={(e) => setConcept(e.target.value)}
        required
      />
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        required
      >
        <option value="">Selecciona una criptomoneda</option>
        {currencies.map((cur) => (
          <option key={cur.code} value={cur.code}>
            {cur.name} ({cur.code})
          </option>
        ))}
      </select>
      <button type="submit" disabled={!isFormValid}>
        Crear Pago
      </button>
    </form>
  );
}

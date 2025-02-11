"use client"; // ✅ Importante en Next.js 15 (App Router)

"use client";
import { useState } from "react";
import { createOrder } from "../utils/api";
import { useRouter } from "next/navigation";
import CryptoSelector from "./criptoSelector";
import "./payment.css";

export default function PaymentForm() {
  const [amount, setAmount] = useState("");
  const [concept, setConcept] = useState("");
  const [currency, setCurrency] = useState("");
  const router = useRouter();

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
      <CryptoSelector onSelect={setCurrency} />
      <button type="submit" disabled={!isFormValid}>
        Crear Pago
      </button>
    </form>
  );
}

"use client"; // Necesario en componentes que usan hooks

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrderInfo } from "../../utils/api"; // Asegúrate de que la ruta sea correcta
import { QRCodeCanvas } from "qrcode.react";

export default function QRPage() {
  const { id } = useParams(); // ✅ Obtiene el parámetro dinámico `id`
  const router = useRouter();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!id) return;
    getOrderInfo(id).then(setOrder);
  }, [id]);

  useEffect(() => {
    if (order) {
      if (order.status === "CO" || order.status === "AC") {
        router.push("/success");
      } else if (order.status === "EX" || order.status === "OC") {
        router.push("/failure");
      }
    }
  }, [order, router]);

  return (
    <div>
      {order ? (
        <>
          <h2>Escanea el QR para pagar</h2>
          <QRCodeCanvas value={order.qrCode} size={256} />
          <p>
            Monto: {order.amount} {order.currency}
          </p>
          <p>Estado: {order.status}</p>
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}

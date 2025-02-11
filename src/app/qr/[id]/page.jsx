"use client"; // Necesario en componentes que usan hooks

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrderInfo } from "../../utils/api"; // Asegúrate de que la ruta sea correcta
import { QRCodeCanvas } from "qrcode.react";
import styles from "./QRPage.module.css"; // Importa el archivo CSS

export default function QRPage() {
  const { id } = useParams(); // Obtiene el parámetro dinámico `id`
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [socket, setSocket] = useState(null);

  // Obtener la información de la orden
  useEffect(() => {
    if (!id) return;
    getOrderInfo(id).then((data) => {
      if (data && data.length > 0) {
        console.log(data);
        setOrder(data[0]); // Extrae el primer elemento del array
        // Crear WebSocket al obtener la orden
        const socketConnection = new WebSocket(
          `wss://payments.pre-bnvo.com/ws/${data[0].identifier}`
        );
        setSocket(socketConnection);
      }
    });
  }, [id]);

  // Escuchar los mensajes del WebSocket
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message && message.status) {
          setOrder((prevOrder) => ({
            ...prevOrder,
            status: message.status,
          }));
        }
      };

      // Limpiar el socket al desmontar el componente
      return () => {
        socket.close();
      };
    }
  }, [socket]);

  // Redirigir según el estado de la orden
  useEffect(() => {
    if (order) {
      if (order.status === "CO" || order.status === "AC") {
        router.push("/success");
      } else if (order.status === "EX" || order.status === "OC") {
        router.push("/failure");
      }
    }
  }, [order, router]);

  if (!order) {
    return <p className={styles.loading}>Cargando...</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.containerResumen}>
        <div className={styles.containerTitleResumen}>
          <h2 className={styles.title}>Resumen del pedido</h2>
        </div>
        <div className={styles.containerInfoResumen}>
          <div className={styles.summaryItem}>
            <span className={styles.spanText}>Importe: </span>
            <span className={styles.spanText}>
              {order.fiat_amount} {order.fiat}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.spanText}>Moneda Seleccionada: </span>
            <span className={styles.spanText}>{order.currency_id}</span>
          </div>
          <div className={styles.summaryItemEspecial}>
            <span className={styles.spanText}>Comercio: </span>
            <span className={styles.spanText}>
              {order.merchant_device || "Comercio no especificado"}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.spanText}>Fecha: </span>
            <span className={styles.spanText}>
              {new Date(order.created_at).toLocaleDateString()}{" "}
              {new Date(order.created_at).toLocaleTimeString()}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.spanText}>Concepto: </span>
            <span className={styles.spanText}>
              {order.notes || "Sin concepto"}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.containerRealizarPago}>
        <div className={styles.containerTitleResumen}>
          <h2 className={styles.title}>Realiza el Pago</h2>
        </div>
        <div className={styles.paymentOptions}>
          <button className={styles.option}>SmarLQR</button>
          <button className={styles.option}>Web3</button>
        </div>

        <div className={styles.qrContainer}>
          <QRCodeCanvas
            value={`bitcoin:${order.address}?amount=${order.crypto_amount}`}
            size={256}
            className={styles.qrCode}
          />
        </div>
        <div className={styles.cryptoInfo}>
          <span>
            Envío: {order.crypto_amount} {order.currency_id}
          </span>
          <span>{order.address}</span>
          {order.tag_memo && <span>Tag/Memo: {order.tag_memo}</span>}
          <span>Estado: {order.status}</span>
          <span>
            Fecha de expiración:{" "}
            {new Date(order.expired_time).toLocaleDateString()}{" "}
            {new Date(order.expired_time).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}

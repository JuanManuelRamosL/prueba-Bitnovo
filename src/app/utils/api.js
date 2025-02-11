import axios from "axios";

const API_URL = "https://payments.pre-bnvo.com/api/v1";
const DEVICE_ID = "ec1504d3-33c8-40cc-94e7-c52c90e345ef"; // Reemplaza con tu ID

export const getCurrencies = async () => {
  const response = await axios.get(`${API_URL}/currencies`, {
    headers: { "X-Device-Id": DEVICE_ID }
  });
  return response.data;
};

export const createOrder = async (amount, concept, currency) => {
  const response = await axios.post(
    `${API_URL}/orders/`,
    { amount, concept, currency },
    { headers: { "X-Device-Id": DEVICE_ID } }
  );
  return response.data;
};

export const getOrderInfo = async (orderId) => {
  const response = await axios.get(`${API_URL}/orders/info/${orderId}`, {
    headers: { "X-Device-Id": DEVICE_ID }
  });
  return response.data;
};

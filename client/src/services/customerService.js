import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/customers";

export const getCustomers = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const createCustomer = async (customerData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(API_URL, customerData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};
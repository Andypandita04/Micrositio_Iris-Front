// src/api/ProyectoService.js
import axios from 'axios';

const API_URL = "http://localhost:3000/proyectos";

export const getProyectos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // lista de proyectos
  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    throw error;
  }
};

export const crearProyecto = async (proyectoData) => {
  try {
    const response = await axios.post(API_URL, proyectoData);
    return response.data;
  } catch (error) {
    console.error("Error al crear proyecto:", error);
    throw error;
  }
};

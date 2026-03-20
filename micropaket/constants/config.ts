// Centralizamos la IP de tu servidor Laravel
const IP_ADDRESS = '192.168.1.22'; 
const PORT = '8000';

export const BASE_URL = `http://${IP_ADDRESS}:${PORT}/api`;

// También puedes centralizar las rutas de las imágenes que guardas en storage
export const STORAGE_URL = `http://${IP_ADDRESS}:${PORT}/storage`;
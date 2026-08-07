import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración de la prueba de carga
export const options = {
  // Simularemos etapas de carga para llegar a los 50-100 usuarios (VUs) requeridos
  stages: [
    { duration: '30s', target: 50 },  // Ramp-up: subir a 50 usuarios en 30 segundos
    { duration: '1m', target: 50 },   // Mantener 50 usuarios por 1 minuto
    { duration: '30s', target: 100 }, // Subir pico a 100 usuarios en 30 segundos
    { duration: '30s', target: 0 },   // Ramp-down: bajar a 0 usuarios
  ],
  thresholds: {
    // Definimos criterios de aceptación de rendimiento (throughput / response time)
    http_req_duration: ['p(95)<500'], // El 95% de las peticiones deben responder en menos de 500ms
    http_req_failed: ['rate<0.01'],   // Menos del 1% de peticiones pueden fallar
  },
  // Ignorar errores de certificado local
  insecureSkipTLSVerify: true,
};

// Reemplazar esta URL con la IP de tu VPS en Hostinger/AWS o dejar localhost para prueba local
const BASE_URL = __ENV.BASE_URL || 'https://localhost:5173';

export default function () {
  // Simular la carga de la página principal (Frontend)
  const resHome = http.get(`${BASE_URL}/`);
  
  check(resHome, {
    'Homepage status es 200': (r) => r.status === 200,
  });

  sleep(1); // Tiempo de lectura/espera del usuario simulado

  // Opcional: Simular petición al backend (ajustar ruta según tu API)
  // const payload = JSON.stringify({ email: 'test@finix.com', password: 'password123' });
  // const headers = { 'Content-Type': 'application/json' };
  // const resApi = http.post(`http://localhost:3000/api/auth/login`, payload, { headers });
  
  // check(resApi, {
  //   'API Login status es 200': (r) => r.status === 200,
  // });
}

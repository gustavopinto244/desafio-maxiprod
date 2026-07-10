import axios from 'axios';

/**
 * Instancia configurada do axios para comunicacao com o backend.
 *
 * Todos os services do frontend usam esta instancia em vez de criar
 * novas conexoes a cada requisicao. Isso centraliza a configuracao
 * da URL base e dos headers padrao.
 *
 * A URL base aponta para o backend ASP.NET Core rodando na localhost:5000.
 * Todos os endpoints da API comecam com /api, entao ja incluimos isso aqui.
 */
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

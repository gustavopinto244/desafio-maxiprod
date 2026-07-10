import api from './api';

/**
 * Servico para popular o banco com dados de exemplo (seed).
 *
 * Este endpoint e util para quem esta avaliando o projeto e quer
 * ver dados na tela sem precisar cadastrar tudo manualmente.
 * Ele cria 3 pessoas (incluindo uma menor de idade) e 11 transacoes.
 *
 * Endpoint: POST /api/seed
 */
export async function popularDadosExemplo(): Promise<{
  mensagem: string;
  pessoasCriadas: number;
  transacoesCriadas: number;
}> {
  const response = await api.post('/seed');
  return response.data;
}

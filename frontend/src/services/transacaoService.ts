import api from './api';
import type { Transacao, CriarTransacaoDto, TotaisGerais } from '../types';

/**
 * Camada de servicos para operacoes relacionadas a transacoes.
 *
 * Segue o mesmo padrao do pessoaService: centraliza todas as chamadas
 * a API relacionadas a transacoes em um unico lugar.
 *
 * IMPORTANTE: a validacao de menores de idade (que so podem ter despesas)
 * e feita no backend. Se o frontend tentar cadastrar uma receita para
 * um menor, o backend retorna 400 Bad Request com mensagem de erro.
 */

/**
 * Lista todas as transacoes cadastradas no sistema
 * Endpoint: GET /api/transacoes
 */
export async function listarTransacoes(): Promise<Transacao[]> {
  const response = await api.get<Transacao[]>('/transacoes');
  return response.data;
}

/**
 * Cadastra uma nova transacao (receita ou despesa) vinculada a uma pessoa
 * Endpoint: POST /api/transacoes
 *
 * Pode retornar 400 se:
 * - A pessoa nao existir
 * - A pessoa for menor de 18 anos e o tipo for Receita
 */
export async function criarTransacao(dto: CriarTransacaoDto): Promise<Transacao> {
  const response = await api.post<Transacao>('/transacoes', dto);
  return response.data;
}

/**
 * Consulta os totais de receitas, despesas e saldo por pessoa e no geral
 * Endpoint: GET /api/transacoes/totais
 *
 * Este e o endpoint usado pela pagina de Consulta de Totais.
 * Os calculos sao feitos inteiramente no backend.
 */
export async function consultarTotais(): Promise<TotaisGerais> {
  const response = await api.get<TotaisGerais>('/transacoes/totais');
  return response.data;
}

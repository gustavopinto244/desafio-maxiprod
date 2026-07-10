import api from './api';
import type { Pessoa, CriarPessoaDto } from '../types';

/**
 * Camada de servicos para operacoes relacionadas a pessoas.
 *
 * Esta camada funciona como intermediaria entre os componentes React e a API.
 * Os componentes NUNCA chamam fetch/axios diretamente — sempre passam por aqui.
 * Isso facilita manutencao: se a URL ou formato da API mudar, so precisamos
 * alterar este arquivo, nao todos os componentes.
 */

/**
 * Lista todas as pessoas cadastradas no sistema
 * Endpoint: GET /api/pessoas
 */
export async function listarPessoas(): Promise<Pessoa[]> {
  const response = await api.get<Pessoa[]>('/pessoas');
  return response.data;
}

/**
 * Cadastra uma nova pessoa no sistema
 * Endpoint: POST /api/pessoas
 * O backend retorna 201 Created com a pessoa criada (incluindo o Id gerado)
 */
export async function criarPessoa(dto: CriarPessoaDto): Promise<Pessoa> {
  const response = await api.post<Pessoa>('/pessoas', dto);
  return response.data;
}

/**
 * Exclui uma pessoa e todas as suas transacoes (cascade delete)
 * Endpoint: DELETE /api/pessoas/{id}
 * O backend retorna 204 No Content em caso de sucesso
 */
export async function excluirPessoa(id: string): Promise<void> {
  await api.delete(`/pessoas/${id}`);
}

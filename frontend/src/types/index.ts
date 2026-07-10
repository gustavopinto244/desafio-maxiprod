/*
Tipos de dados usados no frontend.
 
Estas interfaces espelham os DTOs e Models do backend C#,
garantindo que o TypeScript valide os dados que vem da API.
Centralizar todos os tipos aqui facilita a manutencao e evita
uplicacao de definicoes em varios arquivos.
*/

export interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

export interface CriarPessoaDto {
  nome: string;
  idade: number;
}

export const TipoTransacao = {
  Receita: 1,
  Despesa: 2,
} as const;

export type TipoTransacao = (typeof TipoTransacao)[keyof typeof TipoTransacao];

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: string;
}

export interface CriarTransacaoDto {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: string;
}

export interface TotaisPessoa {
  pessoaId: string;
  nome: string;
  idade: number;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotaisGerais {
  totaisPorPessoa: TotaisPessoa[];
  receitaTotalGeral: number;
  despesaTotalGeral: number;
  saldoLiquidoGeral: number;
}

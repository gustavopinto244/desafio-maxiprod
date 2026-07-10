import { useState, useEffect } from 'react';
import type { TotaisGerais } from '../types';
import * as transacaoService from '../services/transacaoService';
import '../styles/table.css';
import '../styles/messages.css';

/*
  Pagina de Consulta de Totais Ela exibe:
    - Totais individuais por pessoa (receitas, despesas e saldo)
    - Totais gerais de todo o sistema (soma de todas as pessoas)

  Os calculos sao feitos no backend, e esta pagina apenas exibe os resultados.
*/
export default function TotaisPage() {
  // Estado para armazenar os dados de totais vindos do backend
  const [totais, setTotais] = useState<TotaisGerais | null>(null);

  // Estado de loading
  const [carregando, setCarregando] = useState(false);

  // Estado para mensagens de erro
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(
    null
  );

  // Hook useEffect carrega os totais automaticamente quando o usuario abre esta aba
  useEffect(() => {
    carregarTotais();
  }, []);

  // Busca os totais do backend e atualiza o estado
  async function carregarTotais() {
    setCarregando(true);
    setMensagem(null);
    try {
      const dados = await transacaoService.consultarTotais();
      setTotais(dados);
    } catch {
      setMensagem({
        tipo: 'erro',
        texto: 'Erro ao carregar totais. Verifique se o backend esta rodando.',
      });
    } finally {
      setCarregando(false);
    }
  }

  // Formata valor monetario para real
  function formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // Se estiver carregando, mostra apenas o indicador de loading
  if (carregando) {
    return <div className="loading">Carregando totais...</div>;
  }

  return (
    <div>
      <h2>Consulta de Totais</h2>

      {/* Exibe mensagem de erro se houver */}
      {mensagem && <div className={`mensagem mensagem-${mensagem.tipo}`}>{mensagem.texto}</div>}

      {/* Se nao houver dados, mostra mensagem orientando o usuario */}
      {!totais || totais.totaisPorPessoa.length === 0 ? (
        <div className="sem-dados">
          Nenhum dado para exibir. Cadastre pessoas e transacoes primeiro.
        </div>
      ) : (
        <>
          {/* Cards com os totais gerais do sistema (receita total, despesa total e saldo liquido) */}
          <div className="card-totais">
            <div className="totais-item">
              <h3>Receita Total</h3>
              <div className="valor valor-positivo">{formatarValor(totais.receitaTotalGeral)}</div>
            </div>
            <div className="totais-item">
              <h3>Despesa Total</h3>
              <div className="valor valor-negativo">{formatarValor(totais.despesaTotalGeral)}</div>
            </div>
            <div className="totais-item">
              <h3>Saldo Liquido</h3>
              {/* Cor muda dinamicamente: verde se positivo, vermelho se negativo */}
              <div
                className={`valor ${totais.saldoLiquidoGeral >= 0 ? 'valor-positivo' : 'valor-negativo'}`}
              >
                {formatarValor(totais.saldoLiquidoGeral)}
              </div>
            </div>
          </div>

          {/* Tabela detalhada com os totais de cada pessoa individualmente */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Pessoa</th>
                  <th className="text-center">Idade</th>
                  <th className="text-right">Total Receitas</th>
                  <th className="text-right">Total Despesas</th>
                  <th className="text-right">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {/* Uma linha para cada pessoa com seus respectivos totais */}
                {totais.totaisPorPessoa.map((item) => (
                  <tr key={item.pessoaId}>
                    <td>{item.nome}</td>
                    <td className="text-center">{item.idade}</td>
                    <td className="text-right valor-positivo">
                      {formatarValor(item.totalReceitas)}
                    </td>
                    <td className="text-right valor-negativo">
                      {formatarValor(item.totalDespesas)}
                    </td>
                    <td
                      className={`text-right ${item.saldo >= 0 ? 'valor-positivo' : 'valor-negativo'}`}
                    >
                      {formatarValor(item.saldo)}
                    </td>
                  </tr>
                ))}
                {/* Linha com os totais gerais */}
                <tr className="total-row">
                  <td colSpan={2}>Total Geral</td>
                  <td className="text-right valor-positivo">
                    {formatarValor(totais.receitaTotalGeral)}
                  </td>
                  <td className="text-right valor-negativo">
                    {formatarValor(totais.despesaTotalGeral)}
                  </td>
                  <td
                    className={`text-right ${totais.saldoLiquidoGeral >= 0 ? 'valor-positivo' : 'valor-negativo'}`}
                  >
                    {formatarValor(totais.saldoLiquidoGeral)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

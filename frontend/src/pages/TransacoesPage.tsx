import { useState, useEffect } from 'react';
import type { Pessoa, Transacao, CriarTransacaoDto } from '../types';
import { TipoTransacao } from '../types';
import * as transacaoService from '../services/transacaoService';
import * as pessoaService from '../services/pessoaService';
import '../styles/forms.css';
import '../styles/table.css';
import '../styles/messages.css';

/**
  Pagina de gerenciamento de transacoes financeiras
  Responsavel por:
    - Cadastrar novas transacoes (receitas e despesas)
    - Listar todas as transacoes cadastradas
    - Associar cada transacao a uma pessoa especifica
*/
export default function TransacoesPage() {
  // Estado para armazenar a lista de transacoes
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  // Estado para armazenar a lista de pessoas
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);

  // Estados para os campos do formulario de cadastro
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  // Tipo padrao e Despesa
  const [tipo, setTipo] = useState<TipoTransacao>(TipoTransacao.Despesa);
  const [pessoaId, setPessoaId] = useState('');

  // Estado de loading
  const [carregando, setCarregando] = useState(false);

  // Estado para mensagens de feedback (sucesso ou erro)
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(
    null
  );

  //Hook useEffect que carrega tanto as transacoes quanto as pessoas (para o select)
  
  useEffect(() => {
    carregarDados();
  }, []);

  // Carrega dados de transacoes e pessoas em paralelo usando Promise.all
  async function carregarDados() {
    setCarregando(true);
    try {
      // Promise.all executa ambas as requisicoes ao mesmo tempo
      const [dadosTransacoes, dadosPessoas] = await Promise.all([
        transacaoService.listarTransacoes(),
        pessoaService.listarPessoas(),
      ]);
      setTransacoes(dadosTransacoes);
      setPessoas(dadosPessoas);
    } catch {
      setMensagem({
        tipo: 'erro',
        texto: 'Erro ao carregar dados. Verifique se o backend esta rodando.',
      });
    } finally {
      setCarregando(false);
    }
  }

  // Handler do submit do formulario de cadastro de transacao que valida se uma
  // pessoa foi selecionada antes de enviar
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensagem(null);

    // Validacao no frontend: pessoa e obrigatoria
    if (!pessoaId) {
      setMensagem({ tipo: 'erro', texto: 'Selecione uma pessoa.' });
      return;
    }

    // Monta o DTO com os dados do formulario
    const dto: CriarTransacaoDto = {
      descricao: descricao.trim(),
      valor: parseFloat(valor),
      tipo,
      pessoaId,
    };

    try {
      await transacaoService.criarTransacao(dto);
      setMensagem({ tipo: 'sucesso', texto: 'Transacao cadastrada com sucesso!' });
      // Limpa os campos do formulario apos cadastro bem-sucedido
      setDescricao('');
      setValor('');
      setTipo(TipoTransacao.Despesa); // Volta para o tipo padrao
      setPessoaId('');
      carregarDados(); // Recarrega para mostrar a nova transacao
    } catch (error: any) {
      // Extrai mensagem de erro do backend
      const msgErro =
        error.response?.data?.mensagem ||
        error.response?.data?.errors ||
        'Erro ao cadastrar transacao.';
      setMensagem({
        tipo: 'erro',
        texto: typeof msgErro === 'string' ? msgErro : JSON.stringify(msgErro),
      });
    }
  }

  // Busca o nome da pessoa pelo ID para exibir na tabela de listagem
  function getNomePessoa(id: string): string {
    return pessoas.find((p) => p.id === id)?.nome || 'Pessoa nao encontrada';
  }

  // Formata valor monetario para reais

  function formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  return (
    <div>
      {/* Card com formulario de cadastro */}
      <div className="card">
        <h2>Cadastrar Transacao</h2>

        {/* Exibe mensagem de feedback se existir */}
        {mensagem && <div className={`mensagem mensagem-${mensagem.tipo}`}>{mensagem.texto}</div>}

        <form onSubmit={handleSubmit}>
          {/* Select para escolher a pessoa dona da transacao */}
          <div className="form-group">
            <label htmlFor="pessoaId">Pessoa</label>
            <select
              id="pessoaId"
              value={pessoaId}
              onChange={(e) => setPessoaId(e.target.value)}
              required
            >
              <option value="">Selecione uma pessoa</option>
              {/* Mostra nome e idade para ajudar na identificacao */}
              {pessoas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} ({p.idade} anos)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="descricao">Descricao</label>
            <input
              id="descricao"
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Salario, Aluguel, Supermercado..."
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="valor">Valor (R$)</label>
              <input
                id="valor"
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                min="0.01"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="tipo">Tipo</label>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(Number(e.target.value) as TipoTransacao)}
              >
                <option value={TipoTransacao.Receita}>Receita</option>
                <option value={TipoTransacao.Despesa}>Despesa</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Cadastrar Transacao
          </button>
        </form>
      </div>

      <h2>Transacoes Cadastradas</h2>

      {/* Renderizacao condicional: loading, lista vazia ou tabela com dados */}
      {carregando ? (
        <div className="loading">Carregando...</div>
      ) : transacoes.length === 0 ? (
        <div className="sem-dados">Nenhuma transacao cadastrada ainda.</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Pessoa</th>
                <th>Descricao</th>
                <th className="text-center">Tipo</th>
                <th className="text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((transacao) => (
                <tr key={transacao.id}>
                  <td>{getNomePessoa(transacao.pessoaId)}</td>
                  <td>{transacao.descricao}</td>
                  <td className="text-center">
                    {/* Badge colorido de status*/}
                    <span
                      className={`badge ${transacao.tipo === TipoTransacao.Receita ? 'badge-receita' : 'badge-despesa'}`}
                    >
                      {transacao.tipo === TipoTransacao.Receita ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td
                    className={`text-right ${transacao.tipo === TipoTransacao.Receita ? 'valor-positivo' : 'valor-negativo'}`}
                  >
                    {formatarValor(transacao.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

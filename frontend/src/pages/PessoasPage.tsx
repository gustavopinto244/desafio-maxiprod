import { useState, useEffect } from 'react';
import type { Pessoa, CriarPessoaDto } from '../types';
import * as pessoaService from '../services/pessoaService';
import * as seedService from '../services/seedService';
import '../styles/forms.css';
import '../styles/table.css';
import '../styles/messages.css';

/*
  Pagina de gerenciamento de pessoas
  Responsavel por:
    - Cadastrar novas pessoas
    - Listar todas as pessoas cadastradas
    - Excluir pessoas 
    - Popular banco com dados de exemplo (seed)
*/
export default function PessoasPage() {
  // Estado para armazenar a lista de pessoas vindas do backend
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);

  // Estados para os campos do formulario de cadastro
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');

  // Estado de carregamento
  const [carregando, setCarregando] = useState(false);

  // Estado para mensagens de feedback (sucesso ou erro)
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(
    null
  );

  // Hook useEffect roda carregarPessoas, para mostrar a lista de pessoas do backend
  useEffect(() => {
    carregarPessoas();
  }, []);

  // Busca a lista de pessoas do backend e atualiza o estado
  // Mostra loading durante a requisicao e trata erros de conexao
  async function carregarPessoas() {
    setCarregando(true);
    try {
      const dados = await pessoaService.listarPessoas();
      setPessoas(dados);
    } catch {
      setMensagem({ tipo: 'erro', texto: 'Erro ao carregar a lista de pessoas.' });
    } finally {
      setCarregando(false);
    }
  }

  // Handler do submit do formulario de cadastro
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Previne o comportamento padrao de recarregar a pagina
    setMensagem(null); // Limpa mensagens anteriores

    // Monta o DTO com os dados do formulario
    const dto: CriarPessoaDto = {
      nome: nome.trim(), // Remove espacos em branco no inicio e fim
      idade: parseInt(idade),
    };
    // Requisicao para criar pessoa
    try {
      await pessoaService.criarPessoa(dto);
      setMensagem({ tipo: 'sucesso', texto: `Pessoa "${dto.nome}" cadastrada com sucesso!` });
      // Limpa os campos do formulario apos cadastro bem-sucedido
      setNome('');
      setIdade('');
      // Recarrega a lista para mostrar a nova pessoa
      carregarPessoas();
    } catch (error: any) {
      // Extrai a mensagem de erro
      const msgErro =
        error.response?.data?.mensagem ||
        error.response?.data?.errors ||
        'Erro ao cadastrar pessoa.';
      setMensagem({
        tipo: 'erro',
        texto: typeof msgErro === 'string' ? msgErro : JSON.stringify(msgErro),
      });
    }
  }

  // Handler para exclusao de pessoa
  async function handleExcluir(id: string, nomePessoa: string) {
    // Confirmacao porque a exclusao e em cascata (remove transacoes tambem)
    // oxlint-disable-next-line no-alert -- confirm nativo e suficiente para este caso
    if (!confirm(`Tem certeza que deseja excluir "${nomePessoa}" e todas as suas transacoes?`)) {
      return;
    }

    try {
      await pessoaService.excluirPessoa(id);
      setMensagem({ tipo: 'sucesso', texto: `"${nomePessoa}" e suas transacoes foram excluidos.` });
      carregarPessoas(); // Recarrega para remover da lista
    } catch {
      setMensagem({ tipo: 'erro', texto: 'Erro ao excluir pessoa.' });
    }
  }

  // Handler para popular o banco com dados de exemplo
  async function handleSeed() {
    setMensagem(null);
    try {
      const resultado = await seedService.popularDadosExemplo();
      setMensagem({ tipo: 'sucesso', texto: resultado.mensagem });
      carregarPessoas(); // Recarrega para mostrar os dados criados
    } catch {
      setMensagem({ tipo: 'erro', texto: 'Erro ao popular dados de exemplo.' });
    }
  }

  return (
    <div>
      {/* Card com formulario de cadastro */}
      <div className="card">
        <h2>Cadastrar Pessoa</h2>

        {/* Exibe mensagem de feedback,  se existir */}
        {mensagem && <div className={`mensagem mensagem-${mensagem.tipo}`}>{mensagem.texto}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="idade">Idade</label>
              <input
                id="idade"
                type="number"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                placeholder="Idade"
                min="0"
                max="200"
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Cadastrar
          </button>
        </form>
      </div>

      {/* Cabecalho da listagem com botao de seed */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
        }}
      >
        <h2>Pessoas Cadastradas</h2>
        <button className="btn btn-secondary" onClick={handleSeed}>
          Popular dados de exemplo
        </button>
      </div>

      {/* Renderizacao condicional: loading, lista vazia ou tabela com dados */}
      {carregando ? (
        <div className="loading">Carregando...</div>
      ) : pessoas.length === 0 ? (
        <div className="sem-dados">Nenhuma pessoa cadastrada ainda.</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th className="text-center">Idade</th>
                <th className="text-center">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {/* Itera sobre a lista de pessoas e renderiza uma linha para cada */}
              {pessoas.map((pessoa) => (
                <tr key={pessoa.id}>
                  <td>{pessoa.nome}</td>
                  <td className="text-center">{pessoa.idade}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-danger"
                      onClick={() => handleExcluir(pessoa.id, pessoa.nome)}
                    >
                      Excluir
                    </button>
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

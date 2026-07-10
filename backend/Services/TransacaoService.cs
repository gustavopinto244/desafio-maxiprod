using Backend.DTOs;
using Backend.Enums;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    // Service responsavel pela logica de negocio relacionada a transacoes
    public class TransacaoService
    {
        // Idade minima para poder cadastrar receitas
        private const int IdadeMinimaParaReceita = 18;

        private readonly TransacaoRepository _transacaoRepository;
        private readonly PessoaRepository _pessoaRepository;

        public TransacaoService(TransacaoRepository transacaoRepository, PessoaRepository pessoaRepository)
        {
            _transacaoRepository = transacaoRepository;
            _pessoaRepository = pessoaRepository;
        }

       
        // Cria uma nova transacao apos validar as regras de negocio
        public async Task<(Transacao? Transacao, string? Erro)> CriarAsync(CriarTransacaoDto dto)
        {
            // Validacao 1: 
            // a pessoa referenciada pelo PessoaId precisa existir no banco.
            var pessoa = await _pessoaRepository.BuscarPorIdAsync(dto.PessoaId);
            if (pessoa == null)
                return (null, "Pessoa nao encontrada. Verifique se o PessoaId informado existe.");

            // Validacao 2:
            // Menores de 18 anos so podem ter transacoes do tipo Despesa.
            if (pessoa.Idade < IdadeMinimaParaReceita && dto.Tipo == TipoTransacao.Receita)
                return (null, $"Pessoas menores de {IdadeMinimaParaReceita} anos so podem ter transacoes do tipo Despesa.");

            var transacao = new Transacao
            {
                Descricao = dto.Descricao.Trim(),
                Valor = dto.Valor,
                Tipo = dto.Tipo,
                PessoaId = dto.PessoaId
            };

            var resultado = await _transacaoRepository.CriarAsync(transacao);
            return (resultado, null);
        }

        // Lista todas as transacoes cadastradas
        public async Task<List<Transacao>> ListarTodasAsync()
        {
            return await _transacaoRepository.ListarTodasAsync();
        }

        // Lista as transacoes de uma pessoa especifica
        public async Task<List<Transacao>> ListarPorPessoaIdAsync(string pessoaId)
        {
            return await _transacaoRepository.ListarPorPessoaIdAsync(pessoaId);
        }

        // Calcula os totais de receitas, despesas e saldo para cada pessoa,
        // e tambem os totais gerais do sistema (soma de todas as pessoas)
        public async Task<TotaisGeraisDto> CalcularTotaisGeraisAsync()
        {
            // Busca todas as pessoas e todas suas transacoes
            var pessoas = await _pessoaRepository.ListarTodasAsync();
            var todasTransacoes = await _transacaoRepository.ListarTodasAsync();

            var totaisPorPessoa = new List<TotaisPessoaDto>();

            // Para cada pessoa, filtra suas transacoes e calcula os totais
            foreach (var pessoa in pessoas)
            {
                var transacoesDaPessoa = todasTransacoes.Where(t => t.PessoaId == pessoa.Id).ToList();

                var totalReceitas = transacoesDaPessoa
                    .Where(t => t.Tipo == TipoTransacao.Receita)
                    .Sum(t => t.Valor);

                var totalDespesas = transacoesDaPessoa
                    .Where(t => t.Tipo == TipoTransacao.Despesa)
                    .Sum(t => t.Valor);

                totaisPorPessoa.Add(new TotaisPessoaDto
                {
                    PessoaId = pessoa.Id,
                    Nome = pessoa.Nome,
                    Idade = pessoa.Idade,
                    TotalReceitas = totalReceitas,
                    TotalDespesas = totalDespesas,
                    Saldo = totalReceitas - totalDespesas
                });
            }

            // Totais gerais = soma dos totais individuais de cada pessoa
            return new TotaisGeraisDto
            {
                TotaisPorPessoa = totaisPorPessoa,
                ReceitaTotalGeral = totaisPorPessoa.Sum(t => t.TotalReceitas),
                DespesaTotalGeral = totaisPorPessoa.Sum(t => t.TotalDespesas),
                SaldoLiquidoGeral = totaisPorPessoa.Sum(t => t.Saldo)
            };
        }
    }
}

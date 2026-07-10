using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    // Service responsavel pela logica de negocio relacionada a pessoas
    public class PessoaService
    {
        private readonly PessoaRepository _pessoaRepository;
        private readonly TransacaoRepository _transacaoRepository;

        public PessoaService(PessoaRepository pessoaRepository, TransacaoRepository transacaoRepository)
        {
            _pessoaRepository = pessoaRepository;
            _transacaoRepository = transacaoRepository;
        }

        // Cria uma nova pessoa a partir dos dados do DTO
        // O Id (ObjectId) e gerado automaticamente pelo MongoDB.Driver na insercao
        public async Task<Pessoa> CriarAsync(CriarPessoaDto dto)
        {
            var pessoa = new Pessoa
            {
                Nome = dto.Nome.Trim(),
                Idade = dto.Idade
            };

            return await _pessoaRepository.CriarAsync(pessoa);
        }

        // Lista todas as pessoas cadastradas
        public async Task<List<Pessoa>> ListarTodasAsync()
        {
            return await _pessoaRepository.ListarTodasAsync();
        }

      
        // Busca uma pessoa pelo ID. Retorna null se nao encontrar.
        public async Task<Pessoa?> BuscarPorIdAsync(string id)
        {
            return await _pessoaRepository.BuscarPorIdAsync(id);
        }

        // Exclui uma pessoa e todas as suas transacoes (cascade delete)
        public async Task<bool> ExcluirAsync(string id)
        {
            var pessoa = await _pessoaRepository.BuscarPorIdAsync(id);
            if (pessoa == null)
                return false;

            // Remove todas as transacoes da pessoa
            await _transacaoRepository.ExcluirPorPessoaIdAsync(id);
            
            // Remove a pessoa
            return await _pessoaRepository.ExcluirAsync(id);
        }
    }
}

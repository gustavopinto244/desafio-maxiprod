using MongoDB.Driver;
using Backend.Models;
using Backend.Enums;

namespace Backend.Repositories
{
    // Repository responsavel pelas operacoes de acesso a dados da collection "transacoes"
    public class TransacaoRepository
    {
        private readonly IMongoCollection<Transacao> _collection;

        public TransacaoRepository(IMongoDatabase database)
        {
            _collection = database.GetCollection<Transacao>("transacoes");
        }

        public async Task<Transacao> CriarAsync(Transacao transacao)
        {
            await _collection.InsertOneAsync(transacao);
            return transacao;
        }

        public async Task<List<Transacao>> ListarTodasAsync()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<List<Transacao>> ListarPorPessoaIdAsync(string pessoaId)
        {
            return await _collection.Find(t => t.PessoaId == pessoaId).ToListAsync();
        }

        // Remove todas as transacoes de uma pessoa (usado no cascade delete)
        public async Task ExcluirPorPessoaIdAsync(string pessoaId)
        {
            await _collection.DeleteManyAsync(t => t.PessoaId == pessoaId);
        }
    }
}

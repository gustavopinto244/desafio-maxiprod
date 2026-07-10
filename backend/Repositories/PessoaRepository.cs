using MongoDB.Driver;
using Backend.Configurations;
using Backend.Models;

namespace Backend.Repositories
{
    // Repositorio responsavel pelas operacoes de acesso a dados da collection "pessoas"
    public class PessoaRepository
    {
        private readonly IMongoCollection<Pessoa> _collection;

        public PessoaRepository(IMongoDatabase database)
        {
            _collection = database.GetCollection<Pessoa>("pessoas");
        }

        public async Task<Pessoa> CriarAsync(Pessoa pessoa)
        {
            await _collection.InsertOneAsync(pessoa);
            return pessoa;
        }

        public async Task<List<Pessoa>> ListarTodasAsync()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<Pessoa?> BuscarPorIdAsync(string id)
        {
            return await _collection.Find(p => p.Id == id).FirstOrDefaultAsync();
        }

        public async Task<bool> ExcluirAsync(string id)
        {
            var resultado = await _collection.DeleteOneAsync(p => p.Id == id);
            return resultado.DeletedCount > 0;
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Backend.Models;
using Backend.Enums;

namespace Backend.Controllers
{
    // Controller responsavel por popular o banco com dados de exemplo
    
    // Para facilitar o teste do sistema
    
    // Ele cria 3 pessoas (incluindo uma menor de idade) e 11 transacoes
    // variadas entre receitas e despesas
  
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly IMongoDatabase _database;

        public SeedController(IMongoDatabase database)
        {
            _database = database;
        }

        // POST api/seed - Limpa o banco e insere dados de exemplo
        [HttpPost]
        public async Task<IActionResult> PopularDados()
        {
            try
            {
                var pessoasCollection = _database.GetCollection<Pessoa>("pessoas");
                var transacoesCollection = _database.GetCollection<Transacao>("transacoes");

                // Limpa os dados existentes para evitar duplicatas
                await pessoasCollection.DeleteManyAsync(_ => true);
                await transacoesCollection.DeleteManyAsync(_ => true);

                // Cria pessoas de exemplo
                var pessoa1 = new Pessoa { Nome = "Maria Silva", Idade = 35 };
                var pessoa2 = new Pessoa { Nome = "Joao Santos", Idade = 28 };
                var pessoa3 = new Pessoa { Nome = "Ana Oliveira", Idade = 15 };

                // InsertManyAsync gera os ObjectIds automaticamente
                // e preenche o campo Id de cada objeto apos a insercao
                await pessoasCollection.InsertManyAsync(new[] { pessoa1, pessoa2, pessoa3 });

                // Cria transacoes de exemplo para cada pessoa

                // Os PessoaIds aqui ja estao preenchidos porque o InsertManyAsync
                // acima atualizou os Ids das pessoas
                var transacoes = new List<Transacao>
                {
                    new Transacao { Descricao = "Salario mensal", Valor = 5000.00m, Tipo = TipoTransacao.Receita, PessoaId = pessoa1.Id },
                    new Transacao { Descricao = "Freelance design", Valor = 1200.00m, Tipo = TipoTransacao.Receita, PessoaId = pessoa1.Id },
                    new Transacao { Descricao = "Aluguel", Valor = 1500.00m, Tipo = TipoTransacao.Despesa, PessoaId = pessoa1.Id },
                    new Transacao { Descricao = "Supermercado", Valor = 800.00m, Tipo = TipoTransacao.Despesa, PessoaId = pessoa1.Id },
                    new Transacao { Descricao = "Internet", Valor = 120.00m, Tipo = TipoTransacao.Despesa, PessoaId = pessoa1.Id },

                    new Transacao { Descricao = "Salario", Valor = 3500.00m, Tipo = TipoTransacao.Receita, PessoaId = pessoa2.Id },
                    new Transacao { Descricao = "Aluguel apartamento", Valor = 1000.00m, Tipo = TipoTransacao.Despesa, PessoaId = pessoa2.Id },
                    new Transacao { Descricao = "Transporte", Valor = 300.00m, Tipo = TipoTransacao.Despesa, PessoaId = pessoa2.Id },

                    new Transacao { Descricao = "Material escolar", Valor = 250.00m, Tipo = TipoTransacao.Despesa, PessoaId = pessoa3.Id },
                    new Transacao { Descricao = "Curso de ingles", Valor = 400.00m, Tipo = TipoTransacao.Despesa, PessoaId = pessoa3.Id },
                    new Transacao { Descricao = "Lanche escola", Valor = 150.00m, Tipo = TipoTransacao.Despesa, PessoaId = pessoa3.Id }
                };

                await transacoesCollection.InsertManyAsync(transacoes);

                return Ok(new
                {
                    mensagem = "Dados de exemplo inseridos com sucesso!",
                    pessoasCriadas = 3,
                    transacoesCriadas = transacoes.Count
                });
            }
            catch (Exception ex)
            {
                // Log no console para ajudar no diagnostico sem expor detalhes na resposta HTTP
                Console.WriteLine($"[SeedController] Erro ao popular dados: {ex.Message}");
                return StatusCode(500, new { mensagem = "Erro ao popular dados de exemplo. Tente novamente." });
            }
        }
    }
}

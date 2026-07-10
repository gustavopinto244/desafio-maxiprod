using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoasController : ControllerBase
    {
        private readonly PessoaService _pessoaService;

        public PessoasController(PessoaService pessoaService)
        {
            _pessoaService = pessoaService;
        }

        // POST api/pessoas - Cria uma nova pessoa
        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] CriarPessoaDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var pessoa = await _pessoaService.CriarAsync(dto);
                return CreatedAtAction(nameof(BuscarPorId), new { id = pessoa.Id }, pessoa);
            }
            catch
            {
                return StatusCode(500, new { mensagem = "Erro interno ao criar pessoa. Tente novamente." });
            }
        }

        // GET api/pessoas - Lista todas as pessoas
        [HttpGet]
        public async Task<IActionResult> ListarTodas()
        {
            try
            {
                var pessoas = await _pessoaService.ListarTodasAsync();
                return Ok(pessoas);
            }
            catch
            {
                return StatusCode(500, new { mensagem = "Erro interno ao listar pessoas. Tente novamente." });
            }
        }

        // GET api/pessoas/{id} - Busca uma pessoa por ID
        [HttpGet("{id}")]
        public async Task<IActionResult> BuscarPorId(string id)
        {
            try
            {
                var pessoa = await _pessoaService.BuscarPorIdAsync(id);
                if (pessoa == null)
                    return NotFound(new { mensagem = "Pessoa nao encontrada." });

                return Ok(pessoa);
            }
            catch
            {
                return StatusCode(500, new { mensagem = "Erro interno ao buscar pessoa. Tente novamente." });
            }
        }

        // DELETE api/pessoas/{id} - Exclui uma pessoa e todas as suas transacoes
        [HttpDelete("{id}")]
        public async Task<IActionResult> Excluir(string id)
        {
            try
            {
                var excluido = await _pessoaService.ExcluirAsync(id);
                if (!excluido)
                    return NotFound(new { mensagem = "Pessoa nao encontrada." });

                return NoContent();
            }
            catch
            {
                return StatusCode(500, new { mensagem = "Erro interno ao excluir pessoa. Tente novamente." });
            }
        }
    }
}

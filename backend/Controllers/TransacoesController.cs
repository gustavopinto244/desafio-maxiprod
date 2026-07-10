using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly TransacaoService _transacaoService;

        public TransacoesController(TransacaoService transacaoService)
        {
            _transacaoService = transacaoService;
        }

        // POST api/transacoes - Cria uma nova transacao
        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] CriarTransacaoDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var (transacao, erro) = await _transacaoService.CriarAsync(dto);

                if (erro != null)
                    return BadRequest(new { mensagem = erro });

                return CreatedAtAction(nameof(ListarTodas), new { id = transacao!.Id }, transacao);
            }
            catch
            {
                return StatusCode(500, new { mensagem = "Erro interno ao criar transacao. Tente novamente." });
            }
        }

        // GET api/transacoes - Lista todas as transacoes
        [HttpGet]
        public async Task<IActionResult> ListarTodas()
        {
            try
            {
                var transacoes = await _transacaoService.ListarTodasAsync();
                return Ok(transacoes);
            }
            catch
            {
                return StatusCode(500, new { mensagem = "Erro interno ao listar transacoes. Tente novamente." });
            }
        }

        // GET api/transacoes/totais - Consulta de totais por pessoa e total geral
        [HttpGet("totais")]
        public async Task<IActionResult> ConsultarTotais()
        {
            try
            {
                var totais = await _transacaoService.CalcularTotaisGeraisAsync();
                return Ok(totais);
            }
            catch
            {
                return StatusCode(500, new { mensagem = "Erro interno ao calcular totais. Tente novamente." });
            }
        }
    }
}

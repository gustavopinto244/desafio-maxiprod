using System.ComponentModel.DataAnnotations;
using Backend.Enums;

namespace Backend.DTOs
{
    // DTO para criacao de uma nova transacao
    public class CriarTransacaoDto
    {
        [Required(ErrorMessage = "A descricao e obrigatoria.")]
        public string Descricao { get; set; } = string.Empty;

        [Required(ErrorMessage = "O valor e obrigatorio.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser positivo.")]
        public decimal Valor { get; set; }

        [Required(ErrorMessage = "O tipo e obrigatorio.")]
        public TipoTransacao Tipo { get; set; }

        [Required(ErrorMessage = "O PessoaId e obrigatorio.")]
        public string PessoaId { get; set; } = string.Empty;
    }
}

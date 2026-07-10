using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    // DTO para criacao de uma nova pessoa
    public class CriarPessoaDto
    {
        [Required(ErrorMessage = "O nome e obrigatorio.")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "A idade e obrigatoria.")]
        [Range(0, 200, ErrorMessage = "A idade deve ser um valor valido (entre 0 e 200).")]
        public int Idade { get; set; }
    }
}

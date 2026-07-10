namespace Backend.DTOs
{
    // DTO para retornar os totais de uma pessoa (receitas, despesas e saldo)
    public class TotaisPessoaDto
    {
        public string PessoaId { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
        public int Idade { get; set; }
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo { get; set; }
    }
}

namespace Backend.DTOs
{
    // DTO para retornar os totais gerais de todas as pessoas
    public class TotaisGeraisDto
    {
        public List<TotaisPessoaDto> TotaisPorPessoa { get; set; } = new();
        public decimal ReceitaTotalGeral { get; set; }
        public decimal DespesaTotalGeral { get; set; }
        public decimal SaldoLiquidoGeral { get; set; }
    }
}

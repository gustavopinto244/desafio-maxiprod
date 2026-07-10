using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Backend.Enums;

namespace Backend.Models
{
    // Representa uma transacao financeira (receita ou despesa) vinculada a uma pessoa
    // O campo PessoaId e uma referencia (ObjectId) a collection de pessoas
    public class Transacao
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("descricao")]
        public string Descricao { get; set; } = string.Empty;

        [BsonElement("valor")]
        public decimal Valor { get; set; }

        [BsonElement("tipo")]
        [BsonRepresentation(BsonType.String)]
        public TipoTransacao Tipo { get; set; }

        [BsonElement("pessoaId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string PessoaId { get; set; } = string.Empty;
    }
}

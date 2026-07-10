using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models
{
    // Representa uma pessoa cadastrada no sistema
    // Cada pessoa pode ter varias transacoes associadas (relacionamento 1:N)
    public class Pessoa
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("nome")]
        public string Nome { get; set; } = string.Empty;

        [BsonElement("idade")]
        public int Idade { get; set; }
    }
}

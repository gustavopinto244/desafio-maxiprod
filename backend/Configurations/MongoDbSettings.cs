namespace Backend.Configurations
{
    // Classe para mapear as configuracoes do MongoDB vindas do appsettings.json
    public class MongoDbSettings
    {
        public string ConnectionString { get; set; } = string.Empty;
        public string DatabaseName { get; set; } = string.Empty;
    }
}

using MongoDB.Driver;
using Backend.Configurations;
using Backend.Repositories;
using Backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Configuracao do MongoDB Atlas

// A connection string vem do appsettings.json (ou appsettings.Development.json em dev)

// O appsettings.Development.json tem prioridade e esta no .gitignore
// para evitar que a connection string real seja commitada no repositorio
var mongoSettings = builder.Configuration.GetSection("MongoDB").Get<MongoDbSettings>();

if (mongoSettings == null || string.IsNullOrEmpty(mongoSettings.ConnectionString))
{
    Console.WriteLine("ERRO: Connection string do MongoDB nao configurada.");
    Console.WriteLine("Configure a secao 'MongoDB' no appsettings.Development.json");
    return;
}

// Registro de dependencias

// MongoClient como singleton: uma unica instancia para toda a aplicacao
builder.Services.AddSingleton<IMongoClient>(_ =>
    new MongoClient(mongoSettings.ConnectionString));

// IMongoDatabase obtido a partir do client
// Representa o banco "controle-gastos" dentro do cluster do Atlas
builder.Services.AddSingleton<IMongoDatabase>(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase(mongoSettings.DatabaseName);
});

// Repositories: responsaveis pelo acesso direto ao MongoDB
builder.Services.AddSingleton<PessoaRepository>();
builder.Services.AddSingleton<TransacaoRepository>();

// Services: contem a logica de negocio (validacoes, calculos, regras)
builder.Services.AddSingleton<PessoaService>();
builder.Services.AddSingleton<TransacaoService>();

// Configuracao de Controllers para a API REST
builder.Services.AddControllers();

// Configuracao de CORS (Cross-Origin Resource Sharing)
// Permite que o frontend rode no navegador
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Usa os controllers e o CORS
app.UseCors();
app.MapControllers();

app.Run();

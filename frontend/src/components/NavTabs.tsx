import '../styles/nav.css';

interface NavTabsProps {
  abaAtiva: string;
  onTrocarAba: (aba: string) => void;
}

/*
  Componente de navegacao por abas
  Permite alternar entre as tres secoes principais do sistema:
    - Pessoas: cadastro e listagem de pessoas
    - Transacoes: cadastro e listagem de transacoes financeiras
    - Consulta de Totais: visualizacao de receitas, despesas e saldos
*/
export default function NavTabs({ abaAtiva, onTrocarAba }: NavTabsProps) {
  // Configuracoes de cada aba
  const abas = [
    { id: 'pessoas', label: 'Pessoas' },
    { id: 'transacoes', label: 'Transacoes' },
    { id: 'totais', label: 'Consulta de Totais' },
  ];

  return (
    <nav className="nav-tabs">
      {/* Renderiza um botao para cada aba definida no array */}
      {abas.map((aba) => (
        <button
          key={aba.id}
          // Adiciona a classe 'active' se esta for a aba atualmente selecionada
          className={`nav-tab ${abaAtiva === aba.id ? 'active' : ''}`}
          // Ao clicar, chama a funcao onTrocarAba passando o ID desta aba
          onClick={() => onTrocarAba(aba.id)}
        >
          {aba.label}
        </button>
      ))}
    </nav>
  );
}

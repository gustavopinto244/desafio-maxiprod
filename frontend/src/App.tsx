import { useState } from 'react';
import NavTabs from './components/NavTabs';
import PessoasPage from './pages/PessoasPage';
import TransacoesPage from './pages/TransacoesPage';
import TotaisPage from './pages/TotaisPage';
import './styles/global.css';

// Componente principal da aplicacao
function App() {
  // Estado que controla qual aba esta ativa no momento, pessoas e o padrao
  const [abaAtiva, setAbaAtiva] = useState('pessoas');

  return (
    <div className="container">
      <h1>Controle de Gastos Residenciais</h1>

      {/* Componente de navegacao */}
      <NavTabs abaAtiva={abaAtiva} onTrocarAba={setAbaAtiva} />

      {/* Condicional para a aba ativa */}
      {abaAtiva === 'pessoas' && <PessoasPage />}
      {abaAtiva === 'transacoes' && <TransacoesPage />}
      {abaAtiva === 'totais' && <TotaisPage />}
    </div>
  );
}

export default App;

import { useEffect, useState } from 'react';
import api from './api'; // Importando sua configuração do axios

export default function Admin() {
  const [convidados, setConvidados] = useState([]);

  // Função para buscar os dados no seu servidor
  const carregarDados = async () => {
    try {
      const response = await api.get('/guests'); // Lembra? O token já vai no header automaticamente pelo interceptor!
      setConvidados(response.data);
    } catch (err) {
      console.error("Erro ao carregar convidados", err);
    }
  };

  const [stats, setStats] = useState({ total: 0, confirmados: 0, faltantes: 0 });

  const carregarStats = async () => {
    try {
      const response = await api.get('/stats');
      setStats(response.data);
    } catch (err) {
      console.error("Erro ao carregar estatísticas", err);
    }
  };

  useEffect(() => {
    carregarDados();
    carregarStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    // 1. Limpa tudo que guardamos
    localStorage.removeItem('token');
    localStorage.removeItem('cargo');
    
    // 2. Recarrega a página para o sistema ler que o token sumiu
    // Ou use o useNavigate do react-router-dom se preferir
    window.location.href = '/'; 
  };

  const handleToggleCheckin = async (id, statusAtual) => {
    try {
      // Enviamos o contrário do status atual (se era false, vira true)
      await api.patch(`/guests/${id}/checkin`, { status: !statusAtual });
      
      // Atualiza a lista na tela para o usuário ver a bolinha mexer
      carregarDados(); 

      carregarStats();
    } catch (err) {
      alert("Erro ao atualizar!");
    }
  };

  const [novoConvidado, setNovoConvidado] = useState({
    nome: '',
    email: '',
    telefone: '',
    mesa: ''
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1>Painel do Administrador 🔐</h1>  

      <button 
        onClick={() => setIsModalOpen(true)} 
        style={{
          padding: '10px 20px',
          marginBottom: '20px',
          background: '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        + Novo Convidado
      </button>

    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
      <div className="stat-card">Total: {stats.total}</div>
      <div className="stat-card" style={{ color: 'green' }}>Confirmados: {stats.confirmados}</div>
      <div className="stat-card" style={{ color: 'orange' }}>Faltantes: {stats.faltantes}</div>
    </div>  
      
      <table border="1" style={{ width: '100%', marginTop: '100px', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Mesa</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {convidados.map((c) => (
            <tr key={c.id}>
              <td>{c.nome}</td>
              <td>{c.email}</td>
              <td>{c.telefone}</td>
              <td>{c.mesa}</td>
              <td>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={c.status_checkin} 
                    onChange={() => handleToggleCheckin(c.id, c.status_checkin)}
                  />
                  <span className="slider round"></span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    
          
      
    </div>
  );
}
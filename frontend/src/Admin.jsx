import { useEffect, useState } from 'react';
import api from './api'; // Importando sua configuração do axios

export default function Admin() {
  const [convidados, setConvidados] = useState([]);

  useEffect(() => {
    // Função para buscar os dados no seu servidor
    const carregarDados = async () => {
      try {
        const response = await api.get('/guests'); // Lembra? O token já vai no header automaticamente pelo interceptor!
        setConvidados(response.data);
      } catch (err) {
        console.error("Erro ao carregar convidados", err);
      }
    };

    carregarDados();
  }, []);

  const handleLogout = () => {
    // 1. Limpa tudo que guardamos
    localStorage.removeItem('token');
    localStorage.removeItem('cargo');
    
    // 2. Recarrega a página para o sistema ler que o token sumiu
    // Ou use o useNavigate do react-router-dom se preferir
    window.location.href = '/'; 
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Painel do Administrador 🔐</h1>

    <button 
        onClick={handleLogout}
        style={{ 
            backgroundColor: '#ff4d4d', 
            color: 'white', 
            border: 'none', 
            padding: '10px', 
            cursor: 'pointer',
            borderRadius: '5px',
            float: 'right' 
        }}
        >
        Sair do Sistema
    </button>   
      
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
                <button style={{ color: 'red' }}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import { useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const navigate = useNavigate();
  
  // Pegamos as informações direto do "baú" (localStorage)
  const cargo = localStorage.getItem('cargo');
  const nomeUsuario = localStorage.getItem('nome') || 'Usuário';

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
};

  return (
    
    <div className="dashboard-container">
      <aside className="sidebar">
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: '#4f46e5', marginBottom: '5px' }}>Wedding Pass 🥂</h2>
          {/* Exibindo o nome e o cargo dinamicamente */}
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Olá, <strong>{nomeUsuario}</strong></p>
          <span style={{ 
            fontSize: '0.75rem', 
            background: '#e2e8f0', 
            padding: '2px 8px', 
            borderRadius: '10px',
            textTransform: 'lowercase'
          }}>
            {cargo}
          </span>
        </div>
        
        <hr />
      
        <button className="btn-sair" onClick={handleLogout}>Sair</button>
      </aside>

      {/* Conteúdo Principal */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
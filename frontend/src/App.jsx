import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Admin from './Admin';
import Checkin from './Checkin';
import Layout from './Layout';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const token = localStorage.getItem('token');
  const cargo = localStorage.getItem('cargo');

  // Se não estiver logado, qualquer rota manda para o Login
  if (!token) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Layout> 
      <Routes> 
        {/* Rota para o Admin */}
        {cargo === 'ADMIN' && (
          <Route path="/admin" element={<Admin />} />
        )}

        {/* Rota para o Recepcionista */}
        {cargo === 'RECEPCIONISTA' && (
          <Route path="/recepcao" element={<Recepcionista />} />
        )}

        {/* Redirecionamento automático caso a rota não exista ou cargo não bata */}
        <Route 
          path="*" 
          element={<Navigate to={cargo === 'ADMIN' ? "/admin" : "/recepcao"} />} 
        />
      </Routes>
    </Layout>
  );
}

export default App;
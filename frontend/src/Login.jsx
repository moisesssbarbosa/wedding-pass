import React, { useState } from 'react';
import api from './api'; // Importando sua configuração do axios

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await api.post('/login', { email, senha });
    
    // 1. Salva tudo no "baú"
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('cargo', response.data.cargo);
    localStorage.setItem('nome', response.data.nome);

    // 2. O PULO DO GATO: Use window.location.href em vez de navigate
    // Isso força o navegador a recarregar a página já na rota certa, 
    // lendo os dados novos do localStorage.
    if (response.data.cargo === 'ADMIN') {
      window.location.href = '/admin';
    } else {
      window.location.href = '/recepcao';
    }

  } catch (err) {
    alert("Erro ao logar! Verifique suas credenciais.");
  }
};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <form onSubmit={handleLogin} style={{ background: '#333', padding: '30px', borderRadius: '10px' }}>
        <h2 style={{ color: 'white' }}>Wedding Pass - Login</h2>
        <input type="email" placeholder="E-mail" onChange={e => setEmail(e.target.value)} style={{ display: 'block', marginBottom: '10px', padding: '10px', width: '250px' }} />
        <input type="password" placeholder="Senha" onChange={e => setSenha(e.target.value)} style={{ display: 'block', marginBottom: '20px', padding: '10px', width: '250px' }} />
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>Entrar</button>
      </form>
    </div>
  );
};
import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', { email, senha });
      const { token, cargo } = response.data;
      
      // Salva no "cofre" do navegador para não deslogar ao dar F5
      localStorage.setItem('token', token);
      localStorage.setItem('cargo', cargo);
      
      onLogin(token, cargo);
    } catch (err) {
      alert("E-mail ou senha inválidos!");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <form onSubmit={handleSubmit} style={{ background: '#333', padding: '30px', borderRadius: '10px' }}>
        <h2 style={{ color: 'white' }}>Wedding Pass - Login</h2>
        <input type="email" placeholder="E-mail" onChange={e => setEmail(e.target.value)} style={{ display: 'block', marginBottom: '10px', padding: '10px', width: '250px' }} />
        <input type="password" placeholder="Senha" onChange={e => setSenha(e.target.value)} style={{ display: 'block', marginBottom: '20px', padding: '10px', width: '250px' }} />
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>Entrar</button>
      </form>
    </div>
  );
};
"use client";

import React, { useEffect, useState } from 'react';
import api from './api'; // Importando sua configuração do axios
import { Modal, Button, Form, FormLabel } from 'react-bootstrap';
import { PatternFormat } from 'react-number-format'; 

export default function Admin() {
  const [convidados, setConvidados] = useState([]);

  const [novoConvidado, setNovoConvidado] = useState({
    nome: '',
    email: '',
    telefone: '',
    mesa: ''
  });

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Funções para abrir e fechar
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);
  const [editingId, setEditingId] = useState(null);

  const handleEditingClick = (convidado) => {
    setEditingId(convidado.id);
    setNovoConvidado({
      nome: convidado.nome,
      email: convidado.email,
      telefone: convidado.telefone,
      mesa: convidado.mesa      
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await api.put('/convidados/${editingId', novoConvidado);
        alert("Convidado Atualizado!");
      } else {
        await api.post('/convidados', novoConvidado);
        alert("Convidado criado!");
      }
      
      setIsModalOpen(false);
      setEditingId(null);

      // (Opcional) Recarregar a lista de convidados aqui
      carregarDados(); 
      carregarStats();

    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar, verifique o console!");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Painel do Administrador 🔐</h1>  

      {/* Botão que abre o modal */}
      <Button variant="primary" onClick={handleOpen}>
        + Novo Convidado
      </Button>

      <Modal show={isModalOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar Convidado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3' controlId='formNome'>
              <FormLabel>Nome do Convidado</FormLabel>
              <Form.Control
                type="text"
                placeholder="digite o nome completo"
                onChange={(e) => setNovoConvidado({...novoConvidado, nome: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>E-mail</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="exemplo@email.com" 
                value={novoConvidado.email}
                onChange={(e) => setNovoConvidado({...novoConvidado, email: e.target.value})}
              />
            </Form.Group>
            <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3" controlId="formTelefone">
                <Form.Label>Telefone</Form.Label>
                <PatternFormat
                  format='(##) # ####-####'
                  placeholder='(__) _ ____-____'
                  mask="_"
                  customInput={Form.Control}
                  value={novoConvidado.telefone}
                  onValueChange={(values) => { setNovoConvidado({...novoConvidado, telefone: values.value});
                  }}
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3" controlId="formMesa">
                <Form.Label>Mesa</Form.Label>
                <Form.Control 
                  type="number" 
                  placeholder="00" 
                  value={novoConvidado.mesa}
                  onChange={(e) => setNovoConvidado({...novoConvidado, mesa: e.target.value})}
                />
              </Form.Group>
            </div>
          </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', marginTop: '20px' }}>
        <div className="stat-card">Total: {stats.total}</div>
        <div className="stat-card" style={{ color: 'green' }}>Confirmados: {stats.confirmados}</div>
        <div className="stat-card" style={{ color: 'orange' }}>Faltantes: {stats.faltantes}</div>
      </div>  
      
      <table border="1" style={{ width: '100%', marginTop: '100px', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th></th>
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
              <td>
                <button variant="warning" size="sm" onClick={() => handleEditingClick(convidados)}>
                  ✏
                </button>
              </td>
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
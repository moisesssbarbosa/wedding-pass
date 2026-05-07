import api from './api';
import { Form, Button } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import  { useReactToPrint  } from 'react-to-print'// Importando sua configuração do axios

export default function Recepcionista() {

  const [convidados, setConvidados] = useState([]);

  const carregarDados = async () => {
    try {
      const response = await api.get('/guests'); // Lembra? O token já vai no header automaticamente pelo interceptor!
      setConvidados(response.data);
    } catch (err) {
      console.error("Erro ao carregar convidados", err);
    }
  };

  useEffect(() => {
      carregarDados();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  const handleToggleCheckin = async (id, statusAtual) => {
    try {
      // Enviamos o contrário do status atual (se era false, vira true)
      await api.patch(`/guests/${id}/checkin`, { status: !statusAtual });
      
      // Atualiza a lista na tela para o usuário ver a bolinha mexer
      carregarDados(); 
    } catch (err) {
      alert("Erro ao atualizar!");
    }
  };

  const [busca, setBusca] = useState("");

  const convidadosFiltrados = convidados.filter((c) => 
    c.nome.toLowerCase().includes(busca.toLocaleLowerCase()) ||
    c.email.toLowerCase().includes(busca.toLocaleLowerCase()) ||
    String(c.mesa).includes(busca)
  );
 
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Relatório', // Opcional: Define o nome do arquivo
  });

  return (

        <div style={{ padding: '20px' }}>
          <h1 style={{ marginBottom: '40px'}}>Painel do Recepcionista 🔐</h1>   
          
          

          <Form.Control
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            className="mb-3"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <Button onClick={handlePrint}>Gerar PDF</Button> 
    
          <div ref={componentRef}>
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
                {convidadosFiltrados.map((c) => (
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
        </div>
  );
}
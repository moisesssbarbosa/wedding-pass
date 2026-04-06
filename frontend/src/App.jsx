import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [convidados, setConvidados] = useState([])
  // Estados para o formulário
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [mesa, setMesa] = useState('')

  // Função para buscar convidados (vamos usar ela várias vezes)
  const buscarConvidados = () => {
    axios.get('http://localhost:3001/guests')
      .then(res => setConvidados(res.data))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    buscarConvidados()
  }, [])

  // Função para cadastrar
  const handleCadastrar = async (e) => {
    e.preventDefault() // Impede a página de recarregar
    try {
      await axios.post('http://localhost:3001/guests', {
        nome, email, telefone, mesa: Number(mesa)
      })
      alert("Convidado cadastrado!")
      // Limpa os campos
      setNome(''); setEmail(''); setTelefone(''); setMesa('')
      // Atualiza a tabela
      buscarConvidados()
    } catch (err) {
      alert("Erro ao cadastrar. Verifique se o e-mail já existe.")
    }
  }

  const handleCheckin = async (id) => {
  try {
    await axios.patch(`http://localhost:3001/guests/${id}/checkin`);
    buscarConvidados(); // Atualiza a lista para mostrar que confirmou
  } catch (err) {
    alert("Erro ao confirmar presença.");
  }
};

  // Lógica para calcular os números do Dashboard
  const total = convidados.length;
  const confirmados = convidados.filter(c => c.status_checkin).length;
  const pendentes = total - confirmados;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Wedding Pass - Gestão 🥂</h1>

    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
      <div style={{ padding: '15px', background: '#333', color: 'white', borderRadius: '8px', flex: 1 }}>
        <strong>Total:</strong> {total}
      </div>
      <div style={{ padding: '15px', background: '#28a745', color: 'white', borderRadius: '8px', flex: 1 }}>
        <strong>Confirmados:</strong> {confirmados}
      </div>
      <div style={{ padding: '15px', background: '#dc3545', color: 'white', borderRadius: '8px', flex: 1 }}>
        <strong>Pendentes:</strong> {pendentes}
      </div>
    </div>

      {/* FORMULÁRIO DE CADASTRO */}
      <section style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Novo Convidado</h3>
        <form onSubmit={handleCadastrar} style={{ display: 'grid', gap: '10px' }}>
          <input placeholder="Nome Completo" value={nome} onChange={e => setNome(e.target.value)} required />
          <input placeholder="E-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} required />
          <input placeholder="Número da Mesa" type="number" value={mesa} onChange={e => setMesa(e.target.value)} required />
          <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px', cursor: 'pointer' }}>
            Cadastrar Convidado
          </button>
        </form>
      </section>

      {/* TABELA DE LISTAGEM */}
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#333', color: 'white' }}>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Mesa</th>
          </tr>
        </thead>
        <tbody>
          {convidados.map(c => (
            <tr key={c.id} style={{ backgroundColor: c.status_checkin ? '#d4edda' : 'transparent' }}>
              <td style={{ padding: '8px' }}>{c.nome}</td>
              <td style={{ padding: '8px' }}>{c.email}</td>
              <td style={{ padding: '8px' }}>{c.mesa}</td>
              <td style={{ padding: '8px' }}>
                {c.status_checkin ? (
                  <span style={{ color: '#155724', fontWeight: 'bold' }}>✅ Confirmado</span>
                ) : (
                  <button onClick={() => handleCheckin(c.id)}>Confirmar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
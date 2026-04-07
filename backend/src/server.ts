import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient(); // Na v5 isso funciona liso!

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/health', (req, res) => {
  res.json({ message: "Wedding Pass Online e Estável! 🚀" });
});

// Sua rota de convidados
app.get('/guests', async (req, res) => {
  try {
    const guests = await prisma.convidado.findMany();
    res.json(guests);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar convidados" });
  }
});

app.post('/guests', async (req, res) => {
  const { nome, mesa, status_checkin, email, telefone } = req.body;
  try {
    const newGuest = await prisma.convidado.create({
      data: { nome, mesa: Number(mesa), status_checkin: false, email, telefone}
    });
    res.status(201).json(newGuest);
  } catch (error) {
    res.status(400).json({ error: "Erro ao cadastrar convidado." });
  }
});

// Rota para fazer Check-in (Atualizar Status)
app.patch('/guests/:id/checkin', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedGuest = await prisma.convidado.update({
      where: { id: Number(id) },
      data: { status_checkin: true }
    });
    res.json(updatedGuest);
  } catch (error) {
    res.status(400).json({ error: "Erro ao realizar check-in." });
  }
});

app.delete('/guests/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.convidado.delete({
      where: { id: Number(id) }
    });
    res.status(204).send(); // 204 significa "Sucesso, mas não tenho nada para te devolver"
  } catch (error) {
    res.status(400).json({ error: "Erro ao excluir convidado." });
  }
});

app.listen(3001, () => {
  console.log("✅ Servidor rodando em: http://localhost:3001");
});
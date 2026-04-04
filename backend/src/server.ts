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

app.listen(3001, () => {
  console.log("✅ Servidor rodando em: http://localhost:3001");
});
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface RequestComUsuario extends Request {
  user?: any;
}

export const autenticar = (req: RequestComUsuario, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    // Agora o TS aceita porque usamos a nossa interface personalizada
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};

// Esse middleware só deixa passar quem for ADMIN
const verificarAdmin = (req: any, res: Response, next: NextFunction) => {
  // Usamos 'any' no req aqui para o TS não reclamar que o 'user' não existe no padrão
  if (req.user && req.user.cargo === 'ADMIN') {
    return next();
  }
  
  return res.status(403).json({ error: "Acesso negado. Apenas administradores!" });
};

const app = express();
const prisma = new PrismaClient(); // Na v5 isso funciona liso!

// Puxando a chave do ambiente
const SECRET_KEY = process.env.SECRET_KEY || "chave_reserva_caso_o_env_falhe";

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/health', (req, res) => {
  res.json({ message: "Wedding Pass Online e Estável! 🚀" });
});

app.post('/usuarios', async (req, res) => {
  const { email, senha, cargo, nome } = req.body;
  
  // O 10 é o "Salt" (nível de complexidade do embaralhamento)
  const senhaCriptografada = await bcrypt.hash(senha, 10);

  const novoUsuario = await prisma.usuario.create({
    data: {
      email,
      nome,
      cargo,
      senha: senhaCriptografada
    }
  });

  res.json(novoUsuario);
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  // 1. Procura o usuário no banco
  const usuario = await prisma.usuario.findUnique({
    where: { email }
  });

  if (!usuario) {
    return res.status(401).json({ error: "E-mail ou senha incorretos" });
  }

  // 2. Compara a senha digitada com a criptografada no banco
  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  if (!senhaValida) {
    return res.status(401).json({ error: "E-mail ou senha incorretos" });
  }

  // 3. Gera o Token (O "Crachá Digital")
  const token = jwt.sign(
    { id: usuario.id, cargo: usuario.cargo }, 
    SECRET_KEY, 
    { expiresIn: '1d' } // O login vale por 1 dia
  );

  res.json({ token, cargo: usuario.cargo, nome: usuario.nome });
});

// Sua rota de convidados
app.get('/guests', autenticar, async (req, res) => {
  try {
    const guests = await prisma.convidado.findMany();
    res.json(guests);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar convidados" });
  }
});

app.post('/guests', autenticar, verificarAdmin, async (req, res) => {
  const { nome, mesa, status_checkin, email, telefone } = req.body;

  // Validação simples
  if (!nome || !email) {
    return res.status(400).json({ error: "Nome e E-mail são obrigatórios!" });
  }

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
app.patch('/guests/:id/checkin', autenticar, verificarAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // O front vai enviar true ou false aqui

  try {
    const updatedGuest = await prisma.convidado.update({
      where: { id: Number(id) },
      data: { status_checkin: status } 
    });
    res.json(updatedGuest);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar status." });
  }
});

app.delete('/guests/:id', autenticar, verificarAdmin, async (req, res) => {
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



app.get('/stats', autenticar, async (req, res) => {
  const total = await prisma.convidado.count();
  const confirmados = await prisma.convidado.count({
    where: { status_checkin: true }
  });

  res.json({
    total,
    confirmados,
    faltantes: total - confirmados
  });
});

app.listen(3001, () => {
  console.log("✅ Servidor rodando em: http://localhost:3001");
});
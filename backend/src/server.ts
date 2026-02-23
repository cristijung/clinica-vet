import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient(); 

app.use(express.json());
app.use(cors());

interface PetBody {
  nome: string;
  especie: string;
  idade: number;
}

app.get('/pets', async (req: Request, res: Response) => {
  try {
    const pets = await prisma.pet.findMany();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar pets" });
  }
});

app.post('/pets', async (req: Request<{}, {}, PetBody>, res: Response) => {
  const { nome, especie, idade } = req.body;
  try {
    const novoPet = await prisma.pet.create({
      data: { nome, especie, idade },
    });
    res.status(201).json(novoPet);
  } catch (error) {
    res.status(400).json({ error: "Erro ao cadastrar pet" });
  }
});

app.delete('/pets/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.pet.delete({
      where: { id: Number(id) },
    });
    res.status(204).send(); // 204 significa "Ok, mas sem conteúdo para retornar..."
  } catch (error) {
    res.status(400).json({ error: "Erro ao excluir pet. Ele pode não existir mais." });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor clinica-vet ON na porta ${PORT}`);
});
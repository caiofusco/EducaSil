import { Router } from 'express';
import { Curso, ApiResponse } from '../types/index';

const router = Router();

// Dados simulados dos cursos
const cursos: Curso[] = [
  {
    id: 1,
    nome: 'JavaScript Moderno e ES6+',
    descricao: 'Aprenda JavaScript moderno com ES6+, async/await, módulos e muito mais',
    duracao: '40 horas',
    preco: 199.90,
    categoria: 'Programação',
    nivel: 'Intermediário'
  },
  {
    id: 2,
    nome: 'Vue.js Completo',
    descricao: 'Domine o Vue.js do básico ao avançado com projetos práticos',
    duracao: '60 horas',
    preco: 299.90,
    categoria: 'Frontend',
    nivel: 'Iniciante'
  },
  {
    id: 3,
    nome: 'Node.js e Express',
    descricao: 'Construa APIs robustas com Node.js, Express e TypeScript',
    duracao: '50 horas',
    preco: 249.90,
    categoria: 'Backend',
    nivel: 'Intermediário'
  },
  {
    id: 4,
    nome: 'React Avançado',
    descricao: 'Técnicas avançadas do React: Context, Hooks customizados, performance',
    duracao: '45 horas',
    preco: 349.90,
    categoria: 'Frontend',
    nivel: 'Avançado'
  },
  {
    id: 5,
    nome: 'Python para Data Science',
    descricao: 'Análise de dados com Python, Pandas, NumPy e visualizações',
    duracao: '70 horas',
    preco: 399.90,
    categoria: 'Data Science',
    nivel: 'Iniciante'
  },
  {
    id: 6,
    nome: 'DevOps com Docker e Kubernetes',
    descricao: 'Containerização e orquestração de aplicações modernas',
    duracao: '55 horas',
    preco: 459.90,
    categoria: 'DevOps',
    nivel: 'Avançado'
  }
];

// GET /api/cursos - Lista todos os cursos
router.get('/cursos', (req, res) => {
  try {
    const response: ApiResponse<Curso[]> = {
      success: true,
      data: cursos,
      message: 'Cursos carregados com sucesso'
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    const response: ApiResponse<null> = {
      success: false,
      message: 'Erro ao carregar cursos'
    };
    res.status(500).json(response);
  }
});

// GET /api/cursos/:id - Busca um curso específico
router.get('/cursos/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'ID do curso deve ser um número válido'
      };
      return res.status(400).json(response);
    }

    const curso = cursos.find(c => c.id === id);
    
    if (!curso) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Curso não encontrado'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Curso> = {
      success: true,
      data: curso,
      message: 'Curso encontrado'
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao buscar curso:', error);
    const response: ApiResponse<null> = {
      success: false,
      message: 'Erro ao buscar curso'
    };
    res.status(500).json(response);
  }
});

export { router as cursosRouter, cursos };
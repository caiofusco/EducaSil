import { Router } from 'express';
import { MatriculaRequest, MatriculaResponse, ApiResponse } from '../types/index';
import { cursos } from './cursos';

const router = Router();

// Simulação de banco de dados para matrículas
const matriculas: MatriculaResponse[] = [];

// Função para validar email
const validarEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Função para validar dados da matrícula
const validarMatricula = (dados: any): { valido: boolean; erros: string[] } => {
  const erros: string[] = [];

  // Validar nome completo
  if (!dados.nomeCompleto || typeof dados.nomeCompleto !== 'string') {
    erros.push('Nome completo é obrigatório');
  } else if (dados.nomeCompleto.trim().length < 2) {
    erros.push('Nome completo deve ter pelo menos 2 caracteres');
  } else if (dados.nomeCompleto.trim().split(' ').length < 2) {
    erros.push('Por favor, informe o nome completo (nome e sobrenome)');
  }

  // Validar email
  if (!dados.email || typeof dados.email !== 'string') {
    erros.push('Email é obrigatório');
  } else if (!validarEmail(dados.email)) {
    erros.push('Email deve ter um formato válido');
  }

  // Validar curso ID
  if (!dados.cursoId || typeof dados.cursoId !== 'number') {
    erros.push('ID do curso é obrigatório');
  } else {
    const cursoExiste = cursos.find(curso => curso.id === dados.cursoId);
    if (!cursoExiste) {
      erros.push('Curso selecionado não existe');
    }
  }

  return {
    valido: erros.length === 0,
    erros
  };
};

// POST /api/matricula - Realizar matrícula
router.post('/matricula', (req, res) => {
  try {
    const dadosMatricula: MatriculaRequest = req.body;

    // Validar dados recebidos
    const validacao = validarMatricula(dadosMatricula);
    
    if (!validacao.valido) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Dados inválidos para matrícula',
        errors: validacao.erros
      };
      return res.status(400).json(response);
    }

    // Verificar se já existe matrícula para este email e curso
    const matriculaExistente = matriculas.find(
      m => m.email.toLowerCase() === dadosMatricula.email.toLowerCase() && 
           m.curso.id === dadosMatricula.cursoId
    );

    if (matriculaExistente) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Já existe uma matrícula para este email no curso selecionado'
      };
      return res.status(409).json(response);
    }

    // Buscar dados do curso
    const curso = cursos.find(c => c.id === dadosMatricula.cursoId);
    
    if (!curso) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Curso não encontrado'
      };
      return res.status(404).json(response);
    }

    // Criar nova matrícula
    const novaMatricula: MatriculaResponse = {
      id: `MAT${Date.now()}${Math.floor(Math.random() * 1000)}`,
      nomeCompleto: dadosMatricula.nomeCompleto.trim(),
      email: dadosMatricula.email.toLowerCase().trim(),
      curso: curso,
      dataMatricula: new Date(),
      status: 'Confirmada'
    };

    // Simular salvamento no banco
    matriculas.push(novaMatricula);

    console.log(`✅ Nova matrícula realizada:`, {
      id: novaMatricula.id,
      aluno: novaMatricula.nomeCompleto,
      curso: novaMatricula.curso.nome,
      data: novaMatricula.dataMatricula
    });

    const response: ApiResponse<MatriculaResponse> = {
      success: true,
      data: novaMatricula,
      message: 'Matrícula realizada com sucesso!'
    };

    res.status(201).json(response);

  } catch (error) {
    console.error('Erro ao processar matrícula:', error);
    const response: ApiResponse<null> = {
      success: false,
      message: 'Erro interno ao processar matrícula'
    };
    res.status(500).json(response);
  }
});

// GET /api/matriculas - Listar todas as matrículas
router.get('/matriculas', (req, res) => {
  try {
    const response: ApiResponse<MatriculaResponse[]> = {
      success: true,
      data: matriculas,
      message: `${matriculas.length} matrículas encontradas`
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao listar matrículas:', error);
    const response: ApiResponse<null> = {
      success: false,
      message: 'Erro ao listar matrículas'
    };
    res.status(500).json(response);
  }
});

export { router as matriculaRouter };
export interface Curso {
  id: number;
  nome: string;
  descricao: string;
  duracao: string;
  preco: number;
  categoria: string;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
}

export interface MatriculaRequest {
  nomeCompleto: string;
  email: string;
  cursoId: number;
}

export interface MatriculaResponse {
  id: string;
  nomeCompleto: string;
  email: string;
  curso: Curso;
  dataMatricula: Date;
  status: 'Confirmada' | 'Pendente';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}
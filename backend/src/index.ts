import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { cursosRouter } from './routes/cursos';
import { matriculaRouter } from './routes/matricula';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080', 'http://127.0.0.1:3000'],
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Muitas tentativas. Tente novamente em 15 minutos.'
  }
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', cursosRouter);
app.use('/api', matriculaRouter);

app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API funcionando!',
    timestamp: new Date().toISOString()
  });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro:', err.message);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Cursos: http://localhost:${PORT}/api/cursos`);
  console.log(`Matrícula: http://localhost:${PORT}/api/matricula`);
});
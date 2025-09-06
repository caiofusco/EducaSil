#!/bin/bash

echo "Iniciando projeto..."

# Verificar se as dependências estão instaladas
if [ ! -d "backend/node_modules" ]; then
    echo "Dependências do backend não encontradas. Execute ./setup.sh primeiro."
    exit 1
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "Dependências do frontend não encontradas. Execute ./setup.sh primeiro."
    exit 1
fi

# Função para cleanup quando script for interrompido
cleanup() {
    echo ""
    echo "Parando servidores..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Configurar trap para cleanup
trap cleanup SIGINT SIGTERM

echo "Iniciando backend..."
cd backend
npm run dev &
BACKEND_PID=$!

# Aguardar um pouco para o backend iniciar
sleep 3

echo "Iniciando frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Servidores iniciados!"
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo "Acesse a aplicação em: http://localhost:3000"
echo ""
echo "Pressione Ctrl+C para parar os servidores"

# Aguardar processos
wait $BACKEND_PID $FRONTEND_PID
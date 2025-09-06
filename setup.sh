#!/bin/bash

echo "Configurando projeto..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "Node.js não encontrado."
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "npm não encontrado. Por favor, instale o npm antes de continuar."
    exit 1
fi

echo "Node.js $(node --version) encontrado"
echo "npm $(npm --version) encontrado"

# Configurar backend
echo ""
echo "Instalando dependências do backend..."
cd backend
npm install

if [ $? -eq 0 ]; then
    echo "Dependências do backend instaladas com sucesso!"
else
    echo "Erro ao instalar dependências do backend"
    exit 1
fi

# Voltar para raiz
cd ..

# Configurar frontend
echo ""
echo "Instalando dependências do frontend..."
cd frontend
npm install

if [ $? -eq 0 ]; then
    echo "Dependências do frontend instaladas com sucesso!"
else
    echo "Erro ao instalar dependências do frontend"
    exit 1
fi

# Voltar para raiz
cd ..

echo ""
echo "Configuração concluída com sucesso!"
echo ""
echo "Para executar o projeto:"
echo ""
echo "1. Backend (Terminal 1):"
echo "   cd backend"
echo "   npm run dev"
echo "   (API disponível em http://localhost:3001)"
echo ""
echo "2. Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo "   (Aplicação disponível em http://localhost:3000)"
echo ""
echo "Acesse http://localhost:3000 para usar a aplicação!"
echo ""
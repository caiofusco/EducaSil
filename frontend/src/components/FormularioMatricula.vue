<template>
  <div class="formulario-container">
    <h2>📝 Realize sua Matrícula</h2>
    
    <div v-if="erroGeral" class="error-message">
      <p>{{ erroGeral }}</p>
    </div>
    
    <form @submit.prevent="enviarMatricula" novalidate>
      <!-- Seleção de Curso -->
      <div class="form-group">
        <label for="curso" class="form-label">
          <span class="label-icon">📚</span>
          Escolha o Curso *
        </label>
        <select 
          id="curso"
          v-model="formulario.cursoId"
          :class="['form-select', { 'error': erros.cursoId }]"
          @change="limparErro('cursoId')"
          :disabled="enviando"
        >
          <option value="">Selecione um curso</option>
          <option 
            v-for="curso in cursos" 
            :key="curso.id" 
            :value="curso.id"
          >
            {{ curso.nome }} - {{ formatarPreco(curso.preco) }}
          </option>
        </select>
        <div v-if="erros.cursoId" class="error-text">{{ erros.cursoId }}</div>
        
        <!-- Detalhes do curso selecionado -->
        <div v-if="cursoSelecionado" class="curso-detalhes">
          <div class="curso-info">
            <h4>{{ cursoSelecionado.nome }}</h4>
            <p class="curso-descricao">{{ cursoSelecionado.descricao }}</p>
            <div class="curso-meta">
              <span class="meta-item">
                <strong>Duração:</strong> {{ cursoSelecionado.duracao }}
              </span>
              <span class="meta-item">
                <strong>Nível:</strong> 
                <span :class="['nivel', nivelClass(cursoSelecionado.nivel)]">
                  {{ cursoSelecionado.nivel }}
                </span>
              </span>
              <span class="meta-item">
                <strong>Categoria:</strong> {{ cursoSelecionado.categoria }}
              </span>
              <span class="meta-item preco">
                <strong>Investimento:</strong> {{ formatarPreco(cursoSelecionado.preco) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Nome Completo -->
      <div class="form-group">
        <label for="nome" class="form-label">
          <span class="label-icon">👤</span>
          Nome Completo *
        </label>
        <input
          id="nome"
          type="text"
          v-model="formulario.nomeCompleto"
          :class="['form-input', { 'error': erros.nomeCompleto }]"
          placeholder="Digite seu nome completo"
          @input="limparErro('nomeCompleto')"
          @blur="validarNome"
          :disabled="enviando"
          autocomplete="name"
        />
        <div v-if="erros.nomeCompleto" class="error-text">{{ erros.nomeCompleto }}</div>
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="email" class="form-label">
          <span class="label-icon">📧</span>
          Email *
        </label>
        <input
          id="email"
          type="email"
          v-model="formulario.email"
          :class="['form-input', { 'error': erros.email }]"
          placeholder="seu.email@exemplo.com"
          @input="limparErro('email')"
          @blur="validarEmail"
          :disabled="enviando"
          autocomplete="email"
        />
        <div v-if="erros.email" class="error-text">{{ erros.email }}</div>
      </div>

      <!-- Botão de Envio -->
      <button 
        type="submit" 
        :class="['btn-submit', { 'loading': enviando }]"
        :disabled="enviando || !formularioValido"
      >
        <span v-if="!enviando" class="btn-text">
          <span class="btn-icon">🚀</span>
          Confirmar Matrícula
        </span>
        <span v-else class="btn-loading">
          <div class="spinner"></div>
          Processando...
        </span>
      </button>
      
      <p class="form-footer">
        * Campos obrigatórios
      </p>
    </form>
  </div>
</template>

<script>
export default {
  name: 'FormularioMatricula',
  props: {
    cursos: {
      type: Array,
      required: true
    }
  },
  emits: ['matricula-enviada'],
  data() {
    return {
      formulario: {
        nomeCompleto: '',
        email: '',
        cursoId: ''
      },
      erros: {},
      erroGeral: null,
      enviando: false
    }
  },
  computed: {
    cursoSelecionado() {
      return this.cursos.find(curso => curso.id === this.formulario.cursoId)
    },
    formularioValido() {
      return this.formulario.nomeCompleto.trim() && 
             this.formulario.email.trim() && 
             this.formulario.cursoId &&
             Object.keys(this.erros).length === 0
    }
  },
  methods: {
    validarNome() {
      const nome = this.formulario.nomeCompleto.trim()
      
      if (!nome) {
        this.erros.nomeCompleto = 'Nome completo é obrigatório'
      } else if (nome.length < 2) {
        this.erros.nomeCompleto = 'Nome deve ter pelo menos 2 caracteres'
      } else if (nome.split(' ').length < 2) {
        this.erros.nomeCompleto = 'Por favor, informe nome e sobrenome'
      } else {
        delete this.erros.nomeCompleto
      }
    },
    
    validarEmail() {
      const email = this.formulario.email.trim()
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      
      if (!email) {
        this.erros.email = 'Email é obrigatório'
      } else if (!emailRegex.test(email)) {
        this.erros.email = 'Email deve ter um formato válido'
      } else {
        delete this.erros.email
      }
    },
    
    validarCurso() {
      if (!this.formulario.cursoId) {
        this.erros.cursoId = 'Seleção de curso é obrigatória'
      } else {
        delete this.erros.cursoId
      }
    },
    
    limparErro(campo) {
      if (this.erros[campo]) {
        delete this.erros[campo]
      }
      this.erroGeral = null
    },
    
    validarFormulario() {
      this.erros = {}
      
      this.validarNome()
      this.validarEmail() 
      this.validarCurso()
      
      return Object.keys(this.erros).length === 0
    },
    
    async enviarMatricula() {
      if (!this.validarFormulario()) {
        this.erroGeral = 'Por favor, corrija os erros no formulário'
        return
      }
      
      this.enviando = true
      this.erroGeral = null
      
      try {
        const dadosMatricula = {
          nomeCompleto: this.formulario.nomeCompleto.trim(),
          email: this.formulario.email.trim().toLowerCase(),
          cursoId: this.formulario.cursoId
        }
        
        this.$emit('matricula-enviada', dadosMatricula)
        
      } catch (error) {
        console.error('Erro no envio:', error)
        this.erroGeral = 'Erro inesperado. Tente novamente.'
      } finally {
        this.enviando = false
      }
    },
    
    formatarPreco(preco) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(preco)
    },
    
    nivelClass(nivel) {
      const classes = {
        'Iniciante': 'iniciante',
        'Intermediário': 'intermediario', 
        'Avançado': 'avancado'
      }
      return classes[nivel] || ''
    },
    
    mostrarErro(mensagem) {
      this.erroGeral = mensagem
      this.enviando = false
    }
  }
}
</script>

<style scoped>
.formulario-container {
  max-width: 600px;
  margin: 0 auto;
}

.formulario-container h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #374151;
  font-size: 1.8rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 1rem;
}

.label-icon {
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

.form-input,
.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-input.error,
.form-select.error {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.form-input:disabled,
.form-select:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
  opacity: 0.6;
}

.error-text {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  font-weight: 500;
}

.curso-detalhes {
  margin-top: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.curso-info h4 {
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.curso-descricao {
  color: #64748b;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.curso-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}

.meta-item.preco {
  font-size: 1.1rem;
  color: #059669;
  font-weight: 600;
}

.nivel {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}

.nivel.iniciante {
  background: #dcfce7;
  color: #166534;
}

.nivel.intermediario {
  background: #fef3c7;
  color: #92400e;
}

.nivel.avancado {
  background: #fce7f3;
  color: #be185d;
}

.btn-submit {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-text,
.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-icon {
  font-size: 1.2rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-left-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.form-footer {
  text-align: center;
  margin-top: 1rem;
  color: #6b7280;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .formulario-container h2 {
    font-size: 1.5rem;
  }
  
  .curso-meta {
    grid-template-columns: 1fr;
  }
  
  .form-input,
  .form-select {
    padding: 14px 16px;
  }
}
</style>
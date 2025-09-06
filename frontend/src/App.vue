<template>
  <div class="container">
    <div class="header">
      <h1>🎓 EducaSil</h1>
      <p>Transforme sua carreira com nossos cursos online</p>
    </div>
    
    <div class="content">
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>Carregando cursos disponíveis...</p>
      </div>
      
      <div v-else-if="erro" class="error-message">
        <p>{{ erro }}</p>
        <button @click="carregarCursos" class="btn-retry">
          Tentar Novamente
        </button>
      </div>
      
      <div v-else-if="matriculaRealizada" class="success-container">
        <div class="success-message">
          <h3>🎉 Matrícula realizada com sucesso!</h3>
          <p>Parabéns, {{ dadosMatricula.nomeCompleto }}!</p>
          <p>Você foi matriculado no curso <strong>{{ cursoSelecionado?.nome }}</strong></p>
          <p>Em breve você receberá as instruções de acesso no email: <strong>{{ dadosMatricula.email }}</strong></p>
        </div>
        
        <button @click="novaMatricula" class="btn-primary">
          Fazer Nova Matrícula
        </button>
      </div>
      
      <FormularioMatricula 
        v-else
        :cursos="cursos"
        @matricula-enviada="processarMatricula"
      />
    </div>
  </div>
</template>

<script>
import FormularioMatricula from './components/FormularioMatricula.vue'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api'

export default {
  name: 'App',
  components: {
    FormularioMatricula
  },
  data() {
    return {
      cursos: [],
      loading: true,
      erro: null,
      matriculaRealizada: false,
      dadosMatricula: {},
      cursoSelecionado: null
    }
  },
  async mounted() {
    await this.carregarCursos()
  },
  methods: {
    async carregarCursos() {
      this.loading = true
      this.erro = null
      
      try {
        const response = await axios.get(`${API_BASE_URL}/cursos`, {
          timeout: 10000
        })
        
        if (response.data.success) {
          this.cursos = response.data.data
        } else {
          throw new Error(response.data.message || 'Erro ao carregar cursos')
        }
      } catch (error) {
        console.error('Erro ao carregar cursos:', error)
        
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          this.erro = 'Não foi possível conectar ao servidor. Verifique se a API está rodando na porta 3001.'
        } else if (error.code === 'ECONNABORTED') {
          this.erro = 'Timeout: O servidor demorou muito para responder.'
        } else {
          this.erro = error.response?.data?.message || error.message || 'Erro inesperado ao carregar cursos'
        }
      } finally {
        this.loading = false
      }
    },
    
    async processarMatricula(dados) {
      try {
        const response = await axios.post(`${API_BASE_URL}/matricula`, dados, {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (response.data.success) {
          this.dadosMatricula = dados
          this.cursoSelecionado = this.cursos.find(curso => curso.id === dados.cursoId)
          this.matriculaRealizada = true
          
          window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          throw new Error(response.data.message || 'Erro ao realizar matrícula')
        }
      } catch (error) {
        console.error('Erro ao enviar matrícula:', error)
        
        let mensagemErro
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          mensagemErro = 'Não foi possível conectar ao servidor'
        } else if (error.code === 'ECONNABORTED') {
          mensagemErro = 'Timeout: O servidor demorou muito para responder'
        } else if (error.response?.data?.errors) {
          mensagemErro = error.response.data.errors.join(', ')
        } else {
          mensagemErro = error.response?.data?.message || error.message || 'Erro inesperado ao realizar matrícula'
        }
        
        this.$refs.formularioMatricula?.mostrarErro(mensagemErro)
      }
    },
    
    novaMatricula() {
      this.matriculaRealizada = false
      this.dadosMatricula = {}
      this.cursoSelecionado = null
    }
  }
}
</script>

<style scoped>
.success-container {
  text-align: center;
}

.btn-primary {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
}

.btn-retry {
  background: #dc2626;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color 0.2s ease;
}

.btn-retry:hover {
  background: #b91c1c;
}

.success-message h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.success-message p {
  margin-bottom: 0.5rem;
}
</style>
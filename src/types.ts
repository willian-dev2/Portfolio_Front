// Tipos no formato exato que a API Spring Boot devolve

export type Categoria = 'LINGUAGEM' | 'FRAMEWORK' | 'BANCO_DE_DADOS' | 'FERRAMENTA' | 'CLOUD'
export type Nivel = 'BASICO' | 'INTERMEDIARIO' | 'AVANCADO'
export type Contrato = 'CLT' | 'PJ' | 'ESTAGIO' | 'TRAINEE' | 'FREELANCE'
export type Modalidade = 'REMOTO' | 'HIBRIDO' | 'PRESENCIAL'
export type Escolaridade = 'GRADUCAO' | 'GRADUACAO' | 'TECNICO' | 'CURSO' | 'BOOTCAMP' | 'CERTIFICACAO'
export type StatusEscolaridade = 'CURSANDO' | 'CONCLUIDO' | 'TRANCADO'
export type StatusProjeto = 'EM_ANDAMENTO' | 'CONCLUIDO'

export interface Perfil {
  id: number
  nome: string
  titulo: string
  bio: string
  fotoUrl: string | null
  localizacao: string | null
  emailContato: string | null
  gitHubUrl: string | null
  linkedinUrl: string | null
  curriculoPdfUrl: string | null
  disponivel: boolean | null
}

export interface Tecnologia {
  id: number
  nome: string
  icone: string | null
  categoria: Categoria
  nivel: Nivel
  destaque: boolean | null
  ordem: number | null
}

export interface Formacao {
  id: number
  instituicao: string
  curso: string
  tipo: Escolaridade
  status: StatusEscolaridade
  // A API hoje devolve "DataInicio"/"DataFim" (com maiúscula). Aceitamos os dois formatos.
  dataInicio?: string | null
  dataFim?: string | null
  DataInicio?: string | null
  DataFim?: string | null
}

export interface Experiencia {
  id: number
  empresa: string | null
  cargo: string
  tipo: Contrato
  modalidade: Modalidade
  dataInicio: string | null
  dataFim: string | null
  descricao: string
  tecnologias: Tecnologia[]
}

export interface Projeto {
  id: number
  titulo: string
  slug: string | null
  resumo: string
  descricao: string
  arquitetura: string | null
  imagemCapaUrl: string | null
  githubUrl: string | null
  status: StatusProjeto
  destaque: boolean | null
  dataInicial: string | null
  dataFinal: string | null
  tecnologias: Tecnologia[]
}

export interface Resposta<T> {
  dados: T
  ms: number
  status: number
}

export interface Portfolio {
  perfil: Resposta<Perfil[]>
  tecnologias: Resposta<Tecnologia[]>
  formacao: Resposta<Formacao[]>
  experiencia: Resposta<Experiencia[]>
  projetos: Resposta<Projeto[]>
}

// Dados de exemplo, copiados das respostas reais da API.
// Usados só quando VITE_USE_MOCK=true (para ver o site sem a API rodando).
import type { Experiencia, Formacao, Perfil, Projeto, Tecnologia } from './types'

const tecnologias: Tecnologia[] = [
  { id: 1, nome: 'Java', icone: 'java', categoria: 'LINGUAGEM', nivel: 'INTERMEDIARIO', destaque: true, ordem: 1 },
  { id: 2, nome: 'Spring Boot', icone: 'spring', categoria: 'FRAMEWORK', nivel: 'INTERMEDIARIO', destaque: true, ordem: 2 },
  { id: 3, nome: 'Spring Security', icone: 'spring', categoria: 'FRAMEWORK', nivel: 'INTERMEDIARIO', destaque: true, ordem: 3 },
  { id: 4, nome: 'Spring Data JPA', icone: 'spring', categoria: 'FRAMEWORK', nivel: 'INTERMEDIARIO', destaque: false, ordem: 4 },
  { id: 5, nome: 'OpenFeign', icone: 'spring', categoria: 'FRAMEWORK', nivel: 'BASICO', destaque: false, ordem: 5 },
  { id: 6, nome: 'PostgreSQL', icone: 'postgresql', categoria: 'BANCO_DE_DADOS', nivel: 'INTERMEDIARIO', destaque: true, ordem: 6 },
  { id: 7, nome: 'MongoDB', icone: 'mongodb', categoria: 'BANCO_DE_DADOS', nivel: 'BASICO', destaque: false, ordem: 7 },
  { id: 8, nome: 'Docker', icone: 'docker', categoria: 'FERRAMENTA', nivel: 'BASICO', destaque: true, ordem: 8 },
  { id: 9, nome: 'Git', icone: 'git', categoria: 'FERRAMENTA', nivel: 'INTERMEDIARIO', destaque: false, ordem: 9 },
  { id: 10, nome: 'GitHub', icone: 'github', categoria: 'FERRAMENTA', nivel: 'INTERMEDIARIO', destaque: false, ordem: 10 },
  { id: 11, nome: 'Postman', icone: 'postman', categoria: 'FERRAMENTA', nivel: 'INTERMEDIARIO', destaque: false, ordem: 11 },
  { id: 12, nome: 'Swagger', icone: 'swagger', categoria: 'FERRAMENTA', nivel: 'BASICO', destaque: false, ordem: 12 },
  { id: 13, nome: 'Maven', icone: 'maven', categoria: 'FERRAMENTA', nivel: 'BASICO', destaque: false, ordem: 13 },
  { id: 14, nome: 'JWT', icone: null, categoria: 'FERRAMENTA', nivel: 'INTERMEDIARIO', destaque: false, ordem: 14 },
  { id: 15, nome: 'Thymeleaf', icone: null, categoria: 'FRAMEWORK', nivel: 'BASICO', destaque: false, ordem: 15 },
  { id: 16, nome: 'MapStruct', icone: null, categoria: 'FERRAMENTA', nivel: 'BASICO', destaque: false, ordem: 16 },
]

const t = (...ids: number[]) => ids.map((id) => tecnologias.find((x) => x.id === id)!)

const perfil: Perfil[] = [
  {
    id: 1,
    nome: 'Willian Vinicius Sousa do Nascimento',
    titulo: 'Desenvolvedor Back-end Java',
    bio: 'Sou desenvolvedor back-end focado em Java e Spring Boot. Construo APIs REST e microsserviços, cuidando da regra de negócio, da segurança com Spring Security e JWT, da modelagem do banco e da integração entre serviços. Gosto de entender o problema antes de escrever código e de deixar a arquitetura clara para quem vem depois. Atualmente estou na graduação e atuo como trainee, desenvolvendo sistemas distribuídos com Spring Cloud OpenFeign e PostgreSQL.',
    fotoUrl: 'https://github.com/willian-dev2.png',
    localizacao: 'Faro, Portugal',
    emailContato: 'viniciussousaitb35@gmail.com',
    gitHubUrl: 'https://github.com/willian-dev2',
    linkedinUrl: 'https://linkedin.com/in/willian-vinicius-3128b7363',
    curriculoPdfUrl: null,
    disponivel: true,
  },
]

const formacao: Formacao[] = [
  { id: 1, instituicao: 'Universidade do Algarve', curso: 'Engenharia de sistemas e tecnologias informáticas', tipo: 'GRADUCAO', status: 'CURSANDO', DataInicio: null, DataFim: null },
  { id: 2, instituicao: 'JavaNauta', curso: 'Java', tipo: 'TECNICO', status: 'CONCLUIDO', DataInicio: null, DataFim: null },
  { id: 3, instituicao: 'JavaNauta', curso: 'Banco de dados SQL e NoSQL', tipo: 'TECNICO', status: 'CONCLUIDO', DataInicio: null, DataFim: null },
  { id: 4, instituicao: 'Batismo de Java', curso: 'Java10x', tipo: 'TECNICO', status: 'CONCLUIDO', DataInicio: null, DataFim: null },
]

const experiencia: Experiencia[] = [
  {
    id: 1,
    empresa: 'Empresa de tecnologia(confidencial)',
    cargo: 'Trainee de Desenvolvimento Back-end',
    tipo: 'TRAINEE',
    modalidade: 'REMOTO',
    dataInicio: '2026-02-10',
    dataFim: '2026-03-20',
    descricao: 'Desenvolvimento de um sistema de gestão de pedidos em arquitetura de microsserviços com Spring Boot. Criei as APIs de usuários, de produtos e de notificação, e um BFF que orquestra as três via OpenFeign. Implementei autenticação e autorização com Spring Security e JWT, persistência com Spring Data JPA e PostgreSQL, e o envio de e-mails transacionais com templates Thymeleaf.',
    tecnologias: t(6, 1, 5, 15, 3, 14, 2, 4),
  },
]

const projetos: Projeto[] = [
  {
    id: 1,
    titulo: 'Gestão de Pedidos',
    slug: 'gestao-de-pedidos',
    resumo: 'Sistema de pedidos em microsserviços: APIs de usuários, produtos e notificação orquestradas por um BFF com OpenFeign e segurança com JWT.',
    descricao: 'Sistema de gestão de pedidos dividido em serviços independentes, cada um com sua responsabilidade. A API de Usuários cuida do cadastro e da autenticação. A API de Produtos gerencia o catálogo. A API de Notificação envia e-mails ao usuário com templates Thymeleaf. Um BFF (Backend for Frontend) centraliza as chamadas do cliente e orquestra os três serviços, para o front-end conversar com um único ponto de entrada.',
    arquitetura: 'Cliente → BFF → API de Usuários, API de Produtos e API de Notificação. O BFF se comunica com os serviços via Spring Cloud OpenFeign. A autenticação usa Spring Security com JWT: o token é emitido no login e validado nas rotas protegidas. Os dados ficam no PostgreSQL, acessado com Spring Data JPA. A separação em serviços permite evoluir e publicar cada parte de forma independente.',
    imagemCapaUrl: null,
    githubUrl: 'https://github.com/willian-dev2/repositorio',
    status: 'EM_ANDAMENTO',
    destaque: true,
    dataInicial: '2026-08-30',
    dataFinal: null,
    tecnologias: t(5, 6, 14, 4, 1, 3, 2, 15),
  },
  {
    id: 2,
    titulo: 'API do Portfólio',
    slug: 'api-do-portfolio',
    resumo: 'API REST que alimenta este site: conteúdo servido pelo banco, painel admin protegido por JWT e atualização parcial dos dados.',
    descricao: 'API que fornece todo o conteúdo deste portfólio: perfil, tecnologias, formação, experiências e projetos. Nenhum dado fica fixo no front-end; tudo vem do banco. As rotas de leitura são públicas, e as de cadastro, edição e remoção ficam restritas a um administrador autenticado. O cadastro do administrador é travado por um código de configuração e fica bloqueado depois do primeiro registro.',
    arquitetura: 'Monólito em camadas (controller, service, repository) com Spring Boot. Os DTOs são convertidos com MapStruct, e a atualização é parcial: só os campos enviados são alterados. A segurança usa Spring Security e JWT, com um filtro que valida assinatura e expiração do token. CORS configurado por variável de ambiente, banco PostgreSQL rodando em Docker e tratamento global de exceções com respostas padronizadas.',
    imagemCapaUrl: null,
    githubUrl: 'https://github.com/willian-dev2/Portifolio',
    status: 'EM_ANDAMENTO',
    destaque: true,
    dataInicial: '2026-10-03',
    dataFinal: null,
    tecnologias: t(6, 14, 4, 1, 3, 2, 8, 16),
  },
  {
    id: 3,
    titulo: 'Agendador de Tarefas',
    slug: 'agendador-de-tarefas',
    resumo: 'Sistema em microsserviços para agendar tarefas e notificar o usuário por e-mail, com Spring Boot, OpenFeign, JWT, PostgreSQL e MongoDB.',
    descricao: 'Sistema dividido em três serviços independentes. O serviço de Usuário cuida do cadastro, do login com JWT e dos dados de contato (endereços e telefones). O Agendador permite criar, editar, listar e remover tarefas com data de evento, e controla o status de notificação de cada uma (pendente, notificado ou cancelado). Ele também oferece uma busca de tarefas por período, usada para encontrar quais eventos precisam ser notificados. O serviço de Notificação recebe a tarefa e envia ao usuário um e-mail em HTML montado com Thymeleaf.',
    arquitetura: 'Cada serviço é uma aplicação Spring Boot com seu próprio banco: o Usuário usa PostgreSQL com Spring Data JPA, e o Agendador usa MongoDB, mais adequado para documentos de tarefa. O Agendador se comunica com o serviço de Usuário via Spring Cloud OpenFeign para identificar o dono de cada tarefa a partir do token JWT. As rotas são protegidas com Spring Security. Repositórios: usuario, agendador-tarefas e notificacao. Um BFF para centralizar o acesso aos serviços está em desenvolvimento.',
    imagemCapaUrl: null,
    githubUrl: 'https://github.com/willian-dev2/agendador-tarefas',
    status: 'EM_ANDAMENTO',
    destaque: true,
    dataInicial: '2026-01-28',
    dataFinal: null,
    tecnologias: t(5, 6, 14, 4, 1, 3, 2, 15, 7, 16),
  },
  {
    id: 4,
    titulo: 'JobTrack',
    slug: 'jobtrack',
    resumo: 'API para organizar candidaturas a vagas de emprego: cada usuário registra as vagas em que se candidatou e acompanha o status de cada uma.',
    descricao: 'Criei o JobTrack para organizar a minha própria busca de emprego. Depois de se cadastrar e fazer login, o usuário registra cada candidatura com a empresa e o cargo, e a data é gravada automaticamente. Cada candidatura começa como enviada e pode avançar para entrevista, oferta ou rejeitada. O sistema impede registrar duas vezes a mesma vaga na mesma empresa, e cada usuário só vê e altera as próprias candidaturas.',
    arquitetura: 'API REST em camadas (controller, service, repository) com Spring Boot. A autenticação usa Spring Security com JWT: o e-mail do usuário é extraído do token para vincular cada candidatura ao seu dono. As candidaturas têm relacionamento muitos-para-um com o usuário no PostgreSQL, mapeado com Spring Data JPA. Antes de alterar o status, o serviço confere se a candidatura pertence ao usuário autenticado e valida o novo valor contra o enum de status, devolvendo erros tratados por um handler global.',
    imagemCapaUrl: null,
    githubUrl: 'https://github.com/willian-dev2/jobTrack-backend',
    status: 'CONCLUIDO',
    destaque: false,
    dataInicial: '2026-01-16',
    dataFinal: '2026-01-18',
    tecnologias: t(6, 14, 4, 1, 3, 2),
  },
]

export const mock = { perfil, tecnologias, formacao, experiencia, projetos }

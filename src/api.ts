import type { Portfolio, Projeto, Resposta } from './types'
import { mock } from './mock'

export const API_URL: string = (import.meta.env.VITE_API_URL ?? 'http://localhost:9090').replace(/\/$/, '')
export const USANDO_MOCK: boolean = import.meta.env.VITE_USE_MOCK === 'true'

// Rotas públicas da API, na ordem em que aparecem no "API ao vivo"
export const ENDPOINTS = {
  perfil: '/api/perfil',
  tecnologias: '/api/tecnologias',
  experiencia: '/api/experiencia',
  formacao: '/api/formacao',
  projetos: '/api/projetos',
} as const

export type Recurso = keyof typeof ENDPOINTS

export class ErroApi extends Error {
  constructor(public status: number, mensagem: string) {
    super(mensagem)
  }
}

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function get<T>(caminho: string): Promise<Resposta<T>> {
  const inicio = performance.now()

  if (USANDO_MOCK) {
    await esperar(80 + Math.random() * 120)
    const dados = respostaMock(caminho) as T
    if (dados === undefined) throw new ErroApi(404, 'Não encontrado')
    return { dados, ms: Math.round(performance.now() - inicio), status: 200 }
  }

  let resposta: Response
  try {
    resposta = await fetch(API_URL + caminho, { headers: { Accept: 'application/json' } })
  } catch {
    throw new ErroApi(0, 'Não foi possível conectar à API')
  }

  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status}`
    try {
      const corpo = await resposta.json()
      if (corpo?.error) mensagem = corpo.error
    } catch {
      /* corpo sem JSON */
    }
    throw new ErroApi(resposta.status, mensagem)
  }

  const dados = (await resposta.json()) as T
  return { dados, ms: Math.round(performance.now() - inicio), status: resposta.status }
}

function respostaMock(caminho: string): unknown {
  const porId = caminho.match(/^\/api\/buscar-projetos\/(\d+)$/)
  if (porId) return mock.projetos.find((p) => p.id === Number(porId[1]))
  const recurso = (Object.keys(ENDPOINTS) as Recurso[]).find((r) => ENDPOINTS[r] === caminho)
  return recurso ? mock[recurso] : undefined
}

export async function carregarPortfolio(): Promise<Portfolio> {
  const [perfil, tecnologias, formacao, experiencia, projetos] = await Promise.all([
    get<Portfolio['perfil']['dados']>(ENDPOINTS.perfil),
    get<Portfolio['tecnologias']['dados']>(ENDPOINTS.tecnologias),
    get<Portfolio['formacao']['dados']>(ENDPOINTS.formacao),
    get<Portfolio['experiencia']['dados']>(ENDPOINTS.experiencia),
    get<Portfolio['projetos']['dados']>(ENDPOINTS.projetos),
  ])
  return { perfil, tecnologias, formacao, experiencia, projetos }
}

export function buscarProjeto(id: number) {
  return get<Projeto>(`/api/buscar-projetos/${id}`)
}

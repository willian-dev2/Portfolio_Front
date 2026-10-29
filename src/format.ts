import type {
  Categoria, Contrato, Escolaridade, Formacao, Modalidade, Nivel,
  StatusEscolaridade, StatusProjeto, Tecnologia,
} from './types'

// Traduções dos enums da API para o texto que aparece na tela

export const CATEGORIA: Record<Categoria, string> = {
  LINGUAGEM: 'Linguagens',
  FRAMEWORK: 'Frameworks',
  BANCO_DE_DADOS: 'Bancos de dados',
  FERRAMENTA: 'Ferramentas',
  CLOUD: 'Cloud',
}

export const NIVEL: Record<Nivel, { texto: string; valor: number }> = {
  BASICO: { texto: 'Básico', valor: 1 },
  INTERMEDIARIO: { texto: 'Intermediário', valor: 2 },
  AVANCADO: { texto: 'Avançado', valor: 3 },
}

export const CONTRATO: Record<Contrato, string> = {
  CLT: 'CLT',
  PJ: 'PJ',
  ESTAGIO: 'Estágio',
  TRAINEE: 'Trainee',
  FREELANCE: 'Freelance',
}

export const MODALIDADE: Record<Modalidade, string> = {
  REMOTO: 'Remoto',
  HIBRIDO: 'Híbrido',
  PRESENCIAL: 'Presencial',
}

export const ESCOLARIDADE: Record<Escolaridade, string> = {
  GRADUCAO: 'Graduação',
  GRADUACAO: 'Graduação',
  TECNICO: 'Formação técnica',
  CURSO: 'Curso',
  BOOTCAMP: 'Bootcamp',
  CERTIFICACAO: 'Certificação',
}

export const STATUS_ESCOLARIDADE: Record<StatusEscolaridade, { texto: string; tom: Tom }> = {
  CURSANDO: { texto: 'Cursando', tom: 'andamento' },
  CONCLUIDO: { texto: 'Concluído', tom: 'concluido' },
  TRANCADO: { texto: 'Trancado', tom: 'neutro' },
}

export const STATUS_PROJETO: Record<StatusProjeto, { texto: string; tom: Tom }> = {
  EM_ANDAMENTO: { texto: 'Em andamento', tom: 'andamento' },
  CONCLUIDO: { texto: 'Concluído', tom: 'concluido' },
}

export type Tom = 'andamento' | 'concluido' | 'neutro'

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

// "2026-02-10" -> "fev 2026" (sem usar Date, para não sofrer com fuso horário)
export function mesAno(data: string | null | undefined): string | null {
  if (!data) return null
  const [ano, mes] = data.split('-')
  const nome = MESES.at(Number(mes) - 1)
  return nome && ano ? `${nome} ${ano}` : null
}

export function periodo(inicio?: string | null, fim?: string | null, atualTexto = 'atual'): string | null {
  const a = mesAno(inicio)
  const b = fim ? mesAno(fim) : atualTexto
  if (!a) return fim ? mesAno(fim) : null
  return `${a} — ${b}`
}

export function duracao(inicio?: string | null, fim?: string | null): string | null {
  if (!inicio) return null
  const [ai, mi] = inicio.split('-').map(Number)
  const hoje = new Date()
  const [af, mf] = fim ? fim.split('-').map(Number) : [hoje.getFullYear(), hoje.getMonth() + 1]
  // contagem inclusiva, como no LinkedIn: fev a mar = 2 meses
  const meses = Math.max(1, (af - ai) * 12 + (mf - mi) + 1)
  if (meses < 12) return `${meses} ${meses === 1 ? 'mês' : 'meses'}`
  const anos = Math.floor(meses / 12)
  const resto = meses % 12
  return `${anos} ${anos === 1 ? 'ano' : 'anos'}${resto ? ` e ${resto} ${resto === 1 ? 'mês' : 'meses'}` : ''}`
}

export function datasFormacao(f: Formacao) {
  return { inicio: f.dataInicio ?? f.DataInicio ?? null, fim: f.dataFim ?? f.DataFim ?? null }
}

export function porOrdem(a: Tecnologia, b: Tecnologia) {
  return (a.ordem ?? 999) - (b.ordem ?? 999) || a.nome.localeCompare(b.nome)
}

export function tecnologiasOrdenadas(lista: Tecnologia[] | null | undefined) {
  return [...(lista ?? [])].sort(porOrdem)
}

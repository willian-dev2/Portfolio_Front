import { useState, type ReactNode } from 'react'
import { API_URL, ENDPOINTS, USANDO_MOCK, get, type Recurso } from '../api'
import type { Portfolio } from '../types'
import { Secao } from './ui'

// Pinta um JSON com cores (chaves, textos, números, booleanos)
function colorir(json: string): ReactNode[] {
  const partes: ReactNode[] = []
  const regex = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?)/g
  let ultimo = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = regex.exec(json))) {
    if (m.index > ultimo) partes.push(json.slice(ultimo, m.index))
    if (m[1]) {
      partes.push(
        <span key={i++} className={m[2] ? 'j-chave' : 'j-texto'}>
          {m[1]}
        </span>,
      )
      if (m[2]) partes.push(m[2])
    } else if (m[3]) partes.push(<span key={i++} className="j-literal">{m[3]}</span>)
    else if (m[4]) partes.push(<span key={i++} className="j-numero">{m[4]}</span>)
    ultimo = regex.lastIndex
  }
  partes.push(json.slice(ultimo))
  return partes
}

export function ApiAoVivo({ dados }: { dados: Portfolio }) {
  const [recurso, setRecurso] = useState<Recurso>('perfil')
  const [respostas, setRespostas] = useState<Record<Recurso, { corpo: unknown; ms: number; status: number }>>(() => ({
    perfil: { corpo: dados.perfil.dados, ms: dados.perfil.ms, status: dados.perfil.status },
    tecnologias: { corpo: dados.tecnologias.dados, ms: dados.tecnologias.ms, status: dados.tecnologias.status },
    experiencia: { corpo: dados.experiencia.dados, ms: dados.experiencia.ms, status: dados.experiencia.status },
    formacao: { corpo: dados.formacao.dados, ms: dados.formacao.ms, status: dados.formacao.status },
    projetos: { corpo: dados.projetos.dados, ms: dados.projetos.ms, status: dados.projetos.status },
  }))
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function requisitar() {
    setCarregando(true)
    setErro(null)
    try {
      const r = await get<unknown>(ENDPOINTS[recurso])
      setRespostas((atual) => ({ ...atual, [recurso]: { corpo: r.dados, ms: r.ms, status: r.status } }))
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha na requisição')
    } finally {
      setCarregando(false)
    }
  }

  const atual = respostas[recurso]
  const texto = JSON.stringify(atual.corpo, null, 2)
  const itens = Array.isArray(atual.corpo) ? atual.corpo.length : null

  return (
    <Secao id="api" rotulo="06 · api ao vivo" titulo="Este site é servido pela minha API">
      <p className="secao-intro">
        Nada nesta página está escrito no front-end: perfil, tecnologias, experiências e projetos vêm de uma API REST em
        Spring Boot com PostgreSQL. Escolha um endpoint e veja a resposta real.
        {USANDO_MOCK && <em> (Modo demonstração: dados de exemplo.)</em>}
      </p>

      <div className="console">
        <div className="console-abas" role="tablist" aria-label="Endpoints">
          {(Object.keys(ENDPOINTS) as Recurso[]).map((r) => (
            <button
              key={r}
              type="button"
              role="tab"
              aria-selected={recurso === r}
              className={recurso === r ? 'ativo' : ''}
              onClick={() => {
                setRecurso(r)
                setErro(null)
              }}
            >
              {ENDPOINTS[r]}
            </button>
          ))}
        </div>

        <div className="console-requisicao">
          <span className="metodo">GET</span>
          <code className="url">
            {USANDO_MOCK ? 'http://localhost:9090' : API_URL}
            {ENDPOINTS[recurso]}
          </code>
          <button type="button" className="botao botao-primario botao-pequeno" onClick={requisitar} disabled={carregando}>
            {carregando ? 'Enviando…' : 'Enviar'}
          </button>
        </div>

        <div className="console-status" aria-live="polite">
          {erro ? (
            <span className="status-erro">{erro}</span>
          ) : (
            <>
              <span className="status-ok">
                {atual.status} OK
              </span>
              <span>{atual.ms} ms</span>
              {itens !== null && (
                <span>
                  {itens} {itens === 1 ? 'item' : 'itens'}
                </span>
              )}
              <span>application/json</span>
            </>
          )}
        </div>

        <pre className="console-corpo" tabIndex={0}>
          <code>{colorir(texto)}</code>
        </pre>
      </div>
    </Secao>
  )
}

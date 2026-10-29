import { useState, type ReactNode } from 'react'
import type { Tecnologia } from '../types'
import type { Tom } from '../format'

// ---------- Ícones (SVG inline, sem biblioteca) ----------

const caminhos = {
  github:
    'M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z',
  linkedin:
    'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z',
}

type NomeIcone = 'github' | 'linkedin' | 'mail' | 'copiar' | 'ok' | 'seta' | 'externo' | 'local' | 'arquivo' | 'voltar' | 'menu' | 'fechar'

export function Icone({ nome, tamanho = 18 }: { nome: NomeIcone; tamanho?: number }) {
  const p = { width: tamanho, height: tamanho, viewBox: '0 0 24 24', 'aria-hidden': true }
  if (nome === 'github' || nome === 'linkedin')
    return (
      <svg {...p} fill="currentColor">
        <path d={caminhos[nome]} />
      </svg>
    )
  const traco = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const formas: Record<string, ReactNode> = {
    mail: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>),
    copiar: (<><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></>),
    ok: <path d="m5 12.5 4.5 4.5L19 7.5" />,
    seta: <path d="M5 12h14m-6-6 6 6-6 6" />,
    voltar: <path d="M19 12H5m6-6-6 6 6 6" />,
    externo: (<><path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>),
    local: (<><path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>),
    arquivo: (<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    fechar: <path d="M6 6l12 12M18 6 6 18" />,
  }
  return (
    <svg {...p} {...traco}>
      {formas[nome]}
    </svg>
  )
}

// ---------- Ícone de tecnologia (Devicon), com monograma se não houver ----------

export function IconeTecnologia({ tec, tamanho = 22 }: { tec: Pick<Tecnologia, 'nome' | 'icone'>; tamanho?: number }) {
  const [falhou, setFalhou] = useState(false)
  if (!tec.icone || falhou) {
    const sigla = tec.nome.replace(/[^A-Za-z0-9 ]/g, '').split(' ').map((p) => p[0]).join('').slice(0, 3)
    return (
      <span className="monograma" style={{ width: tamanho, height: tamanho, fontSize: tamanho * 0.38 }} aria-hidden>
        {sigla}
      </span>
    )
  }
  const url = `https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/${tec.icone}/${tec.icone}-original.svg`
  return (
    <img
      className={`icone-tec ${tec.icone === 'github' ? 'inverter' : ''}`}
      src={url}
      alt=""
      width={tamanho}
      height={tamanho}
      loading="lazy"
      onError={() => setFalhou(true)}
    />
  )
}

export function ChipTecnologia({ tec, ativo, onClick }: { tec: Tecnologia; ativo?: boolean; onClick?: () => void }) {
  const conteudo = (
    <>
      <IconeTecnologia tec={tec} tamanho={14} />
      {tec.nome}
    </>
  )
  return onClick ? (
    <button type="button" className={`chip ${ativo ? 'ativo' : ''}`} onClick={onClick}>
      {conteudo}
    </button>
  ) : (
    <span className="chip">{conteudo}</span>
  )
}

export function Selo({ tom, children }: { tom: Tom; children: ReactNode }) {
  return <span className={`selo selo-${tom}`}>{children}</span>
}

export function Secao({ id, rotulo, titulo, children }: { id: string; rotulo: string; titulo: string; children: ReactNode }) {
  return (
    <section id={id} className="secao">
      <div className="container">
        <p className="rotulo">{rotulo}</p>
        <h2 className="titulo-secao">{titulo}</h2>
        {children}
      </div>
    </section>
  )
}

export function BotaoCopiar({ texto, rotulo = 'Copiar' }: { texto: string; rotulo?: string }) {
  const [copiado, setCopiado] = useState(false)
  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto)
    } catch {
      const campo = document.createElement('textarea')
      campo.value = texto
      document.body.appendChild(campo)
      campo.select()
      document.execCommand('copy')
      campo.remove()
    }
    setCopiado(true)
    setTimeout(() => setCopiado(false), 1800)
  }
  return (
    <button type="button" className="botao botao-fantasma" onClick={copiar} aria-live="polite">
      <Icone nome={copiado ? 'ok' : 'copiar'} tamanho={16} />
      {copiado ? 'Copiado' : rotulo}
    </button>
  )
}

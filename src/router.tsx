// Roteador mínimo (sem dependência extra): "/" e "/projetos/:id"
import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react'

const ouvintes = new Set<() => void>()

function lerCaminho() {
  const caminho = window.location.pathname
  // Abrir o arquivo index.html diretamente conta como a página inicial
  return caminho.endsWith('.html') ? '/' : caminho
}

let caminhoAtual = typeof window !== 'undefined' ? lerCaminho() : '/'

function avisar() {
  ouvintes.forEach((ouvinte) => ouvinte())
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    caminhoAtual = lerCaminho()
    avisar()
  })
}

function assinar(callback: () => void) {
  ouvintes.add(callback)
  return () => {
    ouvintes.delete(callback)
  }
}

export function useCaminho(): string {
  return useSyncExternalStore(assinar, () => caminhoAtual, () => '/')
}

export function navegar(destino: string) {
  const [caminho, ancora] = destino.split('#')
  const novo = caminho || '/'

  if (novo !== caminhoAtual) {
    caminhoAtual = novo
    try {
      window.history.pushState({}, '', novo)
    } catch {
      // ambientes de pré-visualização podem bloquear o histórico; a navegação continua em memória
    }
    avisar()
    if (!ancora) window.scrollTo({ top: 0 })
  }

  if (ancora) {
    // espera a página nova renderizar antes de rolar até a seção
    requestAnimationFrame(() =>
      setTimeout(() => document.getElementById(ancora)?.scrollIntoView({ behavior: 'smooth' }), 30),
    )
  }
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { para: string }

export function Link({ para, onClick, children, ...resto }: LinkProps) {
  function aoClicar(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
    e.preventDefault()
    navegar(para)
  }
  return (
    <a href={para} onClick={aoClicar} {...resto}>
      {children}
    </a>
  )
}

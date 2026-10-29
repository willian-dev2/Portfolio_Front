// Canvas fixo atrás da página. Lê a rolagem de cada capítulo e desenha a cena correspondente.
import { useEffect, useRef } from 'react'
import type { Tecnologia } from '../types'
import { CenaNome, CenaStack, CenaViagem, Fundo, limitar, type Ponteiro } from './motor'

export const CAPITULOS = ['cap-nome', 'cap-viagem', 'cap-stack'] as const

// A página inicial escuta este evento para filtrar os projetos pela tecnologia clicada
export const EVENTO_TECNOLOGIA = 'portfolio:tecnologia'

interface Props {
  nome: string
  tecnologias: Tecnologia[]
}

export function Palco({ nome: nomeCompleto, tecnologias }: Props) {
  const telaRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const tela = telaRef.current!
    const ctx = tela.getContext('2d')!
    const camada = document.createElement('canvas')
    const ctxCamada = camada.getContext('2d')!
    const movimento = !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const partes = nomeCompleto.trim().split(/\s+/)
    const linhasNome = partes.length > 1 ? [partes[0], partes[partes.length - 1]] : partes
    const fundo = new Fundo()
    const nome = new CenaNome()
    const viagem = new CenaViagem()
    const stack = new CenaStack()
    stack.montar(tecnologias)

    const ponteiro: Ponteiro = { x: -999, y: -999, ativo: false }
    let w = 0
    let h = 0
    let dpr = 1
    let passoNome = 4
    let fontesProntas = false
    let tecSobPonteiro: Tecnologia | null = null
    let quadro = 0

    function redimensionar() {
      w = window.innerWidth
      h = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, w < 700 ? 1.5 : 2)
      for (const c of [tela, camada]) {
        c.width = Math.round(w * dpr)
        c.height = Math.round(h * dpr)
      }
      tela.style.width = `${w}px`
      tela.style.height = `${h}px`
      if (fontesProntas && nome.precisaRemontar(w)) passoNome = nome.montar(linhasNome, w, h, false)
    }

    redimensionar()
    // espera as fontes carregarem para desenhar o nome com a fonte certa
    const fontes = document.fonts?.ready ?? Promise.resolve()
    Promise.race([fontes, new Promise((r) => setTimeout(r, 1500))]).then(() => {
      fontesProntas = true
      passoNome = nome.montar(linhasNome, w, h, movimento)
    })

    // os capítulos são procurados a cada quadro, porque a página inicial pode sair e voltar
    const cachePassos = new WeakMap<HTMLElement, HTMLElement[]>()
    const passosDe = (cap: HTMLElement) => {
      let lista = cachePassos.get(cap)
      if (!lista) {
        lista = Array.from(cap.querySelectorAll<HTMLElement>('[data-de]'))
        cachePassos.set(cap, lista)
      }
      return lista
    }

    function cena(i: number, alvo: CanvasRenderingContext2D, t: number, p: number) {
      if (i === 0) {
        if (fontesProntas) nome.desenhar(alvo, w, h, p, ponteiro, passoNome)
      } else if (i === 1) viagem.desenhar(alvo, w, h, t, p)
      else {
        const tec = stack.desenhar(alvo, w, h, t, p, ponteiro)
        tecSobPonteiro = tec
      }
    }

    function desenhar(agora: number) {
      quadro = requestAnimationFrame(desenhar)
      if (document.hidden) return
      const t = movimento ? agora / 1000 : 0
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      fundo.desenhar(ctx, w, h, t, window.scrollY)

      let stackVisivel = false
      CAPITULOS.forEach((id, i) => {
        const cap = document.getElementById(id)
        if (!cap) return
        const r = cap.getBoundingClientRect()
        const p = limitar(-r.top / Math.max(1, r.height - h))
        cap.style.setProperty('--p', p.toFixed(3))
        passosDe(cap).forEach((el) => {
          const de = Number(el.dataset.de)
          const ate = el.dataset.ate ? Number(el.dataset.ate) : 2
          el.classList.toggle('visivel', p >= de && p < ate)
        })

        // transparência ao entrar e sair do capítulo
        let alfa = 1
        if (r.top > 0) alfa = 1 - r.top / h
        if (r.bottom < h) alfa = r.bottom / h
        alfa = limitar(alfa)
        if (alfa <= 0.01) return
        if (i === 2) stackVisivel = alfa > 0.9

        if (alfa >= 0.99) cena(i, ctx, t, p)
        else {
          ctxCamada.setTransform(1, 0, 0, 1, 0, 0)
          ctxCamada.clearRect(0, 0, camada.width, camada.height)
          ctxCamada.setTransform(dpr, 0, 0, dpr, 0, 0)
          cena(i, ctxCamada, t, p)
          ctx.setTransform(1, 0, 0, 1, 0, 0)
          ctx.globalAlpha = alfa
          ctx.drawImage(camada, 0, 0)
          ctx.globalAlpha = 1
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }
      })

      if (!stackVisivel) tecSobPonteiro = null
      document.body.classList.toggle('sobre-bloco', !!tecSobPonteiro)
    }
    quadro = requestAnimationFrame(desenhar)

    const aoMover = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      ponteiro.x = e.clientX
      ponteiro.y = e.clientY
      ponteiro.ativo = true
    }
    const aoSair = () => {
      ponteiro.ativo = false
    }
    const aoClicar = (e: MouseEvent) => {
      const alvo = e.target as HTMLElement
      if (tecSobPonteiro && !alvo.closest('a, button, input, textarea'))
        window.dispatchEvent(new CustomEvent(EVENTO_TECNOLOGIA, { detail: tecSobPonteiro }))
    }
    let espera: number | undefined
    const aoRedimensionar = () => {
      clearTimeout(espera)
      espera = window.setTimeout(redimensionar, 120)
    }

    window.addEventListener('pointermove', aoMover, { passive: true })
    document.addEventListener('pointerleave', aoSair)
    window.addEventListener('click', aoClicar)
    window.addEventListener('resize', aoRedimensionar)
    return () => {
      cancelAnimationFrame(quadro)
      window.removeEventListener('pointermove', aoMover)
      document.removeEventListener('pointerleave', aoSair)
      window.removeEventListener('click', aoClicar)
      window.removeEventListener('resize', aoRedimensionar)
      document.body.classList.remove('sobre-bloco')
    }
  }, [nomeCompleto, tecnologias])

  return <canvas ref={telaRef} className="palco" aria-hidden />
}

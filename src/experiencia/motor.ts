// Motor das cenas desenhadas em canvas (sem bibliotecas).
// Cada cena é uma função pura de (tempo, progresso da rolagem): rolar para trás desfaz a animação.
import type { Categoria, Tecnologia } from '../types'

export const limitar = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const suave = (v: number) => {
  const x = limitar(v)
  return x * x * (3 - 2 * x)
}
export const entrarRapido = (v: number) => 1 - Math.pow(1 - limitar(v), 3)
const entrarComSalto = (v: number) => {
  const x = limitar(v)
  const c = 1.6
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2)
}

// Gerador pseudoaleatório com semente: as cenas ficam iguais a cada visita
export function aleatorio(semente = 7) {
  let s = semente
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export const CORES = {
  ciano: '#4de1ff',
  violeta: '#9a7bff',
  magenta: '#ff5fd2',
  ambar: '#ffc861',
  verde: '#59f2a5',
}

export const COR_CATEGORIA: Record<Categoria, string> = {
  LINGUAGEM: '#ffc861',
  FRAMEWORK: '#4de1ff',
  BANCO_DE_DADOS: '#59f2a5',
  FERRAMENTA: '#9a7bff',
  CLOUD: '#ff5fd2',
}

export interface Ponteiro {
  x: number
  y: number
  ativo: boolean
}

// ================== Fundo: estrelas e símbolos de código flutuando ==================

export class Fundo {
  private estrelas: { x: number; y: number; z: number }[] = []
  private glifos: { x: number; y: number; v: number; s: string; t: number }[] = []

  constructor() {
    const r = aleatorio(11)
    for (let i = 0; i < 260; i++) this.estrelas.push({ x: r(), y: r(), z: 0.2 + r() * 0.8 })
    const simbolos = ['{ }', '</>', '=>', '200', '@', ';', 'GET', '[ ]', '&&', 'SQL', '0x1F', '//']
    for (let i = 0; i < 22; i++)
      this.glifos.push({ x: r(), y: r(), v: 0.004 + r() * 0.01, s: simbolos[i % simbolos.length], t: 10 + r() * 8 })
  }

  desenhar(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, rolagem: number) {
    const fundo = ctx.createLinearGradient(0, 0, 0, h)
    fundo.addColorStop(0, '#03040b')
    fundo.addColorStop(1, '#070818')
    ctx.fillStyle = fundo
    ctx.fillRect(0, 0, w, h)

    for (const e of this.estrelas) {
      const y = (((e.y * h - rolagem * 0.08 * e.z) % h) + h) % h
      const brilho = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 1.3 + e.x * 40))
      ctx.globalAlpha = e.z * brilho * 0.8
      ctx.fillStyle = e.z > 0.8 ? CORES.ciano : '#c9d6ff'
      const s = e.z > 0.75 ? 2 : 1
      ctx.fillRect(e.x * w, y, s, s)
    }

    ctx.font = '500 12px "JetBrains Mono", monospace'
    for (const g of this.glifos) {
      const y = ((((g.y - t * g.v) * h - rolagem * 0.15) % h) + h) % h
      ctx.globalAlpha = 0.08
      ctx.fillStyle = CORES.violeta
      ctx.fillText(g.s, g.x * w, y)
    }
    ctx.globalAlpha = 1
  }
}

// ================== Cena 1: o nome feito de partículas, que explode ao rolar ==================

export class CenaNome {
  private alvoX = new Float32Array(0)
  private alvoY = new Float32Array(0)
  private x = new Float32Array(0)
  private y = new Float32Array(0)
  private vx = new Float32Array(0)
  private vy = new Float32Array(0)
  private dirX = new Float32Array(0)
  private dirY = new Float32Array(0)
  private prof = new Float32Array(0)
  private cor: string[] = []
  private n = 0
  private largura = 0

  montar(linhas: string[], w: number, h: number, movimento: boolean) {
    this.largura = w
    const tela = document.createElement('canvas')
    tela.width = Math.ceil(w)
    tela.height = Math.ceil(h)
    const c = tela.getContext('2d', { willReadFrequently: true })!
    const maior = linhas.reduce((a, b) => (b.length > a.length ? b : a), '')
    let tamanho = Math.min(150, h * 0.17)
    c.font = `700 ${tamanho}px "Space Grotesk", system-ui, sans-serif`
    const medida = c.measureText(maior.toUpperCase()).width
    tamanho = Math.min(tamanho, (tamanho * (w * 0.88)) / medida)
    c.font = `700 ${tamanho}px "Space Grotesk", system-ui, sans-serif`
    c.textAlign = 'center'
    c.textBaseline = 'middle'
    c.fillStyle = '#fff'
    const altura = tamanho * 1.02
    const centro = h * 0.4
    linhas.forEach((l, i) => c.fillText(l.toUpperCase(), w / 2, centro + (i - (linhas.length - 1) / 2) * altura))

    const passo = Math.max(3, Math.round(tamanho / 26))
    const dados = c.getImageData(0, 0, tela.width, tela.height).data
    const ax: number[] = []
    const ay: number[] = []
    for (let py = 0; py < tela.height; py += passo)
      for (let px = 0; px < tela.width; px += passo)
        if (dados[(py * tela.width + px) * 4 + 3] > 140) {
          ax.push(px)
          ay.push(py)
        }

    const r = aleatorio(3)
    this.n = ax.length
    this.alvoX = Float32Array.from(ax)
    this.alvoY = Float32Array.from(ay)
    this.x = new Float32Array(this.n)
    this.y = new Float32Array(this.n)
    this.vx = new Float32Array(this.n)
    this.vy = new Float32Array(this.n)
    this.dirX = new Float32Array(this.n)
    this.dirY = new Float32Array(this.n)
    this.prof = new Float32Array(this.n)
    this.cor = []
    for (let i = 0; i < this.n; i++) {
      this.x[i] = movimento ? r() * w : ax[i]
      this.y[i] = movimento ? r() * h : ay[i]
      const ang = r() * Math.PI * 2
      // as partículas se espalham para fora, a partir do centro do nome
      const ox = ax[i] - w / 2
      const oy = ay[i] - centro
      const len = Math.hypot(ox, oy) || 1
      this.dirX[i] = ox / len + Math.cos(ang) * 0.6
      this.dirY[i] = oy / len + Math.sin(ang) * 0.6
      this.prof[i] = 0.4 + r() * 1.4
      const mistura = ax[i] / w
      this.cor.push(mistura < 0.5 ? (r() > 0.85 ? CORES.violeta : CORES.ciano) : r() > 0.8 ? CORES.ciano : CORES.violeta)
    }
    return passo
  }

  desenhar(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, ponteiro: Ponteiro, passo: number) {
    const explosao = suave((p - 0.18) / 0.62)
    const alcance = Math.max(w, h) * 0.9
    const raio = Math.min(110, w * 0.12)
    const tam = Math.max(2, passo - 1)

    for (let i = 0; i < this.n; i++) {
      let vx = this.vx[i] + (this.alvoX[i] - this.x[i]) * 0.045
      let vy = this.vy[i] + (this.alvoY[i] - this.y[i]) * 0.045
      if (ponteiro.ativo && explosao < 0.05) {
        const dx = this.x[i] - ponteiro.x
        const dy = this.y[i] - ponteiro.y
        const d2 = dx * dx + dy * dy
        if (d2 < raio * raio) {
          const d = Math.sqrt(d2) || 1
          const forca = ((raio - d) / raio) * 5.5
          vx += (dx / d) * forca
          vy += (dy / d) * forca
        }
      }
      vx *= 0.8
      vy *= 0.8
      this.vx[i] = vx
      this.vy[i] = vy
      this.x[i] += vx
      this.y[i] += vy

      const k = this.prof[i]
      const px = this.x[i] + this.dirX[i] * explosao * alcance * k
      const py = this.y[i] + this.dirY[i] * explosao * alcance * k
      if (px < -10 || py < -10 || px > w + 10 || py > h + 10) continue
      const s = tam * (1 + explosao * 2.2 * k)
      ctx.globalAlpha = 1 - explosao * 0.75
      ctx.fillStyle = this.cor[i]
      ctx.fillRect(px - s / 2, py - s / 2, s, s)
    }
    ctx.globalAlpha = 1
  }

  precisaRemontar(w: number) {
    return Math.abs(w - this.largura) > 40
  }
}

// ================== Cena 2: a viagem da requisição (grade em perspectiva) ==================

export const PORTOES = ['SPRING SECURITY · JWT', '@RestController', '@Service', 'PostgreSQL']
const INICIO_PORTAO = 9
const ESPACO_PORTAO = 7
const CAMINHO_TOTAL = INICIO_PORTAO + PORTOES.length * ESPACO_PORTAO + 2

// Progresso da rolagem em que a requisição atravessa cada portão
export const progressoPortao = (i: number) => (INICIO_PORTAO + i * ESPACO_PORTAO) / CAMINHO_TOTAL

export class CenaViagem {
  private predios: { x: number; l: number; a: number; janelas: number[] }[] = []

  constructor() {
    const r = aleatorio(29)
    let x = -0.05
    while (x < 1.05) {
      const l = 0.015 + r() * 0.035
      const janelas: number[] = []
      for (let j = 0; j < 14; j++) janelas.push(r())
      this.predios.push({ x, l, a: 0.03 + r() * 0.11, janelas })
      x += l + 0.003
    }
  }

  desenhar(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, p: number) {
    const horizonte = h * 0.52
    const cx = w / 2

    // céu
    const ceu = ctx.createLinearGradient(0, 0, 0, horizonte)
    ceu.addColorStop(0, 'rgba(3,4,11,0)')
    ceu.addColorStop(1, 'rgba(76,36,140,0.55)')
    ctx.fillStyle = ceu
    ctx.fillRect(0, 0, w, horizonte)

    // sol listrado
    const r = Math.min(w, h) * 0.17
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, w, horizonte)
    ctx.clip()
    const sol = ctx.createLinearGradient(0, horizonte - r, 0, horizonte + r * 0.2)
    sol.addColorStop(0, CORES.ciano)
    sol.addColorStop(1, CORES.violeta)
    ctx.fillStyle = sol
    ctx.globalAlpha = 0.85
    ctx.beginPath()
    ctx.arc(cx, horizonte, r, Math.PI, 0)
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.fillStyle = '#05040f'
    for (let i = 0; i < 7; i++) {
      const y = horizonte - r * 0.55 + i * r * 0.085
      ctx.fillRect(cx - r, y + ((t * 6) % (r * 0.085)), r * 2, 1.5 + i * 0.9)
    }
    ctx.restore()

    // cidade de servidores no horizonte
    for (const pr of this.predios) {
      const px = pr.x * w
      const pw = pr.l * w
      const ph = pr.a * h
      ctx.fillStyle = '#0a0820'
      ctx.fillRect(px, horizonte - ph, pw, ph)
      ctx.fillStyle = CORES.ciano
      pr.janelas.forEach((v, j) => {
        if (v > 0.55 && (j * 9) % (ph | 1) < ph - 6) {
          ctx.globalAlpha = 0.25 + 0.5 * (0.5 + 0.5 * Math.sin(t * 2 + v * 30))
          ctx.fillRect(px + 3 + ((j * 7) % Math.max(4, pw - 6)), horizonte - ph + 4 + j * 6, 2, 2)
        }
      })
      ctx.globalAlpha = 1
    }

    // chão
    const chao = ctx.createLinearGradient(0, horizonte, 0, h)
    chao.addColorStop(0, '#0d0628')
    chao.addColorStop(1, '#03030b')
    ctx.fillStyle = chao
    ctx.fillRect(0, horizonte, w, h - horizonte)

    const camera = p * CAMINHO_TOTAL
    const avanco = t * 0.8 + camera
    const fy = (h - horizonte) * 1.1

    // linhas horizontais da grade
    ctx.strokeStyle = CORES.violeta
    for (let k = 0; k < 40; k++) {
      const z = k + 1 - (avanco % 1)
      const y = horizonte + fy / z
      if (y > h) continue
      ctx.globalAlpha = limitar(1.2 / z)
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }
    // linhas que convergem para o horizonte
    for (let i = -24; i <= 24; i++) {
      ctx.globalAlpha = 0.5
      ctx.beginPath()
      ctx.moveTo(cx, horizonte)
      ctx.lineTo(cx + i * w * 0.09, h)
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    // portões: cada etapa da requisição dentro da API
    ctx.textAlign = 'center'
    for (let i = PORTOES.length - 1; i >= 0; i--) {
      const z = INICIO_PORTAO + i * ESPACO_PORTAO - camera
      if (z <= 0.35 || z > 30) continue
      const esc = 1 / z
      const base = horizonte + fy * esc
      const largura = w * 1.6 * esc + 20
      const altura = largura * 0.62
      const alfa = limitar((z - 0.35) * 1.6) * limitar((30 - z) / 10)
      ctx.globalAlpha = alfa
      ctx.strokeStyle = i === PORTOES.length - 1 ? CORES.verde : CORES.ciano
      ctx.lineWidth = Math.max(1, 6 * esc)
      ctx.beginPath()
      ctx.moveTo(cx - largura / 2, base)
      ctx.lineTo(cx - largura / 2, base - altura)
      ctx.lineTo(cx + largura / 2, base - altura)
      ctx.lineTo(cx + largura / 2, base)
      ctx.stroke()
      ctx.globalAlpha = alfa * 0.08
      ctx.fillStyle = ctx.strokeStyle
      ctx.fillRect(cx - largura / 2, base - altura, largura, altura)
      ctx.globalAlpha = alfa
      ctx.fillStyle = '#e8f6ff'
      // o rótulo encolhe para caber na largura da tela
      let fonte = Math.max(10, Math.min(46, 130 * esc))
      ctx.font = `600 ${fonte}px "JetBrains Mono", monospace`
      const medida = ctx.measureText(PORTOES[i]).width
      if (medida > w * 0.86) {
        fonte = (fonte * w * 0.86) / medida
        ctx.font = `600 ${fonte}px "JetBrains Mono", monospace`
      }
      ctx.fillText(PORTOES[i], cx, base - altura - Math.max(8, 30 * esc))
    }
    ctx.globalAlpha = 1

    // a requisição (você)
    const by = h * 0.8 + Math.sin(t * 3) * 4
    const tam = Math.min(18, w * 0.03)
    for (let k = 1; k < 9; k++) {
      ctx.globalAlpha = 0.35 / k
      ctx.fillStyle = CORES.ciano
      ctx.fillRect(cx - 1, by + k * 7, 2, 6)
    }
    ctx.globalAlpha = 1
    ctx.save()
    ctx.translate(cx, by)
    ctx.rotate(Math.PI / 4)
    ctx.shadowColor = CORES.ciano
    ctx.shadowBlur = 24
    ctx.fillStyle = CORES.ciano
    ctx.fillRect(-tam / 2, -tam / 2, tam, tam)
    ctx.restore()
  }
}

// ================== Cena 3: a stack como uma cidade isométrica ==================

interface Bloco {
  tec: Tecnologia
  gx: number
  gy: number
  sx: number
  sy: number
  topo: number
}

export class CenaStack {
  blocos: Bloco[] = []
  private colunas = 4

  montar(tecnologias: Tecnologia[]) {
    const ordem: Categoria[] = ['LINGUAGEM', 'FRAMEWORK', 'BANCO_DE_DADOS', 'FERRAMENTA', 'CLOUD']
    const lista = [...tecnologias].sort(
      (a, b) => ordem.indexOf(a.categoria) - ordem.indexOf(b.categoria) || (a.ordem ?? 99) - (b.ordem ?? 99),
    )
    this.colunas = Math.max(3, Math.ceil(Math.sqrt(lista.length)))
    this.blocos = lista.map((tec, i) => ({ tec, gx: i % this.colunas, gy: Math.floor(i / this.colunas), sx: 0, sy: 0, topo: 0 }))
  }

  // devolve a tecnologia sob o ponteiro (para o clique)
  desenhar(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, p: number, ponteiro: Ponteiro): Tecnologia | null {
    if (!this.blocos.length) return null
    const linhas = Math.ceil(this.blocos.length / this.colunas)
    const estreito = w < 700
    const tw = Math.min(estreito ? w * 0.2 : w * 0.1, estreito ? 90 : 128)
    const th = tw * 0.5
    const cx = estreito ? w / 2 : w * 0.64
    // centraliza a cidade (chão + prédio mais alto) na área livre da tela
    const alturaChao = (this.colunas + linhas - 2) * (th / 2)
    const centroY = estreito ? h * 0.66 : h * 0.55
    const cy = centroY - alturaChao / 2 + th * 0.9
    const iso = (gx: number, gy: number) => ({ x: cx + (gx - gy) * (tw / 2), y: cy + (gx + gy) * (th / 2) })

    // chão
    ctx.strokeStyle = CORES.violeta
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.22
    for (let gx = 0; gx <= this.colunas; gx++) {
      const a = iso(gx - 0.5, -0.5)
      const b = iso(gx - 0.5, linhas - 0.5)
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }
    for (let gy = 0; gy <= linhas; gy++) {
      const a = iso(-0.5, gy - 0.5)
      const b = iso(this.colunas - 0.5, gy - 0.5)
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    let sob: Bloco | null = null
    const ordenados = [...this.blocos].sort((a, b) => a.gx + a.gy - (b.gx + b.gy))
    ordenados.forEach((bl) => {
      const i = this.blocos.indexOf(bl)
      const nivel = bl.tec.nivel === 'AVANCADO' ? 3 : bl.tec.nivel === 'INTERMEDIARIO' ? 2 : 1
      const sobe = entrarComSalto((p * 1.5 - 0.08 - i * 0.03) * 2.2)
      const altura = (th * 0.4 + nivel * th * 0.75) * Math.max(0, sobe)
      const c = iso(bl.gx, bl.gy)
      const flutua = sobe >= 1 ? Math.sin(t * 1.6 + i) * 2 : 0
      const baseY = c.y + flutua
      const topoY = baseY - altura
      bl.sx = c.x
      bl.sy = topoY
      bl.topo = altura
      if (altura < 1) return

      const cor = COR_CATEGORIA[bl.tec.categoria]
      const realce = ponteiro.ativo && Math.abs(ponteiro.x - c.x) < tw * 0.42 && Math.abs(ponteiro.y - topoY) < th * 0.6
      if (realce) sob = bl

      // o bloco ocupa só parte do lote, deixando "ruas" entre os prédios
      const meiaL = tw * 0.31
      const meiaA = th * 0.31
      // face esquerda
      ctx.fillStyle = cor
      ctx.globalAlpha = 0.28
      ctx.beginPath()
      ctx.moveTo(c.x - meiaL, topoY)
      ctx.lineTo(c.x, topoY + meiaA)
      ctx.lineTo(c.x, baseY + meiaA)
      ctx.lineTo(c.x - meiaL, baseY)
      ctx.closePath()
      ctx.fill()
      // face direita
      ctx.globalAlpha = 0.16
      ctx.beginPath()
      ctx.moveTo(c.x + meiaL, topoY)
      ctx.lineTo(c.x, topoY + meiaA)
      ctx.lineTo(c.x, baseY + meiaA)
      ctx.lineTo(c.x + meiaL, baseY)
      ctx.closePath()
      ctx.fill()
      // topo
      ctx.globalAlpha = realce ? 0.95 : 0.55
      ctx.beginPath()
      ctx.moveTo(c.x, topoY - meiaA)
      ctx.lineTo(c.x + meiaL, topoY)
      ctx.lineTo(c.x, topoY + meiaA)
      ctx.lineTo(c.x - meiaL, topoY)
      ctx.closePath()
      ctx.fill()
      // arestas
      ctx.globalAlpha = 0.9
      ctx.strokeStyle = cor
      ctx.lineWidth = realce ? 2 : 1
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(c.x - meiaL, topoY)
      ctx.lineTo(c.x - meiaL, baseY)
      ctx.lineTo(c.x, baseY + meiaA)
      ctx.lineTo(c.x + meiaL, baseY)
      ctx.lineTo(c.x + meiaL, topoY)
      ctx.moveTo(c.x, topoY + meiaA)
      ctx.lineTo(c.x, baseY + meiaA)
      ctx.stroke()

      // nome
      ctx.globalAlpha = limitar(sobe)
      ctx.fillStyle = '#e8eeff'
      ctx.font = `600 ${estreito ? 9 : 11}px "JetBrains Mono", monospace`
      ctx.textAlign = 'center'
      ctx.fillText(bl.tec.nome, c.x, topoY - meiaA - 6)
    })
    ctx.globalAlpha = 1

    if (sob) {
      const bl = sob as Bloco
      const nivel = { BASICO: 'Básico', INTERMEDIARIO: 'Intermediário', AVANCADO: 'Avançado' }[bl.tec.nivel]
      const texto = `${bl.tec.nome} · ${nivel}`
      ctx.font = '600 13px "JetBrains Mono", monospace'
      const lw = ctx.measureText(texto).width + 24
      const x = limitar(bl.sx - lw / 2, 8, w - lw - 8)
      const y = bl.sy - th - 44
      ctx.fillStyle = 'rgba(6,8,22,0.92)'
      ctx.strokeStyle = COR_CATEGORIA[bl.tec.categoria]
      ctx.lineWidth = 1
      ctx.fillRect(x, y, lw, 30)
      ctx.strokeRect(x + 0.5, y + 0.5, lw - 1, 29)
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'left'
      ctx.fillText(texto, x + 12, y + 19)
      return bl.tec
    }
    return null
  }
}

import type { PointerEvent } from 'react'
import { STATUS_PROJETO, periodo, tecnologiasOrdenadas } from '../format'
import { Link } from '../router'
import type { Projeto, Tecnologia } from '../types'
import { ChipTecnologia, Icone, Secao, Selo } from './ui'

export function ordenarProjetos(projetos: Projeto[]) {
  return [...projetos].sort(
    (a, b) => Number(!!b.destaque) - Number(!!a.destaque) || (b.dataInicial ?? '').localeCompare(a.dataInicial ?? ''),
  )
}

export function Projetos({
  projetos,
  filtro,
  limparFiltro,
}: {
  projetos: Projeto[]
  filtro: Tecnologia | null
  limparFiltro: () => void
}) {
  const visiveis = ordenarProjetos(projetos).filter((p) => !filtro || p.tecnologias?.some((t) => t.id === filtro.id))

  return (
    <Secao id="projetos" rotulo="05 · projetos" titulo="Escolha uma fase">
      {filtro && (
        <div className="filtro-ativo">
          Mostrando projetos com <ChipTecnologia tec={filtro} ativo />
          <button type="button" className="link-botao" onClick={limparFiltro}>
            Ver todos
          </button>
        </div>
      )}
      <ul className="projetos-grade">
        {visiveis.map((p) => (
          <li key={p.id}>
            <CartaoProjeto projeto={p} />
          </li>
        ))}
      </ul>
    </Secao>
  )
}

// Inclina o cartão em 3D seguindo o mouse e move o brilho da borda
function inclinar(e: PointerEvent<HTMLElement>) {
  if (e.pointerType === 'touch') return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width
  const y = (e.clientY - r.top) / r.height
  el.style.setProperty('--rx', `${(0.5 - y) * 7}deg`)
  el.style.setProperty('--ry', `${(x - 0.5) * 9}deg`)
  el.style.setProperty('--mx', `${x * 100}%`)
  el.style.setProperty('--my', `${y * 100}%`)
}

function endireitar(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty('--rx', '0deg')
  e.currentTarget.style.setProperty('--ry', '0deg')
}

function CartaoProjeto({ projeto: p }: { projeto: Projeto }) {
  const status = STATUS_PROJETO[p.status]
  const techs = tecnologiasOrdenadas(p.tecnologias)
  const visiveis = techs.slice(0, 5)
  const resto = techs.length - visiveis.length

  return (
    <article
      className={`cartao projeto ${p.destaque ? 'projeto-destaque' : ''}`}
      onPointerMove={inclinar}
      onPointerLeave={endireitar}
    >
      {p.imagemCapaUrl && <img className="projeto-capa" src={p.imagemCapaUrl} alt="" loading="lazy" />}
      <div className="projeto-topo">
        <Selo tom={status.tom}>{status.texto}</Selo>
        {periodo(p.dataInicial, p.dataFinal) && <span className="meta">{periodo(p.dataInicial, p.dataFinal)}</span>}
      </div>
      <h3>
        <Link para={`/projetos/${p.id}`} className="projeto-link">
          {p.titulo}
        </Link>
      </h3>
      <p className="projeto-resumo">{p.resumo}</p>
      <div className="chips">
        {visiveis.map((t) => (
          <ChipTecnologia key={t.id} tec={t} />
        ))}
        {resto > 0 && <span className="chip chip-mais">+{resto}</span>}
      </div>
      <div className="projeto-acoes">
        <Link para={`/projetos/${p.id}`} className="link-seta">
          Detalhes e arquitetura <Icone nome="seta" tamanho={15} />
        </Link>
        {p.githubUrl && (
          <a className="icone-link" href={p.githubUrl} target="_blank" rel="noreferrer" aria-label={`Código de ${p.titulo} no GitHub`}>
            <Icone nome="github" tamanho={18} />
          </a>
        )}
      </div>
    </article>
  )
}

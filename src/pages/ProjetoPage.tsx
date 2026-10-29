import { useEffect } from 'react'
import { ordenarProjetos } from '../components/Projetos'
import { ChipTecnologia, Icone, Selo } from '../components/ui'
import { STATUS_PROJETO, periodo, tecnologiasOrdenadas } from '../format'
import { Link } from '../router'
import type { Projeto } from '../types'
import { NaoEncontrado } from './NaoEncontrado'

// Se a arquitetura começar com um fluxo "A → B → C", desenha esse fluxo como diagrama
function extrairFluxo(texto: string | null): string[][] | null {
  if (!texto || !texto.includes('→')) return null
  const primeiraFrase = texto.split(/\.\s/)[0].replace(/\.$/, '')
  const etapas = primeiraFrase.split('→').map((e) => e.trim()).filter(Boolean)
  if (etapas.length < 2) return null
  return etapas.map((etapa) => etapa.split(/,\s*|\s+e\s+(?=[A-ZÁÉÍÓÚ])/).map((p) => p.trim()).filter(Boolean))
}

export function ProjetoPage({ id, projetos }: { id: number; projetos: Projeto[] }) {
  const projeto = projetos.find((p) => p.id === id)

  useEffect(() => {
    if (projeto) document.title = `${projeto.titulo} · Willian Nascimento`
    return () => {
      document.title = 'Willian Nascimento · Desenvolvedor Back-end Java'
    }
  }, [projeto])

  if (!projeto) return <NaoEncontrado />

  const status = STATUS_PROJETO[projeto.status]
  const fluxo = extrairFluxo(projeto.arquitetura)
  const textoArquitetura = fluxo ? projeto.arquitetura!.split(/\.\s/).slice(1).join('. ') : projeto.arquitetura
  const outros = ordenarProjetos(projetos).filter((p) => p.id !== projeto.id).slice(0, 3)

  return (
    <article className="pagina-projeto">
      <div className="container container-estreito">
        <Link para="/#projetos" className="link-seta voltar">
          <Icone nome="voltar" tamanho={15} /> Todos os projetos
        </Link>

        <header className="projeto-cabecalho">
          <div className="projeto-topo">
            <Selo tom={status.tom}>{status.texto}</Selo>
            {periodo(projeto.dataInicial, projeto.dataFinal) && (
              <span className="meta">{periodo(projeto.dataInicial, projeto.dataFinal)}</span>
            )}
          </div>
          <h1>{projeto.titulo}</h1>
          <p className="projeto-lead">{projeto.resumo}</p>
          {projeto.githubUrl && (
            <a className="botao botao-primario" href={projeto.githubUrl} target="_blank" rel="noreferrer">
              <Icone nome="github" tamanho={16} /> Ver o código no GitHub
            </a>
          )}
        </header>

        {projeto.imagemCapaUrl && <img className="projeto-imagem" src={projeto.imagemCapaUrl} alt={`Tela do projeto ${projeto.titulo}`} />}

        <section className="projeto-bloco">
          <h2>O projeto</h2>
          <p>{projeto.descricao}</p>
        </section>

        {projeto.arquitetura && (
          <section className="projeto-bloco">
            <h2>Arquitetura</h2>
            {fluxo && (
              <div className="fluxo" role="img" aria-label={`Fluxo: ${fluxo.map((e) => e.join(', ')).join(' para ')}`}>
                {fluxo.map((etapa, i) => (
                  <div key={i} className="fluxo-passo">
                    {i > 0 && <span className="fluxo-seta" aria-hidden>→</span>}
                    <div className="fluxo-grupo">
                      {etapa.map((no) => (
                        <span key={no} className="fluxo-no">
                          {no}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {textoArquitetura && <p>{textoArquitetura}</p>}
          </section>
        )}

        <section className="projeto-bloco">
          <h2>Tecnologias</h2>
          <div className="chips">
            {tecnologiasOrdenadas(projeto.tecnologias).map((t) => (
              <ChipTecnologia key={t.id} tec={t} />
            ))}
          </div>
        </section>

        {outros.length > 0 && (
          <section className="projeto-bloco">
            <h2>Outros projetos</h2>
            <ul className="outros">
              {outros.map((p) => (
                <li key={p.id}>
                  <Link para={`/projetos/${p.id}`} className="cartao outro">
                    <strong>{p.titulo}</strong>
                    <span>{p.resumo}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  )
}

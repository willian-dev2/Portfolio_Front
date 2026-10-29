import { useEffect, useState } from 'react'
import { API_URL, USANDO_MOCK } from '../api'
import { ApiAoVivo } from '../components/ApiAoVivo'
import { Projetos } from '../components/Projetos'
import { Contato, Experiencias, Formacoes, Sobre } from '../components/Secoes'
import { Icone } from '../components/ui'
import { EVENTO_TECNOLOGIA } from '../experiencia/Palco'
import { COR_CATEGORIA, progressoPortao } from '../experiencia/motor'
import { CATEGORIA, porOrdem } from '../format'
import { Link } from '../router'
import type { Categoria, Portfolio, Tecnologia } from '../types'

export function Home({ dados }: { dados: Portfolio }) {
  const [filtro, setFiltro] = useState<Tecnologia | null>(null)
  const perfil = dados.perfil.dados[0]
  const ms = dados.perfil.ms
  const host = USANDO_MOCK ? 'localhost:9090' : API_URL.replace(/^https?:\/\//, '')

  // clique num bloco da cidade (desenhada no canvas) filtra os projetos
  useEffect(() => {
    const aoEscolher = (e: Event) => {
      setFiltro((e as CustomEvent<Tecnologia>).detail)
      document.getElementById('projetos')?.scrollIntoView({ behavior: 'smooth' })
    }
    window.addEventListener(EVENTO_TECNOLOGIA, aoEscolher)
    return () => window.removeEventListener(EVENTO_TECNOLOGIA, aoEscolher)
  }, [])

  if (!perfil) {
    return (
      <div className="container estado">
        <h1>Perfil ainda não cadastrado</h1>
        <p>Cadastre o perfil na API para o site aparecer.</p>
      </div>
    )
  }

  const categorias = (Object.keys(CATEGORIA) as Categoria[]).filter((c) =>
    dados.tecnologias.dados.some((t) => t.categoria === c),
  )

  const log = [
    { de: 0.03, classe: '', texto: `> GET ${host}/api/perfil` },
    { de: progressoPortao(0), classe: 'ok', texto: '✓ JwtRequestFilter · rota pública liberada' },
    { de: progressoPortao(1), classe: '', texto: '→ UsuarioController.perfilVitae()' },
    { de: progressoPortao(2), classe: '', texto: '→ UsuarioService.retornarListaPerfil()' },
    { de: progressoPortao(3), classe: '', texto: '→ SELECT * FROM perfil' },
    { de: 0.9, classe: 'ok', texto: `← 200 OK · ${ms} ms` },
  ]

  return (
    <>
      {/* ============ Capítulo 1: o nome em partículas ============ */}
      <section id="cap-nome" className="capitulo capitulo-nome">
        <div className="palco-fixo">
          <div className="intro" data-de="0" data-ate="0.2">
            <h1 className="sr-only">
              {perfil.nome}, {perfil.titulo}
            </h1>
            <p className="intro-titulo">{perfil.titulo}</p>
            <p className="intro-status">
              <span className={`ponto ${USANDO_MOCK ? 'ponto-neutro' : ''}`} />
              {USANDO_MOCK ? 'modo demonstração' : `API online · ${ms} ms`}
              {perfil.localizacao && <span className="intro-local"> · {perfil.localizacao}</span>}
            </p>
            <div className="intro-acoes">
              <Link para="/#projetos" className="botao botao-primario">
                Ver projetos <Icone nome="seta" tamanho={16} />
              </Link>
              {perfil.gitHubUrl && (
                <a className="botao botao-fantasma" href={perfil.gitHubUrl} target="_blank" rel="noreferrer">
                  <Icone nome="github" tamanho={16} /> GitHub
                </a>
              )}
              {perfil.linkedinUrl && (
                <a className="botao botao-fantasma" href={perfil.linkedinUrl} target="_blank" rel="noreferrer">
                  <Icone nome="linkedin" tamanho={16} /> LinkedIn
                </a>
              )}
            </div>
            <p className="dica-rolar">
              <span className="mouse" aria-hidden />
              role para começar
            </p>
          </div>

          <p className="frase-central" data-de="0.32" data-ate="0.95">
            Tudo o que você vai ver aqui vem de uma <strong>API que eu construí</strong>.
            <span>Continue rolando e acompanhe uma requisição até ela.</span>
          </p>
        </div>
      </section>

      {/* ============ Capítulo 2: a viagem da requisição ============ */}
      <section id="cap-viagem" className="capitulo capitulo-viagem">
        <div className="palco-fixo">
          <div className="viagem-titulo" data-de="0" data-ate="0.1">
            <p className="rotulo-pixel">fase 1 · a requisição</p>
            <h2>
              Você é um <code>GET /api/perfil</code>
            </h2>
            <p>Role para atravessar cada camada da minha API.</p>
          </div>

          <ol className="log" data-de="0.02" aria-label="Caminho da requisição dentro da API">
            {log.map((l) => (
              <li key={l.texto} data-de={l.de} className={l.classe}>
                {l.texto}
              </li>
            ))}
          </ol>

          <div className="resposta-ok" data-de="0.92">
            <p className="ok-codigo">200 OK</p>
            <p>{ms} ms · a resposta está logo abaixo</p>
          </div>
        </div>
      </section>

      <Sobre perfil={perfil} formacao={dados.formacao.dados} />

      {/* ============ Capítulo 3: a stack como cidade ============ */}
      <section id="cap-stack" className="capitulo capitulo-stack">
        <div className="palco-fixo">
          <div className="stack-texto" data-de="0">
            <p className="rotulo">02 · stack</p>
            <h2 className="titulo-secao">Minha stack, em blocos</h2>
            <p>
              Cada bloco é uma tecnologia que eu uso. Quanto mais alto, maior o domínio.{' '}
              <span className="so-mouse">Passe o mouse e clique num bloco para ver os projetos em que ela aparece.</span>
            </p>
            <ul className="legenda">
              {categorias.map((c) => (
                <li key={c}>
                  <i style={{ background: COR_CATEGORIA[c] }} />
                  {CATEGORIA[c]}
                </li>
              ))}
            </ul>
          </div>
          <ul className="sr-only">
            {[...dados.tecnologias.dados].sort(porOrdem).map((t) => (
              <li key={t.id}>
                {t.nome} ({t.nivel.toLowerCase()})
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Experiencias experiencias={dados.experiencia.dados} />
      <Formacoes formacao={dados.formacao.dados} />
      <Projetos projetos={dados.projetos.dados} filtro={filtro} limparFiltro={() => setFiltro(null)} />
      <ApiAoVivo dados={dados} />
      <Contato perfil={perfil} />
    </>
  )
}

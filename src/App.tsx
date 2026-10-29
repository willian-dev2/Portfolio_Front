import { useDados } from './dados'
import { Navbar } from './components/Navbar'
import { Palco } from './experiencia/Palco'
import { Home } from './pages/Home'
import { NaoEncontrado } from './pages/NaoEncontrado'
import { ProjetoPage } from './pages/ProjetoPage'
import { useCaminho } from './router'

export function App() {
  const caminho = useCaminho()
  const { estado, recarregar } = useDados()

  let conteudo
  if (estado.status === 'carregando') {
    conteudo = (
      <div className="container estado" aria-busy="true">
        <div className="carregando" aria-hidden />
        <p>Carregando dados da API…</p>
      </div>
    )
  } else if (estado.status === 'erro') {
    conteudo = (
      <div className="container estado">
        <p className="estado-codigo">!</p>
        <h1>Não foi possível carregar o portfólio</h1>
        <p>{estado.mensagem}. A API pode estar iniciando: em servidores gratuitos isso leva até um minuto.</p>
        <button type="button" className="botao botao-primario" onClick={recarregar}>
          Tentar de novo
        </button>
      </div>
    )
  } else {
    const projeto = caminho.match(/^\/projetos\/(\d+)\/?$/)
    if (caminho === '/' || caminho === '/index.html') conteudo = <Home dados={estado.dados} />
    else if (projeto) conteudo = <ProjetoPage id={Number(projeto[1])} projetos={estado.dados.projetos.dados} />
    else conteudo = <NaoEncontrado />
  }

  const perfil = estado.status === 'ok' ? estado.dados.perfil.dados[0] : undefined

  return (
    <>
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>
      {perfil && <Palco nome={perfil.nome} tecnologias={estado.status === 'ok' ? estado.dados.tecnologias.dados : []} />}
      <Navbar />
      <main id="conteudo">{conteudo}</main>
      <footer className="rodape">
        <div className="container rodape-conteudo">
          <span>© {new Date().getFullYear()} {perfil?.nome ?? 'Willian Nascimento'}</span>
          <span className="meta">React no front · Spring Boot + PostgreSQL na API</span>
        </div>
      </footer>
    </>
  )
}

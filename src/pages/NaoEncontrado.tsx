import { Link } from '../router'

export function NaoEncontrado() {
  return (
    <div className="container estado">
      <p className="estado-codigo">404</p>
      <h1>Página não encontrada</h1>
      <p>O endereço que você abriu não existe ou foi removido.</p>
      <Link para="/" className="botao botao-primario">
        Voltar ao início
      </Link>
    </div>
  )
}

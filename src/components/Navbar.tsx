import { useEffect, useState } from 'react'
import { Link } from '../router'
import { Icone } from './ui'

const itens = [
  { id: 'sobre', texto: 'Sobre' },
  { id: 'stack', texto: 'Stack' },
  { id: 'experiencia', texto: 'Experiência' },
  { id: 'projetos', texto: 'Projetos' },
  { id: 'api', texto: 'API ao vivo' },
  { id: 'contato', texto: 'Contato' },
]

export function Navbar() {
  const [aberto, setAberto] = useState(false)
  const [rolou, setRolou] = useState(false)

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 8)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  return (
    <header className={`navbar ${rolou ? 'rolou' : ''}`}>
      <div className="container navbar-conteudo">
        <Link para="/" className="marca" onClick={() => setAberto(false)}>
          <span className="marca-chave">{'{'}</span>willian<span className="marca-ponto">.dev</span>
          <span className="marca-chave">{'}'}</span>
        </Link>

        <button
          type="button"
          className="navbar-menu"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={aberto}
          onClick={() => setAberto((a) => !a)}
        >
          <Icone nome={aberto ? 'fechar' : 'menu'} tamanho={22} />
        </button>

        <nav className={`navbar-links ${aberto ? 'aberto' : ''}`} aria-label="Seções">
          {itens.map((item) => (
            <Link key={item.id} para={`/#${item.id}`} onClick={() => setAberto(false)}>
              {item.texto}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

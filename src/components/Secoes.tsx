import { useState } from 'react'
import {
  CONTRATO, ESCOLARIDADE, MODALIDADE, STATUS_ESCOLARIDADE,
  datasFormacao, duracao, periodo, tecnologiasOrdenadas,
} from '../format'
import type { Experiencia, Formacao, Perfil } from '../types'
import { BotaoCopiar, ChipTecnologia, Icone, Secao, Selo } from './ui'

// ---------------- Sobre ----------------

export function Sobre({ perfil, formacao }: { perfil: Perfil; formacao: Formacao[] }) {
  const atual = formacao.find((f) => f.status === 'CURSANDO') ?? formacao[0]
  const [fotoFalhou, setFotoFalhou] = useState(false)
  return (
    <Secao id="sobre" rotulo="01 · a resposta" titulo="Quem sou eu">
      <div className="sobre-grade">
        <div className="sobre-texto">
          {perfil.bio.split(/\n+/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <aside className="cartao sobre-ficha">
          {perfil.fotoUrl && !fotoFalhou && (
            <img
              className="sobre-foto"
              src={perfil.fotoUrl}
              alt={perfil.nome}
              width={88}
              height={88}
              onError={() => setFotoFalhou(true)}
            />
          )}
          <dl>
            {perfil.localizacao && (
              <div>
                <dt>Localização</dt>
                <dd>{perfil.localizacao}</dd>
              </div>
            )}
            {atual && (
              <div>
                <dt>Formação</dt>
                <dd>
                  {atual.curso}
                  <small>{atual.instituicao}</small>
                </dd>
              </div>
            )}
            <div>
              <dt>Foco</dt>
              <dd>APIs REST, microsserviços e segurança</dd>
            </div>
            {perfil.disponivel != null && (
              <div>
                <dt>Disponibilidade</dt>
                <dd>
                  <Selo tom={perfil.disponivel ? 'concluido' : 'neutro'}>
                    {perfil.disponivel ? 'Aberto a oportunidades' : 'Indisponível no momento'}
                  </Selo>
                </dd>
              </div>
            )}
          </dl>
        </aside>
      </div>
    </Secao>
  )
}

// ---------------- Experiência ----------------

export function Experiencias({ experiencias }: { experiencias: Experiencia[] }) {
  const ordenadas = [...experiencias].sort((a, b) => (b.dataInicio ?? '').localeCompare(a.dataInicio ?? ''))
  if (!ordenadas.length) return null
  return (
    <Secao id="experiencia" rotulo="03 · experiência" titulo="Missões concluídas">
      <ol className="linha-tempo">
        {ordenadas.map((e) => (
          <li key={e.id} className="linha-item">
            <span className="linha-marcador" aria-hidden />
            <div className="cartao">
              <div className="exp-topo">
                <div>
                  <h3>{e.cargo}</h3>
                  {e.empresa && <p className="exp-empresa">{e.empresa}</p>}
                </div>
                <div className="exp-datas">
                  <span>{periodo(e.dataInicio, e.dataFim)}</span>
                  {duracao(e.dataInicio, e.dataFim) && <small>{duracao(e.dataInicio, e.dataFim)}</small>}
                </div>
              </div>
              <p className="meta">
                {CONTRATO[e.tipo]} · {MODALIDADE[e.modalidade]}
                {!e.dataFim && <Selo tom="andamento">Atual</Selo>}
              </p>
              <p className="exp-descricao">{e.descricao}</p>
              <div className="chips">
                {tecnologiasOrdenadas(e.tecnologias).map((t) => (
                  <ChipTecnologia key={t.id} tec={t} />
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Secao>
  )
}

// ---------------- Formação ----------------

export function Formacoes({ formacao }: { formacao: Formacao[] }) {
  if (!formacao.length) return null
  const ordem = { CURSANDO: 0, CONCLUIDO: 1, TRANCADO: 2 }
  const ordenadas = [...formacao].sort((a, b) => ordem[a.status] - ordem[b.status] || a.id - b.id)
  return (
    <Secao id="formacao" rotulo="04 · formação" titulo="Formação e cursos">
      <ul className="formacao-grade">
        {ordenadas.map((f) => {
          const { inicio, fim } = datasFormacao(f)
          const status = STATUS_ESCOLARIDADE[f.status]
          return (
            <li key={f.id} className="cartao formacao">
              <div className="formacao-topo">
                <span className="meta">{ESCOLARIDADE[f.tipo]}</span>
                <Selo tom={status.tom}>{status.texto}</Selo>
              </div>
              <h3>{f.curso}</h3>
              <p className="formacao-inst">{f.instituicao}</p>
              {periodo(inicio, fim, 'em curso') && <p className="meta">{periodo(inicio, fim, 'em curso')}</p>}
            </li>
          )
        })}
      </ul>
    </Secao>
  )
}

// ---------------- Contato ----------------

export function Contato({ perfil }: { perfil: Perfil }) {
  return (
    <Secao id="contato" rotulo="07 · contato" titulo="Vamos conversar">
      {perfil.emailContato && (
        <a className="press-start" href={`mailto:${perfil.emailContato}`}>
          <span aria-hidden>▶</span> PRESS START
        </a>
      )}
      <div className="cartao contato">
        <p className="contato-texto">
          Estou {perfil.disponivel === false ? 'acompanhando novas' : 'aberto a'} oportunidades como desenvolvedor
          back-end. O jeito mais rápido de falar comigo é por e-mail ou pelo LinkedIn.
        </p>
        {perfil.emailContato && (
          <div className="contato-email">
            <a href={`mailto:${perfil.emailContato}`}>
              <Icone nome="mail" />
              {perfil.emailContato}
            </a>
            <BotaoCopiar texto={perfil.emailContato} rotulo="Copiar e-mail" />
          </div>
        )}
        <div className="contato-links">
          {perfil.linkedinUrl && (
            <a className="botao botao-primario" href={perfil.linkedinUrl} target="_blank" rel="noreferrer">
              <Icone nome="linkedin" tamanho={16} /> LinkedIn
            </a>
          )}
          {perfil.gitHubUrl && (
            <a className="botao botao-fantasma" href={perfil.gitHubUrl} target="_blank" rel="noreferrer">
              <Icone nome="github" tamanho={16} /> GitHub
            </a>
          )}
          {perfil.curriculoPdfUrl && (
            <a className="botao botao-fantasma" href={perfil.curriculoPdfUrl} target="_blank" rel="noreferrer">
              <Icone nome="arquivo" tamanho={16} /> Currículo (PDF)
            </a>
          )}
        </div>
        {perfil.localizacao && (
          <p className="meta contato-local">
            <Icone nome="local" tamanho={15} /> {perfil.localizacao}
          </p>
        )}
      </div>
    </Secao>
  )
}

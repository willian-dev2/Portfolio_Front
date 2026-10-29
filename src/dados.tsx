// Carrega todo o conteúdo da API uma vez e compartilha com as páginas
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { carregarPortfolio, ErroApi } from './api'
import type { Portfolio } from './types'

type Estado =
  | { status: 'carregando' }
  | { status: 'ok'; dados: Portfolio }
  | { status: 'erro'; mensagem: string }

const Contexto = createContext<{ estado: Estado; recarregar: () => void } | null>(null)

export function DadosProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Estado>({ status: 'carregando' })

  const recarregar = useCallback(() => {
    setEstado({ status: 'carregando' })
    carregarPortfolio()
      .then((dados) => setEstado({ status: 'ok', dados }))
      .catch((e: unknown) =>
        setEstado({ status: 'erro', mensagem: e instanceof ErroApi ? e.message : 'Erro inesperado' }),
      )
  }, [])

  useEffect(recarregar, [recarregar])

  return <Contexto.Provider value={{ estado, recarregar }}>{children}</Contexto.Provider>
}

export function useDados() {
  const ctx = useContext(Contexto)
  if (!ctx) throw new Error('useDados precisa estar dentro de <DadosProvider>')
  return ctx
}

# Portfólio · Front-end

Site do portfólio de Willian Nascimento. Todo o conteúdo vem da [Portfólio API](https://github.com/willian-dev2/Portifolio) (Spring Boot + PostgreSQL).

Feito com **React 19**, **TypeScript** e **Vite**, sem bibliotecas de UI. As cenas animadas são desenhadas em **canvas**, sem imagens.

## A experiência

A página inicial é contada pela rolagem:

1. **O nome em partículas:** o mouse desmancha as letras, e ao rolar elas explodem em estrelas
2. **A viagem da requisição:** o visitante "é" um `GET /api/perfil` e atravessa os portões Spring Security, Controller, Service e PostgreSQL até o `200 OK`
3. **A stack como cidade isométrica:** cada prédio é uma tecnologia, a altura é o nível; clicar num prédio filtra os projetos

Rolar para trás desfaz cada animação. Quem usa "reduzir movimento" no sistema vê as cenas sem animação automática.

## Seções

- **Sobre, Experiência, Formação e Projetos** (cartões com inclinação 3D)
- **Página de cada projeto** (`/projetos/{id}`): descrição, diagrama da arquitetura e tecnologias
- **API ao vivo:** o visitante escolhe um endpoint e vê a resposta JSON real, com o tempo de resposta
- **Contato**

## Como rodar

Pré-requisito: Node.js 20 ou superior.

```bash
npm install
cp .env.example .env    # no Windows: copy .env.example .env
npm run dev
```

O site abre em `http://localhost:5173`.

### Variáveis de ambiente

| Variável | Valor | Para que serve |
|---|---|---|
| `VITE_API_URL` | `http://localhost:9090` | Endereço da API |
| `VITE_USE_MOCK` | `false` ou `true` | `true` mostra os dados de exemplo de `src/mock.ts`, sem precisar da API |

A API precisa liberar a origem do site no CORS (`APP_CORS_ORIGENS`). Em desenvolvimento, `http://localhost:5173`.

## Build e deploy

```bash
npm run build      # gera a pasta dist/
npm run typecheck  # opcional: confere os tipos do TypeScript
```

Na **Vercel**: importe o repositório, framework **Vite**, e defina `VITE_API_URL` com o endereço público da API. O `vercel.json` já faz as rotas como `/projetos/1` funcionarem ao recarregar a página.

## Estrutura

```
src/
├── api.ts          → chamadas à API (e o modo demonstração)
├── dados.tsx       → carrega o conteúdo uma vez e compartilha com as páginas
├── format.ts       → tradução dos enums da API e formatação de datas
├── router.tsx      → roteador simples ("/" e "/projetos/:id")
├── types.ts        → tipos no formato que a API devolve
├── mock.ts         → dados de exemplo
├── experiencia/    → canvas e cenas animadas (motor.ts, Palco.tsx)
├── components/     → Navbar, seções, projetos, API ao vivo
└── pages/          → Home, página de projeto, 404
```

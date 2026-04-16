# Vikingo Ads Brain

Sistema completo de gestão de Amazon Ads.

## Como acessar o projeto

### Acesso pela web (produção)

O frontend é publicado na **Vercel**. Para acessar a URL pública:

1. Entre em https://vercel.com/dashboard com a conta que gerencia o projeto.
2. Abra o projeto **`vikingo-ads-brain-frontend-deploy`**.
3. A URL de produção aparece no topo da página do projeto (formato padrão: `https://vikingo-ads-brain-frontend-deploy.vercel.app` ou o domínio customizado configurado).

Alternativamente, via CLI da Vercel:

```bash
npm i -g vercel
vercel login
vercel ls vikingo-ads-brain-frontend-deploy
```

IDs internos da Vercel (apenas referência):

- `projectId`: `prj_OcJ4rO3u67PGszFung7KriWT35v6`
- `orgId` (team): `team_wALihzNHXTcJEBk9sxY5WSzP`

### Acesso local (desenvolvimento)

Pré-requisitos: Node.js 18+ e npm.

```bash
# 1. Clonar o repositório
git clone https://github.com/sales441/vikingo-ads-brain-frontend-deploy.git
cd vikingo-ads-brain-frontend-deploy

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Ajuste VITE_API_URL conforme o backend em uso
```

Scripts disponíveis:

| Comando           | Descrição                              |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento (Vite)     |
| `npm run build`   | Gera o build de produção em `dist/`    |
| `npm run preview` | Servidor local para validar o build    |

Por padrão o `npm run dev` expõe a aplicação em http://localhost:5173.

### Variáveis de ambiente

| Variável        | Descrição                                  | Exemplo                     |
| --------------- | ------------------------------------------ | --------------------------- |
| `VITE_API_URL`  | URL base da API consumida pelo frontend    | `http://localhost:5000/api` |

### Banco de dados

Os scripts SQL do Supabase estão no repositório [`sales441/docs`](https://github.com/sales441/docs). Consulte o README daquele repositório para instruções de provisionamento.

## Stack

- React 18 + React Router
- Vite 5
- Tailwind CSS 3
- Axios, Recharts, Lucide

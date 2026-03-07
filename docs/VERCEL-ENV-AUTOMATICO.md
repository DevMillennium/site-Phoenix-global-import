# Enviar variáveis do .env.local para a Vercel (automático)

Execute **uma vez** para copiar STRIPE, SITE_URL e WHATSAPP do seu `.env.local` para a Vercel.

## Passo 1: Token da Vercel

1. Acesse https://vercel.com/account/tokens  
2. Clique em **Create**  
3. Nome (ex.: "env-script"), expiração à vontade  
4. Copie o token (só aparece uma vez)

## Passo 2: Nome do projeto na Vercel

No painel do projeto na Vercel: **Settings** → **General** → **Project Name** (ex.: `phoenix-global` ou `site-phoenix-global-import`).

## Passo 3: Rodar o script

No terminal, na pasta do projeto:

```bash
VERCEL_TOKEN=seu_token_aqui VERCEL_PROJECT=nome-do-projeto npm run vercel:env
```

Exemplo (substitua pelo seu token e nome do projeto):

```bash
VERCEL_TOKEN=vercel_xxxx... VERCEL_PROJECT=phoenix-global npm run vercel:env
```

**Alternativa:** se você já rodou `vercel link` no projeto, não precisa de `VERCEL_PROJECT`:

```bash
VERCEL_TOKEN=seu_token npm run vercel:env
```

## O que o script envia

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

(Todas as que existirem no `.env.local`.)

Depois, faça um **Redeploy** no projeto na Vercel para as variáveis valerem no build.

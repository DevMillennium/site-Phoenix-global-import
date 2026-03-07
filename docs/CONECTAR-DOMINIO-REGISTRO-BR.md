# Conectar domínio phoenixglobal.com.br (Registro.br) ao site

O domínio **phoenixglobal.com.br** foi configurado no projeto. Para ele funcionar no ar, é preciso apontar o DNS no Registro.br para a hospedagem (ex.: Vercel).

---

## 1. Adicionar o domínio na Vercel

1. Acesse [vercel.com](https://vercel.com) e abra o projeto do site Phoenix Global.
2. Vá em **Settings** → **Domains**.
3. Clique em **Add** e digite:
   - `phoenixglobal.com.br`
   - `www.phoenixglobal.com.br` (opcional; recomendado para redirecionar www → raiz)
4. A Vercel vai mostrar as instruções de DNS. Anote:
   - Para o domínio **raiz** (phoenixglobal.com.br): tipo **A** com o IP que a Vercel indicar, ou uso de **ANAME/ALIAS** se o Registro.br suportar.
   - Para **www**: tipo **CNAME** apontando para `cname.vercel-dns.com` (ou o valor que a Vercel mostrar).

---

## 2. Configurar DNS no Registro.br

1. Acesse [registro.br](https://registro.br) e faça login.
2. Abra **Meus domínios** e clique em **phoenixglobal.com.br**.
3. Vá em **Alterar zona DNS** ou **DNS** / **Servidores DNS**.
4. Configure conforme a Vercel pedir. Exemplo típico:

   | Tipo  | Nome / Host | Valor / Aponta para        |
   |-------|-------------|----------------------------|
   | A     | @ (ou vazio)| IP fornecido pela Vercel   |
   | CNAME | www         | cname.vercel-dns.com       |

   Se o Registro.br permitir apenas **redirecionamento** ou **ponteiro**, use a opção que permita apontar o domínio para o endereço do projeto na Vercel (a própria Vercel explica o que fazer para .com.br).

5. **Alternativa (recomendada pela Vercel):** usar os **nameservers da Vercel** no Registro.br em vez de criar registros A/CNAME manualmente. No painel do domínio na Vercel, veja a opção “Use Vercel Nameservers” e troque no Registro.br os servidores DNS atuais pelos que a Vercel indicar.
6. Salve as alterações. A propagação pode levar de alguns minutos até 48 horas.

---

## 3. Variável de ambiente em produção

No projeto da Vercel:

1. **Settings** → **Environment Variables**.
2. Crie ou edite:
   - Nome: `NEXT_PUBLIC_SITE_URL`
   - Valor: `https://phoenixglobal.com.br`
3. Faça um novo deploy para aplicar.

Assim o sitemap, Open Graph e links absolutos usarão **https://phoenixglobal.com.br**.

---

## 4. Conferir

- Abra **https://phoenixglobal.com.br** no navegador.
- Se configurou **www**, teste também **https://www.phoenixglobal.com.br** (e confirme o redirecionamento para a raiz, se for o desejado).
- No projeto, a URL base padrão já está definida como `https://phoenixglobal.com.br` em `src/lib/env.ts` e em `.env.example`.

---

## Resumo

| Onde        | O que fazer |
|------------|-------------|
| **Vercel** | Adicionar domínio(s) em Settings → Domains e seguir as instruções de DNS. |
| **Registro.br** | Inserir os registros A/CNAME (ou trocar para os nameservers da Vercel). |
| **Vercel (env)** | Definir `NEXT_PUBLIC_SITE_URL=https://phoenixglobal.com.br` e redeployar. |

Depois disso, o domínio **phoenixglobal.com.br** estará conectado ao site.

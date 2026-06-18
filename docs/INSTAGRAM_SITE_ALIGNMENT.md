# Alinhamento Instagram ↔ Site Phoenix Global Import

> Perfil analisado: [@globalholdingphoenix](https://www.instagram.com/globalholdingphoenix?igsh=MmxqbW1yeWFoMDh1&utm_source=qr)  
> Data: 2026-06-18

---

## Análise do perfil Instagram

| Campo | Valor |
|-------|-------|
| **Handle** | `@globalholdingphoenix` |
| **Nome exibido** | Phoenix Imports |
| **Posts** | 29 (predominância de Reels) |
| **Seguidores** | ~34 |
| **Bio** | 🌎 Holding Internacional · 📦 Importações Brasil ↔ Paraguai · 💻 Tecnologia • IA • Expansão empresarial |
| **WhatsApp na bio** | `wa.me/5585994482323` |
| **Logo** | Phoenix Global Holding (fênix dourada) |
| **Links na bio** | WhatsApp + 2 links adicionais |

### Conteúdo observado

- Reels de produtos (câmeras, eletrônicos, vitrine comercial).
- Posicionamento misto **holding + importação**, mas nome comercial **Phoenix Imports** — alinhado ao site `phoenixglobal.com.br`.
- Mesmo número WhatsApp do site (`5585994482323`).

---

## Divergências encontradas (antes do alinhamento)

| Item | Instagram | Site (antes) | Status |
|------|-----------|--------------|--------|
| Handle no footer | `@globalholdingphoenix` | `@phoenixglobalimports` ❌ | **Corrigido** |
| WhatsApp | 5585994482323 | 5585994482323 | ✅ já alinhado |
| CTA Instagram na PDP | Direct disponível | só WhatsApp | **Corrigido** |
| Página contato | Direct | só WhatsApp | **Corrigido** |
| JSON-LD `sameAs` | — | ausente | **Corrigido** |
| Menção Brasil ↔ Paraguai | na bio | só Fortaleza | **Parcial** (sobre atualizado) |

### Nota sobre duas contas Instagram no ecossistema

No Phoenix Omnichannel / Fernanda existem **duas contas oficiais**:

| Conta | Inbox Fernanda | Uso |
|-------|----------------|-----|
| `@phoenixglobalimports` | Inbox 4 | Import Meta legado |
| `@globalholdingphoenix` | Inbox 8 | Holding Meta oficial |

O perfil `@globalholdingphoenix` exibe **"Phoenix Imports"** e a mesma linha comercial do site. Por isso o site passa a usar esta conta como **Instagram primário**.

---

## Alterações implementadas no site

1. **`src/lib/social.ts`** — URLs centralizadas (`globalholdingphoenix`, Facebook).
2. **Footer** — link Instagram corrigido.
3. **`/contato`** — seção Instagram + botão Direct.
4. **PDP** — botão "Instagram Direct" com registro de lead (`channelPreference: instagram`).
5. **`LinkInstagram`** — componente com tracking GA + lead PAIOS.
6. **JSON-LD** — `sameAs` com Instagram e Facebook na home.
7. **`/sobre`** — menção Brasil ↔ Paraguai (como na bio).
8. **`.env.example`** — `NEXT_PUBLIC_INSTAGRAM_URL` e `HANDLE`.

---

## Mensagens sugeridas (Instagram Direct)

O Instagram não permite pré-preencher DM via URL. O site abre `instagram.com/direct/t/globalholdingphoenix` e registra o lead com contexto do produto.

Exemplo para PDP:

> Olá! Tenho interesse no Sony ZV-E10. Ainda está disponível? Qual o valor no Pix e como funciona a retirada/entrega?

---

## Próximos passos recomendados

1. **Bio do Instagram** — adicionar link `https://phoenixglobal.com.br` se ainda não estiver nos "mais 2" links.
2. **Link na bio** — usar UTM: `?utm_source=instagram&utm_medium=bio&utm_campaign=phoenix_imports`
3. **Fernanda** — confirmar que inbox 8 (`@globalholdingphoenix`) está ativo no fast-reply-agent.
4. **Conta secundária** — decidir se `@phoenixglobalimports` redireciona bio para o site ou permanece legado.
5. **Reels** — linkar produtos do site nas legendas (`phoenixglobal.com.br/produtos/[slug]`).

---

## Variáveis de ambiente

```env
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/globalholdingphoenix
NEXT_PUBLIC_INSTAGRAM_HANDLE=globalholdingphoenix
NEXT_PUBLIC_FACEBOOK_URL=https://www.facebook.com/phoenixglobalimport
```

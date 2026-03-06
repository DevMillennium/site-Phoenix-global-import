# Phoenix Global Import — Análise e Arquitetura do E-commerce

## 1. ANÁLISE DO PRODUTO

### Objetivo do site
E-commerce de importados (eletrônicos, tecnologia, áudio, wearables, gaming) com estoque em Fortaleza-CE e envio para todo o Brasil. Foco em conversão, confiança e clareza de preço/entrega.

### Público-alvo
- Consumidores que buscam eletrônicos importados com preço competitivo
- Quem valoriza "pronta entrega", PIX e garantia de originalidade
- Perfil mobile-first (vitrine atual no Instagram)

### Proposta de valor
- **Estoque local** em Fortaleza — entrega mais rápida
- **Enviamos para todo Brasil**
- **Preços em destaque** (incl. PIX)
- **Produtos originais** e seminovos com descrição clara
- **Cotações sob demanda** ("Solicite cotação do produto que precisa")

### Diferenciais
- Marca Phoenix (logo fênix laranja/vermelho/dourado em fundo escuro)
- Mix de categorias: câmeras, áudio, gaming, wearables, acessórios
- Conteúdo rico: vídeos por produto, specs, badges (Pronta entrega!, 100% ORIGINAL, SEMINOVA)
- Métricas de engajamento (visualizações) como prova social

### Posicionamento
Premium acessível — qualidade visual e UX de loja global, com preços e logística brasileiros.

---

## 2. ARQUITETURA DA EXPERIÊNCIA (UX)

- **Fluxo:** Home → Categorias/Produtos → Detalhe do produto → Carrinho → Checkout/Contato
- **Hierarquia:** Hero + destaques → Grade de produtos → Filtros/categorias → Detalhe com vídeo/imagens/specs
- **Microinterações:** hover em cards, badges, botões "Compre agora", transições suaves
- **Conversão:** CTAs claros, preço e "Pronta entrega" em evidência, contato/cotação acessível

---

## 3. ESTRUTURA DO SITE

| Página | Função |
|--------|--------|
| **Home** | Hero, produtos em destaque, categorias, prova social, CTA contato/cotação |
| **Produtos** | Listagem com filtros por categoria (Câmeras, Áudio, Gaming, Wearables, Acessórios), ordenação, grid de cards |
| **Produto** | Galeria (imagens + vídeo), nome, preço, badges, descrição, specs, botão comprar/cotação |
| **Carrinho** | Itens, totais, link para WhatsApp/contato para fechar pedido |
| **Contato** | Formulário, WhatsApp, localização (Fortaleza), link Facebook/Instagram |
| **Sobre** | Quem somos, estoque Fortaleza, envio todo Brasil |

---

## 4. DESIGN SYSTEM

### Identidade (a partir do logo)
- **Primária:** laranja/vermelho fênix (#E85D04, #DC2F02)
- **Secundária:** dourado (#F4A261, #E9C46A)
- **Neutras:** fundo escuro (#0D0D0D, #1A1A1A), texto claro (#F8F8F8, #A0A0A0)
- **Destaque:** verde para "Pronta entrega", badges (original, seminova)

### Tipografia
- **Display:** bold, impacto (títulos hero e seções)
- **Body:** legível, hierarquia clara (nome do produto, preço, descrição)

### Componentes
- **ProductCard:** imagem, badge vídeo, nome, preço, tags (condição/entrega), métrica opcional
- **Badges:** condição (Novo, Seminova), entrega (Pronta entrega!), originalidade (100% ORIGINAL)
- **Botões:** primário (Compre agora), secundário (Solicitar cotação)
- **Header:** logo, navegação, busca, carrinho
- **Footer:** links, contato, redes, localização

---

## 5. STACK E ENTREGAS

- **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**, **Framer Motion**
- **SSR/SSG** onde fizer sentido; lazy loading de imagens; code splitting
- **SEO:** meta tags, Open Graph, structured data (Product), sitemap
- **Acessibilidade:** contraste, teclado, ARIA, foco visível
- **Responsividade:** mobile-first, grid adaptativo

Este documento serve como referência para a implementação do e-commerce.

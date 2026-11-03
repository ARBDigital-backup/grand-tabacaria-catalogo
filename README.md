# Catálogo Grand Tabacaria (protótipo)

Protótipo de apresentação: catálogo com busca, filtros por marca, escolha de sabor, carrinho e envio do pedido pelo WhatsApp. Sem back-end: os produtos estão em `produtos.js`.

## Arquivos

| Arquivo | O que tem |
|---|---|
| `index.html` | Estrutura da página e textos fixos (hero, perfumes, rodapé) |
| `styles.css` | Visual: cores em `:root`, tipografia, layout para celular e computador |
| `app.js` | Lógica: filtros, busca, carrinho e mensagem do WhatsApp. O número da loja fica na constante `WHATSAPP` no topo |
| `produtos.js` | Lista de produtos: marca, nome, preço, imagem, selo de novo e sabores |
| `img/` | Fotos dos produtos |

## Como abrir

Dê dois cliques no `index.html`, ou rode um servidor local na pasta: `python3 -m http.server 8000` e abra http://localhost:8000.

## Próxima fase

Trocar `produtos.js` por leitura do banco da plataforma ARB (estoque real), com painel do lojista.

Produtos, fotos e preços são exemplos para demonstração.

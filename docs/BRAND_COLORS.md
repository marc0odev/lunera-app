# Cores da marca Lunera

Extraídas por amostragem de pixels da logo oficial (`Lunera10.png`). A cliente avisou que as cores dos arquivos
não batem 100% entre si; o importante é manter a essência (azul, roxo, branco; ciclos da lua).

## Da logo
| Token | Hex | Onde aparece na logo | Uso no produto |
|---|---|---|---|
| indigo | `#3F399B` | núcleo do wordmark "Lunera" | cor principal, botões, títulos fortes |
| slate | `#495596` | texto "Healthcare" | texto secundário |
| violet | `#7D5ADF` | corpo do crescente | acentos, gráficos, "Moderate" |
| orchid | `#9C66D3` | início do degradê do wordmark | degradês decorativos |
| periwinkle | `#8299F8` | brilho do crescente | gráficos, decoração (não para texto branco) |
| royal | `#526CD7` | azul médio do crescente | "Mild", links |
| sky | `#4794CE` | fim do degradê do wordmark | acentos |
| aqua | `#6AC8E6` | ponta ciano do crescente | indicador "conectado", detalhes |
| lavender | `#DBC0F7` | reflexo claro do crescente | fundos suaves |

## Derivadas (ajustadas para legibilidade)
`ink #1E1B52` (texto principal), `violetDeep #6446C8` (violeta para texto pequeno), `hero #0F1238` (fundo escuro, cor da foto da caixa),
`paper #FAF9FF`, `mist #F1EEFC`, `line #E6E1F5`.

## Contraste (WCAG)
| Par | Razão | Resultado |
|---|---|---|
| ink / paper | 15,0:1 | AAA |
| slate / paper | 6,6:1 | AA (texto normal) |
| slate / mist | 6,1:1 | AA |
| branco / indigo | 9,3:1 | AAA |
| branco / violet | 4,8:1 | AA |
| branco / royal | 4,7:1 | AA |
| violetDeep / mist | 5,7:1 | AA (pílulas de status) |
| violetDeep / branco | 6,5:1 | AA |
| branco / hero | 18,0:1 | AAA |
| aqua / hero | 9,5:1 | AAA |
| violet / mist | 4,2:1 | **falha** para texto pequeno, por isso o texto usa violetDeep |
| branco / periwinkle | 2,7:1 | **falha**, periwinkle só em elementos decorativos |
| sky / branco | 3,3:1 | **falha** para texto pequeno, só para elementos gráficos |

# Sintomas do app: como a planilha da Ana virou configuração

Fonte: `analise_de_sintomas_APP.xlsx` (e-mail da Ana: "orientação do que medir e como medir os sintomas"). A planilha tem 19 linhas e 2 colunas de medição:
- **Forma de mensurar**: "Leve, moderado, forte, muito forte" para todos os sintomas.
- **Número de episódios noturnos/durante o dia**: marcado com "x" em 4 sintomas; em "Dificuldade de memória ou concentração" a coluna diz "escala de tempo, até dia todo".

Tudo fica em um único arquivo: `src/data/symptoms.js` (e os textos em `src/i18n/translations.js`, chaves `sym.<id>`).

## Regras aplicadas
| Regra da planilha | Como aparece no app |
|---|---|
| Leve, moderado, forte, muito forte | Controle de 5 passos: Nenhum, Leve, Moderado, Forte, Muito forte (o "Nenhum" permite registrar que não houve) |
| Número de episódios noturnos/durante o dia | Contador. De manhã (ao acordar) pergunta "Episódios durante a noite"; à noite pergunta "Episódios durante o dia" |
| Escala de tempo, até dia todo | Pergunta "Quanto tempo durou?": Minutos, 1 a 2 horas, Várias horas, O dia todo |

## Linha da planilha → app
| Linha da planilha | id | Área no corpo | Entrada extra |
|---|---|---|---|
| Mudanças na menstruação | `period` | Ciclo | |
| Ondas de calor | `hotFlashes` | Peito | episódios |
| Suor noturno | `nightSweats` | Peito | episódios |
| Dificuldade para dormir | `sleep` | Sono | |
| Mudanças de humor | `mood` | Mente | |
| Dificuldade de memória ou concentração | `memory` | Mente | duração |
| Mudanças no desejo sexual | `desire` | Ciclo | |
| Secura ou desconforto íntimo | `intimate` | Ciclo | |
| Mudanças urinárias | `urinary` | Ciclo | |
| Dores no corpo ou nas articulações | `aches` | Corpo | |
| Dores articulares mesmo sem lesão | `joints` | Corpo | |
| Maior sensibilidade ao álcool | `alcohol` | Corpo | |
| Boca seca ou sede constante | `dryMouth` | Boca | |
| Tontura e vertigem | `dizziness` | Mente | |
| Alterações de paladar | `taste` | Boca | |
| Palpitações | `palpitations` | Peito | |
| Ataques de pânico | `panic` | Mente | episódios |
| Formigamentos (mãos, pés, outras regiões) | `tingling` | Corpo | episódios |
| Sangramentos na gengiva | `gums` | Boca | |
| **Cansaço ou falta de energia** (fora da planilha) | `fatigue` | Corpo | |

As 6 áreas do corpo são Mente, Sono, Boca, Peito, Corpo e Ciclo. Cada área tem o botão "Nada aqui hoje", que registra tudo como "nenhum" em um toque.

## Pontos para confirmar com a Ana
1. **Cansaço não está na planilha**, mas foi o sintoma mais citado na pesquisa (74%). Mantive como item extra, marcado `extra: true`. Para tirar, apague a linha `fatigue` em `symptoms.js`.
2. **Duas linhas parecidas**: "Dores no corpo ou nas articulações" e "Dores articulares mesmo sem lesão". Mantive as duas como na planilha. Se forem a mesma coisa, é só remover uma.
3. **Escala de tempo da memória**: a planilha diz "até dia todo" sem definir os degraus. Usei Minutos, 1 a 2 horas, Várias horas e O dia todo. Confirmar.
4. **Episódios**: a planilha junta "noturnos/durante o dia". Interpretei como noite no registro da manhã e dia no registro da noite. Confirmar.
5. **Mudanças na menstruação** passou de Sim/Não para a escala de intensidade, como na planilha.
6. Os 5 degraus ("Nenhum" mais os 4 da planilha) são decisão minha para permitir "sem sintoma". A escala da pesquisa (1 a 5) foi convertida assim: 1 e 2 = leve, 3 = moderado, 4 = forte, 5 = muito forte.

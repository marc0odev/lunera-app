# Lunera App (protótipo de apresentação)

Protótipo em **React Native + Expo (SDK 58)**, seguindo o "Briefing de evolução do protótipo Lunera". Roda no celular (Expo Go) e no computador (web), sem backend: tudo fica salvo no próprio aparelho.
Idioma principal: português do Brasil, com seletor para EN, ES, FR e DE. Modo claro e escuro.

## Rodar
```bash
npm install
npx expo start        # QR code para o Expo Go; pressione "w" para abrir no navegador
npm run web           # direto no navegador
```
Para abrir em outro idioma na web: `http://localhost:8081/?lang=en`. Para mudar o idioma padrão: `DEFAULT_LANG` em `src/i18n/index.js`.
Para publicar a versão web em uma subpasta (ex.: `/app` no site): `EXPO_BASE_URL=/app npx expo export --platform web`.

## Mapa de telas (como no briefing)
| Tela | Onde está | O que faz |
|---|---|---|
| Abertura | `src/screens/Flow.js` (Opening) | Logo e, em seguida, a mulher se conectando ao App. Até 10 s, com "Pular" |
| Início | `HomeScreen.js` | "Climatério" em destaque, "Você não precisa passar por isso sozinha.", engrenagem "Ajustes", convite ao registro, progresso (ex.: 6/21 dias), Lunera Patch com a caixa aberta e botão de sincronização, informações que acolhem |
| Vamos começar | `Flow.js` (Start) | Só o plano salvo (duração, período, horários, sintomas). "Um dia de cada vez, no seu ritmo." |
| Meu aplicativo | `MyApp.js` | "Configure:" e as 4 seções: Minha representação, Sintomas e duração, Horários e lembretes, Minhas consultas |
| Meu diário | `DiaryScreen.js` | Momento do registro, "Registro 1/14", corpo estilizado com o patch (ou lista), escala e campos opcionais. Salvar leva ao acolhimento |
| Evolução | `EvolutionScreen.js` | Síntese, filtro de origem (meus registros ou exemplo sintético), gráficos e comparação com o patch |
| Minhas consultas | `ConsultScreen.js` | Prioridades, perguntas, relatório revisável e "Preparar envio" |
| Acolhimento | `Flow.js` (Welcome) | "Te ajudo com algo mais hoje?" e "É só selecionar abaixo:". Só a frase de apoio varia |
| Até logo | `Flow.js` (Bye) | Logo, a mulher olhando para a paciente, mensagem breve e "Voltar ao App" |
| Experiência 3D | `Experience3D.js` | Caixa aberta e patch em três camadas separáveis (como ele seria fisicamente). Atalho fixo "3D" na lateral direita |

A barra inferior (Início, Diário, Evolução, Minhas consultas, Ajustes) fica em todas as telas usuais; a abertura e a despedida a ocultam.

## Regras implementadas
- **Nome**: fonte única (`profile.name` em `src/state/app.js`), usado na saudação, no acolhimento, na despedida e no relatório. Sem nome, a saudação é neutra. Não existe nome fixo de demonstração.
- **Plano**: 7, 14 ou 21 dias; até 5 sintomas (um pode ser descrito pela própria pessoa); quatro opções de horário, iguais no diário e nas configurações; no modo "Ao levantar e antes de dormir", cada sintoma é atribuído a um momento.
- **Registro**: o dia avança pelo calendário, nunca ao salvar. Editar o mesmo dia e momento atualiza o registro. "Escolha a escala" começa sem valor; "Não registrar" é diferente de "Não senti". "Quantidade de eventos — opcional" começa em "Selecione".
- **Progresso**: dia concluído = todos os sintomas previstos respondidos ou marcados como "Não registrar". "Dias com registro" conta só os dias com dados que permitem análise. Pendências são avaliadas com o plano usado em cada registro (mudar o plano não cria pendências retroativas).
- **Mensagens de cuidado**: início, ponto intermediário (dia 4 de 7, 8 de 14, 11 de 21; uma versão sem pendências e outra com pendências) e conclusão, com os textos do briefing. Ao concluir, o App oferece evolução e consulta e não reinicia o ciclo sozinho.
- **Evolução**: lacunas aparecem como faixas claras, nunca como zero. A síntese só aparece com três dias ou mais. A correlação (Pearson) só é calculada nos dados de exemplo, com cinco pares ou mais, e vem com método, pares e janela.
- **Patch**: sincronização simulada. Sinais sintéticos de sono (movimento), batimento cardíaco, temperatura cutânea e condutância da pele. Sintomas sem sinal correspondente aparecem como "Sem medida equivalente".
- **Preparar envio**: disponibilização simulada, PDF (pela impressão do navegador) e rascunho para compartilhar. O App nunca diz que um profissional recebeu algo. Informações íntimas e textos livres só entram no relatório se a usuária permitir.
- **Lembretes**: preferência por alarme/calendário, WhatsApp ou SMS, sempre identificada como simulada.
- **Demonstração**: em Ajustes há controles para avançar um dia, reiniciar o acompanhamento e apagar os dados. Servem só para apresentar.

## Interação
- Folhas (sintomas de uma área, relatório, preparar envio) fecham ao **arrastar o topo para baixo** ou ao tocar fora, com animação.
- Botões encolhem ao toque e os ícones da barra inferior "saltam" ao serem escolhidos.
- Layout testado em 320, 360, 390 e 1280 px, em português, inglês e alemão: chips e linhas quebram em vez de cortar.

## Estrutura
- `App.js`, `src/Shell.js`: provedores, barra inferior e atalho 3D.
- `src/state/app.js`: estado único (perfil, plano, registros, consulta, patch) salvo no aparelho.
- `src/data/`: `symptoms.js` (20 sintomas, escala, áreas do corpo, cores da representação), `synthetic.js` (dados de exemplo), `mock.js` (locais do patch).
- `src/i18n/`: um arquivo JSON por idioma (`pt.json`, `en.json`, `es.json`, `fr.json`, `de.json`).
- `src/components/`: `Figure.js` (ilustração única: a mesma cabeça, pele, cabelo e roupa no avatar e no corpo do diário), `Body.js` (corpo com pontos e patch), gráficos, formulários, header e folhas.
- `assets/`: logo oficial, caixa aberta sem fundo e as duas imagens da mulher do protótipo de referência (`assets/people/`).

## Decisões para confirmar com a Ana
1. **Respiração ficou de fora** da comparação com o patch. O briefing cita "frequência cardíaca e respiração", mas a mensagem mais recente lista 4 parâmetros (sono por movimento, batimento cardíaco, temperatura cutânea e condutância). Segui os 4.
2. **Dados da pesquisa saíram do App**, como pedido. O App não usa mais nenhuma respondente como persona.
3. **Início e convite ao registro** estão na mesma tela (no briefing são duas).
4. **Campos obrigatórios**: considerei obrigatórios só os sintomas do plano; sono, energia e quantidade de eventos são opcionais.
5. **Imagens da mulher**: são as do protótipo de referência. As escolhas de aparência (tom de pele, cor do cabelo, 6 penteados, cor dos olhos, óculos, 3 silhuetas e cor da roupa) mudam juntas o avatar e o corpo do diário, não a foto.
6. **Telefone 3D retirado**: o conteúdo e a organização do telefone 3D do protótipo de referência foram trazidos para o próprio App. A experiência 3D ficou com a caixa aberta e o patch em camadas (perspectiva e giro por arrasto, sem WebGL).
7. As traduções foram feitas com apoio de IA: revisar alemão e francês antes da Suíça.

## Instalar pelo navegador (12/11)

`public/` traz o `manifest.json`, os ícones e o `index.html` da versão web. Com eles, o app publicado pode ser instalado com ícone:
no Android (Chrome › Instalar app), no iPhone (Safari › Compartilhar › Adicionar à Tela de Início) e no computador (Chrome/Edge).
Para publicar dentro do site: `EXPO_BASE_URL=/app npx expo export --platform web` e copiar a pasta `dist` para `lunera-site/public/app`.

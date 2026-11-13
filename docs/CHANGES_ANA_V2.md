# Versão 2: tom acolhedor, diário configurável e comparação com o Patch

Baseada no retorno da Ana (gostou do equilíbrio de cores, do corpo estilizado e das luas; pediu tom humano, sem dados da pesquisa dentro do App, e botão de sincronização com o Patch) e no briefing de desenvolvimento.

## O que mudou no App
| Área | Mudança |
|---|---|
| Pesquisa | Removida de todo o App (cartão "o que mulheres como você disseram", "Na sua pesquisa: ..." e perfil da persona). `src/data/persona.js` foi apagado. |
| Início | "Climatério" em destaque, "Você não precisa passar por isso sozinha.", engrenagem de configurações, **caixa aberta** no topo, convite "Entender suas mudanças começa com escutar você." e botão "Iniciar meu registro" → "Vamos começar" (só o plano salvo, sem "Lembretes ativados"). |
| Acompanhamento | "Registro 6/14", barra discreta + texto, dias com registro e pendências separados. Mensagens de início, ponto intermediário (dia 4/8/11 para 7/14/21 dias; com ou sem pendências) e conclusão, sem culpa e sem promessa clínica. |
| Diário | Só os sintomas escolhidos (até 5 + "outro"). Começa em "Escolha a escala" (ausência ≠ "Nenhum"). "Não registrar esta área" é explícito. Eventos: "Quantidade de eventos — opcional" / "Selecione". Salvar leva ao acolhimento. Editar o mesmo dia e momento atualiza o registro. |
| Patch | Botão **Sincronizar com o Patch** (Início, Diário e Evolução) com os 4 parâmetros: sono (movimento), batimento cardíaco, condutância da pele e temperatura da pele; possíveis fogachos como *candidatos*. Leitura **simulada**, identificada na tela. |
| Evolução | Síntese descritiva antes dos gráficos; filtro **Meus registros / Exemplo sintético**; sintoma em foco (intensidade, eventos, lacunas); comparação diário × Patch na mesma janela; correlação de Pearson só com ≥ 7 pares válidos e variância > 0, com método, pares e janela; avisos de que associação não é causa nem validação do sensor. |
| Minhas consultas | Prioridades, perguntas, observações, relatório revisável, controles de inclusão (sintomas íntimos e texto livre, desligados por padrão) e "Preparar envio" com 3 ações distintas, todas **simuladas** ("nada foi enviado"). |
| Meu aplicativo | "Configure:" com 4 seções na ordem: Minha representação, Sintomas e duração, Horários e lembretes, Minhas consultas. Salvar, voltar ao menu e confirmação ao sair com alterações não salvas. |
| Representação | Nome (fonte única, reflete em todas as telas; sem nome fixo), idade, tom de pele, cor e comprimento do cabelo e cor dos olhos no corpo estilizado. O padrão continua o lilás original. |
| Acolhimento e despedida | "Te ajudo com algo mais hoje?" (frases variam, botões fixos) e "Até logo" com a figura estilizada; barra inferior oculta na despedida. Abertura de ~8 s com "Pular". |
| Navegação | 5 abas: Início, Diário, Evolução, Consultas, Ajustes. |
| Idiomas | EN, PT, ES, FR e DE para todos os textos novos (`src/i18n/care.js`). |

## Decisões que tomei e que precisam de confirmação
1. **Imagem humana realista**: não gerei fotos de mulher. Usei a figura estilizada que a Ana elogiou, com sorriso discreto.
2. **Sintomas**: a lista de 19 da planilha continua, mas a pessoa escolhe até 5 (sugestão inicial: ondas de calor, suor noturno, sono, humor, memória). A Ana confirma se prefere todos.
3. **Campos obrigatórios** para considerar um dia concluído: todas as áreas dos sintomas escolhidos respondidas ou marcadas "Não registrar".
4. **Idioma padrão** segue o e-mail da Ana (inglês, com troca para PT/ES/FR/DE).
5. **Ferramentas da demonstração** (Ajustes): simular outro dia do plano, para mostrar as mensagens do meio e do fim.
6. O texto do briefing "mulher conectando-se ao App" na abertura usa a figura estilizada com o Patch.

## Não implementado / simulado
Backend, envio real (WhatsApp, SMS, e-mail, PDF), sensor real, algoritmos clínicos e gêmeo digital. Tudo isso está identificado como simulado na interface.

## Como rodar
`npm install` e `npx expo start --web` (ou `npm run web`). Para regenerar capturas e vídeo, use os scripts já existentes do projeto.

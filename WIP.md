Titolo: Assessment adattivo e multimodale (domande una-alla-volta, stili coach, esecuzione codice)

Obiettivo
Progetta e implementa un assessment che misura la padronanza per topic (Arrays, Hooks, Types, Functions, …) mostrando UNA domanda per volta, adattando difficoltà e formato alla performance e allo “stile coach” scelto (Elia profondo, Skippy rapido, Lupa collaborativo, Polpo ibrido).

Requisiti chiave
1) Formati domanda
   - Multiple choice (singola/multipla) con shuffle.
   - Cloze/fill-in-the-blank su codice.
   - Ordina passi/algoritmo.
   - Debug/explain (trova il bug e spiega).
   - Code-run JS/TS in sandbox (WebWorker/iframe) con test pubblici/nascosti.
   - Domande aperte brevi con rubric (no grading 100% LLM-only).

2) Esecuzione di codice
   - Sandbox isolata con timeout, memory cap, cattura console/output.
   - Autograder con punteggio parziale (es. N test su M).
   - Mostra diff atteso/ottenuto e log errori.

3) Adattività
   - Una domanda alla volta; blocco successivo selezionato in base a prestazioni recenti.
   - Modello semplice (IRT/BKT light): aggiorna “ability per topic”.
   - Se risposta sbagliata con alta confidence ⇒ domanda di scaffold + riduci difficoltà.
   - Se risposte corrette rapide ⇒ alza difficoltà o cambia formato (es. da MCQ a code-run).

4) Modalità coach (stili di apprendimento)
   - Elia: ritmo calmo, why-questions, step-by-step hints, spiegazioni estese.
   - Skippy: micro-challenges a tempo, feedback immediato, cicli rapidi.
   - Lupa: item collaborativi (scegli miglior spiegazione tra 2-3), peer-review sintetica simulata.
   - Polpo: mix adattivo delle tre strategie precedenti in base ai segnali (tempo, errori, confidence).

5) Metadati & punteggio
   - Traccia: tempo risposta, hint usati, confidence (basso/medio/alto), retry.
   - Punteggio parziale per cloze/ordering/code-run; costo per hint.
   - Mastery per topic + trend.

6) UX & Accessibilità
   - Stepper con UNA domanda, tasti avanti/indietro controllati, salvataggio stato.
   - Keyboard-first, ARIA per combobox/select/editor, annunci errori, contrasto adeguato.
   - Mobile friendly: editor comprimibile, layout responsivo.

7) Anti-abuso soft
   - Shuffle opzioni; varianti equivalenti degli item (templating).
   - Limitazioni soft su copy/paste solo dove sensato (senza penalizzare accessibilità).

8) Output & feedback finale
   - Report mastery per topic, errori comuni, “next best actions” (link a mini-lezioni/esercizi).
   - Ricompense cosmetiche (skin/rarità coach) basate su mastery, streak, velocità; alcune sbloccabili, altre acquistabili (solo cosmetico).

9) Persistenza (indicativa)
   - Modelli: AssessmentSession, AssessmentItem, ItemResponse (answer, correct, score, timeMs, confidence, hintsUsed, codeRunLog).
   - Salvataggio e ripresa sessione; supporto offline→online sync.

Criteri di accettazione
- Flusso completo UNA-ALLA-VOLTA con adattività funzionante.
- Almeno 5 formati domanda attivi, incluso code-run con autograder e punteggio parziale.
- Modalità coach che modificano timing, feedback, hint e formato dei prossimi item.
- Report finale con mastery per topic e suggerimenti studio.
- Accessibilità WCAG 2.1 AA su componenti interattivi principali.
- Suite di test: unit (render/stati/validatori), integration (adattività e scoring), task tests (stati e progressi persistono su reload e offline→online), E2E per i flussi chiave.

richiesta uno:

# Product Overview

Zuno is a personalized learning platform that combines course management with an AI coaching system. The web application provides users with:

## Core Features
- **Course Catalog**: Browse and enroll in courses across different categories and difficulty levels
- **Assessment-Driven Learning**: Focus on what you don't know through continuous assessment and adaptive content
- **Personalized Learning**: Track progress, streaks, and XP across lessons and courses
- **AI Coach System**: Four distinct coaching personalities (Elia, Skippy, Lupa, Polpo) that adapt the learning experience
- **Gamification**: XP rewards, achievements, streaks, and progress tracking
- **User Profiles**: Subscription tiers, learning preferences, and activity tracking

## Coach Personalities
- **Elia (Elephant)**: Deep, reflective, methodical learning approach
- **Skippy (Squirrel)**: Fast, dynamic, exploratory learning style  
- **Lupa (Wolf)**: Collaborative, social learning experience
- **Polpo (Octopus)**: Adaptive hybrid approach that intelligently combines multiple learning strategies

## Target Users
Learners seeking a personalized, gamified educational experience with adaptive coaching based on their learning style preferences, accessed through web browsers.

## Key Value Propositions
- Assessment-driven learning that focuses on knowledge gaps
- Adaptive learning experience through AI coaching
- Comprehensive progress tracking and gamification
- Multi-modal content delivery (text, quizzes, practice, games)
- Social and collaborative learning elements
- Professional yet engaging web interface

Above you can see my add description, you task is to implement the pages for 
Initial Assessment, the page can visualize multuole type of quiz enum QuestionTypeValues {
  MULTIPLE_CHOICE
  TRUE_FALSE
  SHORT_ANSWER
  FILL_IN_THE_BLANK
  MATCHING
  ORDERING
  ESSAY
  CODING
  IMAGE
  AUDIO
  VIDEO
  OTHER
} e the user need to answer all the questins to get the final assessment result the assessnet result is not just a store it will be an AI analized asssessment that privide deep knowledge insiths (and also the score)

La pagina valuda i rpogressi permette di valutare i progressi n app ma anche di inserire a mano gli argomenti che si sono studiati ed appresi altrove, il sistema analizza tutto e genera una pagina complessiva di progresso

set di missioni giornaliere da completare con quiz per restare aggiornato sugli ultimi argomenti

Per ogni corso voglio una pagina di dettaglio che mi spiega i contenuti,  prerequisiti, tempo medio di apprendimento, difficoltà e così via

Una volta fatto enroll il corso compare nei miei corsi e quindi premendo "continue learning" mi compare una nuova pagina dove posso studiare, quindi ci sarà il testo del corso, dove viene evidenziato quello che già so rispetto ai progressi, quello che devo approfondire e le sfide per imparare

richiesta due:

Sulla grafica non ci siamo, allinea la grafica alle foto che ti ho condiviso. Neppure sulla gamification ci siamo, il sito è piatto e noioso. L'assessment è il classico elenco di domande. 

Titolo: Assessment adattivo e multimodale (domande una-alla-volta, stili coach, esecuzione codice)

Obiettivo
Progetta e implementa un assessment che misura la padronanza per topic (Arrays, Hooks, Types, Functions, …) mostrando UNA domanda per volta, adattando difficoltà e formato alla performance e allo “stile coach” scelto (Elia profondo, Skippy rapido, Lupa collaborativo, Polpo ibrido).

Requisiti chiave
1) Formati domanda
   - Multiple choice (singola/multipla) con shuffle.
   - Cloze/fill-in-the-blank su codice.
   - Ordina passi/algoritmo.
   - Debug/explain (trova il bug e spiega).
   - Code-run JS/TS in sandbox (WebWorker/iframe) con test pubblici/nascosti.
   - Domande aperte brevi con rubric (no grading 100% LLM-only).

2) Esecuzione di codice
   - Sandbox isolata con timeout, memory cap, cattura console/output.
   - Autograder con punteggio parziale (es. N test su M).
   - Mostra diff atteso/ottenuto e log errori.

3) Adattività
   - Una domanda alla volta; blocco successivo selezionato in base a prestazioni recenti.
   - Modello semplice (IRT/BKT light): aggiorna “ability per topic”.
   - Se risposta sbagliata con alta confidence ⇒ domanda di scaffold + riduci difficoltà.
   - Se risposte corrette rapide ⇒ alza difficoltà o cambia formato (es. da MCQ a code-run).

4) Modalità coach (stili di apprendimento)
   - Elia: ritmo calmo, why-questions, step-by-step hints, spiegazioni estese.
   - Skippy: micro-challenges a tempo, feedback immediato, cicli rapidi.
   - Lupa: item collaborativi (scegli miglior spiegazione tra 2-3), peer-review sintetica simulata.
   - Polpo: mix adattivo delle tre strategie precedenti in base ai segnali (tempo, errori, confidence).

5) Metadati & punteggio
   - Traccia: tempo risposta, hint usati, confidence (basso/medio/alto), retry.
   - Punteggio parziale per cloze/ordering/code-run; costo per hint.
   - Mastery per topic + trend.

6) UX & Accessibilità
   - Stepper con UNA domanda, tasti avanti/indietro controllati, salvataggio stato.
   - Keyboard-first, ARIA per combobox/select/editor, annunci errori, contrasto adeguato.
   - Mobile friendly: editor comprimibile, layout responsivo.

7) Anti-abuso soft
   - Shuffle opzioni; varianti equivalenti degli item (templating).
   - Limitazioni soft su copy/paste solo dove sensato (senza penalizzare accessibilità).

8) Output & feedback finale
   - Report mastery per topic, errori comuni, “next best actions” (link a mini-lezioni/esercizi).
   - Ricompense cosmetiche (skin/rarità coach) basate su mastery, streak, velocità; alcune sbloccabili, altre acquistabili (solo cosmetico).

9) Persistenza (indicativa)
   - Modelli: AssessmentSession, AssessmentItem, ItemResponse (answer, correct, score, timeMs, confidence, hintsUsed, codeRunLog).
   - Salvataggio e ripresa sessione; supporto offline→online sync.

Criteri di accettazione
- Flusso completo UNA-ALLA-VOLTA con adattività funzionante.
- Almeno 5 formati domanda attivi, incluso code-run con autograder e punteggio parziale.
- Modalità coach che modificano timing, feedback, hint e formato dei prossimi item.
- Report finale con mastery per topic e suggerimenti studio.
- Accessibilità WCAG 2.1 AA su componenti interattivi principali.
- Suite di test: unit (render/stati/validatori), integration (adattività e scoring), task tests (stati e progressi persistono su reload e offline→online), E2E per i flussi chiave.

La valutazione dei progrssi mi immagino un grafico, con degli insights già scritti (anche sllo com placeholder) una descrizione del mio profilo, la possibilità di esportare i progressi per esempio per applicare ad un lavoro. Una sorta di achievement con badge. In più posso descrivere in una sorta di timeline cosa ho imparato giorno dopo giorno così da far generare al sistema dei quiz. 

Nel focus check mi deve dire perchè mi sta chiedendo quella cosa, è una carenza identificata? ho inseirto io l'argomento tra i progressi? è semplicemente un upate sui corsi che ho fatto in passato o novità nel settore?

Anche la aprte dei corsi va rivista, ho aggiunto un esempio di dettaglio del corso.  Le domande segui più o meno le legoche di prima tuttavia qui gli argomenti sono specifici.
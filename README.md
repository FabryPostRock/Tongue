[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?logo=vite&logoColor=white)](https://vite.dev/guide/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E%20Testing-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/docs/intro)
[![Firebase Hosting](https://img.shields.io/badge/Firebase-Hosting-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/products/hosting)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/fabrizio-de-masi-55016088/)

<p align="center">
  <img src="public/web-app-manifest-192x192.png" alt="Logo Tongue" width="120">
</p>

# Tongue

Landing page e news app sviluppata con **Vite**, JavaScript modulare, Bootstrap, SCSS, test unitari con **Vitest** e test end-to-end con **Playwright**.

Il progetto presenta il brand **Tongue**, una piattaforma di informazione smart, chiara e accessibile, e integra una sezione dinamica di news caricate dalla **Hacker News API**.

<a href="https://tongue-8869e.web.app/">View Demo</a>

---

## Indice

- [Tongue](#tongue)
  - [Indice](#indice)
  - [Funzionalità principali](#funzionalità-principali)
  - [Stack tecnico](#stack-tecnico)
  - [Struttura del progetto](#struttura-del-progetto)
  - [Architettura JavaScript](#architettura-javascript)
    - [`main.js`](#mainjs)
    - [`hacker_news_api.js`](#hacker_news_apijs)
    - [`observable.js`](#observablejs)
    - [`observers.js`](#observersjs)
    - [`utilities.js`](#utilitiesjs)
    - [`animations.js`](#animationsjs)
  - [Installazione](#installazione)
  - [Script consigliati](#script-consigliati)
  - [Avvio in locale](#avvio-in-locale)
  - [Build di produzione](#build-di-produzione)
  - [Test](#test)
    - [Test unitari con Vitest](#test-unitari-con-vitest)
    - [Test end-to-end con Playwright](#test-end-to-end-con-playwright)
  - [Deploy su Firebase Hosting collegato a GitHub](#deploy-su-firebase-hosting-collegato-a-github)
    - [1. Installa Firebase CLI](#1-installa-firebase-cli)
    - [2. Esegui login](#2-esegui-login)
    - [3. Verifica la build locale](#3-verifica-la-build-locale)
    - [4. Inizializza Firebase Hosting](#4-inizializza-firebase-hosting)
    - [5. Collega GitHub](#5-collega-github)
    - [6. Deploy manuale opzionale](#6-deploy-manuale-opzionale)
  - [Configurazione consigliata Firebase](#configurazione-consigliata-firebase)
  - [Workflow GitHub Actions con test prima del deploy](#workflow-github-actions-con-test-prima-del-deploy)
  - [Checklist prima del deploy](#checklist-prima-del-deploy)
    - [SEO e metadati](#seo-e-metadati)
    - [Asset nella cartella `public`](#asset-nella-cartella-public)
    - [CSS/SCSS](#cssscss)
    - [Test](#test-1)
    - [Firebase](#firebase)
  - [Note di manutenzione](#note-di-manutenzione)
    - [Gestione news](#gestione-news)
    - [Pattern Observable](#pattern-observable)
    - [Test con moduli che leggono il DOM](#test-con-moduli-che-leggono-il-dom)
  - [Possibili miglioramenti futuri](#possibili-miglioramenti-futuri)
  - [Licenza](#licenza)
  - [Autore](#autore)

---

## Funzionalità principali

- Landing page responsive per il brand **Tongue**.
- Sezioni statiche: hero, presentazione del progetto, founder, contatti e social.
- Sezione news dinamica alimentata dalla Hacker News API.
- Caricamento progressivo delle news a blocchi da 10 elementi.
- Pulsante “carica altri contenuti”.
- Pulsante di reset che riporta il contatore delle news all’inizio e ricarica la pagina.
- Eliminazione di una news dalla vista tramite click sulla card.
- Animazioni reveal-on-scroll tramite `IntersectionObserver`.
- Animazione decorativa della lente in background con `requestAnimationFrame`.
- Persistenza temporanea dello stato delle news tramite `sessionStorage`.
- Test unitari su API wrapper, Observable, storage utilities e rendering DOM.
- Test end-to-end Playwright su clickabilità dei pulsanti e animazioni scroll.
- Configurazione pronta per deploy statico su Firebase Hosting.

---

## Stack tecnico

- **Vite** per sviluppo e build frontend.
- **JavaScript ES Modules**.
- **Bootstrap 5** tramite CDN.
- **SCSS/CSS custom** per tema, colori, animazioni e componenti.
- **Axios** per le chiamate HTTP alla Hacker News API.
- **Vitest** per test unitari.
- **JSDOM** per testare moduli che interagiscono con il DOM.
- **Playwright** per test end-to-end multi-browser.
- **Firebase Hosting** per il deploy.
- **GitHub Actions** tramite integrazione Firebase Hosting/GitHub.

---

## Struttura del progetto

```text
.
|-- public
|   |-- favicon.ico
|   |-- favicon.svg
|   |-- ...
|
|-- src
|   |-- assets
|       |-- css
|       |   |-- scss
|       |       |-- main.scss
|       |       |-- colors.scss
|       |       |-- animations.scss
|       |       |-- custom_shapes.scss
|       |       |-- ...scss
|       |
|       |-- fonts
|       |   |-- fonts.css
|       |   |-- icomoon.eot
|       |   |-- icomoon.svg
|       |   |-- icomoon.ttf
|       |   |-- icomoon.woff
|       |
|       |-- img
|       |   |-- founder_tongue.png
|       |   |-- ...png
|       |
|       |-- js
|           |-- main.js
|           |-- main.test.js
|           |-- hacker_news_api.js
|           |-- hacker_news_api.test.js
|           |-- observable.js
|           |-- observable.test.js
|           |-- observers.js
|           |-- observers.test.js
|           |-- utilities.js
|           |-- utilities.test.js
|           |-- animations.js
|
|-- tests
|   |-- clicks.spec.js
|   |-- reveal-on-scroll.spec.js
|
|-- index.html
|-- vitest.config.js
|-- vitest.setup.js
|-- playwright.config.js
```

> Nota: nel materiale fornito non era presente `package.json`. I comandi indicati sotto assumono gli script Vite/Vitest/Playwright standard. Verifica o aggiungi gli script nella sezione [Script consigliati](#script-consigliati).

---

## Architettura JavaScript

### `main.js`

È il punto di orchestrazione dell’applicazione.

Responsabilità principali:

- inizializza le chiavi usate in `sessionStorage`;
- importa dinamicamente i moduli che dipendono dal DOM;
- recupera la lista degli ID delle news da Hacker News;
- carica le news a blocchi da 10;
- registra i listener sui pulsanti di caricamento e reset;
- abilita la cancellazione delle news dalla vista;
- collega gli elementi `.reveal` all’`IntersectionObserver`;
- avvia l’animazione della lente.

Flusso semplificato:

```text
DOMContentLoaded
  -> importa observers.js e animations.js
  -> configura pulsanti
  -> osserva sezioni .reveal
  -> recupera IDs Hacker News
  -> salva IDs in sessionStorage
  -> carica primo blocco di 10 news
  -> abilita eliminazione news
  -> avvia animazione lente
```

---

### `hacker_news_api.js`

Contiene la classe statica `HackerNewsAPI`, che incapsula le chiamate HTTP verso Hacker News tramite Axios.

Endpoint usati:

```text
https://hacker-news.firebaseio.com/v0/newstories.json
https://hacker-news.firebaseio.com/v0/item/{id}.json
```

Metodi principali:

- `getAllNewsIDs(url)`: recupera gli ID delle ultime news.
- `getBlockNewsDetails(id)`: recupera il dettaglio di una singola news.
- `reset()`: resetta lo stato statico interno usato nei test.

Entrambi i metodi gestiscono retry e restituiscono un oggetto normalizzato:

```js
{
  data: null | Array | Object,
  ok: boolean,
  status: number,
  error: null | string
}
```

---

### `observable.js`

Implementa un semplice pattern **Observable**.

Classi principali:

- `Observable`: gestisce registrazione, rimozione e notifica degli observer.
- `News`: estende `Observable` e mantiene una `Map` interna delle news caricate.

La classe `News` espone:

- `addNews(item)`: valida, normalizza e aggiunge una news.
- `removeNews(id)`: rimuove una news e notifica gli observer.
- `snapshot()`: restituisce una copia serializzabile delle news.

---

### `observers.js`

Gestisce il rendering DOM delle news e le animazioni reveal-on-scroll.

Responsabilità principali:

- genera HTML per news con URL esterno;
- genera HTML per news con testo interno;
- gestisce il caso di news senza URL e senza testo descrittivo;
- aggiorna il DOM quando una news viene aggiunta o rimossa;
- applica/rimuove la classe `active` agli elementi `.reveal` tramite `IntersectionObserver`.

---

### `utilities.js`

Contiene `safeStorage`, una utility class statica per usare `sessionStorage` in modo più sicuro.

Metodi principali:

- `safeStorage.getFrom(storageClass, kStorage)`
- `safeStorage.setTo(storageClass, kStorage, el)`
- `safeStorage.clearStorage(storageClass)`

La classe gestisce errori di parsing, serializzazione e parametri mancanti.

---

### `animations.js`

Gestisce l’animazione della lente in background.

La funzione principale è:

```js
animate();
```

L’animazione:

- legge le dimensioni della scena;
- aggiorna le coordinate della lente;
- gestisce collisioni sui bordi;
- sincronizza la posizione dell’immagine interna;
- usa `requestAnimationFrame` per il loop continuo.

---

## Installazione

Dalla root del progetto:

```bash
npm install
```

Installa anche i browser necessari a Playwright:

```bash
npx playwright install
```

---

## Script consigliati

Se non sono già presenti in `package.json`, puoi usare una configurazione simile:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:report": "playwright show-report"
  }
}
```

Se il CSS finale viene generato da SCSS e `main.css` non è versionato nel repository, aggiungi anche uno script dedicato, ad esempio:

```json
{
  "scripts": {
    "scss:build": "sass src/assets/css/scss/main.scss src/assets/css/scss/main.css --style=compressed",
    "build": "npm run scss:build && vite build"
  }
}
```

In alternativa, puoi importare direttamente `main.scss` dal codice JavaScript e lasciare che Vite gestisca la compilazione SCSS, purché `sass` sia installato:

```bash
npm install -D sass
```

---

## Avvio in locale

```bash
npm run dev
```

Vite avvierà il progetto in locale, normalmente su:

```text
http://localhost:5173
```

---

## Build di produzione

```bash
npm run build
```

La build di produzione viene generata nella cartella:

```text
dist
```

Per verificare localmente la build:

```bash
npm run preview
```

---

## Test

### Test unitari con Vitest

Esegui tutti i test unitari:

```bash
npm run test:run
```

Oppure in modalità watch:

```bash
npm run test
```

Aree coperte dai test unitari:

- chiamate Hacker News API con Axios mockato;
- gestione retry e risposte normalizzate;
- `safeStorage` e gestione errori JSON;
- classi `Observable` e `News`;
- rendering DOM delle news;
- logica `getNewsBlock`;
- eliminazione delle news dal DOM e dalla `Map` interna.

---

### Test end-to-end con Playwright

Esegui i test end-to-end:

```bash
npm run test:e2e
```

Il file `playwright.config.js` avvia automaticamente il dev server con:

```bash
npm run dev
```

I test E2E verificano:

- titolo pagina;
- visibilità e clickabilità del pulsante “carica altri contenuti”;
- caricamento progressivo da 10 a 20 news;
- visibilità e clickabilità del pulsante di reset;
- attivazione delle sezioni `.reveal` durante lo scroll;
- esecuzione su Chromium, Firefox e WebKit.

Per visualizzare il report HTML Playwright:

```bash
npm run test:e2e:report
```

---

## Deploy su Firebase Hosting collegato a GitHub

### 1. Installa Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Esegui login

```bash
firebase login
```

### 3. Verifica la build locale

```bash
npm run build
```

La cartella da pubblicare su Firebase Hosting deve essere:

```text
dist
```

### 4. Inizializza Firebase Hosting

Dalla root del progetto:

```bash
firebase init hosting
```

Durante la configurazione:

```text
? What do you want to use as your public directory? dist
? Configure as a single-page app? No
? Set up automatic builds and deploys with GitHub? Yes
```

Per questa landing page statica puoi rispondere `No` alla domanda sulla single-page app. Se in futuro aggiungi routing client-side, puoi rispondere `Yes` oppure aggiungere manualmente una rewrite verso `/index.html`.

### 5. Collega GitHub

Quando la CLI chiede di configurare GitHub:

- seleziona il repository GitHub del progetto;
- autorizza Firebase a creare i workflow;
- scegli il branch di produzione, ad esempio `main`;
- imposta il comando di build:

```bash
npm ci && npm run build
```

Quando lanci:

```bash
npm ci
```

npm:

- legge package-lock.json;
- cancella completamente la cartella node_modules;
- reinstalla tutte le dipendenze esattamente come sono bloccate nel lockfile;
- non aggiorna package-lock.json;
- fallisce se package.json e package-lock.json non sono coerenti.

La CLI creerà automaticamente i workflow in:

```text
.github/workflows/
```

Tipicamente verranno creati workflow per:

- deploy su canali preview quando apri una Pull Request;
- deploy live quando fai merge sul branch principale.

### 6. Deploy manuale opzionale

Puoi sempre pubblicare manualmente con:

```bash
firebase deploy --only hosting
```

---

## Configurazione consigliata Firebase

Esempio base di `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
  }
}
```

Se in futuro il progetto diventa una SPA con routing client-side, puoi usare:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

Esempio di `.firebaserc`:

```json
{
  "projects": {
    "default": "YOUR_FIREBASE_PROJECT_ID"
  }
}
```

Sostituisci `YOUR_FIREBASE_PROJECT_ID` con l’ID reale del progetto Firebase.

---

## Workflow GitHub Actions con test prima del deploy

La configurazione automatica di Firebase Hosting può essere sufficiente per il deploy. Se vuoi aggiungere un controllo qualità prima della build, puoi modificare il workflow includendo i test.

Esempio indicativo:

```yaml
name: Firebase Hosting Deploy

on:
  push:
    branches:
      - main
  pull_request:

jobs:
  build_and_test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:run

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npm run test:e2e

      - name: Build
        run: npm run build
```

> Nota: il workflow generato da Firebase conterrà anche lo step di deploy tramite Firebase Hosting Action e userà un secret GitHub creato dalla Firebase CLI. Non cancellare quel secret.

---

## Checklist prima del deploy

Prima di pubblicare in produzione, controlla questi punti.

### SEO e metadati

Nel file `index.html` sono presenti alcuni placeholder:

```text
TO_BE_FILLED
```

Sostituiscili con il dominio reale, ad esempio:

```html
<link rel="canonical" href="https://www.tongue.it/" />
<meta property="og:url" content="https://www.tongue.it/" />
<meta property="og:image" content="https://www.tongue.it/web-app-manifest-192x192.png" />
```

Aggiorna anche i dati strutturati JSON-LD:

```json
{
  "url": "https://www.tongue.it/",
  "logo": "https://www.tongue.it/favicon.svg"
}
```

---

### Asset nella cartella `public`

Con Vite, gli asset dentro `public` sono serviti dalla root del sito.

Quindi, in produzione, è consigliato usare percorsi come:

```html
<link rel="icon" href="/favicon.ico" /> <img src="/web-app-manifest-192x192.png" alt="Tongue" />
```

invece di:

```html
<link rel="icon" href="public/favicon.ico" />
```

Verifica anche tutti i riferimenti a immagini, manifest e favicon prima della build.

---

### CSS/SCSS

Nel file HTML viene caricato:

```html
<link href="src/assets/css/scss/main.css" rel="stylesheet" />
```

Se `main.css` non è presente nel repository, la build/deploy potrebbe non includere correttamente lo stile.

Soluzioni possibili:

1. versionare `main.css` generato;
2. compilare SCSS prima della build;
3. importare `main.scss` da JavaScript e lasciare la compilazione a Vite.

---

### Test

Prima di fare merge sul branch principale:

```bash
npm run test:run
npm run test:e2e
npm run build
```

---

### Firebase

Controlla che:

- `firebase.json` punti a `dist`;
- il progetto Firebase corretto sia indicato in `.firebaserc`;
- i workflow GitHub siano presenti in `.github/workflows/`;
- i secret GitHub creati dalla Firebase CLI siano presenti nel repository;
- il branch configurato per il deploy live sia quello corretto, ad esempio `main`.

---

## Note di manutenzione

### Gestione news

Le news sono caricate a blocchi da 10. Lo stato dell’indice corrente è salvato in `sessionStorage` tramite la chiave:

```text
news:idxStartId
```

La lista degli ID recuperati da Hacker News è salvata con:

```text
news:itemsIds
```

Il flag di fine aggiornamenti è salvato con:

```text
news:enNewsUpdates
```

---

### Pattern Observable

Il rendering non è eseguito direttamente dalla classe `News`, ma tramite observer registrati.

Questo rende più semplice:

- testare la logica dati separatamente dal DOM;
- aggiungere altri observer in futuro;
- mantenere separata la logica di stato dalla logica di rendering.

---

### Test con moduli che leggono il DOM

Alcuni moduli leggono elementi dal DOM al momento dell’importazione. Nei test con JSDOM è quindi importante creare prima il DOM minimo e importare dopo il modulo.

Esempio:

```js
document.body.innerHTML = `<div id="news-container"></div>`;
const { renderNewsChange } = await import('./observers.js');
```

---

## Possibili miglioramenti futuri

- Separare template HTML e logica eventi per le card news.
- Aggiungere un loader durante il caricamento delle news.
- Aggiungere messaggi utente in caso di errore API.
- Aggiungere test accessibility con Playwright.
- Aggiungere Lighthouse CI nel workflow GitHub Actions.
- Gestire `main.scss` direttamente tramite Vite invece di linkare un CSS generato manualmente.
- Sostituire i placeholder SEO con variabili di ambiente o configurazione centralizzata.

---

## Licenza

Questo progetto è distribuito sotto licenza MIT. Consulta il file [LICENSE](LICENSE) per maggiori dettagli.

---

## Autore

Progetto sviluppato da **Fabrizio De Masi**.

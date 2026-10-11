# Pokédex

A responsive Pokédex web app powered by the [PokéAPI](https://pokeapi.co/). It is built with vanilla JavaScript ES modules, Vite, and i18next.

## Features

- Browse Pokémon cards with pagination and search.
- Open an accessible detail dialog with Pokémon information, base stats, evolution chains, and level-up moves.
- Navigate between Pokémon while keeping the selected detail tab open.
- Choose from the languages provided by PokéAPI. Pokémon names, types, stats, moves, and descriptions use the selected language when the API provides a translation.
- Select a translated interface in English, German, French, Spanish, Italian, Japanese, Korean, Simplified Chinese, or Traditional Chinese. Other API languages fall back to English for interface text.
- Detect the browser's preferred language on the first visit and remember the user's selection.
- Switch between light and dark themes.
- Show a themed loading intro while the initial Pokédex data is prepared.

The app requires an internet connection to load Pokémon data and artwork from PokéAPI and its sprite repository.

## Requirements

- Node.js and npm
- An internet connection

## Development

Install dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://127.0.0.1:5173/`. If that port is already in use, Vite selects another available port. Use the URL printed in the terminal.

Run the production build and preview it locally:

```bash
npm run build
npm run preview
```

The production files are generated in `dist/`. Serve this directory with a static web server when deploying the app. Do not open `index.html` through VS Code Live Server; this project relies on Vite to process its ES modules and stylesheets.

## Project structure

```text
Pokedex/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── public/
│   └── assets/
│       └── pokeball.svg
└── src/
    ├── main.js
    ├── app.js
    ├── api/
    │   └── pokeapi.js
    ├── data/
    │   └── pokemon.js
    ├── state/
    │   └── pokedex.js
    ├── i18n/
    │   ├── index.js
    │   ├── apiContent.js
    │   ├── languageNames.js
    │   └── locales/
    ├── styles/
    │   ├── base.css
    │   ├── responsive.css
    │   ├── components/
    │   │   ├── cards.css
    │   │   ├── dialog.css
    │   │   └── loader.css
    │   └── themes/
    │       └── pokemon-types.css
    └── ui/
        ├── cards.js
        ├── dialog.js
        ├── dialogContent.js
        ├── header.js
        ├── html.js
        ├── interface.js
        ├── languagePicker.js
        ├── loader.js
        ├── templates.js
        └── theme.js
```

## Where to make changes

- Application startup and module wiring: `src/main.js` and `src/app.js`
- API requests and request caching: `src/api/pokeapi.js`
- Pokémon loading, pagination, and search: `src/data/pokemon.js`
- Shared application state: `src/state/pokedex.js`
- Interface translations: `src/i18n/locales/`
- Pokémon and API-provided translations: `src/i18n/apiContent.js`
- UI components and markup: `src/ui/`
- Global, component, responsive, and type styles: `src/styles/`
- Static files served as-is: `public/`

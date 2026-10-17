# poulinal.github.io

A personal academic website for an astrophysicist, built with plain HTML, CSS and JavaScript. There's no build step and no framework, and it's hosted free on GitHub Pages.

| Page | File | What it shows |
|---|---|---|
| Home | `index.html` | Photo + intro, highlight cards, selected publications, news |
| About | `aboutme.html` | Bio, research interests, positions, education, awards |
| Publications | `publications.html` | Searchable list with abstracts, links, BibTeX and a **signature plot** per paper |
| Tutorials | `runcode-template.html` | Jupyter-style notebooks: readers **edit and run Python in the browser** |

All four pages share the same toolbar and footer, which are generated from one config file.

> **Everything shipped here is placeholder content** ("Ada Astronomer", made-up papers, generated plots). Replace it with your own before publishing.

---

## Contents

1. [Quick start](#1-quick-start)
2. [How the code is organised (MVC)](#2-how-the-code-is-organised-mvc)
3. [Customisation cookbook](#3-customisation-cookbook)
4. [Writing tutorials](#4-writing-tutorials)
5. [Deploying](#5-deploying)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Quick start

```bash
cd poulinal.github.io
python3 -m http.server 8000
# open http://localhost:8000
```

You can also double-click any `.html` file. Most things work from `file://`; see [Troubleshooting](#6-troubleshooting) for the few exceptions.

**To make the site yours, edit these files in order:**

1. `jss/config.js`: name, toolbar links, social links, colours
2. `data/profile.js`: photo, intro, bio, career
3. `data/publications.js`: your papers (or generate them, see [§3.6](#36-import-publications-from-nasa-ads))
4. `data/highlights.js`: front-page cards and news
5. `data/tutorials.js`: your Python lessons
6. Replace the images in `assets/img/`

You shouldn't need to touch the HTML files at all.

---

## 2. How the code is organised (MVC)

```
poulinal.github.io/
├── index.html              ┐
├── aboutme.html            │  VIEW SHELLS: identical boilerplate; only
├── publications.html       │  <body data-page="..."> differs
├── runcode-template.html   ┘
│
├── jss/
│   ├── config.js           MODEL     site-wide settings (identity, nav, theme, features, CDN versions)
│   ├── models.js           MODEL     query API over the data: sort, filter, search, look-up
│   ├── views.js            VIEW      data → HTML strings; the editor widget; icons
│   ├── controllers.js      CONTROLLER  one per page: gets data from models, renders views, handles events
│   ├── python-engine.js    SERVICE   Pyodide "kernel" in a Web Worker (used by the tutorials controller)
│   └── script.js           BOOTSTRAP utilities, theme, picks the controller for the page
│
├── data/                   MODEL (content); this is where you'll spend most of your time
│   ├── profile.js
│   ├── highlights.js
│   ├── publications.js
│   └── tutorials.js
│
├── css/style.css           all styles; design tokens at the top
├── assets/img/             photos, favicon, publication plots (assets/img/pubs/)
└── tools/bib2js.py         BibTeX → publications.js converter
```

### How a page loads

```
<head> loads, in order:  config → data/* → models → views → python-engine → controllers → script
                                                                                          │
script.js:  1. apply theme (no flash)   2. load fonts   3. on DOMContentLoaded:          ▼
            Site.controllers.layout.init(page)        → toolbar + footer (every page)
            Site.controllers[page].init(#view, body)  → the page itself
```

### The rules each layer follows

| Layer | May | May not |
|---|---|---|
| **data/** | contain plain objects and strings | contain logic |
| **models.js** | sort, filter, compute derived values | touch the DOM |
| **views.js** | turn data into HTML, emit `data-action="..."` hooks | read `Site.data` directly or attach event listeners |
| **controllers.js** | call models, call views, insert HTML, listen to events | build large chunks of HTML inline |

Everything hangs off one global, `window.Site` (`Site.config`, `Site.data`, `Site.models`, `Site.views`, `Site.controllers`, `Site.util`, `Site.theme`, `Site.PythonEngine`). You can inspect any of it from the browser console.

**Events** use delegation: a view writes `<button data-action="copy-bibtex" data-id="...">`, and the controller's single click listener dispatches on the `data-action` name. To add a button, add the attribute in the view and a handler with the same name in the controller.

---

## 3. Customisation cookbook

### 3.1 Name, affiliation, browser-tab title
`jss/config.js` → `site`. `shortName` is appended to every page title (`Publications · A. Astronomer`). `logo` can point to an image; otherwise `logoText` is shown as a monogram.

### 3.2 Toolbar links
`jss/config.js` → `nav`. Reorder, rename or remove entries. Each `id` must match a page's `<body data-page="...">` so the toolbar can highlight the current page. External links and files (`assets/cv.pdf`) work too.

### 3.3 Colours, fonts, dark mode
There are two ways to change these. Use whichever you prefer.

* **From config** (`jss/config.js` → `theme`): any CSS variable, e.g.
  ```js
  light: { '--color-accent': '#b23434' },
  dark:  { '--color-accent': '#ff9a9a' },
  shared: { '--radius': '2px', '--font-heading': "'Merriweather', serif" }
  ```
  If you change fonts, also change `theme.fontsUrl` (a Google Fonts URL).
* **From CSS**: edit the *design tokens* at the top of `css/style.css`. Dark-mode values live under `:root[data-theme="dark"]`.

`theme.defaultMode` can be `'auto'` (follow the OS), `'light'` or `'dark'`. Set `theme.showToggle: false` to hide the sun/moon button.

### 3.4 Home page sections
`jss/config.js` → `home.sections` controls which sections appear and in what order: `['hero', 'highlights', 'featured', 'news']`. The limits `maxHighlights`, `maxFeatured` and `maxNews` set how many items each shows.

To add a **new section type** (say "Upcoming talks"):
1. Add data, e.g. `Site.data.talks = [...]` in `data/highlights.js`.
2. Add a renderer in `jss/views.js`: `V.home.talks = function (ctx) { return V.section({ title: 'Talks' }, '...'); }`.
3. Pass the data into `ctx` in `Site.controllers.home` (`jss/controllers.js`).
4. Add `'talks'` to `home.sections`.

### 3.5 Publications and signature plots
Each entry in `data/publications.js` documents its fields at the top of the file. Points to know:

* **Signature plot**: `figure: { src, alt, caption }`. Put the images in `assets/img/pubs/`. A 3:2 PNG around 1200 px wide looks good. Clicking a figure opens it full-size.
* **Your name is bolded** wherever it matches `config.site.authorAliases`, so list every spelling you publish under.
* **Links**: `ads`, `arxiv` (bare ID ok), `doi` (bare DOI ok), `pdf`, `code`, `data`, `slides`, `press`. To add a new kind, add it to `LINK_KINDS` in `jss/models.js`.
* **Deep links**: `publications.html#<id>` scrolls to and highlights a paper. Filters are reflected in the URL, so `publications.html?tag=dark%20matter` is shareable.
* **Math**: `$...$` and `$$...$$` render with KaTeX in titles, abstracts and captions. In JS strings, double the backslashes (`'$\\Lambda$CDM'`).
* Page options (default sort, year grouping, abstracts open, type labels) are in `config.publications`.

To make your signature plots match each other, use one matplotlib style for all of them:

```python
plt.rcParams.update({"font.size": 11, "axes.spines.top": False, "axes.spines.right": False})
fig, ax = plt.subplots(figsize=(6, 4))
...
fig.tight_layout(); fig.savefig("assets/img/pubs/my-paper.png", dpi=150)
```

### 3.6 Import publications from NASA ADS
1. On ADS, run your author query, select all, then **Export → BibTeX** (enable abstracts in the export settings).
2. `python3 tools/bib2js.py export.bib > draft.js`
3. Paste the objects into `Site.data.publications`, then add `figure`, `tags`, `featured` and `links.code` by hand.

The converter has no dependencies. It maps common journal macros (`\apj` → `ApJ`, and so on); add more to `JOURNALS` in the script.

### 3.7 About page
All content is in `data/profile.js`. Remove a field (e.g. `awards`) to hide its section. To add a CV button, put the PDF in `assets/` and set `cvUrl: 'assets/cv.pdf'`.

### 3.8 Social / contact links
`jss/config.js` → `social`. These appear on the Home hero, the About sidebar and the footer. The `icon` names refer to `Site.views.icons` in `jss/views.js`; to add one, paste the inner markup of any 24×24 stroke-style SVG there.

### 3.9 Adding a whole new page
1. Copy `aboutme.html` to `talks.html` and set `<body data-page="talks">`.
2. Add `{ id: 'talks', label: 'Talks', href: 'talks.html' }` to `config.nav`.
3. Either:
   * **Static page**: write HTML inside `<main>` after `<div id="view">`. With no controller registered you get the shared toolbar and footer plus your own HTML.
   * **Data-driven page**: add data, a model, a view and `Site.controllers.talks = { init(view) { ... } }`, following the existing ones.
   * **Reuse a controller**: `<body data-page="talks" data-controller="home">`.

If you add a new `data/*.js` file, add its `<script>` tag to the `<head>` of **every** page (keeping the order: config → data → models → views → controllers → script).

### 3.10 Changing the markup of a component
Each component is one function in `jss/views.js` (`V.publications.item`, `V.home.hero`, …), and its CSS is in the matching numbered section of `css/style.css`. Change both together.

### 3.11 Library versions
All third-party URLs are in `config.cdn`. Change a version there to upgrade it site-wide. Libraries load **only on pages that use them** (Pyodide and CodeMirror only on the tutorials page; KaTeX only when the page has content to render).

| Library | Used for | Turn off with |
|---|---|---|
| [Pyodide](https://pyodide.org) | Python in the browser | — |
| [CodeMirror 5](https://codemirror.net/5/) | syntax-highlighted cells | `notebook.editor: 'textarea'` |
| [marked](https://marked.js.org) | markdown in tutorial cells | (falls back to plain paragraphs) |
| [KaTeX](https://katex.org) | LaTeX math everywhere | `features.math: false` |

---

## 4. Writing tutorials

Tutorials live in `data/tutorials.js`. Each one is a list of cells:

```js
{
  id: 'my-lesson',                     // → runcode-template.html?t=my-lesson
  title: 'Fitting a power law',
  summary: 'One sentence for the tutorial list.',
  level: 'Intermediate', duration: '15 min',
  packages: ['numpy', 'scipy', 'matplotlib'],   // pre-load (imports are also auto-detected)
  cells: [
    { type: 'markdown', source: String.raw`
## Heading
Text with math $\alpha = 2.35$ and **bold**. Inline code: <code>np.polyfit</code>.` },
    { type: 'code', hidden: true, autorun: true, source: String.raw`# setup the reader doesn't need to see
import numpy as np` },
    { type: 'code', source: String.raw`x = np.linspace(1, 10)
x.mean()` }
  ]
}
```

**How the notebook behaves**
* All cells in a tutorial share one Python namespace, as in Jupyter. **Restart** clears it and also stops runaway code such as infinite loops.
* The last expression is shown as `Out[n]`. End the line with `;` to hide it.
* `print()` output streams live, and stderr shows in amber.
* **matplotlib**: any open figures are rendered as PNGs below the cell. `plt.show()` is optional.
* `Shift+Enter` runs a cell and moves to the next one. **Run all** stops at the first error.
* **Reset code** puts back the original source in every cell. Readers' own `+ Code cell` cells can be deleted.

**Cell flags:** `hidden` (collapsed behind *Show code*), `autorun` (runs once Python is ready), `readonly`.

**Packages:** anything in [Pyodide's package list](https://pyodide.org/en/stable/usage/packages-in-pyodide.html) (numpy, scipy, matplotlib, astropy, pandas, …) loads automatically when imported. Pure-Python packages from PyPI can be listed as `'micropip:package-name'`.

**Writing tips:** use `String.raw\`...\`` so backslashes in LaTeX and Python don't need escaping. The only characters to avoid inside are the backtick and `${`; for inline code in markdown use `<code>…</code>`.

**One page per tutorial (optional):** copy `runcode-template.html`, add `data-tutorial="my-lesson"` to `<body>`, and link to it from `config.nav`.

**Notebook settings** (`config.notebook`): `editor`, `preloadPackages` (loaded for every tutorial), `allowAddCells`, `newCellTemplate`, `figureDpi`. Python that should run at kernel start-up for every tutorial (e.g. a plotting style) can go in `SETUP_PY` in `jss/python-engine.js`.

---

## 5. Deploying

The repository is named `poulinal.github.io`, so GitHub Pages serves it automatically at `https://poulinal.github.io` once it's pushed to `main` (*Settings → Pages → Deploy from branch → main / root*).

There's no build step, so whatever is committed is what gets served. GitHub Pages runs Jekyll by default. That's harmless here, but adding an empty `.nojekyll` file at the root skips it and makes deploys slightly faster.

---

## 6. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Page is blank | Open the browser console. A syntax error in a `data/*.js` file (a missing comma or an unescaped quote) is the usual cause, and the page shows the error message when it can. |
| "Python failed to load" | Pyodide (~10 MB on first visit, cached afterwards) comes from a CDN, so it needs an internet connection. Check `config.cdn.pyodide`. |
| First run of a cell is slow | Packages download on first import. List them in the tutorial's `packages` to start the download as soon as the page opens. |
| Math shows as raw `$...$` | Check `features.math: true` and that backslashes are doubled in normal JS strings (or use `String.raw`). |
| Filters don't appear in the URL | Browsers block `history.replaceState` on `file://`. It works on a local server and on GitHub Pages. |
| A literal `$` gets turned into math | Wrap it in `<code>`, or turn math off. |

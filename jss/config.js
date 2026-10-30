/* =============================================================================
 * jss/config.js — SITE-WIDE CONFIGURATION
 * =============================================================================
 *
 * This is the first file to edit when making the site your own. Everything
 * that is shared by *every* page lives here:
 *
 *   - your name / title / affiliation (used in the toolbar, footer, <title>)
 *   - the toolbar links (order, labels, which page they point to)
 *   - social / contact links shown in the footer and on the About page
 *   - theme colours and fonts (override the CSS variables in css/style.css)
 *   - feature switches (LaTeX math, dark-mode toggle, ...)
 *   - CDN URLs for third-party libraries (pin versions here, in ONE place)
 *
 * Page *content* (highlights, publications, tutorials, bio) does NOT live
 * here — see the files in data/ for that.
 *
 * Architecture reminder (see README.md for the full picture):
 *
 *     config.js + data/*.js   ->  MODEL       (plain data, no DOM)
 *     jss/models.js           ->  MODEL API   (query / sort / filter the data)
 *     jss/views.js            ->  VIEW        (data -> HTML, no business logic)
 *     jss/controllers.js      ->  CONTROLLER  (wires models + views + events)
 *     jss/python-engine.js    ->  SERVICE     (Pyodide runtime for notebooks)
 *     jss/script.js           ->  BOOTSTRAP   (picks the controller per page)
 *
 * All files attach to one global namespace, `window.Site`, so no build step
 * or module bundler is needed. The site works on GitHub Pages as-is, and also
 * when you open the .html files straight from disk (file://).
 * ========================================================================== */

(function (Site) {
  'use strict';

  Site.config = {

    /* -------------------------------------------------------------------------
     * IDENTITY
     * Shown in the toolbar brand, the footer, and appended to every <title>.
     * ---------------------------------------------------------------------- */
    site: {
      name: 'Alexander Poulin',            // your name, as it should appear in the toolbar
      shortName: 'A. Poulin',        // used in the browser tab title (keep it short)
      tagline: 'Studying Astrophysicist · Galaxies, LRDs & Cosmology',
      affiliation: 'Khoury College of Computer Science, Northeastern University',
      email: 'apoulinpff@gmail.com',

      // Small logo/monogram in the toolbar. Either a path to an image
      // (e.g. 'assets/img/logo.svg') or null to show `logoText` instead.
      logo: null,
      logoText: 'AP',

      // Used to highlight your own name in publication author lists.
      // Add every spelling that appears in your author lists.
      authorAliases: ['A. Poulin', 'Poulin, A.', 'Alexander Poulin']
    },

    /* -------------------------------------------------------------------------
     * TOOLBAR / NAVIGATION
     * The same toolbar is rendered on every page from this list.
     *   id     must match the `data-page` attribute on that page's <body>
     *          (that's how the toolbar knows which link is "active").
     *   label  text shown in the toolbar.
     *   href   link target. External links (https://...) open in a new tab.
     *
     * To ADD a page:  copy any .html file, change its <body data-page="...">,
     *                 add an entry here, and register a controller in
     *                 jss/controllers.js (or reuse an existing one).
     * To REMOVE a page: delete its entry here (and the .html file if you like).
     * To REORDER:     reorder this array.
     *   newTab optional; open in a new tab. Links starting with http(s)://
     *          open in a new tab automatically.
     * ---------------------------------------------------------------------- */
    nav: [
      { id: 'home',         label: 'Home',         href: 'index.html' },
      { id: 'about',        label: 'About',        href: 'aboutme.html' },
      { id: 'publications', label: 'Publications', href: 'publications.html' },
      { id: 'tutorials',    label: 'Tutorials',    href: 'runcode-template.html' },
      { id: 'blog',         label: 'Blog',         href: 'blog.html' }
      // Files and external links work too, e.g. once you add assets/cv.pdf:
      // { id: 'cv', label: 'CV', href: 'assets/cv.pdf', newTab: true }
    ],

    /* -------------------------------------------------------------------------
     * SOCIAL / CONTACT LINKS
     * Shown in the footer and on the About page. Remove any you don't use.
     * `icon` is one of the keys in Site.views.icons (jss/views.js) — add your
     * own SVG there if you need a new one.
     * ---------------------------------------------------------------------- */
    social: [
      { icon: 'email',   label: 'Email',        href: 'mailto:apoulinpff@gmail.com' },
      { icon: 'github',  label: 'GitHub',       href: 'https://github.com/poulinal/' },
      { icon: 'orcid',   label: 'ORCID',        href: 'https://orcid.org/0009-0008-3349-0954' },
      { icon: 'ads',     label: 'NASA ADS',     href: 'https://ui.adsabs.harvard.edu/search/q=author:%22Poulin%2C+Alexander%22&sort=date%20desc,%20bibcode%20desc' },
      { icon: 'scholar', label: 'Google Scholar', href: 'https://scholar.google.com/citations?view_op=list_works&hl=en&user=SLW1VPUAAAAJ' }
    ],

    /* -------------------------------------------------------------------------
     * THEME
     * Every key here overrides the CSS custom property of the same name
     * defined in css/style.css (`--color-accent`, `--font-body`, ...).
     * Leave an entry out (or set it to null) to keep the stylesheet default.
     *
     * `light` applies in light mode, `dark` in dark mode, `shared` in both.
     * For deeper changes (layout, spacing) edit css/style.css directly.
     * ---------------------------------------------------------------------- */
    theme: {
      // 'light' | 'dark' | 'auto' (follow the visitor's OS setting)
      defaultMode: 'auto',
      // Show the sun/moon button in the toolbar so visitors can switch.
      showToggle: true,

      shared: {
        '--font-body': "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
        '--font-heading': "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
        '--font-mono': "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace",
        '--content-width': '68rem'
      },
      light: {
        '--color-accent': '#3451b2'
      },
      dark: {
        '--color-accent': '#8ea6ff'
      },

      // Google Fonts stylesheet to load (set to null to use system fonts only).
      // If you change fonts above, update this URL to match.
      fontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap'
    },

    /* -------------------------------------------------------------------------
     * FEATURES
     * ---------------------------------------------------------------------- */
    features: {
      // Render LaTeX ($...$ and $$...$$) anywhere on the page with KaTeX.
      // Handy for abstracts. Turn off if you never use math (saves ~300 kB).
      math: true,

      // Footer text. `{year}` is replaced by the current year.
      footerText: '© {year} Alexander Poulin · Built with plain HTML/CSS/JS, hosted on GitHub Pages'
    },

    /* -------------------------------------------------------------------------
     * HOME PAGE OPTIONS
     * The order of `sections` is the order they appear on index.html.
     * Remove a name to hide that section. Available sections:
     *   'hero'        photo, name, intro and buttons     (data/profile.js)
     *   'highlights'  image cards                         (data/highlights.js)
     *   'featured'    publications with featured: true    (data/publications.js)
     *   'news'        dated news list                     (data/highlights.js)
     * To add a new section type, add a renderer to Site.views.home in
     * jss/views.js and its name here.
     * ---------------------------------------------------------------------- */
    home: {
      sections: ['hero', 'highlights', 'featured', 'news'],
      maxHighlights: 3,
      maxFeatured: 3,
      maxNews: 5
    },

    /* -------------------------------------------------------------------------
     * PUBLICATIONS PAGE OPTIONS
     * ---------------------------------------------------------------------- */
    publications: {
      // Initial sort: 'year-desc' | 'year-asc' | 'title' | 'citations'
      defaultSort: 'year-desc',
      // Start with abstracts expanded (true) or collapsed (false).
      abstractsOpen: false,
      // Show the search / filter bar.
      showControls: true,
      // Group the list under year headings.
      groupByYear: true,
      // Labels for the `type` field of each publication (data/publications.js).
      typeLabels: {
        article: 'Refereed article',
        proceedings: 'Conference proceedings',
        preprint: 'Preprint',
        thesis: 'Thesis',
        software: 'Software'
      }
    },

    /* -------------------------------------------------------------------------
     * NOTEBOOK / TUTORIAL OPTIONS (runcode-template.html)
     * ---------------------------------------------------------------------- */
    notebook: {
      // 'codemirror' gives syntax highlighting; 'textarea' is a zero-dependency
      // fallback. If CodeMirror fails to load, the textarea is used automatically.
      editor: 'codemirror',
      // Packages loaded into Python *before* any cell runs, on every tutorial.
      // Tutorials can add more with their own `packages` list. Imports in a
      // cell (e.g. `import numpy`) are also detected and loaded automatically.
      // See https://pyodide.org/en/stable/usage/packages-in-pyodide.html
      preloadPackages: [],
      // Show the "+ Code cell" button so readers can add their own cells.
      allowAddCells: true,
      // Starting code for newly added cells.
      newCellTemplate: '# Write some Python here, then press Shift+Enter\n',
      // Resolution of inline matplotlib figures.
      figureDpi: 100
    },

    /* -------------------------------------------------------------------------
     * BLOG PAGE OPTIONS (blog.html; posts live in data/blog.js)
     * ---------------------------------------------------------------------- */
    blog: {
      title: 'Research Notes',
      // Shown under the title. HTML allowed.
      taglineHtml: 'Plain-language write-ups of simulations, new papers and the ideas behind them, ' +
        'written for students and early-career researchers.',
      // Your blog logo, shown next to the title (and as the blog's browser-tab
      // icon — update the <link rel="icon"> in blog.html too). SVG or PNG,
      // square works best. Set to null to hide.
      logo: 'assets/icons/logo_budding_universe_centered.svg',
      logoAlt: '',

      // Labels for the `category` field of each post.
      categoryLabels: {
        simulation: 'Simulation',
        publication: 'New paper',
        tutorial: 'Tutorial',
        notes: 'Notes',
        review: 'Review'
      },
      wordsPerMinute: 200,

      // Fonts used only on the blog. Must match the families in `theme` below.
      fontsUrl: ['https://fonts.googleapis.com/css2?family=Quantico:ital,wght@0,400;0,700;1,400;1,700&display=swap', 'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap'],

      // Blog look: same rules as `theme` above (override the --blog-* CSS
      // variables in css/style.css, section 14). Change text and heading
      // fonts, sizes and colours here; a single post can override any of
      // these with its own `style` field (see data/blog.js).
      theme: {
        shared: {
          '--blog-font-body': "'Source Serif 4', Georgia, 'Times New Roman', serif",
          '--blog-font-heading': "'Quantico', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
          '--blog-text-size': '1.125rem',       // paragraph text
          '--blog-line-height': '1.75',
          '--blog-h1-size': 'clamp(2rem, 3vw + 1rem, 2.75rem)',
          '--blog-h2-size': '1.6rem',
          '--blog-h3-size': '1.25rem',
          '--blog-measure': '44rem'              // width of the text column
        },
        light: {
          '--blog-red':  '#c8102e',
          '--blog-blue': '#1f4fbf',
          '--blog-heading-color': '#141824',
          '--blog-text-color': '#252a36'
        },
        dark: {
          '--blog-red':  '#ff6b70',
          '--blog-blue': '#8ea6ff',
          '--blog-heading-color': '#f1f3f8',
          '--blog-text-color': '#dde1e9'
        }
      }
    },

    /* -------------------------------------------------------------------------
     * THIRD-PARTY LIBRARIES (loaded on demand — only by pages that need them)
     * Change a version number here to upgrade the library everywhere.
     * ---------------------------------------------------------------------- */
    cdn: {
      pyodide:         'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js',
      codemirrorJs:    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js',
      codemirrorPython:'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/python/python.min.js',
      codemirrorCss:   'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css',
      marked:          'https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js',
      katexJs:         'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js',
      katexAutoRender: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js',
      katexCss:        'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css'
    }
  };

})(window.Site = window.Site || {});

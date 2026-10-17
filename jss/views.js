/* =============================================================================
 * jss/views.js — VIEW LAYER (data -> HTML)
 * =============================================================================
 *
 * Every function here takes plain data and returns an HTML string (or, for
 * the few interactive widgets, a DOM element). Views:
 *
 *   - never read Site.data directly (controllers pass in what they need),
 *   - never attach event listeners (controllers do that, using the
 *     `data-action` / `data-*` attributes the views emit),
 *   - escape all plain-text fields with `esc()`. Fields documented as HTML
 *     (`...Html`, `abstract`) are inserted as-is: only put trusted content
 *     in them (i.e. your own data files).
 *
 * CUSTOMISING THE MARKUP
 *   Change the HTML of a component by editing its function below. CSS class
 *   names follow a simple BEM-ish pattern (`.pub`, `.pub__title`, ...) and are
 *   all styled in css/style.css, so a markup change usually only needs a
 *   matching CSS change.
 *
 *   Contents:
 *     Site.views.esc / formatDate / icon   small helpers
 *     Site.views.icons                     inline SVG icon set
 *     Site.views.layout                    toolbar + footer (shared by all pages)
 *     Site.views.home                      hero, highlights, featured, news
 *     Site.views.about                     About page
 *     Site.views.publications              list, filters, single entry, lightbox
 *     Site.views.notebook                  tutorial index, cells, outputs
 *     Site.views.editor                    code editor widget (CodeMirror or <textarea>)
 * ========================================================================== */

(function (Site) {
  'use strict';

  var V = Site.views = {};

  /* =========================================================================
   * HELPERS
   * ====================================================================== */

  /** Escape text for safe insertion into HTML. */
  V.esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };
  var esc = V.esc;

  /** 'YYYY-MM-DD' -> 'Sep 2, 2026' (style 'long') or 'Sep 2026' (style 'month'). */
  V.formatDate = function (iso, style) {
    if (!iso) return '';
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return esc(iso);
    var opts = style === 'month'
      ? { year: 'numeric', month: 'short' }
      : { year: 'numeric', month: 'short', day: 'numeric' };
    return d.toLocaleDateString(undefined, opts);
  };

  /** Join non-empty parts. */
  function join(parts, sep) {
    return parts.filter(function (p) { return p != null && p !== ''; }).join(sep == null ? '' : sep);
  }

  function isExternal(href) { return /^https?:\/\//.test(href || ''); }

  function linkAttrs(href, newTab) {
    return 'href="' + esc(href) + '"' +
      ((newTab || isExternal(href)) ? ' target="_blank" rel="noopener"' : '');
  }

  /* =========================================================================
   * ICONS
   * Add your own: any 24×24 SVG body (paths drawn with `currentColor`).
   * Reference them by key from config.social[].icon or V.icon('key').
   * ====================================================================== */

  V.icons = {
    email:    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    github:   '<path d="m8 7-5 5 5 5M16 7l5 5-5 5"/>',
    orcid:    '<circle cx="12" cy="12" r="9"/><text x="12" y="15.5" text-anchor="middle" font-size="8.5" font-weight="700" font-family="sans-serif" fill="currentColor" stroke="none">iD</text>',
    ads:      '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    scholar:  '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    link:     '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
    sun:      '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon:     '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    menu:     '<path d="M3 6h18M3 12h18M3 18h18"/>',
    close:    '<path d="M6 6l12 12M18 6 6 18"/>',
    play:     '<path d="M7 4v16l13-8z" fill="currentColor"/>',
    playAll:  '<path d="M4 5v14l8-7zM13 5v14l8-7z" fill="currentColor"/>',
    plus:     '<path d="M12 5v14M5 12h14"/>',
    trash:    '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    restart:  '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    undo:     '<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
    copy:     '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
    arrow:    '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back:     '<path d="M19 12H5M11 6l-6 6 6 6"/>'
  };

  V.icon = function (name, cls) {
    return '<svg class="icon ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true" fill="none" ' +
      'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      (V.icons[name] || V.icons.link) + '</svg>';
  };

  /** Generic page section with a heading and an optional right-aligned link. */
  V.section = function (opts, body) {
    return '<section class="section ' + esc(opts.cls || '') + '"' + (opts.id ? ' id="' + esc(opts.id) + '"' : '') + '>' +
      (opts.title
        ? '<div class="section__head"><h2 class="section__title">' + esc(opts.title) + '</h2>' +
          (opts.action ? '<a class="section__action" ' + linkAttrs(opts.action.href) + '>' + esc(opts.action.label) + ' ' + V.icon('arrow') + '</a>' : '') +
          '</div>'
        : '') +
      body + '</section>';
  };

  V.socialList = function (social, cls) {
    if (!social || !social.length) return '';
    return '<ul class="social ' + (cls || '') + '">' + social.map(function (s) {
      return '<li><a ' + linkAttrs(s.href) + ' aria-label="' + esc(s.label) + '" title="' + esc(s.label) + '">' +
        V.icon(s.icon) + '<span class="social__label">' + esc(s.label) + '</span></a></li>';
    }).join('') + '</ul>';
  };

  /* =========================================================================
   * LAYOUT — the uniform toolbar and footer on every page
   * ====================================================================== */

  V.layout = {

    /**
     * @param config   Site.config
     * @param activeId the `data-page` of the current page
     * @param mode     current theme ('light' | 'dark'), for the toggle icon
     */
    toolbar: function (config, activeId, mode) {
      var site = config.site || {};
      var brandMark = site.logo
        ? '<img class="toolbar__logo-img" src="' + esc(site.logo) + '" alt="">'
        : '<span class="toolbar__logo" aria-hidden="true">' + esc(site.logoText || '') + '</span>';

      var links = (config.nav || []).map(function (item) {
        var active = item.id === activeId;
        return '<li><a class="toolbar__link' + (active ? ' is-active' : '') + '" ' +
          linkAttrs(item.href, item.newTab) + (active ? ' aria-current="page"' : '') + '>' +
          esc(item.label) + '</a></li>';
      }).join('');

      var showToggle = !config.theme || config.theme.showToggle !== false;

      return '' +
        '<nav class="toolbar__inner" aria-label="Main">' +
          '<a class="toolbar__brand" href="index.html">' + brandMark +
            '<span class="toolbar__name">' + esc(site.name || '') + '</span></a>' +
          '<button class="toolbar__btn toolbar__menu-btn" type="button" data-action="toggle-menu" ' +
            'aria-expanded="false" aria-controls="toolbar-links" aria-label="Open menu">' + V.icon('menu') + '</button>' +
          '<ul class="toolbar__links" id="toolbar-links">' + links + '</ul>' +
          (showToggle
            ? '<button class="toolbar__btn toolbar__theme" type="button" data-action="toggle-theme" ' +
              'aria-label="Switch to ' + (mode === 'dark' ? 'light' : 'dark') + ' mode">' +
              V.icon(mode === 'dark' ? 'sun' : 'moon') + '</button>'
            : '') +
        '</nav>';
    },

    footer: function (config) {
      var text = ((config.features && config.features.footerText) || '')
        .replace('{year}', new Date().getFullYear());
      return '<div class="footer__inner">' +
        '<p class="footer__text">' + esc(text) + '</p>' +
        V.socialList(config.social, 'social--compact') +
        '</div>';
    }
  };

  /* =========================================================================
   * HOME PAGE
   * Each function renders one section. config.home.sections picks which
   * appear and in what order. Add a new function here to add a section type.
   * ====================================================================== */

  V.home = {

    hero: function (ctx) {
      var p = ctx.profile, site = ctx.config.site || {};
      var buttons = (p.heroButtons || []).map(function (b) {
        return '<a class="btn btn--' + esc(b.style || 'secondary') + '" ' + linkAttrs(b.href) + '>' + esc(b.label) + '</a>';
      }).join('');
      return '<section class="hero">' +
        (p.photo ? '<img class="hero__photo" src="' + esc(p.photo) + '" alt="' + esc(p.photoAlt || '') + '">' : '') +
        '<div class="hero__text">' +
          (p.heroRole ? '<p class="eyebrow">' + esc(p.heroRole) + '</p>' : '') +
          '<h1 class="hero__title">' + esc(p.heroHeading || site.name) + '</h1>' +
          (site.affiliation ? '<p class="hero__affil">' + esc(site.affiliation) + '</p>' : '') +
          (p.introHtml ? '<div class="hero__intro prose">' + p.introHtml + '</div>' : '') +
          (buttons ? '<div class="hero__actions">' + buttons + '</div>' : '') +
          V.socialList(ctx.config.social) +
        '</div>' +
      '</section>';
    },

    highlights: function (ctx) {
      var items = ctx.highlights;
      if (!items.length) return '';
      var cards = items.map(function (h) {
        var inner =
          (h.image ? '<div class="card__media"><img src="' + esc(h.image) + '" alt="' + esc(h.imageAlt || '') + '" loading="lazy"></div>' : '') +
          '<div class="card__body">' +
            '<p class="card__meta">' + join([
              h.category ? '<span class="badge">' + esc(h.category) + '</span>' : '',
              '<time datetime="' + esc(h.date) + '">' + V.formatDate(h.date) + '</time>'
            ], ' ') + '</p>' +
            '<h3 class="card__title">' + esc(h.title) + '</h3>' +
            (h.summaryHtml ? '<div class="card__text prose">' + h.summaryHtml + '</div>' : '') +
            (h.link ? '<span class="card__cta">' + esc(h.link.label || 'Read more') + ' ' + V.icon('arrow') + '</span>' : '') +
          '</div>';
        return h.link
          ? '<a class="card card--link" ' + linkAttrs(h.link.href) + '>' + inner + '</a>'
          : '<article class="card">' + inner + '</article>';
      }).join('');
      return V.section({ title: 'Highlights', cls: 'section--highlights' }, '<div class="card-grid">' + cards + '</div>');
    },

    featured: function (ctx) {
      var pubs = ctx.featured;
      if (!pubs.length) return '';
      var rows = pubs.map(function (p) {
        return '<li class="mini-pub">' +
          (p.figure && p.figure.src ? '<img class="mini-pub__thumb" src="' + esc(p.figure.src) + '" alt="" loading="lazy">' : '') +
          '<div><a class="mini-pub__title" href="publications.html#' + esc(p.id) + '">' + esc(p.title) + '</a>' +
          '<p class="mini-pub__venue">' + join([esc(p.journal), esc(p.year)], ' · ') + '</p></div>' +
          '</li>';
      }).join('');
      return V.section({ title: 'Selected publications', action: { label: 'All publications', href: 'publications.html' } },
        '<ul class="mini-pubs">' + rows + '</ul>');
    },

    news: function (ctx) {
      var items = ctx.news;
      if (!items.length) return '';
      return V.section({ title: 'News' }, '<ul class="news">' + items.map(function (n) {
        return '<li><time datetime="' + esc(n.date) + '">' + V.formatDate(n.date, 'month') + '</time>' +
          '<span class="prose">' + n.textHtml + '</span></li>';
      }).join('') + '</ul>');
    }
  };

  /* =========================================================================
   * ABOUT PAGE
   * ====================================================================== */

  V.about = {

    timeline: function (title, items) {
      if (!items || !items.length) return '';
      return V.section({ title: title }, '<ol class="timeline">' + items.map(function (i) {
        return '<li><span class="timeline__years">' + esc(i.years) + '</span>' +
          '<span class="timeline__role">' + esc(i.role) + '</span>' +
          '<span class="timeline__org">' + esc(i.org) + '</span></li>';
      }).join('') + '</ol>');
    },

    page: function (profile, config) {
      var site = config.site || {};
      var interests = (profile.interests || []).map(function (i) {
        return '<div class="interest"><h3>' + esc(i.title) + '</h3><p>' + esc(i.description) + '</p></div>';
      }).join('');

      return '<div class="about">' +
        '<aside class="about__side">' +
          (profile.photo ? '<img class="about__photo" src="' + esc(profile.photo) + '" alt="' + esc(profile.photoAlt || '') + '">' : '') +
          '<h1 class="about__name">' + esc(site.name) + '</h1>' +
          (profile.heroRole ? '<p class="about__role">' + esc(profile.heroRole) + '</p>' : '') +
          (site.affiliation ? '<p class="about__affil">' + esc(site.affiliation) + '</p>' : '') +
          (profile.cvUrl ? '<a class="btn btn--primary btn--block" ' + linkAttrs(profile.cvUrl, true) + '>Download CV</a>' : '') +
          V.socialList(config.social, 'social--stacked') +
        '</aside>' +
        '<div class="about__main">' +
          V.section({ title: 'About me' }, '<div class="prose">' + (profile.bioHtml || []).map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div>') +
          (interests ? V.section({ title: 'Research interests' }, '<div class="interests">' + interests + '</div>') : '') +
          this.timeline('Positions', profile.positions) +
          this.timeline('Education', profile.education) +
          this.timeline('Awards & honours', profile.awards) +
        '</div>' +
      '</div>';
    }
  };

  /* =========================================================================
   * PUBLICATIONS PAGE
   * ====================================================================== */

  V.publications = {

    header: function (count) {
      return '<header class="page-head"><h1>Publications</h1>' +
        '<p class="page-head__sub">' + count + ' entries · click a figure to enlarge it</p></header>';
    },

    /** Filter bar. `state` is the current filter state, `facets` from the model. */
    controls: function (state, facets, typeLabel) {
      function options(values, selected, labelFn, anyLabel) {
        return '<option value="">' + esc(anyLabel) + '</option>' + values.map(function (v) {
          return '<option value="' + esc(v) + '"' + (String(v) === String(selected) ? ' selected' : '') + '>' +
            esc(labelFn ? labelFn(v) : v) + '</option>';
        }).join('');
      }
      var sorts = [['year-desc', 'Newest first'], ['year-asc', 'Oldest first'], ['title', 'Title A–Z'], ['citations', 'Most cited']];
      return '<form class="filters" role="search" data-role="filters">' +
        '<input class="filters__search" type="search" name="q" placeholder="Search titles, authors, abstracts…" value="' + esc(state.q) + '" aria-label="Search publications">' +
        '<select name="type" aria-label="Type">' + options(facets.types, state.type, typeLabel, 'All types') + '</select>' +
        '<select name="year" aria-label="Year">' + options(facets.years, state.year, null, 'All years') + '</select>' +
        '<select name="tag" aria-label="Topic">' + options(facets.tags, state.tag, null, 'All topics') + '</select>' +
        '<select name="sort" aria-label="Sort">' + sorts.map(function (s) {
          return '<option value="' + s[0] + '"' + (state.sort === s[0] ? ' selected' : '') + '>' + s[1] + '</option>';
        }).join('') + '</select>' +
        '<label class="filters__check"><input type="checkbox" name="firstAuthor"' + (state.firstAuthor ? ' checked' : '') + '> First-author only</label>' +
        '<button class="btn btn--ghost btn--sm" type="button" data-action="toggle-abstracts">' + (state.abstractsOpen ? 'Collapse' : 'Expand') + ' abstracts</button>' +
      '</form>';
    },

    authors: function (authors, isSelf) {
      return (authors || []).map(function (a) {
        return isSelf(a) ? '<strong class="self">' + esc(a) + '</strong>' : esc(a);
      }).join(', ');
    },

    venue: function (p) {
      return join([
        p.journal ? '<em>' + esc(p.journal) + '</em>' : '',
        esc(p.volume), esc(p.pages)
      ], ', ');
    },

    /** One publication. `helpers` = { isSelf, links, typeLabel, abstractsOpen }. */
    item: function (p, helpers) {
      var links = helpers.links(p).map(function (l) {
        return '<a class="chip chip--link" ' + linkAttrs(l.href) + '>' + esc(l.label) + '</a>';
      }).join('');
      if (p.bibtex) {
        links += '<button class="chip chip--link" type="button" data-action="copy-bibtex" data-id="' + esc(p.id) + '">' + V.icon('copy') + ' BibTeX</button>';
      }
      var tags = (p.tags || []).map(function (t) {
        return '<button class="chip chip--tag" type="button" data-action="filter-tag" data-tag="' + esc(t) + '">#' + esc(t) + '</button>';
      }).join('');

      var figure = p.figure && p.figure.src
        ? '<figure class="pub__figure">' +
            '<button type="button" class="pub__zoom" data-action="zoom" data-id="' + esc(p.id) + '" aria-label="Enlarge figure">' +
              '<img src="' + esc(p.figure.src) + '" alt="' + esc(p.figure.alt || '') + '" loading="lazy"></button>' +
            (p.figure.caption ? '<figcaption>' + esc(p.figure.caption) + '</figcaption>' : '') +
          '</figure>'
        : '';

      return '<article class="pub' + (figure ? ' pub--has-figure' : '') + '" id="' + esc(p.id) + '">' +
        '<div class="pub__body">' +
          '<p class="pub__meta">' + join([
            p.type ? '<span class="badge">' + esc(helpers.typeLabel(p.type)) + '</span>' : '',
            '<span>' + esc(p.year) + '</span>',
            p.citations != null ? '<span>' + esc(p.citations) + ' citation' + (p.citations === 1 ? '' : 's') + '</span>' : '',
            p.note ? '<span>' + esc(p.note) + '</span>' : ''
          ], '<span class="dot">·</span>') + '</p>' +
          '<h3 class="pub__title"><a href="#' + esc(p.id) + '">' + esc(p.title) + '</a></h3>' +
          '<p class="pub__authors">' + this.authors(p.authors, helpers.isSelf) + '</p>' +
          (this.venue(p) ? '<p class="pub__venue">' + this.venue(p) + '</p>' : '') +
          (links ? '<div class="pub__links">' + links + '</div>' : '') +
          (p.abstract
            ? '<details class="pub__abstract"' + (helpers.abstractsOpen ? ' open' : '') + '><summary>Abstract</summary>' +
              '<div class="prose">' + p.abstract + '</div></details>'
            : '') +
          (tags ? '<div class="pub__tags">' + tags + '</div>' : '') +
        '</div>' +
        figure +
      '</article>';
    },

    /** Full list, optionally grouped under year headings. */
    list: function (pubs, helpers, groupByYear) {
      var self = this;
      if (!pubs.length) {
        return '<div class="empty">No publications match these filters. ' +
          '<button class="btn btn--ghost btn--sm" type="button" data-action="clear-filters">Clear filters</button></div>';
      }
      if (!groupByYear) return pubs.map(function (p) { return self.item(p, helpers); }).join('');
      var html = '', lastYear = null;
      pubs.forEach(function (p) {
        if (p.year !== lastYear) {
          html += '<h2 class="year-heading">' + esc(p.year) + '</h2>';
          lastYear = p.year;
        }
        html += self.item(p, helpers);
      });
      return html;
    },

    count: function (shown, total) {
      return shown === total ? '' : 'Showing ' + shown + ' of ' + total;
    },

    lightbox: function () {
      return '<dialog class="lightbox" data-role="lightbox">' +
        '<button class="lightbox__close toolbar__btn" type="button" data-action="close-lightbox" aria-label="Close">' + V.icon('close') + '</button>' +
        '<img class="lightbox__img" alt=""><p class="lightbox__caption"></p></dialog>';
    }
  };

  /* =========================================================================
   * NOTEBOOK / TUTORIALS PAGE
   * ====================================================================== */

  V.notebook = {

    /** Landing page listing all tutorials. */
    index: function (tutorials) {
      var cards = tutorials.map(function (t) {
        return '<a class="card card--link tutorial-card" href="?t=' + encodeURIComponent(t.id) + '">' +
          '<div class="card__body">' +
            '<p class="card__meta">' + join([
              t.level ? '<span class="badge">' + esc(t.level) + '</span>' : '',
              t.duration ? '<span>' + esc(t.duration) + '</span>' : ''
            ], ' ') + '</p>' +
            '<h3 class="card__title">' + esc(t.title) + '</h3>' +
            '<p class="card__text">' + esc(t.summary || '') + '</p>' +
            '<span class="card__cta">Start ' + V.icon('arrow') + '</span>' +
          '</div></a>';
      }).join('');
      return '<header class="page-head"><h1>Python tutorials</h1>' +
        '<p class="page-head__sub">Short, runnable lessons. Python runs entirely in your browser via ' +
        '<a href="https://pyodide.org" target="_blank" rel="noopener">Pyodide</a>, so nothing to install.</p>' +
        '<p class="page-head__sub">Note: Currently in development. Check back soon.</p></header>' +
        '<div class="card-grid">' + cards +
          '<a class="card card--link card--dashed tutorial-card" href="?t=scratch"><div class="card__body">' +
          '<h3 class="card__title">' + V.icon('plus') + ' Empty scratchpad</h3>' +
          '<p class="card__text">A blank notebook to experiment in.</p></div></a>' +
        '</div>';
    },

    /** Title, metadata, kernel status and notebook-level buttons. */
    header: function (t, opts) {
      return '<header class="nb-head">' +
        '<a class="nb-head__back" href="runcode-template.html">' + V.icon('back') + ' All tutorials</a>' +
        '<h1>' + esc(t.title) + '</h1>' +
        (t.summary ? '<p class="page-head__sub">' + esc(t.summary) + '</p>' : '') +
        '<div class="nb-bar">' +
          '<span class="kernel" data-role="kernel" data-state="loading"><span class="kernel__dot"></span>' +
            '<span data-role="kernel-text">Starting Python…</span></span>' +
          '<div class="nb-bar__buttons">' +
            '<button class="btn btn--primary btn--sm" type="button" data-action="run-all">' + V.icon('playAll') + ' Run all</button>' +
            '<button class="btn btn--ghost btn--sm" type="button" data-action="restart" title="Stop running code and clear all variables">' + V.icon('restart') + ' Restart</button>' +
            '<button class="btn btn--ghost btn--sm" type="button" data-action="reset-all" title="Restore the original code in every cell">' + V.icon('undo') + ' Reset code</button>' +
          '</div>' +
        '</div>' +
        '<p class="nb-hint">Tip: <kbd>Shift</kbd> + <kbd>Enter</kbd> runs the current cell. Variables are shared between cells.</p>' +
      '</header>';
    },

    /** Container for a markdown cell; the controller fills in rendered HTML. */
    markdownCell: function (id) {
      return '<div class="cell cell--md prose" data-cell="' + esc(id) + '"></div>';
    },

    /** A code cell shell. Editor and outputs are mounted by the controller. */
    codeCell: function (id, cell, opts) {
      return '<div class="cell cell--code' + (cell.hidden ? ' is-collapsed' : '') + '" data-cell="' + esc(id) + '">' +
        '<div class="cell__gutter"><button class="cell__run" type="button" data-action="run-cell" aria-label="Run cell" title="Run (Shift+Enter)">' + V.icon('play') + '</button>' +
          '<span class="cell__prompt" data-role="prompt">[ ]</span></div>' +
        '<div class="cell__main">' +
          (cell.hidden ? '<button class="cell__reveal" type="button" data-action="toggle-code">Show code</button>' : '') +
          '<div class="cell__editor" data-role="editor"></div>' +
          '<div class="cell__tools">' +
            (cell.readonly ? '<span class="cell__flag">read-only</span>' : '') +
            (!opts.userAdded && !cell.readonly ? '<button type="button" class="cell__tool" data-action="reset-cell" title="Restore original code">' + V.icon('undo') + '</button>' : '') +
            (opts.userAdded ? '<button type="button" class="cell__tool" data-action="delete-cell" title="Delete cell">' + V.icon('trash') + '</button>' : '') +
          '</div>' +
          '<div class="cell__output" data-role="output" hidden></div>' +
        '</div>' +
      '</div>';
    },

    addCellButton: function () {
      return '<button class="add-cell" type="button" data-action="add-cell">' + V.icon('plus') + ' Code cell</button>';
    },

    /* ---- outputs: these mutate a cell's output element ---------------- */

    clearOutput: function (outEl) {
      outEl.innerHTML = '';
      outEl.hidden = true;
    },

    /** Append streamed text, merging with the previous block of the same stream. */
    appendStream: function (outEl, name, text) {
      outEl.hidden = false;
      var last = outEl.lastElementChild;
      if (!last || last.getAttribute('data-stream') !== name) {
        last = document.createElement('pre');
        last.className = 'out out--' + name;
        last.setAttribute('data-stream', name);
        outEl.appendChild(last);
      }
      last.textContent += text;
    },

    appendResult: function (outEl, n, text) {
      outEl.hidden = false;
      var row = document.createElement('div');
      row.className = 'out out--result';
      row.innerHTML = '<span class="out__label">Out[' + n + ']:</span>';
      var pre = document.createElement('pre');
      pre.textContent = text;
      row.appendChild(pre);
      outEl.appendChild(row);
    },

    appendImage: function (outEl, base64png) {
      outEl.hidden = false;
      var img = document.createElement('img');
      img.className = 'out out--image';
      img.alt = 'Figure produced by this cell';
      img.src = 'data:image/png;base64,' + base64png;
      outEl.appendChild(img);
    },

    appendError: function (outEl, text) {
      outEl.hidden = false;
      var pre = document.createElement('pre');
      pre.className = 'out out--error';
      pre.textContent = text;
      outEl.appendChild(pre);
    },

    notFound: function (id) {
      return '<div class="empty"><h1>Tutorial not found</h1><p>No tutorial with id <code>' + esc(id) + '</code>. ' +
        '<a href="runcode-template.html">See all tutorials</a>.</p></div>';
    }
  };

  /* =========================================================================
   * EDITOR WIDGET
   * A thin adapter so the controller doesn't care which editor is used.
   * Returns { getValue, setValue, focus, refresh }.
   * To plug in a different editor (Monaco, CodeMirror 6, ...), add a branch
   * here that returns the same four methods.
   * ====================================================================== */

  V.editor = {
    create: function (container, opts) {
      if (window.CodeMirror && opts.kind !== 'textarea') {
        try {
          return this.codemirror(container, opts);
        } catch (e) {
          console.warn('[site] CodeMirror failed for this cell, using textarea:', e);
          container.innerHTML = '';
        }
      }
      return this.textarea(container, opts);
    },

    /** CodeMirror 5 with Python highlighting. */
    codemirror: function (container, opts) {
      var cm = window.CodeMirror(container, {
        value: opts.value || '',
        mode: 'python',
        lineNumbers: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        readOnly: !!opts.readonly,
        viewportMargin: Infinity,          // auto-height: grow with content
        extraKeys: {
          'Shift-Enter': function () { opts.onRun && opts.onRun(); },
          'Ctrl-Enter':  function () { opts.onRun && opts.onRun(); },
          'Cmd-Enter':   function () { opts.onRun && opts.onRun(); },
          Tab: function (c) {
            if (c.somethingSelected()) c.indentSelection('add');
            else c.replaceSelection('    ', 'end');
          }
        }
      });
      return {
        getValue: function () { return cm.getValue(); },
        setValue: function (v) { cm.setValue(v); },
        focus:    function () { cm.focus(); },
        refresh:  function () { cm.refresh(); }
      };
    },

    /** Fallback: plain auto-growing <textarea>. */
    textarea: function (container, opts) {
      var ta = document.createElement('textarea');
      ta.className = 'cell__textarea';
      ta.spellcheck = false;
      ta.value = opts.value || '';
      ta.readOnly = !!opts.readonly;
      ta.setAttribute('aria-label', 'Python code');
      function grow() { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 2 + 'px'; }
      ta.addEventListener('input', grow);
      ta.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && (e.shiftKey || e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          opts.onRun && opts.onRun();
        } else if (e.key === 'Tab' && !ta.readOnly) {
          e.preventDefault();
          var s = ta.selectionStart;
          ta.setRangeText('    ', s, ta.selectionEnd, 'end');
          grow();
        }
      });
      container.appendChild(ta);
      requestAnimationFrame(grow);
      return {
        getValue: function () { return ta.value; },
        setValue: function (v) { ta.value = v; grow(); },
        focus:    function () { ta.focus(); },
        refresh:  grow
      };
    }
  };

})(window.Site = window.Site || {});

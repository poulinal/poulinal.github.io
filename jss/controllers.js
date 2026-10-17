/* =============================================================================
 * jss/controllers.js — CONTROLLER LAYER
 * =============================================================================
 *
 * A controller connects models and views for one page:
 *
 *     1. read what it needs from Site.models
 *     2. pass that data to Site.views to get HTML
 *     3. put the HTML in the page
 *     4. listen for user events and repeat as needed
 *
 * Controllers are picked by jss/script.js from the <body> of each page:
 *
 *     <body data-page="publications">               -> Site.controllers.publications
 *     <body data-page="my-page" data-controller="home">  -> reuse the home controller
 *
 * Every controller has the same shape:  { init: function (viewEl, bodyEl) {} }
 * where `viewEl` is the <div id="view"> inside <main>.
 *
 * ADDING A NEW PAGE TYPE
 *   1. Copy one of the .html files, set <body data-page="talks">.
 *   2. Add { id: 'talks', label: 'Talks', href: 'talks.html' } to config.nav.
 *   3. Add data in data/talks.js (and a <script> tag for it in every page head),
 *      a model in models.js, a view in views.js, and
 *          Site.controllers.talks = { init: function (view) { ... } };
 *      below.
 *
 * EVENT HANDLING
 *   Views emit `data-action="..."` attributes; controllers attach ONE listener
 *   per page (event delegation) and switch on the action name. To add a new
 *   button, emit a new data-action in the view and handle it here.
 * ========================================================================== */

(function (Site) {
  'use strict';

  var V = Site.views;
  var M = Site.models;
  var C = Site.controllers = {};

  function cfg() { return Site.config || {}; }

  /** Delegate clicks on [data-action] inside `root` to handlers[action](el, event). */
  function onAction(root, handlers) {
    root.addEventListener('click', function (e) {
      var el = e.target.closest('[data-action]');
      if (!el || !root.contains(el)) return;
      var fn = handlers[el.getAttribute('data-action')];
      if (fn) fn(el, e);
    });
  }
  C.onAction = onAction;

  /* =========================================================================
   * LAYOUT — runs on every page: toolbar + footer
   * ====================================================================== */

  C.layout = {
    init: function (pageId) {
      var bar = document.getElementById('site-toolbar');
      var foot = document.getElementById('site-footer');
      var self = this;

      function renderBar() {
        bar.innerHTML = V.layout.toolbar(cfg(), pageId, Site.theme.current());
      }

      if (bar) {
        bar.classList.add('toolbar');
        renderBar();
        onAction(bar, {
          'toggle-menu': function (btn) {
            var open = bar.classList.toggle('is-open');
            btn.setAttribute('aria-expanded', String(open));
          },
          'toggle-theme': function () {
            Site.theme.toggle();
            renderBar();
            var btn = bar.querySelector('[data-action="toggle-theme"]');
            if (btn) btn.focus();
          }
        });
        // Close the mobile menu after picking a link or pressing Escape.
        bar.addEventListener('click', function (e) {
          if (e.target.closest('.toolbar__link')) self.closeMenu(bar);
        });
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') self.closeMenu(bar);
        });
        // Re-render if the OS theme changes while in 'auto' mode.
        Site.theme.onChange(renderBar);
      }

      if (foot) {
        foot.classList.add('footer');
        foot.innerHTML = V.layout.footer(cfg());
      }
    },

    closeMenu: function (bar) {
      bar.classList.remove('is-open');
      var btn = bar.querySelector('[data-action="toggle-menu"]');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  };

  /* =========================================================================
   * HOME — index.html
   * ====================================================================== */

  C.home = {
    init: function (view) {
      var home = cfg().home || {};
      var ctx = {
        config: cfg(),
        profile: M.profile.get(),
        highlights: M.highlights.list(home.maxHighlights),
        featured: M.publications.featured(home.maxFeatured),
        news: M.news.list(home.maxNews)
      };
      var sections = home.sections || ['hero', 'highlights', 'featured', 'news'];
      view.innerHTML = sections.map(function (name) {
        if (typeof V.home[name] !== 'function') {
          console.warn('[site] Unknown home section "' + name + '" in config.home.sections');
          return '';
        }
        return V.home[name](ctx);
      }).join('');
      Site.util.renderMath(view);
    }
  };

  /* =========================================================================
   * ABOUT — aboutme.html
   * ====================================================================== */

  C.about = {
    init: function (view) {
      view.innerHTML = V.about.page(M.profile.get(), cfg());
      Site.util.renderMath(view);
    }
  };

  /* =========================================================================
   * PUBLICATIONS — publications.html
   * Filter state is mirrored in the URL (?q=...&tag=...) so filtered views
   * can be shared, and #<id> scrolls to a specific paper.
   * ====================================================================== */

  C.publications = {

    // Filter keys that are synced with the URL query string.
    URL_KEYS: ['q', 'type', 'year', 'tag', 'sort', 'firstAuthor'],

    init: function (view) {
      var opts = cfg().publications || {};
      var params = Site.util.params();
      this.view = view;
      this.state = {
        q: params.get('q') || '',
        type: params.get('type') || '',
        year: params.get('year') || '',
        tag: params.get('tag') || '',
        sort: params.get('sort') || opts.defaultSort || 'year-desc',
        firstAuthor: params.get('firstAuthor') === '1',
        abstractsOpen: !!opts.abstractsOpen
      };
      this.defaultSort = opts.defaultSort || 'year-desc';
      this.helpers = {
        isSelf: M.publications.isSelf.bind(M.publications),
        links: M.publications.links.bind(M.publications),
        typeLabel: M.publications.typeLabel.bind(M.publications),
        abstractsOpen: this.state.abstractsOpen
      };

      view.innerHTML =
        V.publications.header(M.publications.all().length) +
        (opts.showControls !== false ? V.publications.controls(this.state, M.publications.facets(), this.helpers.typeLabel) : '') +
        '<p class="filters__count" data-role="count" aria-live="polite"></p>' +
        '<div class="pub-list" data-role="list"></div>' +
        V.publications.lightbox();

      this.bind();
      this.renderList();
      this.scrollToHash();
    },

    renderList: function () {
      var pubs = M.publications.query(this.state);
      var list = this.view.querySelector('[data-role="list"]');
      list.innerHTML = V.publications.list(pubs, this.helpers, (cfg().publications || {}).groupByYear !== false);
      this.view.querySelector('[data-role="count"]').textContent = V.publications.count(pubs.length, M.publications.all().length);
      Site.util.renderMath(list);
      this.syncUrl();
    },

    syncUrl: function () {
      var s = this.state, self = this;
      var params = new URLSearchParams();
      this.URL_KEYS.forEach(function (k) {
        var v = s[k];
        if (k === 'sort' && v === self.defaultSort) return;
        if (k === 'firstAuthor') v = v ? '1' : '';
        if (v) params.set(k, v);
      });
      var qs = params.toString();
      try {
        history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
      } catch (e) { /* file:// in some browsers */ }
    },

    scrollToHash: function () {
      var id = decodeURIComponent(location.hash.slice(1));
      if (!id) return;
      var el = document.getElementById(id);
      if (!el) return;
      el.classList.add('is-target');
      requestAnimationFrame(function () { el.scrollIntoView({ block: 'start' }); });
    },

    /** Push the state back into the form controls (after e.g. clicking a tag chip). */
    syncForm: function () {
      var form = this.view.querySelector('[data-role="filters"]');
      if (!form) return;
      var f = form.elements, s = this.state;
      f.q.value = s.q;
      f.type.value = s.type;
      f.year.value = s.year;
      f.tag.value = s.tag;
      f.sort.value = s.sort;
      f.firstAuthor.checked = s.firstAuthor;
    },

    bind: function () {
      var self = this, view = this.view;
      var form = view.querySelector('[data-role="filters"]');
      var dialog = view.querySelector('[data-role="lightbox"]');
      var timer = null;

      if (form) {
        form.addEventListener('submit', function (e) { e.preventDefault(); });
        form.addEventListener('input', function (e) {
          if (e.target.name !== 'q') return;
          clearTimeout(timer);
          timer = setTimeout(function () { self.state.q = e.target.value; self.renderList(); }, 150);
        });
        form.addEventListener('change', function (e) {
          var t = e.target;
          if (!t.name || t.name === 'q') return;
          self.state[t.name] = t.type === 'checkbox' ? t.checked : t.value;
          self.renderList();
        });
      }

      onAction(view, {
        'filter-tag': function (el) {
          self.state.tag = el.getAttribute('data-tag');
          self.syncForm();
          self.renderList();
          view.scrollIntoView({ behavior: 'smooth' });
        },
        'clear-filters': function () {
          self.state.q = self.state.type = self.state.year = self.state.tag = '';
          self.state.firstAuthor = false;
          self.syncForm();
          self.renderList();
        },
        'toggle-abstracts': function (btn) {
          var open = self.helpers.abstractsOpen = self.state.abstractsOpen = !self.state.abstractsOpen;
          view.querySelectorAll('.pub__abstract').forEach(function (d) { d.open = open; });
          btn.textContent = (open ? 'Collapse' : 'Expand') + ' abstracts';
        },
        'copy-bibtex': function (btn) {
          var pub = M.publications.byId(btn.getAttribute('data-id'));
          if (!pub) return;
          Site.util.copyText(pub.bibtex).then(function () {
            var old = btn.innerHTML;
            btn.textContent = 'Copied!';
            setTimeout(function () { btn.innerHTML = old; }, 1500);
          });
        },
        'zoom': function (btn) {
          var pub = M.publications.byId(btn.getAttribute('data-id'));
          if (!pub || !dialog) return;
          var img = dialog.querySelector('.lightbox__img');
          img.src = pub.figure.src;
          img.alt = pub.figure.alt || '';
          var cap = dialog.querySelector('.lightbox__caption');
          cap.textContent = pub.figure.caption || '';
          Site.util.renderMath(cap);
          if (dialog.showModal) dialog.showModal(); else window.open(pub.figure.src, '_blank');
        },
        'close-lightbox': function () { dialog.close(); }
      });

      // Click on the dark backdrop closes the lightbox.
      if (dialog) {
        dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
      }
    }
  };

  /* =========================================================================
   * TUTORIALS — runcode-template.html
   *   no ?t=          -> tutorial index
   *   ?t=<id>         -> that tutorial as a notebook
   *   <body data-tutorial="<id>"> pins the page to one tutorial
   * ====================================================================== */

  C.tutorials = {
    init: function (view, body) {
      var id = body.getAttribute('data-tutorial') || Site.util.params().get('t');
      if (!id) {
        view.innerHTML = V.notebook.index(M.tutorials.all());
        return;
      }
      var tutorial = id === 'scratch' ? M.tutorials.scratch() : M.tutorials.byId(id);
      if (!tutorial) {
        view.innerHTML = V.notebook.notFound(id);
        return;
      }
      document.title = tutorial.title + ' · ' + ((cfg().site || {}).shortName || '');
      new Notebook(view, tutorial).mount();
    }
  };

  /* ---------------------------------------------------------------------
   * Notebook: the controller for one open tutorial.
   * ------------------------------------------------------------------ */

  function Notebook(view, tutorial) {
    this.view = view;
    this.tutorial = tutorial;
    this.opts = cfg().notebook || {};
    this.cells = [];          // { id, type, source, el, editor, userAdded, hidden }
    this.execCount = 0;
    this.nextCellId = 1;
  }

  Notebook.prototype.mount = function () {
    var self = this, t = this.tutorial;

    this.view.innerHTML =
      '<div class="nb">' + V.notebook.header(t) +
      '<div class="nb__cells" data-role="cells"></div>' +
      (this.opts.allowAddCells !== false ? V.notebook.addCellButton() : '') +
      '</div>';
    this.cellsEl = this.view.querySelector('[data-role="cells"]');

    // Start Python immediately; it downloads while the editors are set up.
    this.engine = new Site.PythonEngine({
      pyodideUrl: cfg().cdn.pyodide,
      packages: (this.opts.preloadPackages || []).concat(t.packages || []),
      figureDpi: this.opts.figureDpi,
      onStatus: this.setKernel.bind(this)
    });
    var ready = this.engine.start();

    Site.util.loadEditor(this.opts.editor).then(function (kind) {
      self.editorKind = kind;
      (t.cells || []).forEach(function (cell) { self.addCell(cell, false); });
      self.bind();
      ready.then(function () {
        self.cells.forEach(function (c) { if (c.autorun) self.runCell(c); });
      }, function (err) {
        console.error(err);
        self.setKernel('error', 'Python failed to load: check your connection and reload');
      });
    }).catch(function (err) {
      console.error(err);
      self.view.insertAdjacentHTML('beforeend', '<div class="empty">Could not build this notebook: ' +
        V.esc(err.message) + '. Check data/tutorials.js.</div>');
    });
  };

  Notebook.prototype.setKernel = function (state, text) {
    var k = this.view.querySelector('[data-role="kernel"]');
    if (!k) return;
    k.setAttribute('data-state', state);
    k.querySelector('[data-role="kernel-text"]').textContent = text;
  };

  /** Append a cell. `cell` is a tutorial cell object; `userAdded` marks reader-created cells. */
  Notebook.prototype.addCell = function (cell, userAdded) {
    var self = this;
    var id = 'c' + this.nextCellId++;
    var c = {
      id: id, type: cell.type || 'code', source: cell.source || '', userAdded: userAdded,
      readonly: !!cell.readonly, hidden: !!cell.hidden, autorun: !!cell.autorun
    };
    var trimmed = c.source.replace(/^\n+|\s+$/g, '');

    if (c.type === 'markdown') {
      this.cellsEl.insertAdjacentHTML('beforeend', V.notebook.markdownCell(id));
      c.el = this.cellsEl.lastElementChild;
      Site.util.markdown(trimmed).then(function (html) {
        c.el.innerHTML = html;
        Site.util.renderMath(c.el);
      });
    } else {
      this.cellsEl.insertAdjacentHTML('beforeend', V.notebook.codeCell(id, c, { userAdded: userAdded }));
      c.el = this.cellsEl.lastElementChild;
      c.source = trimmed;
      c.editor = V.editor.create(c.el.querySelector('[data-role="editor"]'), {
        value: trimmed,
        readonly: c.readonly,
        kind: this.editorKind,
        onRun: function () { self.runCell(c); self.focusNext(c); }
      });
    }
    this.cells.push(c);
    return c;
  };

  Notebook.prototype.find = function (el) {
    var cellEl = el.closest('[data-cell]');
    var id = cellEl && cellEl.getAttribute('data-cell');
    return this.cells.filter(function (c) { return c.id === id; })[0];
  };

  Notebook.prototype.focusNext = function (c) {
    var code = this.cells.filter(function (x) { return x.type === 'code'; });
    var next = code[code.indexOf(c) + 1];
    if (next && !next.hidden) next.editor.focus();
  };

  /** Run one cell; resolves to true on success, false on error. */
  Notebook.prototype.runCell = function (c) {
    var self = this;
    var prompt = c.el.querySelector('[data-role="prompt"]');
    var out = c.el.querySelector('[data-role="output"]');
    V.notebook.clearOutput(out);
    prompt.textContent = '[*]';
    c.el.classList.add('is-running');

    return this.engine.run(c.editor.getValue(), {
      packages: this.tutorial.packages,
      onStream: function (name, text) { V.notebook.appendStream(out, name, text); }
    }).then(function (r) {
      c.el.classList.remove('is-running');
      if (r.cancelled) { prompt.textContent = '[ ]'; return false; }
      var n = ++self.execCount;
      prompt.textContent = '[' + n + ']';
      if (r.result != null) V.notebook.appendResult(out, n, r.result);
      (r.figures || []).forEach(function (png) { V.notebook.appendImage(out, png); });
      if (r.error) V.notebook.appendError(out, r.error);
      return !r.error;
    }, function (err) {
      c.el.classList.remove('is-running');
      prompt.textContent = '[!]';
      V.notebook.appendError(out, 'Python is not available: ' + (err && err.message ? err.message : err));
      return false;
    });
  };

  /** Run all code cells in order, stopping at the first error (like Jupyter). */
  Notebook.prototype.runAll = function () {
    var self = this;
    var code = this.cells.filter(function (c) { return c.type === 'code'; });
    return code.reduce(function (p, c) {
      return p.then(function (ok) { return ok ? self.runCell(c) : false; });
    }, Promise.resolve(true));
  };

  Notebook.prototype.bind = function () {
    var self = this;
    onAction(this.view, {
      'run-cell':   function (el) { self.runCell(self.find(el)); },
      'run-all':    function () { self.runAll(); },
      'restart':    function () {
        self.execCount = 0;
        self.cells.forEach(function (c) {
          if (c.type === 'code') c.el.querySelector('[data-role="prompt"]').textContent = '[ ]';
        });
        self.engine.restart().catch(function () {});
      },
      'reset-all':  function () {
        if (!window.confirm('Restore the original code in every cell? Your edits will be lost.')) return;
        self.cells.forEach(function (c) {
          if (c.type !== 'code') return;
          if (!c.userAdded) c.editor.setValue(c.source);
          V.notebook.clearOutput(c.el.querySelector('[data-role="output"]'));
        });
      },
      'reset-cell': function (el) {
        var c = self.find(el);
        c.editor.setValue(c.source);
      },
      'delete-cell': function (el) {
        var c = self.find(el);
        c.el.remove();
        self.cells.splice(self.cells.indexOf(c), 1);
      },
      'toggle-code': function (el) {
        var c = self.find(el);
        var collapsed = c.el.classList.toggle('is-collapsed');
        el.textContent = collapsed ? 'Show code' : 'Hide code';
        if (!collapsed) c.editor.refresh();
      },
      'add-cell':   function () {
        var c = self.addCell({ type: 'code', source: self.opts.newCellTemplate || '' }, true);
        c.editor.focus();
      }
    });
  };

  C.Notebook = Notebook;

})(window.Site = window.Site || {});

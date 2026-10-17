/* =============================================================================
 * jss/models.js — MODEL LAYER
 * =============================================================================
 *
 * The models wrap the raw data in data/*.js and expose small, testable query
 * functions (sort, filter, search, look-up). They never touch the DOM.
 *
 * Why bother? Views and controllers ask the model for "publications from 2025
 * tagged 'dark matter', newest first" instead of each re-implementing the
 * filtering. If you later move your data to JSON files, a CMS, or the
 * NASA ADS API, only this file has to change.
 *
 *   Site.models.profile        -> the profile object
 *   Site.models.highlights     -> highlight cards, sorted
 *   Site.models.news           -> news items, sorted
 *   Site.models.publications   -> query / facets / link normalisation
 *   Site.models.tutorials      -> tutorial look-up
 *   Site.models.prefs          -> small per-visitor preferences (localStorage)
 * ========================================================================== */

(function (Site) {
  'use strict';

  var data = Site.data || {};
  var config = Site.config || {};

  /* ---- helpers ------------------------------------------------------- */

  function byDateDesc(a, b) {
    return String(b.date || '').localeCompare(String(a.date || ''));
  }

  function stripHtml(s) {
    return String(s || '').replace(/<[^>]*>/g, ' ');
  }

  function normalise(s) {
    return String(s || '').toLowerCase();
  }

  function unique(list) {
    return list.filter(function (v, i) { return v != null && list.indexOf(v) === i; });
  }

  Site.models = {};

  /* ---- profile ------------------------------------------------------- */

  Site.models.profile = {
    get: function () { return data.profile || {}; }
  };

  /* ---- highlights & news -------------------------------------------- */

  Site.models.highlights = {
    /** Pinned items first, then newest first. `limit` optional. */
    list: function (limit) {
      var items = (data.highlights || []).slice().sort(function (a, b) {
        if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1;
        return byDateDesc(a, b);
      });
      return limit ? items.slice(0, limit) : items;
    }
  };

  Site.models.news = {
    list: function (limit) {
      var items = (data.news || []).slice().sort(byDateDesc);
      return limit ? items.slice(0, limit) : items;
    }
  };

  /* ---- publications -------------------------------------------------- */

  /*
   * Link kinds understood by `links()`. To support a new kind (e.g. 'video'),
   * add an entry here; `order` controls button order on the page and `url`
   * turns a bare identifier into a full URL.
   */
  var LINK_KINDS = {
    ads:    { label: 'ADS',    order: 1 },
    arxiv:  { label: 'arXiv',  order: 2, url: function (v) { return /^https?:/.test(v) ? v : 'https://arxiv.org/abs/' + v; } },
    doi:    { label: 'DOI',    order: 3, url: function (v) { return /^https?:/.test(v) ? v : 'https://doi.org/' + v; } },
    pdf:    { label: 'PDF',    order: 4 },
    code:   { label: 'Code',   order: 5 },
    data:   { label: 'Data',   order: 6 },
    slides: { label: 'Slides', order: 7 },
    press:  { label: 'Press',  order: 8 }
  };

  var SORTS = {
    'year-desc': function (a, b) { return (b.year - a.year) || String(a.title).localeCompare(b.title); },
    'year-asc':  function (a, b) { return (a.year - b.year) || String(a.title).localeCompare(b.title); },
    'title':     function (a, b) { return String(a.title).localeCompare(b.title); },
    'citations': function (a, b) { return (b.citations || 0) - (a.citations || 0) || b.year - a.year; }
  };

  Site.models.publications = {

    LINK_KINDS: LINK_KINDS,
    SORTS: SORTS,

    all: function () { return (data.publications || []).slice(); },

    byId: function (id) {
      return this.all().filter(function (p) { return p.id === id; })[0] || null;
    },

    featured: function (limit) {
      var items = this.all().filter(function (p) { return p.featured; }).sort(SORTS['year-desc']);
      return limit ? items.slice(0, limit) : items;
    },

    /** True when `name` is one of your own author aliases (config.site.authorAliases). */
    isSelf: function (name) {
      var aliases = ((config.site && config.site.authorAliases) || []).map(normalise);
      return aliases.indexOf(normalise(name).trim()) !== -1;
    },

    isFirstAuthor: function (pub) {
      return !!(pub.authors && pub.authors.length && this.isSelf(pub.authors[0]));
    },

    /**
     * Filter + sort.
     *   q          free-text search over title, authors, abstract, venue, tags
     *   type       exact match on pub.type ('' = any)
     *   year       exact match ('' = any)
     *   tag        pub must have this tag ('' = any)
     *   firstAuthor  only papers where you are first author
     *   sort       key of SORTS
     */
    query: function (opts) {
      opts = opts || {};
      var self = this;
      var terms = normalise(opts.q).split(/\s+/).filter(Boolean);

      var items = this.all().filter(function (p) {
        if (opts.type && p.type !== opts.type) return false;
        if (opts.year && String(p.year) !== String(opts.year)) return false;
        if (opts.tag && (p.tags || []).indexOf(opts.tag) === -1) return false;
        if (opts.firstAuthor && !self.isFirstAuthor(p)) return false;
        if (terms.length) {
          var hay = normalise([
            p.title, (p.authors || []).join(' '), stripHtml(p.abstract),
            p.journal, (p.tags || []).join(' '), p.year
          ].join(' '));
          return terms.every(function (t) { return hay.indexOf(t) !== -1; });
        }
        return true;
      });

      return items.sort(SORTS[opts.sort] || SORTS['year-desc']);
    },

    /** Distinct values for the filter drop-downs. */
    facets: function () {
      var all = this.all();
      return {
        years: unique(all.map(function (p) { return p.year; })).sort(function (a, b) { return b - a; }),
        types: unique(all.map(function (p) { return p.type; })),
        tags:  unique([].concat.apply([], all.map(function (p) { return p.tags || []; }))).sort()
      };
    },

    /** [{ kind, label, href }] in display order, with bare IDs expanded to URLs. */
    links: function (pub) {
      var links = pub.links || {};
      return Object.keys(links)
        .filter(function (k) { return links[k]; })
        .map(function (k) {
          var kind = LINK_KINDS[k] || { label: k.charAt(0).toUpperCase() + k.slice(1), order: 99 };
          return { kind: k, label: kind.label, href: kind.url ? kind.url(links[k]) : links[k], order: kind.order };
        })
        .sort(function (a, b) { return a.order - b.order; });
    },

    typeLabel: function (type) {
      var labels = (config.publications && config.publications.typeLabels) || {};
      return labels[type] || type || '';
    }
  };

  /* ---- tutorials ----------------------------------------------------- */

  Site.models.tutorials = {
    all: function () { return (data.tutorials || []).slice(); },
    byId: function (id) {
      return this.all().filter(function (t) { return t.id === id; })[0] || null;
    },
    /** An empty notebook used for ?t=scratch. */
    scratch: function () {
      return {
        id: 'scratch',
        title: 'Scratchpad',
        summary: 'An empty notebook. Add cells and experiment.',
        packages: [],
        cells: [{ type: 'code', source: (config.notebook && config.notebook.newCellTemplate) || '' }]
      };
    }
  };

  /* ---- per-visitor preferences --------------------------------------- */
  /* localStorage can be unavailable (private mode, blocked storage), so
   * every access is wrapped and falls back gracefully. */

  Site.models.prefs = {
    get: function (key, fallback) {
      try {
        var v = window.localStorage.getItem('site:' + key);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { window.localStorage.setItem('site:' + key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    }
  };

})(window.Site = window.Site || {});

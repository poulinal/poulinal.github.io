/* =============================================================================
 * jss/script.js — BOOTSTRAP + SHARED UTILITIES
 * =============================================================================
 *
 * Loaded LAST on every page (after config, data, models, views, controllers).
 * It:
 *   1. applies the colour theme immediately (before the page paints, so
 *      there is no flash of the wrong theme),
 *   2. loads web fonts from config.theme.fontsUrl,
 *   3. on DOMContentLoaded, renders the shared toolbar + footer and runs the
 *      controller named by <body data-page="..."> (or data-controller="...").
 *
 * It also defines Site.util (script/CSS loader, markdown, math, clipboard)
 * and Site.theme (light/dark handling), used by the controllers.
 *
 * You rarely need to edit this file. Typical reasons:
 *   - change how markdown is rendered        -> Site.util.markdown
 *   - change which LaTeX delimiters are used -> Site.util.renderMath
 *   - add a library that EVERY page needs    -> bottom of this file
 * ========================================================================== */

(function (Site) {
  'use strict';

  var config = Site.config || {};

  /* =========================================================================
   * UTILITIES
   * ====================================================================== */

  var loaded = {};

  Site.util = {

    /** Load a <script> once; returns a Promise. */
    loadScript: function (src) {
      if (!loaded[src]) {
        loaded[src] = new Promise(function (resolve, reject) {
          var s = document.createElement('script');
          s.src = src;
          s.async = false;
          s.onload = resolve;
          s.onerror = function () { delete loaded[src]; reject(new Error('Failed to load ' + src)); };
          document.head.appendChild(s);
        });
      }
      return loaded[src];
    },

    /** Load a stylesheet once (resolves immediately; failures only log). */
    loadCss: function (href) {
      if (!loaded[href]) {
        var l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = href;
        document.head.appendChild(l);
        loaded[href] = Promise.resolve();
      }
      return loaded[href];
    },

    /** URLSearchParams for the current page. */
    params: function () { return new URLSearchParams(location.search); },

    /**
     * Render LaTeX in `el` with KaTeX (if config.features.math is on).
     * Delimiters: $...$ inline, $$...$$ display, also \( \) and \[ \].
     * Text inside <code> and <pre> is left alone, so a literal dollar sign
     * (e.g. a price) is safest wrapped in <code>, or set features.math: false.
     */
    renderMath: function (el) {
      if (!el || !(config.features && config.features.math)) return Promise.resolve();
      // Skip the ~300 kB download when there's nothing that looks like math.
      if (!/\$|\\\(|\\\[/.test(el.textContent)) return Promise.resolve();
      var cdn = config.cdn;
      Site.util.loadCss(cdn.katexCss);
      return Site.util.loadScript(cdn.katexJs)
        .then(function () { return Site.util.loadScript(cdn.katexAutoRender); })
        .then(function () {
          window.renderMathInElement(el, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '\\[', right: '\\]', display: true },
              { left: '$', right: '$', display: false },
              { left: '\\(', right: '\\)', display: false }
            ],
            throwOnError: false
          });
        })
        .catch(function (e) { console.warn('[site] Math rendering unavailable:', e.message); });
    },

    /**
     * Markdown -> HTML (Promise). Uses `marked` from the CDN. LaTeX is
     * protected first so markdown doesn't eat backslashes and underscores.
     * Falls back to escaped paragraphs if the library can't load.
     */
    markdown: function (src) {
      var math = [];
      var guarded = String(src).replace(/\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\$[^$\n]+?\$/g, function (m) {
        math.push(m);
        return '@@MATH' + (math.length - 1) + '@@';
      });
      function restore(html) {
        return html.replace(/@@MATH(\d+)@@/g, function (_, i) { return Site.views.esc(math[+i]); });
      }
      return Site.util.loadScript(config.cdn.marked).then(function () {
        return restore(window.marked.parse(guarded));
      }).catch(function () {
        return restore(guarded.split(/\n{2,}/).map(function (p) {
          return '<p>' + Site.views.esc(p) + '</p>';
        }).join(''));
      });
    },

    /**
     * Load the notebook editor. Resolves to the editor kind actually
     * available: 'codemirror', or 'textarea' if CodeMirror is disabled or
     * fails to load.
     */
    loadEditor: function (preferred) {
      if (preferred === 'textarea') return Promise.resolve('textarea');
      var cdn = config.cdn;
      Site.util.loadCss(cdn.codemirrorCss);
      return Site.util.loadScript(cdn.codemirrorJs)
        .then(function () { return Site.util.loadScript(cdn.codemirrorPython); })
        .then(function () { return 'codemirror'; })
        .catch(function (e) {
          console.warn('[site] CodeMirror unavailable, using plain textarea:', e.message);
          return 'textarea';
        });
    },

    copyText: function (text) {
      if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) { /* ignore */ }
      ta.remove();
      return Promise.resolve();
    }
  };

  /* =========================================================================
   * THEME (light / dark)
   * The resolved mode is written to <html data-theme="light|dark">, which
   * css/style.css keys its colour variables on. Variable overrides from
   * config.theme.{shared,light,dark} are applied as inline styles on <html>.
   * A visitor's choice is remembered in localStorage.
   * ====================================================================== */

  var themeCfg = config.theme || {};
  var listeners = [];
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  Site.theme = {

    /** 'light' or 'dark', taking the stored choice, config default and OS setting into account. */
    resolve: function () {
      var mode = Site.models.prefs.get('theme', null) || themeCfg.defaultMode || 'auto';
      if (mode === 'auto') mode = media && media.matches ? 'dark' : 'light';
      return mode;
    },

    current: function () {
      return document.documentElement.getAttribute('data-theme') || Site.theme.resolve();
    },

    apply: function (mode) {
      var root = document.documentElement;
      root.setAttribute('data-theme', mode);
      var light = themeCfg.light || {}, dark = themeCfg.dark || {}, shared = themeCfg.shared || {};
      Object.keys(light).concat(Object.keys(dark)).forEach(function (k) { root.style.removeProperty(k); });
      [shared, mode === 'dark' ? dark : light].forEach(function (vars) {
        Object.keys(vars).forEach(function (k) { if (vars[k] != null) root.style.setProperty(k, vars[k]); });
      });
    },

    toggle: function () {
      var next = Site.theme.current() === 'dark' ? 'light' : 'dark';
      Site.models.prefs.set('theme', next);
      Site.theme.apply(next);
    },

    onChange: function (fn) { listeners.push(fn); }
  };

  // Follow OS changes while the visitor hasn't picked a mode explicitly.
  if (media && media.addEventListener) {
    media.addEventListener('change', function () {
      if (Site.models.prefs.get('theme', null)) return;
      Site.theme.apply(Site.theme.resolve());
      listeners.forEach(function (fn) { fn(); });
    });
  }

  /* =========================================================================
   * BOOT
   * ====================================================================== */

  // 1. Theme + fonts right away (this script runs in <head>).
  Site.theme.apply(Site.theme.resolve());
  if (themeCfg.fontsUrl) Site.util.loadCss(themeCfg.fontsUrl);

  // 2. Page title: "<page title> · <short name>"
  var shortName = config.site && config.site.shortName;
  if (shortName && document.title.indexOf(shortName) === -1) {
    document.title = document.title ? document.title + ' · ' + shortName : shortName;
  }

  // 3. Layout + page controller once the DOM is ready.
  document.addEventListener('DOMContentLoaded', function () {
    var body = document.body;
    var page = body.getAttribute('data-page') || '';
    var name = body.getAttribute('data-controller') || page;

    Site.controllers.layout.init(page);

    var view = document.getElementById('view');
    var controller = Site.controllers[name];
    if (!view) return;
    if (!controller || typeof controller.init !== 'function') {
      console.warn('[site] No controller "' + name + '" — static page only.');
      return;
    }
    try {
      controller.init(view, body);
    } catch (err) {
      console.error(err);
      view.innerHTML = '<div class="empty"><h1>Something went wrong</h1><p>' +
        Site.views.esc(err.message) + '</p><p>Check the browser console and your data/*.js files.</p></div>';
    }
  });

})(window.Site = window.Site || {});

/* =============================================================================
 * jss/python-engine.js — PYTHON "KERNEL" FOR THE TUTORIAL NOTEBOOKS
 * =============================================================================
 *
 * A small service that runs Python code with Pyodide (CPython compiled to
 * WebAssembly). It is UI-agnostic: the notebook controller calls it, it
 * never touches the DOM.
 *
 * Python runs inside a Web Worker, so:
 *   - the page stays responsive while code runs,
 *   - print() output streams in live, line by line,
 *   - "Restart" can stop runaway code (e.g. an infinite loop) by terminating
 *     the worker and starting a fresh one, like restarting a Jupyter kernel.
 *
 * USAGE (see Site.controllers.tutorials for the real thing)
 *
 *   var py = new Site.PythonEngine({
 *     pyodideUrl: Site.config.cdn.pyodide,
 *     packages:   ['numpy'],                 // loaded at start-up
 *     figureDpi:  100,
 *     onStatus:   function (state, text) {}  // 'loading' | 'ready' | 'busy' | 'error'
 *   });
 *   py.start();
 *   py.run('print(1 + 1)', { onStream: function (name, text) {} })
 *     .then(function (r) { r.result; r.figures; r.error; });
 *   py.restart();
 *
 * WHAT `run` RETURNS
 *   result   repr() of the last expression, or null (like Jupyter's Out[n])
 *   figures  array of base64 PNG strings, one per open matplotlib figure
 *   error    cleaned-up traceback string, or null
 *   cancelled  true if the job was dropped because the kernel restarted
 *
 * CUSTOMISING
 *   - Extra Python run once at start-up (imports, helper functions, plotting
 *     style, ...): add it to SETUP_PY below, or pass `setupCode` in options.
 *   - Pyodide version: change Site.config.cdn.pyodide.
 * ========================================================================== */

(function (Site) {
  'use strict';

  /* ---------------------------------------------------------------------
   * Python executed once when the kernel starts. Defines the helpers the
   * worker calls to run a cell and to collect matplotlib figures.
   * ------------------------------------------------------------------ */
  var SETUP_PY = [
    'import os, sys, io, base64, warnings',
    'os.environ["MPLBACKEND"] = "AGG"  # render figures off-screen; we display them as PNGs',
    'warnings.filterwarnings("ignore", message=".*non-GUI backend.*")      # plt.show() is harmless here',
    'warnings.filterwarnings("ignore", message=".*non-interactive.*")',
    'from pyodide.code import eval_code_async',
    '',
    'def _site_figures(dpi):',
    '    if "matplotlib.pyplot" not in sys.modules:',
    '        return []',
    '    plt = sys.modules["matplotlib.pyplot"]',
    '    out = []',
    '    for n in plt.get_fignums():',
    '        buf = io.BytesIO()',
    '        plt.figure(n).savefig(buf, format="png", dpi=dpi, bbox_inches="tight")',
    '        out.append(base64.b64encode(buf.getvalue()).decode("ascii"))',
    '    plt.close("all")',
    '    return out',
    '',
    'async def _site_run(code, ns, dpi):',
    '    try:',
    '        result = await eval_code_async(code, ns, filename="<cell>")',
    '    except BaseException:',
    '        _site_figures(dpi)  # discard half-drawn figures',
    '        raise',
    '    return (None if result is None else repr(result)), _site_figures(dpi)'
  ].join('\n');

  /* ---------------------------------------------------------------------
   * Worker source. Kept as a function so it is readable and lint-able; it
   * is stringified and started from a Blob URL (works on GitHub Pages and
   * from file://, no separate worker file needed).
   * ------------------------------------------------------------------ */
  function workerMain() {
    /* global importScripts, loadPyodide */
    var py = null, ns = null, runFn = null, currentId = null;
    var send = function (m) { self.postMessage(m); };

    function newNamespace() {
      if (ns) ns.destroy();
      ns = py.globals.get('dict')();
      ns.set('__name__', '__main__');
    }

    async function install(packages) {
      var plain = [], pip = [];
      (packages || []).forEach(function (p) {
        if (p.indexOf('micropip:') === 0) pip.push(p.slice(9)); else plain.push(p);
      });
      var log = function (m) { send({ type: 'log', text: m }); };
      if (plain.length) await py.loadPackage(plain, { messageCallback: log });
      if (pip.length) {
        await py.loadPackage('micropip', { messageCallback: log });
        var micropip = py.pyimport('micropip');
        for (var i = 0; i < pip.length; i++) { log('Installing ' + pip[i]); await micropip.install(pip[i]); }
      }
    }

    self.onmessage = async function (e) {
      var msg = e.data;
      if (msg.type === 'init') {
        try {
          importScripts(msg.pyodideUrl);
          py = await loadPyodide({ indexURL: msg.pyodideUrl.replace(/[^/]*$/, '') });
          py.setStdout({ batched: function (t) { send({ type: 'stream', id: currentId, name: 'stdout', text: t + '\n' }); } });
          py.setStderr({ batched: function (t) { send({ type: 'stream', id: currentId, name: 'stderr', text: t + '\n' }); } });
          await py.runPythonAsync(msg.setup);
          runFn = py.globals.get('_site_run');
          newNamespace();
          await install(msg.packages);
          send({ type: 'ready' });
        } catch (err) {
          send({ type: 'init-error', error: String((err && err.message) || err) });
        }
      } else if (msg.type === 'run') {
        currentId = msg.id;
        try {
          await install(msg.packages);
          await py.loadPackagesFromImports(msg.code, { messageCallback: function (m) { send({ type: 'log', text: m }); } });
          var out = await runFn(msg.code, ns, msg.dpi);
          var js = out.toJs();
          out.destroy();
          send({ type: 'done', id: msg.id, result: js[0] == null ? null : js[0], figures: Array.from(js[1] || []), error: null });
        } catch (err) {
          send({ type: 'done', id: msg.id, result: null, figures: [], error: String((err && err.message) || err) });
        }
      }
    };
  }

  /** Keep only the part of a Pyodide traceback that refers to the user's cell. */
  function cleanTraceback(text) {
    var lines = String(text).split('\n');
    var start = -1;
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].indexOf('File "<cell>"') !== -1) { start = i; break; }
    }
    if (start === -1) return text.trim();
    return ['Traceback (most recent call last):'].concat(lines.slice(start)).join('\n').trim();
  }

  function PythonEngine(opts) {
    this.opts = opts || {};
    this.worker = null;
    this.ready = null;          // Promise resolved when the kernel can run code
    this.queue = Promise.resolve();
    this.pending = {};          // run id -> { resolve, onStream }
    this.nextId = 1;
    this.loaded = {};           // packages already requested
    this.generation = 0;        // bumped on restart; stale queued jobs are cancelled
  }

  PythonEngine.prototype._status = function (state, text) {
    if (this.opts.onStatus) this.opts.onStatus(state, text);
  };

  /** Start the kernel (idempotent). Returns a Promise. */
  PythonEngine.prototype.start = function () {
    if (this.ready) return this.ready;
    var self = this;
    var src = '(' + workerMain.toString() + ')();';
    var url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
    this.worker = new Worker(url);
    this._status('loading', 'Starting Python…');

    this.ready = new Promise(function (resolve, reject) {
      self.worker.onmessage = function (e) {
        var m = e.data;
        if (m.type === 'ready') { self._status('ready', 'Python ready'); resolve(); }
        else if (m.type === 'init-error') { self._status('error', 'Python failed to load'); reject(new Error(m.error)); }
        else if (m.type === 'log') { self._status('busy', m.text); }
        else if (m.type === 'stream') {
          var p = self.pending[m.id];
          if (p && p.onStream) p.onStream(m.name, m.text);
        } else if (m.type === 'done') {
          var job = self.pending[m.id];
          delete self.pending[m.id];
          if (job) job.resolve({ result: m.result, figures: m.figures, error: m.error ? cleanTraceback(m.error) : null });
        }
      };
      self.worker.onerror = function (e) {
        self._status('error', 'Python worker crashed');
        reject(e);
      };
    });

    var packages = (this.opts.packages || []).slice();
    packages.forEach(function (p) { self.loaded[p] = true; });
    this.worker.postMessage({
      type: 'init',
      pyodideUrl: this.opts.pyodideUrl,
      setup: SETUP_PY + '\n' + (this.opts.setupCode || ''),
      packages: packages
    });
    // Avoid "unhandled rejection" noise; callers handle errors via run()/ready.
    this.ready.catch(function () {});
    return this.ready;
  };

  /**
   * Run code. Calls are queued, so cells always execute one at a time in
   * the order they were requested.
   *   options.onStream(name, text)  live stdout/stderr
   *   options.packages              extra packages to make sure are loaded
   */
  PythonEngine.prototype.run = function (code, options) {
    var self = this;
    options = options || {};
    var gen = this.generation;
    var job = this.queue.then(function () {
      if (gen !== self.generation) return { cancelled: true, result: null, figures: [], error: null };
      return self.start().then(function () {
        var id = self.nextId++;
        var extra = (options.packages || []).filter(function (p) { return !self.loaded[p]; });
        extra.forEach(function (p) { self.loaded[p] = true; });
        self._status('busy', 'Running…');
        return new Promise(function (resolve) {
          self.pending[id] = { resolve: resolve, onStream: options.onStream };
          self.worker.postMessage({ type: 'run', id: id, code: code, packages: extra, dpi: self.opts.figureDpi || 100 });
        });
      }).then(function (r) {
        if (gen === self.generation) self._status('ready', 'Python ready');
        return r;
      });
    });
    // Keep the queue alive even if a job fails.
    this.queue = job.catch(function () {});
    return job;
  };

  /** Kill the worker (stopping any running code) and start a fresh kernel. */
  PythonEngine.prototype.restart = function () {
    var self = this;
    if (this.worker) this.worker.terminate();
    this.generation++;
    Object.keys(this.pending).forEach(function (id) {
      self.pending[id].resolve({ result: null, figures: [], error: 'KernelRestart: execution was stopped.' });
    });
    this.pending = {};
    this.worker = null;
    this.ready = null;
    this.loaded = {};
    this.queue = Promise.resolve();
    return this.start();
  };

  Site.PythonEngine = PythonEngine;

})(window.Site = window.Site || {});

/* =============================================================================
 * data/highlights.js — FRONT-PAGE HIGHLIGHTS AND NEWS
 * =============================================================================
 *
 * Two lists:
 *
 *   Site.data.highlights  Big image cards near the top of the home page.
 *                         Good for new papers, press releases, talks, awards.
 *   Site.data.news        A short dated list ("News") further down.
 *
 * Both are sorted newest-first automatically by `date`, so you can add new
 * items anywhere in the array. How many are shown is set in config.js
 * (Site.config.home).
 *
 * HIGHLIGHT FIELDS
 *   date       'YYYY-MM-DD' (required — used for sorting and display)
 *   category   short label shown above the title, e.g. 'Paper', 'Talk'
 *   title      plain text
 *   summaryHtml  1–2 sentences, HTML + LaTeX allowed. If the card has a
 *              `link`, the whole card is clickable, so don't put <a> tags
 *              inside the summary (links can't be nested).
 *   image      path or URL (optional — card shows without an image)
 *   imageAlt   describe the image for screen readers
 *   link       { href, label } (optional). Tip: link to a publication with
 *              'publications.html#<publication id>' to jump straight to it.
 *   pinned     true keeps the card first regardless of date
 *
 * NEWS FIELDS
 *   date       'YYYY-MM-DD'
 *   textHtml   one line, HTML allowed
 * ========================================================================== */

(function (Site) {
  'use strict';
  Site.data = Site.data || {};

  Site.data.highlights = [
    {
      date: '2026-04-17',
      category: 'Recent paper',
      title: 'Magnetic Fields of Satellite Galaxies Stronger than Comparable Centrals in TNG100',
      summaryHtml:
        'In TNG100 we find that magnetic fields in satellite galaxies are stronger than in central galaxies of the same stellar mass.',
      image: 'assets/img/pubs/rnaasadce74f1_lr.jpg',
      imageAlt: 'Log-Log plot of magnetic field strength vs stellar mass for TNG100 galaxies, showing satellites have stronger fields than centrals at the same mass.',
      link: { href: 'publications.html#astronomer2026-cores', label: 'Read the paper' },
      pinned: true
    },
    {
      date: '2026-08-03',
      category: 'Software',
      title: 'CLADA (CLASSE-GUI-Toolkit) v0.2.0 released',
      summaryHtml:
        'A fast gui toolkit for CLASSE\'s beamline data, interfacing with <code>nxs-analysis-tools</code>. Focused on producing deltaPDF\'s. ' +
        'Install source <code>git clone https://github.com/poulinal/Classe-GUI-Toolkit.git</code> or download release.',
      image: 'assets/img/pubs/CLADA-home.png',
      imageAlt: 'Image of the CLADA GUI\'s main window, showing a sample plot and various controls.',
      // link: { href: 'publications.html#astronomer2025-specfit', label: 'See the software paper' }
      link: { href: 'https://github.com/poulinal/Classe-GUI-Toolkit/releases/tag/v0.2.0', label: 'See the software repo'}
    },
    {
      date: '2026-04-01',
      category: 'Tutorial',
      title: 'Interactive Python tutorials',
      summaryHtml:
        'Run Python in your browser — no install needed. Currently in development.', //+
        // ' Start with Kepler’s third law and work up to fitting rotation curves.',
      // image: 'assets/img/pubs/light-curve.png',
      imageAlt: 'Transit light curve',
      link: { href: 'runcode-template.html', label: 'Open the tutorials' }
    }
  ];

  Site.data.news = [
    { date: '2026-09-06', textHtml: 'Preparing new paper on my project on redshift dependence on satellite galaxy distribution lopsidedness in TNG300 & TNG-Cluster simulations. Intended to be submitted to <em>ApJ</em>.' },
    { date: '2026-08-29', textHtml: 'Preparing new paper on my project on F277W-Dropouts in the COSMOS-Web field while at the Cosmic DAWN Center. Intended to be submitted to <em>ApJ</em>.' },
    { date: '2026-08-14', textHtml: 'Gave a talk at the Cosmic DAWN Center during one of their cake-talks.' },
    { date: '2026-06-06', textHtml: 'Began working on a new project at the COSMIC DAWN Center with Shuowen Jin and Marko Shuntov on F277W-Dropouts.' },
    { date: '2026-01-12', textHtml: 'Began working on a new co-op project at Boston University on satellite distribution lopsidedness\'s redshift dependence in the TNG simulations with Professor Brainerd' },
    // { date: '2026-07-10', textHtml: 'Invited talk at the Summer Galaxies Workshop.' },
    // { date: '2026-05-14', textHtml: '<code>specfit</code> v1.0 is out on PyPI.' },
    // { date: '2025-11-03', textHtml: 'Awarded the Early Career Research Prize.' },
    // { date: '2025-06-01', textHtml: 'Started observing run at Some Observatory.' },
    // { date: '2024-09-01', textHtml: 'New paper on dark matter cores accepted to <em>ApJ</em>' }
  ];

})(window.Site = window.Site || {});

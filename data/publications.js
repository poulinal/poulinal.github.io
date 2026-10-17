/* =============================================================================
 * data/publications.js — YOUR PUBLICATION LIST
 * =============================================================================
 *
 * One object per paper. Order doesn't matter: the page sorts them (see
 * Site.config.publications.defaultSort). Only `id`, `title`, `authors`
 * and `year` are required; every other field is optional and its UI element
 * is hidden when missing.
 *
 * FIELDS
 *   id         unique, URL-safe string. Becomes the anchor, so
 *              publications.html#<id> links directly to the entry.
 *   title      plain text (LaTeX allowed, e.g. 'The $z\\sim2$ universe')
 *   authors    array of names. Names matching Site.config.site.authorAliases
 *              are highlighted. Use 'et al.' as the last entry to truncate.
 *   year       number
 *   journal    e.g. 'ApJ', 'MNRAS', 'A&A', 'arXiv e-prints'
 *   volume, pages   optional strings
 *   type       one of the keys in Site.config.publications.typeLabels
 *              ('article', 'proceedings', 'preprint', 'thesis', 'software')
 *   abstract   HTML + LaTeX allowed. Remember to double the backslashes in
 *              JS strings ('$\\Lambda$CDM'), or use String.raw`...`.
 *   figure     { src, alt, caption }  your "signature plot" for the paper.
 *              PNG/SVG/JPG all fine; ~1200 px wide is plenty.
 *   links      any of { ads, arxiv, doi, pdf, code, data, slides, press }.
 *              arxiv may be just the ID ('2601.01234'), doi just the DOI.
 *   tags       array of strings (become filter chips)
 *   featured   true -> also listed under "Selected publications" on Home
 *   citations  number (optional; shown and usable for sorting)
 *   bibtex     raw BibTeX string -> enables a "Copy BibTeX" button
 *   note       short extra line, e.g. 'Press release by NASA'
 *
 * TIP: export a BibTeX file from NASA ADS and convert it with
 *     python3 tools/bib2js.py my-papers.bib > draft.js
 * then paste the entries below and add figures/tags by hand.
 * ========================================================================== */

(function (Site) {
  'use strict';
  Site.data = Site.data || {};

  Site.data.publications = [
    {
      id: 'RNAAS-magnetic-fields-2025',
      title: 'Magnetic Fields of Satellite Galaxies Stronger than Comparable Centrals in TNG100',
      authors: ['A. Astronomer', 'B. Collaborator', 'C. Student', 'D. Senior'],
      year: 2026,
      journal: 'ApJ',
      volume: '981',
      pages: '42',
      type: 'article',
      featured: true,
      citations: 7,
      tags: ['Satellite Galaxies', 'Central Galaxies', 'Magnetic Field'],
      abstract:
        'Magnetic fields exist in and around galaxies, but the properties of these fields have not been fully explored due to the challenges inherent in observing and modeling them. In this Note, we explore the differences in magnetic field strength of central and satellite galaxies from the magnetohydrodynamic TNG100 simulation. We find that on average, magnetic fields in satellite galaxies are roughly an order of magnitude stronger than those of central galaxies with comparable masses. The difference is greater for satellites that have already approached within 1R200 of their host galaxies. These results indicate that magnetic fields in satellite galaxies are amplified by environmental processes as they fall into a host halo.',
      figure: {
        src: 'assets/img/pubs/rnaasadce74f1_lr.jpg',
        alt: 'In TNG100 we find that magnetic fields in satellite galaxies are stronger than in central galaxies of the same stellar mass.',
        caption: 'Magnetic field strength of galaxies as a function of stellar mass. Galaxies are binned by stellar mass, separated into pre-infall satellites (green), post-infall satellites (purple), non-isolated centrals (red), and isolated centrals (blue). Error bars on each point are the standard deviation in each bin. The contour lines represents the distribution of unbinned pre-infall satellites.'
      },
      links: {
        ads: 'https://ui.adsabs.harvard.edu/abs/2025RNAAS...9...93M/abstract',
        // RNAAS: 'https://iopscience.iop.org/article/10.3847/2515-5172/adce74',
        arxiv: '2504.07895v2',
        doi: 'https://ui.adsabs.harvard.edu/link_gateway/2025RNAAS...9...93M/doi:10.3847/2515-5172/adce74',
        code: 'https://github.com/poulinal/TNG_Magnetic_Field_Study'
      },
      bibtex:
        // '@ARTICLE{Astronomer2026,\n' +
        // '  author  = {{Astronomer}, A. and {Collaborator}, B. and {Student}, C. and {Senior}, D.},\n' +
        // '  title   = "{Cored dark matter halos are ubiquitous in nearby dwarf galaxies}",\n' +
        // '  journal = {ApJ},\n  year = 2026,\n  volume = {981},\n  pages = {42}\n}'
        '@article{mcdonough_magnetic_2025,' +
          'title = {Magnetic {Fields} of {Satellite} {Galaxies} {Stronger} than {Comparable} {Centrals} in {TNG100}},' +
          'volume = {9}, '+
          'issn = {2515-5172},'+
          'url = {https://doi.org/10.3847/2515-5172/adce74},'+
          'doi = {10.3847/2515-5172/adce74},'+
          'abstract = {Magnetic fields exist in and around galaxies, but the properties of these fields have not been fully explored due to the challenges inherent in observing and modeling them. In this Note, we explore the differences in magnetic field strength of central and satellite galaxies from the magnetohydrodynamic TNG100 simulation. We find that on average, magnetic fields in satellite galaxies are roughly an order of magnitude stronger than those of central galaxies with comparable masses. The difference is greater for satellites that have already approached within 1R200 of their host galaxies. These results indicate that magnetic fields in satellite galaxies are amplified by environmental processes as they fall into a host halo.},'+
          'language = {en},'+
          'number = {4},'+
          'urldate = {2026-10-17},'+
          'journal = {Research Notes of the AAS},'+
          'publisher = {The American Astronomical Society},'+
          'author = {McDonough, Bryanne and Poulin, Alexander},'+
          'month = apr,'+
          'year = {2025},'+
          'pages = {93},'+
        '}'
    },
    // {
    //   id: 'astronomer2025-specfit',
    //   title: 'specfit: fast spectral fitting for integral-field data cubes',
    //   authors: ['A. Astronomer', 'E. Engineer'],
    //   year: 2025,
    //   journal: 'Journal of Open Source Software',
    //   volume: '10',
    //   pages: '7001',
    //   type: 'software',
    //   featured: true,
    //   citations: 15,
    //   tags: ['software', 'spectroscopy'],
    //   abstract:
    //     '<code>specfit</code> is a Python package for fitting stellar and gas ' +
    //     'kinematics in IFU data cubes. Using vectorised template fitting it ' +
    //     'processes a full MUSE cube in minutes on a laptop, recovering ' +
    //     'velocities to within $2\\,\\mathrm{km\\,s^{-1}}$ of established codes.',
    //   figure: {
    //     src: 'assets/img/pubs/power-spectrum.png',
    //     alt: 'Residual power spectrum comparing specfit to a reference code',
    //     caption: 'Residual power across spatial scales: specfit matches the reference pipeline at all $k$.'
    //   },
    //   links: {
    //     doi: '10.0000/joss.07001',
    //     code: 'https://github.com/your-username/specfit'
    //   }
    // },
    // {
    //   id: 'student2025-transits',
    //   title: 'A search for transiting companions around white dwarfs in TESS',
    //   authors: ['C. Student', 'A. Astronomer', 'F. Observer', 'et al.'],
    //   year: 2025,
    //   journal: 'MNRAS',
    //   volume: '530',
    //   pages: '1123–1140',
    //   type: 'article',
    //   citations: 4,
    //   tags: ['exoplanets', 'time domain'],
    //   abstract:
    //     'We searched 12,000 white dwarfs observed by TESS for periodic transits. ' +
    //     'We report two candidate substellar companions with periods under ' +
    //     '$10\\,\\mathrm{h}$ and place occurrence-rate upper limits for ' +
    //     'giant planets on short orbits.',
    //   figure: {
    //     src: 'assets/img/pubs/light-curve.png',
    //     alt: 'Phase-folded transit light curve with model',
    //     caption: 'Phase-folded TESS light curve of the strongest candidate with the best-fitting transit model.'
    //   },
    //   links: { arxiv: '2503.00002', ads: 'https://ui.adsabs.harvard.edu/' }
    // },
    // {
    //   id: 'astronomer2023-thesis',
    //   title: 'Weighing the smallest galaxies: dark matter in the dwarf regime',
    //   authors: ['A. Astronomer'],
    //   year: 2023,
    //   journal: 'PhD Thesis, Another University',
    //   type: 'thesis',
    //   tags: ['dark matter', 'dwarf galaxies'],
    //   abstract:
    //     'This thesis measures the dark matter content of dwarf galaxies using ' +
    //     'stellar and gas kinematics, and tests the predictions of cold dark ' +
    //     'matter on the smallest galactic scales.',
    //   figure: {
    //     src: 'assets/img/pubs/scaling-relation.png',
    //     alt: 'Scatter plot of halo mass versus stellar mass',
    //     caption: 'Stellar-to-halo mass relation for the thesis sample.'
    //   },
    //   links: { pdf: 'https://example.edu/thesis.pdf' }
    // },
    // {
    //   id: 'astronomer2021-proc',
    //   title: 'Preliminary rotation curves from a pilot IFU survey',
    //   authors: ['A. Astronomer', 'D. Senior'],
    //   year: 2021,
    //   journal: 'Proceedings of the IAU Symposium 999',
    //   pages: '55–58',
    //   type: 'proceedings',
    //   tags: ['kinematics'],
    //   abstract: 'We describe the pilot sample and first kinematic maps.',
    //   note: 'Contributed talk'
    // }
  ];

})(window.Site = window.Site || {});

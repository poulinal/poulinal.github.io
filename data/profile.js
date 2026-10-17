/* =============================================================================
 * data/profile.js — WHO YOU ARE (used by the Home and About pages)
 * =============================================================================
 *
 * Pure data, no logic. Edit freely.
 *
 * Fields whose name ends in `Html` (or that are documented as HTML) are
 * inserted as raw HTML, so you can use <a>, <em>, <strong>, and LaTeX math
 * like $M_\odot$ (rendered by KaTeX if features.math is on in config.js).
 * All other fields are treated as plain text and escaped automatically.
 *
 * Any field can be removed; its section on the page is simply skipped.
 * ========================================================================== */

(function (Site) {
  'use strict';
  Site.data = Site.data || {};

  Site.data.profile = {

    /* ---- Home page hero ------------------------------------------------- */
    photo: 'assets/img/photos/Poulin_Alexander_cropped.jpg',      // square image works best
    photoAlt: 'Portrait of Alexander Poulin',
    heroHeading: 'Welcome, I’m Alexander Poulin.',
    heroRole: 'Undergraduate Researcher in Physics & Computer Science',
    // A short (2–3 sentence) intro. HTML allowed.
    introHtml:
      'I\'m interested in studying <strong>cosmology, the high-redshift universe, little red dots, and galaxy evolution</strong>. ' +
      'I enjoy using large deep-field observational surveys and simulations like the IllustrisTNG project to study these topics. ',
      // 'I also build open-source tools that make astronomical data easier to explore.',
    // Buttons under the intro. Remove the array to hide them.
    heroButtons: [
      { label: 'Read my research', href: 'publications.html', style: 'primary' },
      { label: 'Try a tutorial',   href: 'runcode-template.html', style: 'secondary' }
    ],

    /* ---- About page ----------------------------------------------------- */
    // Each string is one paragraph. HTML allowed.
    bioHtml: [
      'I am a fourth-year undergraduate at Northeastern University majoring in Physics and Computer Science, ' +
      'with a minor in astrophysics. In my past research, I have worked on: developing data analysis tools ' +
      'for Cornell\'s CLASSE beamline; galactic magnetic field dependence in TNG100; ',

      'I am currently looking to pursuing a PhD in graduate school. ' +
      'Outside research I enjoy ' +
      'playing hockey and piano, hiking, film photogreaphy, and running. ' +
      'Additionally, I am passionate about teaching and mentoring students in the sciences including ' +
      'teaching scientific Python — try one of the ' +
      '<a href="runcode-template.html">interactive tutorials</a> on this site. ' +
      'Please feel free to reach out to me for a chat! '
    ],

    // Research interests shown as cards.
    interests: [
      { title: 'Cosmology',        description: 'Study of the large-scale structure and evolution of the universe.' },
      { title: 'Galaxy Evolution',            description: 'Evolution of galaxies, galaxy clusters, and galaxy-host relations.' },
      { title: 'High-Redshift Universe', description: 'High-redshift objects like LRDs and galaxies.' },
      // { title: 'Open-source software',   description: 'Python tools for spectral fitting and visualisation.' }
    ],

    // Timelines. `years` is free text, so "2024–present" or "Fall 2023" both work.
    positions: [
      { years: 'June 2026 – August 2026', role: 'DAWN-IRES Scholar', org: 'Cosmic DAWN Center (University of Copenhagen / Technical University of Denmark)' },
      { years: 'January 2026 – May 2026',    role: 'Undergraduate Research Co-op',     org: 'Cosmology Group – Boston University' },
      { years: 'January 2025 – June 2025',    role: 'AJC Merit Scholarship Co-op',     org: 'CERN & Northeastern University' },
      { years: 'October 2024 – April 2025',    role: 'Undergraduate Research',     org: 'Cosmology Group – Northeastern University' },
      { years: 'November 2023 – Present',    role: 'Undergraduate Research',     org: 'DeLTA Laboratory – Northeastern University' },
    ],
    education: [
      { years: '2023 – 2027', role: 'BSc, Computer Science & Physics',   org: 'Northeastern Unniversity' }
    ],

    // Optional list of awards / talks / service. Remove to hide the section.
    awards: [
      { years: '2026', role: 'DAWN-IRES Scholars Program', org: 'NSF & University of Massachusetts Amherst' },
      { years: '2026', role: 'Barry Goldwater Nomination',         org: 'Northeastern University' },
      { years: '2026', role: 'Four Gavin Brothers Experiential Learning Scholarship',         org: 'Northeastern University' },
      { years: '2024', role: 'John Martinson Honors Program',         org: 'Northeastern University' },
      { years: '2025', role: 'PEAK Award Summit',         org: 'Northeastern University' },
      { years: '2025', role: 'AJC Merit Research Scholarship',         org: 'Northeastern University' },
      { years: '2024', role: 'PEAK Award Ascent',         org: 'Northeastern University' },
      { years: '2024', role: 'PEAK Award Base Camp',         org: 'Northeastern University' },

    ],

    // Link to a PDF of your CV (put the file in assets/). null hides the button.
    // cvUrl: null // e.g. 'assets/cv.pdf'
    cvUrl: 'poulinal.github.io/assets/Alexander Poulin – CV – Cambridge Final.pdf'


    //TODO: should i add a section for presentations?
  };

})(window.Site = window.Site || {});

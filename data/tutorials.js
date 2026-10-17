/* =============================================================================
 * data/tutorials.js — INTERACTIVE PYTHON TUTORIALS (runcode-template.html)
 * =============================================================================
 *
 * Each tutorial is a mini Jupyter notebook: an ordered list of cells.
 * Readers can edit and run the code cells in their browser (via Pyodide),
 * and all cells in a tutorial share one Python namespace, just like Jupyter.
 *
 * URLS
 *   runcode-template.html                    -> list of all tutorials
 *   runcode-template.html?t=kepler           -> opens the tutorial with id 'kepler'
 *   runcode-template.html?t=scratch          -> empty scratchpad notebook
 *
 *   You can also make a dedicated page for one tutorial: copy
 *   runcode-template.html and add data-tutorial="kepler" to its <body>.
 *
 * TUTORIAL FIELDS
 *   id         unique, URL-safe string (used in ?t=...)
 *   title      plain text
 *   summary    one sentence for the tutorial list
 *   level      free text, e.g. 'Beginner'
 *   duration   free text, e.g. '10 min'
 *   packages   Pyodide packages to load before running, e.g. ['numpy', 'matplotlib'].
 *              (Imports are also auto-detected, so this mostly avoids a delay
 *              on the first run.) Pure-Python wheels from PyPI can be listed
 *              as 'micropip:package-name'.
 *   cells      array of { type: 'markdown' | 'code', source: '...' }
 *              Optional per-cell flags:
 *                readonly: true   code can be run but not edited
 *                hidden:   true   code is hidden (setup code); a "show code"
 *                                 toggle is displayed instead
 *                autorun:  true   runs automatically once Python is ready
 *
 * WRITING CELLS
 *   - Use String.raw`...` (backticks) so you can write Python and LaTeX
 *     without escaping backslashes. Just avoid the characters ` and ${ inside;
 *     for inline code in markdown cells write <code>x</code> instead of `x`.
 *   - Markdown supports headings, lists, `code`, links, and LaTeX ($...$).
 *   - matplotlib figures appear below the cell automatically; no need to
 *     call plt.show() (it's harmless if you do).
 *   - The value of the last line is displayed, like Jupyter's Out[n].
 * ========================================================================== */

(function (Site) {
  'use strict';
  Site.data = Site.data || {};

  Site.data.tutorials = [

//     /* ------------------------------------------------------------------ */
//     {
//       id: 'kepler',
//       title: 'Python warm-up: Kepler’s third law',
//       summary: 'Variables, functions and loops, by computing planetary orbits.',
//       level: 'Beginner',
//       duration: '10 min',
//       packages: [],
//       cells: [
//         { type: 'markdown', source: String.raw`
// ## Kepler's third law

// For a small body orbiting a star of mass $M$, the orbital period $P$ and
// semi-major axis $a$ obey

// $$P^2 = \frac{4\pi^2}{G M} a^3 .$$

// In units of years, AU and solar masses this becomes simply $P^2 = a^3 / M$.
// Run the cell below with **Shift + Enter** or the ▶ button.
// ` },
//         { type: 'code', source: String.raw`def period_years(a_au, m_star=1.0):
//     """Orbital period in years for semi-major axis a (AU) around m_star (M_sun)."""
//     return (a_au**3 / m_star) ** 0.5

// period_years(1.0)   # Earth: the last line's value is displayed` },

//         { type: 'markdown', source: String.raw`
// Now loop over the planets. Try adding Pluto ($a \approx 39.5$ AU), or
// change <code>m_star</code> to see how the orbits would change around a heavier star.
// ` },
//         { type: 'code', source: String.raw`planets = {
//     "Mercury": 0.387, "Venus": 0.723, "Earth": 1.000,
//     "Mars": 1.524, "Jupiter": 5.203, "Saturn": 9.537,
// }

// for name, a in planets.items():
//     print(f"{name:8s}  a = {a:6.3f} AU   P = {period_years(a):7.2f} yr")` },

//         { type: 'markdown', source: String.raw`
// ### Exercise
// The exoplanet *51 Pegasi b* orbits a $1.11\,M_\odot$ star every 4.23 days.
// What is its semi-major axis? (Hint: invert the formula.)
// ` },
//         { type: 'code', source: String.raw`P_days = 4.23
// m_star = 1.11

// # your code here
// a = ...
// a` }
//       ]
//     },

//     /* ------------------------------------------------------------------ */
//     {
//       id: 'rotation-curve',
//       title: 'Plotting a galaxy rotation curve',
//       summary: 'Use NumPy and matplotlib to compare dark matter halo models.',
//       level: 'Intermediate',
//       duration: '20 min',
//       packages: ['numpy', 'matplotlib'],
//       cells: [
//         { type: 'markdown', source: String.raw`
// ## Galaxy rotation curves

// The circular velocity at radius $r$ depends on the enclosed mass,
// $v_c(r) = \sqrt{G M(<r) / r}$. Two common halo models are the cuspy
// **NFW** profile and the **cored** (pseudo-isothermal) profile.

// The next cell is set-up code: it runs automatically and is hidden (click *Show code* to see it).
// It generates a mock data set.
// ` },
//         { type: 'code', hidden: true, autorun: true, source: String.raw`import numpy as np
// import matplotlib.pyplot as plt

// rng = np.random.default_rng(42)
// r_obs = np.linspace(0.3, 8, 18)                      # kpc
// v_true = 60 * np.sqrt(1 - np.arctan(r_obs / 1.5) / (r_obs / 1.5))
// v_err = 3 + 0.05 * v_true
// v_obs = v_true + rng.normal(0, v_err)
// print("Mock data ready:", len(r_obs), "points")` },

//         { type: 'code', source: String.raw`G = 4.30091e-6   # kpc (km/s)^2 / M_sun

// def v_nfw(r, v200=70, c=8, r200=60):
//     x = r / r200
//     f = lambda y: np.log(1 + y) - y / (1 + y)
//     return v200 * np.sqrt(f(c * x) / (x * f(c)))

// def v_core(r, v_inf=62, r_c=1.5):
//     return v_inf * np.sqrt(1 - np.arctan(r / r_c) / (r / r_c))

// r = np.linspace(0.05, 8, 200)
// plt.figure(figsize=(6, 4))
// plt.errorbar(r_obs, v_obs, v_err, fmt="o", color="k", label="data")
// plt.plot(r, v_nfw(r), "--", label="NFW")
// plt.plot(r, v_core(r), "-", label="cored")
// plt.xlabel("radius [kpc]")
// plt.ylabel("$v_c$ [km/s]")
// plt.legend();   # trailing ; hides the return value, as in Jupyter` },

//         { type: 'markdown', source: String.raw`
// ### Which model fits better?
// Compute $\chi^2$ for each model. Then try changing <code>c</code> or <code>r_c</code> above and re-run.
// ` },
//         { type: 'code', source: String.raw`def chi2(model):
//     return np.sum(((v_obs - model(r_obs)) / v_err) ** 2)

// print(f"chi2  NFW   = {chi2(v_nfw):6.1f}")
// print(f"chi2  cored = {chi2(v_core):6.1f}")` }
//       ]
//     },

//     /* ------------------------------------------------------------------ */
//     {
//       id: 'blackbody',
//       title: 'Blackbody spectra and stellar colours',
//       summary: 'Planck’s law, Wien’s displacement law and why hot stars look blue.',
//       level: 'Beginner',
//       duration: '15 min',
//       packages: ['numpy', 'matplotlib'],
//       cells: [
//         { type: 'markdown', source: String.raw`
// ## Planck's law

// $$B_\lambda(T) = \frac{2hc^2}{\lambda^5}\,\frac{1}{e^{hc/\lambda k_B T} - 1}$$
// ` },
//         { type: 'code', source: String.raw`import numpy as np
// import matplotlib.pyplot as plt

// h, c, kB = 6.626e-34, 2.998e8, 1.381e-23

// def planck(lam, T):
//     return 2*h*c**2 / lam**5 / np.expm1(h*c / (lam*kB*T))

// lam = np.linspace(100e-9, 3000e-9, 500)
// for T in [3500, 5800, 10000]:
//     plt.plot(lam*1e9, planck(lam, T) / planck(lam, T).max(), label=f"{T} K")
// plt.axvspan(380, 750, color="gold", alpha=0.15, label="visible")
// plt.xlabel("wavelength [nm]"); plt.ylabel("normalised $B_\\lambda$")
// plt.legend();   # trailing ; hides the return value, as in Jupyter` },
//         { type: 'markdown', source: String.raw`
// Wien's law says the peak is at $\lambda_\mathrm{max} = b/T$ with
// $b = 2.898\times10^{-3}\,\mathrm{m\,K}$. Check it numerically:
// ` },
//         { type: 'code', source: String.raw`for T in [3500, 5800, 10000]:
//     peak = lam[np.argmax(planck(lam, T))]
//     print(f"T = {T:5d} K   numerical peak = {peak*1e9:6.0f} nm   Wien = {2.898e-3/T*1e9:6.0f} nm")` }
//       ]
//     }


  ];

})(window.Site = window.Site || {});

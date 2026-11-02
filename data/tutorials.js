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
 *   - Markdown cells also get the blog extras (see data/blog.js): ::: note /
 *     key / definition / tip / question callouts, {{figure ...}}, {{video ...}},
 *     and {{tutorial ...}} / {{pub ...}} / {{blog ...}} cards. Citations
 *     ([@key]) are blog-only.
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
    /* ------------------------------------------------------------------ */
    {
      id: 'TNG_Startup',
      title: 'TNG Startup Guide: catalogs from the API',
      summary: 'How to pull IllustrisTNG group catalogs through the web API, then plot galaxy masses and the star-forming main sequence.',
      level: 'Beginner',
      duration: '15 min',
      packages: ['numpy', 'matplotlib'],
      cells: [
        { type: 'markdown', source: String.raw`
## Getting started with IllustrisTNG

The IllustrisTNG simulations are public: anyone can browse and download them through a web
**API** at [tng-project.org/data](https://www.tng-project.org/data/). In this tutorial you will

1. see how to talk to the API from Python,
2. learn which **group catalog** fields hold galaxy masses and star formation rates,
3. turn those raw fields into physical units, and
4. make two classic plots: the **galaxy mass distribution** and the **star-forming main sequence**.

Loosely based on the STScI TNG workshop notebook by Bryanne McDonough and Olivia Curtis.

::: note Why the API code is not runnable here
The API needs a personal key (free, from [the registration page](https://www.tng-project.org/users/register/)),
and this page runs Python inside your browser, which can't reach the TNG servers. So the API steps are
shown as code to copy into your own Jupyter notebook. For the plots, a hidden cell builds a small
**mock catalog** with exactly the same field names, shapes and units as the real one, so the
analysis code below works unchanged on real TNG data.
:::
` },

        { type: 'markdown', source: String.raw`
## 1. Talking to the API

Every request goes to a URL under <code>https://www.tng-project.org/api/</code> and carries your API key
in a header. The TNG docs suggest a small helper like this one. JSON replies come back as Python
dictionaries; file downloads (HDF5) are saved to disk and the filename is returned.

~~~python
import requests

baseUrl = 'https://www.tng-project.org/api/'
headers = {'api-key': 'YOUR_API_KEY_HERE'}   # from your TNG account page

def get(path, params=None):
    r = requests.get(path, params=params, headers=headers)
    r.raise_for_status()                      # stop on HTTP errors (e.g. bad key)

    if r.headers['content-type'] == 'application/json':
        return r.json()                       # metadata -> dict

    if 'content-disposition' in r.headers:    # a file -> save it
        filename = r.headers['content-disposition'].split('filename=')[1]
        with open(filename, 'wb') as f:
            f.write(r.content)
        return filename
    return r
~~~

### Simulation metadata

Start by listing the simulations and picking one. **TNG100-1** (a box about 110 Mpc across, at the
highest resolution) is a good default. The suffix <code>-1</code>, <code>-2</code>, <code>-3</code>
goes from highest to lowest resolution, and <code>-Dark</code> runs are dark matter only.

~~~python
sims = get(baseUrl)
print([s['name'] for s in sims['simulations']])

sim = 'TNG100-1'
simdata = get(baseUrl + sim)
print(simdata.keys())
h = simdata['hubble']            # "little h" = H0 / 100 = 0.6774
print(simdata['num_snapshots'])  # 100 snapshots; snapshot 99 is today (z = 0)
~~~

### A quick look at a few galaxies

Single objects come back as JSON, and you can sort and filter on the server. For example, the five
subhalos (galaxies) at $z=0$ with the most stellar mass:

~~~python
subs = get(baseUrl + sim + '/snapshots/99/subhalos/',
           {'limit': 5, 'order_by': '-mass_stars'})
for s in subs['results']:
    info = get(s['url'])
    print(s['id'], info['mass_stars'], info['sfr'])
~~~

This is great for exploring, but far too slow for millions of galaxies. For that, you want a catalog.
` },

        { type: 'markdown', source: String.raw`
## 2. Group catalogs

The **group catalogs** list properties of every halo (*Group* fields) and every subhalo / galaxy
(*Subhalo* fields) in a snapshot. The full list is in the
[data specifications](https://www.tng-project.org/data/docs/specifications/#sec2). Instead of downloading
the whole catalog (many GB), you can ask for just the fields you need, and the API returns one HDF5 file:

~~~python
import h5py

fields = 'SubhaloFlag,SubhaloMassType,SubhaloSFR'
fname = get(baseUrl + sim + '/files/groupcat-99/', {'Subhalo': fields})

with h5py.File(fname, 'r') as f:
    flag  = f['Subhalo/SubhaloFlag'][:]
    mass  = f['Subhalo/SubhaloMassType'][:]   # shape (N_subhalos, 6)
    sfr   = f['Subhalo/SubhaloSFR'][:]        # M_sun / yr
~~~

The fields we use:

| Field | Meaning | Units |
|---|---|---|
| <code>SubhaloFlag</code> | 1 = cosmological origin, 0 = spurious clump; keep only 1 | — |
| <code>SubhaloMassType</code> | bound mass split by particle type (6 columns) | $10^{10}\,M_\odot/h$ |
| <code>SubhaloSFR</code> | instantaneous star formation rate of the gas | $M_\odot\,\mathrm{yr}^{-1}$ |

The six columns of <code>SubhaloMassType</code> are particle types: **0** gas, **1** dark matter, **2** unused,
**3** tracers, **4** stars (and wind), **5** black holes.

::: note Supplementary catalogs
Beyond the group catalogs there are many
[supplementary catalogs](https://www.tng-project.org/data/docs/specifications/#sec5), for example
time-averaged star formation rates, which are closer to what observers measure. They download the same way,
e.g. <code>get(baseUrl + sim + '/files/star_formation_rates.hdf5')</code>. Some are large, so download once and reuse the file.
:::
` },

        { type: 'markdown', source: String.raw`
## 3. Loading the (mock) catalog

The next cell is hidden set-up code. It runs automatically and creates <code>flag</code>, <code>mass</code>,
<code>sfr</code> and <code>h</code> as if they came from the snippet above: a random subset of 30,000
subhalos with realistic TNG-like scaling relations. (Click *Show code* if you are curious how.)
` },
        { type: 'code', hidden: true, autorun: true, source: String.raw`import numpy as np
import matplotlib.pyplot as plt

# ---- mock TNG100-1 z=0 subhalo catalog (same fields, shapes and units) ----
rng = np.random.default_rng(2026)
h = 0.6774
N = 30_000

# halo masses: dN/dlogM ~ M^-0.7 between 10^10.3 and 10^14.5 M_sun
a = -0.7
u = rng.random(N)
lo, hi = 10**(a * 10.3), 10**(a * 14.5)
logMh = np.log10(lo + u * (hi - lo)) / a

# stellar-to-halo mass relation (Moster et al. 2010 shape) + 0.2 dex scatter
M1, Nn, beta, gamma = 10**11.59, 0.0351, 1.376, 0.608
Mh = 10**logMh
Mstar = Mh * 2 * Nn / ((Mh / M1)**-beta + (Mh / M1)**gamma)
Mstar *= 10**rng.normal(0, 0.2, N)
Mstar[(logMh < 10.6) & (rng.random(N) < 0.3)] = 0.0   # some dark subhalos have no stars
logMs = np.log10(np.maximum(Mstar, 1.0))

# star formation: main sequence, plus quenching that rises with mass
ms = 0.8 * (logMs - 10.0) + rng.normal(0, 0.3, N)
quenched = rng.random(N) < 1 / (1 + np.exp(-(logMs - 10.5) / 0.25))
logSFR = np.where(quenched, ms - 2.0 + rng.normal(0, 0.4, N), ms)
sfr = (10**logSFR).astype(np.float32)
sfr[quenched & (rng.random(N) < 0.4)] = 0.0          # TNG has many exactly-zero SFRs
sfr[Mstar == 0] = 0.0

Mgas = np.where(quenched, 0.05, 1.0) * Mstar * 10**rng.normal(0, 0.3, N)
Mbh = np.where(logMs > 9, 10**(8.2 + 1.1 * (logMs - 11) + rng.normal(0, 0.3, N)), 0.0)

# pack into TNG code units: 10^10 M_sun / h
mass = np.zeros((N, 6), dtype=np.float32)
to_code = h / 1e10
mass[:, 0] = Mgas * to_code
mass[:, 1] = (Mh - Mstar - Mgas).clip(0) * to_code
mass[:, 4] = Mstar * to_code
mass[:, 5] = Mbh * to_code
flag = (rng.random(N) > 0.02).astype(np.int32)

del a, u, lo, hi, logMh, M1, Nn, beta, gamma, Mh, Mstar, logMs, ms, quenched, logSFR, Mgas, Mbh, to_code
print(f"Mock catalog ready: {N} subhalos, h = {h}")` },

        { type: 'markdown', source: String.raw`
Always look at what you got before using it:
` },
        { type: 'code', source: String.raw`print("flag:", flag.shape, flag.dtype)
print("mass:", mass.shape, mass.dtype)
print("sfr: ", sfr.shape, sfr.dtype)
mass[:3]   # first three subhalos, all six particle types` },

        { type: 'markdown', source: String.raw`
## 4. Physical units and cleaning

Masses are stored in units of $10^{10}\,M_\odot/h$, so to get solar masses multiply by $10^{10}$ and divide
by $h$. Then keep only galaxies that are cosmological in origin (<code>flag == 1</code>) and that are
reasonably well resolved, say $M_\ast > 10^{8}\,M_\odot$ (a few hundred star particles in TNG100).
` },
        { type: 'code', source: String.raw`stellar_mass = mass[:, 4] * 1e10 / h      # M_sun
dm_mass      = mass[:, 1] * 1e10 / h
subID        = np.arange(len(stellar_mass)) # a subhalo's ID is its row index

good = (flag == 1) & (stellar_mass > 1e8)

ids  = subID[good]
Ms   = stellar_mass[good]
Mdm  = dm_mass[good]
SFR  = sfr[good]

print(f"Before cuts: {len(stellar_mass):6d} subhalos")
print(f"After cuts:  {len(Ms):6d} galaxies")` },

        { type: 'markdown', source: String.raw`
## 5. Plot 1: how are galaxy masses distributed?

Galaxy masses span many orders of magnitude, so we histogram $\log_{10} M$. Plotting stars and
dark matter together shows how small a galaxy's stellar component is compared to its halo.
` },
        { type: 'code', source: String.raw`bins = np.arange(8, 14.6, 0.2)

plt.figure(figsize=(6.5, 4))
plt.hist(np.log10(Ms),  bins=bins, histtype="step", lw=2, color="#2a6fdb", label="stars")
plt.hist(np.log10(Mdm), bins=bins, histtype="step", lw=2, color="#7a7a7a", label="dark matter")
plt.yscale("log")
plt.xlabel(r"$\log_{10}\,M\ [M_\odot]$")
plt.ylabel("number of galaxies per 0.2 dex")
plt.title("Mass distribution of galaxies (TNG-like, z = 0)")
plt.legend(frameon=False);` },

        { type: 'markdown', source: String.raw`
Two things to notice: low-mass galaxies vastly outnumber massive ones, and the dark matter curve sits
roughly 1.5–2 dex (a factor of 30–100) to the right. Dividing the counts by the bin width and the box volume
turns this histogram into the **stellar mass function**, one of the key observables TNG was tuned to reproduce.

## 6. Plot 2: the star-forming main sequence

Star-forming galaxies follow a tight relation between SFR and stellar mass, the **main sequence**.
Galaxies far below it are **quenched**. A common dividing line is the *specific* SFR,
$\mathrm{sSFR} = \mathrm{SFR}/M_\ast$, at $10^{-11}\,\mathrm{yr}^{-1}$.

TNG gives many galaxies an SFR of exactly zero (no gas dense enough to form stars), which would vanish on a log
axis. A common trick is to place them at a floor value so they stay visible.
` },
        { type: 'code', source: String.raw`ssfr = SFR / Ms
is_sf = ssfr > 1e-11
floor = -3.5                                   # where to draw SFR = 0 galaxies
logSFR = np.log10(np.where(SFR > 0, SFR, 10**floor))
logMs = np.log10(Ms)

fig, ax = plt.subplots(figsize=(6.5, 4.5))
ax.scatter(logMs[~is_sf], logSFR[~is_sf], s=4, alpha=0.35, color="#d1495b", label="quenched", rasterized=True)
ax.scatter(logMs[is_sf],  logSFR[is_sf],  s=4, alpha=0.35, color="#2a6fdb", label="star-forming", rasterized=True)

m = np.linspace(8, 12, 50)                     # the sSFR = 1e-11 / yr line
ax.plot(m, m - 11, "k--", lw=1)
ax.text(8.1, -3.15, "sSFR = $10^{-11}$/yr", fontsize=9)

ax.set_xlim(8, 12.2); ax.set_ylim(floor - 0.3, 2.5)
ax.set_xlabel(r"$\log_{10}\,M_\ast\ [M_\odot]$")
ax.set_ylabel(r"$\log_{10}\,\mathrm{SFR}\ [M_\odot\,\mathrm{yr}^{-1}]$")
ax.set_title("Star-forming main sequence")
ax.legend(frameon=False, markerscale=4, loc="upper left")

print(f"quenched fraction: {np.mean(~is_sf):.1%}")
print(f"galaxies with SFR = 0 (on the floor): {np.sum(SFR == 0)}");` },

        { type: 'markdown', source: String.raw`
The quenched population grows with mass: in TNG, galaxies above about $10^{10.5}\,M_\odot$ are shut down
mainly by energy from their central supermassive black hole.

### Exercises

1. Compute the quenched fraction in bins of stellar mass and plot it against $\log_{10} M_\ast$.
   (Hint: <code>np.digitize</code> or a loop over <code>bins</code>.)
2. Plot the **stellar-to-halo mass ratio** $M_\ast / M_\mathrm{DM}$ against $M_\mathrm{DM}$. At what halo mass are galaxies most
   efficient at forming stars?
3. Column 5 of <code>mass</code> is black hole mass. How does it scale with stellar mass?
` },
        { type: 'code', source: String.raw`# your code here
` },

        { type: 'markdown', source: String.raw`
## Where to go next

On your own machine, swap the mock cell for the real API download and everything above runs as is.
From there, the API also offers

- **merger trees**: <code>get(baseUrl + sim + '/snapshots/99/subhalos/ID/sublink/mpb.hdf5')</code> follows one galaxy back in time,
- **cutouts**: <code>get(baseUrl + sim + '/snapshots/99/subhalos/ID/cutout.hdf5', {'stars': 'Coordinates,Masses'})</code> gives the individual particles of one galaxy,
- the [TNG API cookbook](https://www.tng-project.org/data/docs/api/) with many more worked examples.
` }
      ]
    }

  ];

})(window.Site = window.Site || {});

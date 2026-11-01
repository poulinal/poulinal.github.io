/* =============================================================================
 * data/blog.js — BLOG POSTS (blog.html)
 * =============================================================================
 *
 * One object per post. Order doesn't matter: posts are listed newest first
 * (pinned posts on top). Only `id`, `title`, `date` and `body` are required.
 *
 * URLS
 *   blog.html                    -> list of posts, with search and keywords
 *   blog.html?p=<id>             -> one post
 *   blog.html?kw=TNG100          -> posts with that keyword
 *   blog.html?p=style-guide      -> a hidden demo of every feature below
 *
 * POST FIELDS
 *   id          unique, URL-safe string (used in ?p=...)
 *   title       plain text
 *   date        'YYYY-MM-DD'      updated  optional 'YYYY-MM-DD'
 *   author      optional; defaults to Site.config.site.name
 *   category    one of the keys in Site.config.blog.categoryLabels
 *               ('simulation', 'publication', 'tutorial', 'notes')
 *   summary     1–2 sentences for the post list and the top of the post.
 *               HTML + LaTeX allowed.
 *   keywords    array of strings. Shown as clickable chips; readers can
 *               filter and search by them.
 *   thumbnail   { src, alt, credit, cite }           image on the post-list card only
 *   cover       { src, alt, caption }  large image at the top of the post
 *               (also used on the card when there is no thumbnail)
 *   body        the post itself, in markdown (see WRITING THE BODY)
 *   references  array of sources you cite with [@key] (see CITATIONS)
 *   related     { publications: ['<pub id>'], tutorials: ['<tutorial id>'],
 *                 links: [{ label, href }] }  -> "Related" box at the end
 *   style       per-post look, e.g. { '--blog-text-size': '1.2rem' }.
 *               Any --blog-* variable from config.blog.theme works.
 *   draft       true -> hidden from the list, still viewable at ?p=<id>
 *   pinned      true -> stays at the top of the list
 *
 * WRITING THE BODY
 *   Write the body inside String.raw`...` so LaTeX backslashes work as-is.
 *   Inside it, avoid the backtick character and ${. That means:
 *     inline code  ->  <code>np.mean(x)</code>
 *     code blocks  ->  fence with ~~~ instead of three backticks
 *
 *   Markdown:     ## Heading, ### Subheading, **bold**, *italic*, lists,
 *                 > quotes, tables, --- (divider), [link text](https://...)
 *   Plain images: ![alt text](assets/img/blog/my-plot.png)
 *   Math:         $E = mc^2$ inline, $$ ... $$ on its own lines for display
 *   HTML:         any HTML works too, e.g. <sub>, <abbr>, <iframe>.
 *
 *   Blog extras (each on a line of its own; parts separated by | ):
 *     {{figure path/to/image.png | Caption (HTML + LaTeX ok) | alt text | 70%}}
 *         numbered "Figure N." with caption. alt and width are optional;
 *         click opens the full-size image.
 *     {{video https://www.youtube.com/watch?v=ID | Caption}}
 *         YouTube or Vimeo links are embedded; a path to an .mp4/.webm
 *         file (e.g. assets/video/run.mp4) gets a plain video player.
 *     {{tutorial kepler | Optional label}}
 *         card linking to runcode-template.html?t=kepler
 *     {{pub RNAAS-magnetic-fields-2025}}
 *         card for a paper in data/publications.js
 *
 *   Callout boxes, for definitions and take-aways:
 *     ::: key Optional title
 *     Markdown text...
 *     :::
 *   kinds: note, key, definition, tip, question (red = key, question;
 *   blue = note, tip, definition).
 *
 * CITATIONS
 *   In the text write [@nelson2019] or [@nelson2019; @pillepich2018].
 *   They become numbered links, numbered in order of first use, and a
 *   "References" list is added at the end of the post. Each key needs an
 *   entry in `references`, either one of your own papers:
 *       { key: 'mcdonough2025', pub: 'RNAAS-magnetic-fields-2025' }
 *   or written out (all fields optional except key):
 *       { key: 'nelson2019', authors: ['Nelson, D.', 'Springel, V.', 'et al.'],
 *         year: 2019, title: '...', journal: 'ComAC', volume: '6', pages: '2',
 *         doi: '10.1186/...', arxiv: '1812.05609', url: 'https://...', note: '...' }
 *   References that are never cited are still listed, after the cited ones.
 *
 * IMAGES AND VIDEOS
 *   Put post files in assets/img/blog/ (one folder per post keeps it tidy,
 *   e.g. assets/img/blog/tng-magnetic-fields/fig1.png). ~1600 px wide is
 *   plenty; compress large PNGs. Big videos are better on YouTube/Vimeo,
 *   since GitHub Pages limits file sizes.
 * ========================================================================== */

(function (Site) {
  'use strict';
  Site.data = Site.data || {};

  Site.data.blog = [

    /* ------------------------------------------------------------------ */
  /*
    {
      id: 'tng100-satellite-magnetic-fields',
      title: 'Why are satellite galaxies more magnetized? A look inside TNG100',
      date: '2026-10-29',
      category: 'publication',
      summary:
        'A plain-language tour of our RNAAS note: what a cosmological simulation is, ' +
        'how we split galaxies into centrals and satellites, and why satellites end up ' +
        'about ten times more magnetized than centrals of the same mass.',
      keywords: ['TNG100', 'IllustrisTNG', 'Magnetic fields', 'Satellite galaxies', 'Simulations', 'Galaxy evolution'],
      thumbnail: {
        src: 'assets/img/pubs/rnaasadce74f1_lr.jpg',
        alt: 'Plot of magnetic field strength against stellar mass for TNG100 galaxies.'
      },
      related: {
        publications: ['RNAAS-magnetic-fields-2025'],
        links: [
          { label: 'IllustrisTNG public data', href: 'https://www.tng-project.org/data/' },
          { label: 'Our analysis code on GitHub', href: 'https://github.com/poulinal/TNG_Magnetic_Field_Study' }
        ]
      },
      references: [
        { key: 'mcdonough2025', pub: 'RNAAS-magnetic-fields-2025' },
        {
          key: 'pillepich2018',
          authors: ['Pillepich, A.', 'Springel, V.', 'Nelson, D.', 'et al.'],
          year: 2018,
          title: 'Simulating galaxy formation with the IllustrisTNG model',
          journal: 'MNRAS', volume: '473', pages: '4077',
          doi: '10.1093/mnras/stx2656'
        },
        {
          key: 'nelson2019',
          authors: ['Nelson, D.', 'Springel, V.', 'Pillepich, A.', 'et al.'],
          year: 2019,
          title: 'The IllustrisTNG simulations: public data release',
          journal: 'Computational Astrophysics and Cosmology', volume: '6', pages: '2',
          doi: '10.1186/s40668-019-0028-x'
        },
        {
          key: 'marinacci2018',
          authors: ['Marinacci, F.', 'Vogelsberger, M.', 'Pakmor, R.', 'et al.'],
          year: 2018,
          title: 'First results from the IllustrisTNG simulations: radio haloes and magnetic fields',
          journal: 'MNRAS', volume: '480', pages: '5113',
          doi: '10.1093/mnras/sty2206'
        }
      ],
      body: String.raw`
Magnetic fields thread through every galaxy we know of, including our own Milky Way. They are also
notoriously hard to measure: we cannot put a compass in another galaxy, so observers rely on indirect
signals such as polarized radio emission. Simulations offer a complementary route. In a simulation we
can simply *read off* the field strength in every galaxy, and then ask which kinds of galaxies are the
most magnetized. That is exactly what we did in a short research note [@mcdonough2025].

## What is TNG100?

IllustrisTNG is a suite of cosmological simulations: computer models that start from the nearly smooth
universe shortly after the Big Bang and follow gravity, gas, star formation and black holes forward to
the present day [@pillepich2018; @nelson2019]. **TNG100** is the mid-sized run, a cube about 110
megaparsecs (roughly 360 million light-years) on a side, big enough to contain many thousands of
galaxies.

Crucially for us, TNG also tracks magnetic fields [@marinacci2018]. The fields start out extremely weak
and grow as gas is stretched, compressed and stirred during galaxy formation.

::: definition Magnetohydrodynamics (MHD)
Ordinary fluid dynamics describes how gas flows. MHD adds the fact that hot, ionized gas conducts
electricity, so it drags magnetic field lines along with it. Squeeze the gas and you squeeze the field
lines closer together, which makes the field stronger.
:::

## Centrals and satellites

Galaxies live inside large clumps of dark matter called **halos**. The biggest galaxy in a halo is its
*central*; smaller galaxies orbiting inside the same halo are *satellites*. To decide when a satellite
has really "fallen in", we use a standard size for the halo, the radius $R_{200}$. Inside this radius,
the average density is 200 times the critical density of the universe, $\rho_{\rm crit}$:

$$
M_{200} = \frac{4\pi}{3}\, R_{200}^3 \times 200\, \rho_{\rm crit}
$$

You can think of $R_{200}$ as the rough "edge" of the halo. We then split the satellites into those that
have not yet come within $R_{200}$ of their host (*pre-infall*) and those that have (*post-infall*).
Centrals are split into isolated and non-isolated galaxies; the paper gives the exact criteria.

## What we found

We compared the typical field strength of each group at the same stellar mass, so that we are not just
comparing big galaxies with small ones.

{{figure assets/img/pubs/rnaasadce74f1_lr.jpg | Magnetic field strength as a function of stellar mass in TNG100. Pre-infall satellites are green, post-infall satellites purple, non-isolated centrals red and isolated centrals blue. Error bars show the standard deviation in each mass bin; contours show the unbinned pre-infall satellites. From McDonough & Poulin. | Plot of magnetic field strength against stellar mass, with satellites lying above centrals.}}

::: key
At the same stellar mass, satellite galaxies have magnetic fields roughly **an order of magnitude
stronger** than central galaxies. The gap is largest for satellites that have already passed within
$R_{200}$ of their host.
:::

Because the difference grows once a satellite has fallen in, the most natural reading is that the
satellite's *environment* is doing the work: something about falling into a bigger halo amplifies the
field. Our note does not pin down which process is responsible, and that is the obvious next question.

::: question
If you wanted to find out which process amplifies the field, what would you measure? One idea: follow
individual satellites through time and check whether their field jumps at a particular point in their
orbit, for example their first close passage to the host.
:::

## Try it yourself

All of the TNG data are public, and you can explore them with a free account on the
[TNG project website](https://www.tng-project.org/data/). Our analysis code is on
[GitHub](https://github.com/poulinal/TNG_Magnetic_Field_Study). If you are new to scientific Python,
the tutorials on this site are a good place to start.

{{tutorial | Interactive Python tutorials on this site}}

{{pub RNAAS-magnetic-fields-2025}}
`
    },
    */

    { //LRD Review
      id: 'lrd_review',
      title: 'JWST\'s Mysterious Little Red Dots: A Review',
      date: '2026-11-01',
      category: 'Review',
      summary:
        'A high-level breakdown of little red dots (LRDs), JWST\'s recent discovery: ' +
        'what LRDs are, what they mean, how we find them, and why they matter' ,
      keywords: ['JWST', 'Little Red Dots', 'LRDs', 'Cosmology', 'SMBH', 'BH'],
      cover: {
        src: 'assets/img/blog/lrd_review_blog_2026/littlereddots.jpg',
        alt: 'Recent LRD discoveries in JWST fields.',
        credit: 'NASA, ESA, CSA, STScI, D. Kocevski (Colby College)',
      },
      related: {
        publications: ['RNAAS-magnetic-fields-2025'],
        links: [
          { label: 'IllustrisTNG public data', href: 'https://www.tng-project.org/data/' },
          // { label: 'Our analysis code on GitHub', href: 'https://github.com/poulinal/TNG_Magnetic_Field_Study' }
        ]
      },
      references: [
        // { key: 'mcdonough2025', pub: 'RNAAS-magnetic-fields-2025' },
        {
          key: 'tanaka2025',
          authors: ['Tanaka, Takumi S.', 'Akins, Hollis B.', 'Harikane, Yiuchi', 'et al.'],
          year: 2025,
          title: 'Discovery of a Little Red Dot Candidate at z ≳ 10 in COSMOS-web Based on MIRI-NIRCam Selection',
          journal: 'ApJ', volume: '995', pages: '21',
          doi: '10.3847/1538-4357/ae145f'
        },
        {
          key: 'kocevski2023',
          authors: ['Kocevski, D.', 'et al.'],
          year: 2023,
          title: 'Hidden Little Monsters: Spectroscopic Identification of Low-Mass, Broad-Line AGN at z>5 with CEERS',
          journal: 'arXiv:2302.00012',
          doi: '10.48550/arXiv.2302.00012'
        },
        {
          key: 'inayoshi2025',
          authors: ['Inayoshi, K.', 'Ho, Luis C.'],
          year: 2025,
          title: 'A Critical Evaluation of the Physical Nature of the Little Red Dots',
          journal: 'arXiv:2512.03130', 
          doi: '10.48550/arXiv.2512.03130'
        },
        {
          key: 'zang2026',
          authors: ['Zhand, C.', 'Wu, Q.', 'Fan, X.', 'et al.'],
          year: 2026,
          title: 'The composite spectrum of little red dots from a standard inner disk and an unstable outer disk',
          journal: 'Nat Astron', volume: '10', pages: '753-761',
          doi: '10.1038/s41550-026-02785-x'
        }
      ],
      body: String.raw`
The launch of the James Webb Space Telescope (JWST) has revolutionized our understanding of the high-redshift Universe. Its high photometric sensitivity and spatial resolution in the infrared wavelengths enables astronomers to study some of the youngest and most distant objects. But early observations by JWST spotted an object that didn't fit neatly with existing classification of objects. These sources were deemed *little red dots (LRDs)* which I hope to provide a high-level review on what's currently known about these objects. Their unusual properties raises the important questions: *Are LRDs a previously overlooked population of black holes (BHs) or are they representative of a different physical phenomenon?*

::: note
JWST (James Webb Space Telescope) is the largest space-based telescope launched in December of 2021 and began observing in July 2022 with high resolution instruments to observe objects too distant and faint for the Hubble Space Telescope. JWST primarily targets near-infrared astronomy to accomplish this. Due to cosmological expansion, light emitted in the UV and optical range by early galaxies are stretched to infrared wavelengths by the time we observe it at Earth. JWST's main instruments include NIRCam: broad range infrared imager to identify distant sources, NIRSpec: performs spectroscopy over a similar infrared range to investigate emission lines, MIRI: provides mid-to-long-infrared wavelength coverage.
:::

## The discovery from JWST:
The powerful capabilities of JWST enables detailed observations with photometry and spectroscopy of AGNs. Studying AGNs enables us to understand the processes that drive the evolution of galaxies and the growth of supermassive black holes. Early JWST observations have observed a previously unseen and mysterious population of what seemed to possess characteristics of AGN and galaxies. These objects were deemed LRDs [@kocevski2023].

::: definition AGN
AGN (Active Galactic Nucleus) is a compact region at the center of a galaxy that emits a large amount of energy, typically due to a supermassive black hole (SMBH) accreting matter. This accreting matter falls towards the SMBH, forming an accretion disk. The immense amount of gravitational energy is converted into radiation which is absorbed and re-emitted by the surrounding gas, producing signature emission lines, broadening, and continuum features.
:::


## An unexpected light spectrum:
LRDs, as the name suggests, are very compact sources, much smaller than the size of a typical galaxy (LRDs are typically less than 100pc). This compactness places strong constraints on the physical properties of LRDs and the source of their luminosity to possible AGN or concentrated stellar population origins. In addition, LRDs show strong emission in the redder optical continuum, contributing to its signature 'little and red' designation [@inayoshi2025]. Since its first observation in 2023, the catalog of LRDs have since exploded, with candidates from many JWST programs. 

::: definition SED
SED (Spectral Energy Distribution) describes how an object's emitted energy is distributed across different wavelengths. This provides insight into the object's physical properties and energy output through components which make up the SED.

{{figure assets/img/blog/lrd_review_blog_2026/my_sed.png | A CIGALE SED fit for a galaxy, showing how different components (blue, red, green, etc. lines) contribute to the overall SED (in black).}}
:::

Strikingly, LRDs have a peculiar, V-shape spectral energy distributions (SEDs) with strong rest-frame red and rest-UV continuums [@tanaka2025]. The V-shape spectrum suggests that the observed radiation originates from multiple physical components or regions within the source. For example, the strong rest-UV emission could be caused from young stars, an accretion disk, or radiation escaping through less-obscured regions. The rest-red optical component could arise from heavily obscured dust or gas regions. 

{{ figure assets/img/blog/lrd_review_blog_2026/lrd_vshape_sed.webp | The black solid lines show the observed spectra, the red solid lines indicate the best-fitting absorbed SEDs and the blue dashed lines represent the intrinsic SEDs before absorption. The grey-shaded regions denote the 1σ uncertainty bands derived from the MCMC posterior distributions. The vertical dotted lines mark the Balmer limit at 3,645 Å. Courtesy of Zang et al. (2026) [@zang2026] }}
::: note dust
Dust reddening is the process by which dust grains in the interstellar medium absorb and scatter light. This scattering is dependent on wavelength, favoring shorter wavelengths (blue light), letting the longer-wavelengths (red light) through more easily, causing the observed light to be reddened. This effect is particularly important in the study of distant galaxies and other astronomical objects, as it can significantly alter the observed spectral energy distribution.
:::


## So what are LRDs:
One of LRDs definitive spectrum features is their broad emission lines, that is, emission lines that are wide and not sharply defined. Based on LRD’s broad line emission it agrees well with either AGNs or dusty star formation. AGNs are often attributed with broad line emission whereby the high velocity of the gas (due to the immense gravitational influence of the BH) in an AGN's broad line regions produces doppler broadening [@inayoshi2025]. In contrast, dusty star-forming galaxies provide dense environments to create broaden emission lines through electron scattering. 

{{ figure assets/img/blog/lrd_review_blog_2026/lrd_source_summary.png | Summary of three proposed scenarios for the energy sources of LRDs. (1) Dust-reddened AGNs: broad-line AGNs with moderate dust extinction, explaining their red optical continua. (2) Gas-enshrouded BHs: AGNs embedded in dense gas with a high covering fraction, representing the extreme limit of an AGN + dense gas system. (3) Dusty star formation: systems where the red colors originate primarily from stellar emission attenuated by dust [@inayoshi2025]. Figure courtesy of Inayoshi et al. (2025)[@inayoshi2025] }}

But LRD's Balmer absorption and break features make it difficult to explain the observed properties through a dusty star forming source. The combination of the broad line features and the balmer break is a complex combination and suggests that the observed spectrum involves complex interactions between stars, ionized gas, and an accreting BH rather than from a conventional star population.

::: define Balmer Break
A Balmer break occurs around 3645 angstroms, caused by a change in hydrogen absorption. At wavelengths shorter than 3646 angstroms, there is enough energy to completely ionize hydrogen atoms that have their electrons in the second energy level. This creates a sudden drop in the spectrum as high-energy photons are consumed by this ionization energy.
:::

A prominent interpretation of these results suggests LRD’s are young, gas-enshrouded AGNs whose gas and dust can produce the reddening needed to produce the red optical spectra and emission features. In this scenario, the radiation from the accretion disk is absorbed, scattered, and reprocessed by the surrounding material, reproducing the unusual red optical continuum and spectral features while the surrounding gas may broaden emission lines through electron scattering. 

Still, the two components of the LRD’s V-shape are challenging to interpret. A possible interpretation is that the blue UV slope corresponds to the unobscured sources (young stellar populations or unobscured AGNs or scatter light leaking through a patchy medium); while the red optical slope corresponds to the dust-reddened obscured sources (from dusty galaxy or obscured AGN) where the radiation has been heavily reddened or reprocessed. But LRD populations have consistently exhibited extremely similar SED shapes, especially in the V-shaped valley. This uniformity struggles to be explained with the ultimately variable progenitors above. Further difficulting these interpretations is that dust obscuration implies dust heating and subsequent thermal re-emission of that energy but JWST and ALMA has not detected any detection of thermal re-emitted flux in LRDs [@inayoshi2025]. So there is still no consensus on what LRDs are, but a proposed model must not only explain the two strong continuum components but also the relative consistency of the spectral shape across the population.

## What can they hope to tell us:
If LRDs are indeed young, gas-enshrouded AGNs, then they can provide crucial insights into the early stages of BH growth and the co-evolution of galaxies and their central BHs. A major unresolved problem in cosmology is explaining how SMBH, on the order of billion solar masses, formed within the first few billion years after the Big Band. LRDs could represent an opportunity to observe this rapid growth, near or above the Eddington limit, of BHs in an early, heavily obscured phase of their development. Current samples suggests that LRDs have peak abundance at z=6-8, corresponding to cosmic times of t\~0.6-1.0 Gyr, and outnumbers typical active galactic nuclei at z=5 (t\~1.5 Gyr) which suggests LRD contributes a crucial population for understanding black hole evolution in the high redshift universe [@tanaka2025]. 

::: define Eddington Limit 
The Eddington limit describes the approximate luminosity at which the outward radiation pressure from an accreting black hole balances the inward gravitational force, a probe for measuring how rapidly a black hole is accreting.
:::

In addition, the environments in which LRDs are found can also provide important context. LRDs are often not isolated but reside in clustered environments which can potentially serve as reservoirs of gas and stars that can fuel the LRDs in its evolutionary phases. However, it remains unclear whether these environments are typical of LRD populations or whether our sample represents a population that happens to occupy unusually dense regions. Measuring this clustering along with the observed number density of LRDs can help constrain the environments and how long black holes spend during this phase of their evolution.

## The future
Current searches for LRDs expand the population in both directions of cosmic time, targeting higher redshift (z ≥ 10) and lower redshifts (z ≤ 3). In both cases there are challenges. At z≥10, the spectrum is shifted to longer infrared wavelengths. To capture the red optical continuum, MIRI photometry is required but MIRI is generally shallower than NIRCam. This biases brighter objects, making it difficult to establish the abundance of properties of fainter high-redshift LRDs. At z≤3, blue UV and lyman break fall out of JWST, requiring complementary datasets and cautious treatment of contaminant red galaxies that can mimic some of the characteristic LRD colors [@inayoshi2025]. But these observations could help to establish when LRDs first emerged and how long this phase of evolution of galaxies and BHs are.

Another important search is the study of LRD variability. AGNs are known to exhibit changes in their emitted brightness due to fluctuations in the accretion disk as the rate of infall matter towards the BH changes. Detecting similar variability in LRDs would provide independent evidence for an AGN origin and provide additional information about the size and structure of the emitting regions [@inayoshi2025].

Still, the nature of LRDs remains an open question. Their compactness, unusual V-shape SED spectrums, strong balmer breaks, and broad emission lines suggest they may represent a previously unknown stage of BH growth in the early Universe. No single model has yet explained all of their observed properties, but improved observations and theoretical models may help to clarify their nature. Further research is needed to fully understand the properties and behavior of these enigmatic objects, but it will be sure to enable a new opportunity to investigate the relationship between early galaxies and the SMBH that reside within them.


## To see more:
Podcasts: <br>
[From First Principles Podcast (JWST’s “Little Red Dots,” TimeVaults, and the Dawn of Math: EP. 23)](https://www.youtube.com/watch?v=0wmIP6NvkWo&t=178s), <br>
[The Quanta Podcast (The Mystery of the Early Universe's Little Red Dots)](https://open.spotify.com/episode/1JZa5bdFvfU4gth7DOAMMn) <br>

Other Great Blogs: <br>
[Astrobites (Little Red Dots and Big Black Holes)](https://astrobites.org/2024/01/29/little-red-dots-and-big-black-holes/), <br>
[Astrobites (Little Red Dots and Shaq’s Huge Feet)](https://astrobites.org/2026/05/25/lrds-shaq/)

`
    },

    { //BH* Naidu et al 2026
      id: 'BH*_naidu_2026',
      title: 'A Brand New Star: A Possible Explanation for the Rapid Growth of Black Holes in the Early Universe',
      date: '2026-11-01',
      category: 'New paper',
      summary:
        'A breakdown description of a new paper by Naidu et al. 2026 describing the observational discovery ' +
        'of the previously theoretical BH* with JWST: what the authors found, their methodology, and the implications for our understanding of black hole growth in the early universe' ,
      keywords: ['JWST', 'SMBH', 'BH', 'BH*', 'Little Red Dots', 'LRDs'],
      cover: {
        src: 'assets/img/blog/bhstar_naidu_et_al_blog_2026/bhstar_feature.avif',
        alt: 'Artistic interpretation of BH* object the size of our solar system.',
        credit: 'Rohan Naidu, University of Hawai\'i',
        cite: 'naidu2026'
      },
      related: {
        publications: ['RNAAS-magnetic-fields-2025'],
        links: [
          { label: 'IllustrisTNG public data', href: 'https://www.tng-project.org/data/' },
          // { label: 'Our analysis code on GitHub', href: 'https://github.com/poulinal/TNG_Magnetic_Field_Study' }
        ]
      },
      references: [
        // { key: 'mcdonough2025', pub: 'RNAAS-magnetic-fields-2025' },
        {
          key: 'naidu2026',
          authors: ['Naidu, Rohan P.', 'Matthee, Jorryt', 'et al.'],
          year: 2026,
          title: 'A gas-enshrouded and gas-reddened black hole at cosmic dawn',
          journal: 'Nature', volume: '656', pages: '329-333',
          doi: '10.1038/s41586-026-10846-4'
        },
      ],
      body: String.raw`
Astronomers

## A brand new (candidate) discovery:
Astronomers remain puzzled at the physical processes that led to the formation of the first supermassive black holes in the early universe. However, a theoretical object, a black hole star (BH*) may provide insight into these processes. The first BH*, MoM-BH*-1 was observed by Naidu et al. through JWST’s ‘Mirage or Miracle’ (MoM) JWST program. This program focused on …. MoM-BH*-1 stood out as a point-like source that was the reddest source in the Ultra Deep Survey field while being incredible luminous in JWST’s F444W (4.44 micron) filter while exhibiting properties of a F200W (2.00 micron) dropout, effectively disappearing in the shorter wavelengths (contributing to an extreme redness and a large blue contribution dropout. 


A formidable balmer break:
This dropout corresponds to an extreme balmer break where ….  (see figure 2 below). To the authors, this suggested that MoM-BH*-1 could either be a dust-free stellar population. However, for the case of a dust-free stellar population, i.e. a population of purely A-type stars, the strongest break is still magnitude weaker than MoM-BH*-1’s. The intense absorption in the Balmer lines (Hbeta and Hgamma) suggests extreme gas densities such that hydrogen atoms with populated n=2 shells are abundant to …. In addition  in addition to an extremely broad Hbeta emission since …. These feature is typically seen in SMBH and LRDs but could also arise from quiescent galaxy. “However, no known object, AGN or not, displays the singular Balmer break we report in this source”. THis model was compared against an LRD and quiescent galaxy models. To determine the fit, the authors used two balmer break windows to determine the break strength of which MoM-BH*-1 was the absolute monster in balmer break strength, falling far above lrd populations and the stellar population maximum

Determination:
To fully pin down the origin of the source, the team constructed a grid of Cloudy spectral synthesis models. Cloudy is a ….  to match the data with a classical AGN accretion disk. The authors tuned this model produced a mock spectrum to match key features of the observed spectrum (show figure 3). This BH is seen through a dense, turbulent, envelope of Compton thick gas. The SED has features of SMBH with broad lines but also features associated with stars like the Balmer break, blackbody-like SED, and increasingly deep absorption across the balmer series

Early SMBH:
Theories of SMBH growth predict channels of seeding massive BHs as well as growing them at a rapid, super-eddington pace where a BH, enshrouded in a dense gas, has high enough opacity to trap the accretion radiation (and convect it away such that gravity may overcome the radiative feedback and exceed the eddington limit. MoM-BH*-1 is an early, growing BH and its features align with theoretical models of this super-eddington growth. Surrounding MoM-BH*-1 is a faint low-mass host dwarf galaxy. This dwarf galaxy is associated with a more massive, bright galaxy only 60 kpc away which agrees with theories that direct collapse BHs that form out of primordial gas needs proximity to an ionizing source to suppress formation of molecular hydrogen to aid in direct collapse (need more BHs in similar configurations to constrain). THe authors overlaid the spectra of the neighboring galaxy with the BH which obtained features found in LRDs suggesting potential origins of LRDs. As such MoM-BH*-1 is effectively the pure templates for the AGN component of LRD’s, untangled from the host galaxy. The host galaxy dominates in the UV while the BH dominates in the rest-optical



To see more:
Podcasts: https://www.npr.org/2026/08/21/nx-s1-5931541/black-hole-stars-red-dots-james-webb

`
    },

    { // TNG Simulations Review
      id: 'tng-review',
      title: 'TNG: A Breakthrough in Large-Scale Simulations from Big-Bang to Present',
      date: '2026-11-01',
      category: 'Simulations',
      summary:
        'A review of the IllustrisTNG simulations, what they are, how they work, and how to get started.',
      keywords: ['JWST', 'Little Red Dots', 'LRDs', 'Cosmology', 'SMBH', 'BH'],
      cover: {
        src: 'assets/img/blog/tngsimulation_review_blog_2026/tng_dm_structure_feature.jpg',
        alt: 'Dark matter structure in the TNG100-1 simulation.',
        credit: 'IllustrisTNG Project',
      },
      related: {
        publications: ['RNAAS-magnetic-fields-2025'],
        links: [
          { label: 'IllustrisTNG public data', href: 'https://www.tng-project.org/data/' },
          // { label: 'Our analysis code on GitHub', href: 'https://github.com/poulinal/TNG_Magnetic_Field_Study' }
        ]
      },
      references: [
        {
          key: 'tng_release_2021',
          authors: ['Nelson, Dylan', 'Springel, Volker', 'Pillepich, Annalisa', 'et al.'],
          year: 2021,
          title: 'The IllustrisTNG Simulations: Public Data Release',
          journal: 'arXiv:1812.05609',// volume: '995', pages: '21',
          doi: '10.48550/arXiv.1812.05609'
        },
      ],
      body: String.raw`
Magnetic fields thread through every galaxy we know of,

## A model of the universe
Observations are hard! From factors like limited data, limited observables, and rare objects, the frontier is constantly pushing on the limitations of current telescopes. Simulations provide a gateway to test theoretical predictions that may not be feasible with current or as a precursor to observations. Fro example, dark matter and dark energy are remain difficult to observe but through TNG, simulations of models of dark matter and dark energy can test how accurate the simulations are to our observations. By testing the simulation, better constraints can be placed on the models which will better predict how visible and dark matter evolve in the universe. Introducing the IllustrisTNG project, it is an ongoing series of large, cosmological magnetohydrodynamical simulations of galaxy formation. It hopes to study the physical processes that drive galaxy formation. It is built on the lambda CDM, cold dark matter theory, through magnetohydrodynamical which is …. It is the successor to the original Illustris simulations built in …. It improves on the original Illustris simulations that failed to agree with observational color bimodality. The simulations start shortly after the Big Bang and model the evolution of dark matter, cosmic filaments, and the formation and evolution of galaxies and stars forward to the present day. 




The simulations:
The core IllustrisTNG project consists of three main simulations: TNG50, TNG100, and TNG300, each with 3 resolution levels, indicated with a ‘-n’ where n=1,2,3 in order of highest to lowest resolution. In addition, each of the main simulations also include a “dark matter only” run which helps study how the large scale structure and halos evolves with a clean model that isn’t turbulent with how baryons interact.
Recently, the project has been expanded with the addition of TNG-Cluster. TNG-Cluster provides 352 zoom-in clusters, to significantly enhance the sample statistics of the highest cluster mass regime, enabling insight into the most massive and rare objects in the universe
There are several spin-off projects, utilizing the TNG galaxy formation model to apply to new regimes and applications like TNG-Millenium, CAMELS, and AIDA-TNG.


Key Findings thus far:

Data access:
The simulations are completely open-access. To begin getting your hands on the simulations, you can visit the m

See *point to tutorial* for more information on handling TNG


::: definition Magnetohydrodynamics (MHD)
Ordinary fluid dynamics describes how gas flows. MHD adds the fact that hot, ionized gas conducts
electricity, so it drags magnetic field lines along with it. Squeeze the gas and you squeeze the field
lines closer together, which makes the field stronger.
:::

::: key
At the same stellar mass, satellite galaxies have magnetic fields roughly **an order of magnitude
stronger** than central galaxies. The gap is largest for satellites that have already passed within
$R_{200}$ of their host.
:::

## Tables, quotes, dividers

| Run      | Box size   | Purpose        |
|----------|------------|----------------|
| TNG50    | ~50 Mpc    | detail         |
| TNG100   | ~100 Mpc   | balance        |
| TNG300   | ~300 Mpc   | statistics     |

{{video https://www.youtube.com/watch?v=O674AZ_UKZk | Formation of a single massive galaxy through time in the TNG50 cosmic simulations}}

{{video https://youtu.be/xg25bxdRw-M?si=X411kT6zBMb9dVIK | Simulations of the formation of galaxies in TNG50}}

## To see more:
Check out the TNG Page: [IllustrisTNG Project](https://www.tng-project.org) <br>
Check out my tutorials:
{{tutorial | Interactive Python tutorials on this site}}
`
    },

    /* ------------------------------------------------------------------ */
    { // Style Guide (hidden demo: open blog.html?p=style-guide, safe to delete)
      id: 'style-guide',
      title: 'Blog style guide',
      date: '2026-11-01',
      draft: true,
      category: 'notes',
      summary: 'Every formatting option available in a post, with the source next to the result.',
      thumbnail: {
        src: 'assets/img/blog/lrd/jwst-field.png',
        alt: 'JWST deep field with several little red dots circled',
        credit: 'NASA, ESA, CSA, STScI',   // text credit (optional)
        cite: 'matthee2024'                // key from this post's references (optional)
      },

      keywords: ['Meta'],
      references: [
        { key: 'mcdonough2025', pub: 'RNAAS-magnetic-fields-2025' },
        {
          key: 'nelson2019',
          authors: ['Nelson, D.', 'Springel, V.', 'Pillepich, A.', 'et al.'],
          year: 2019, title: 'The IllustrisTNG simulations: public data release',
          journal: 'Computational Astrophysics and Cosmology', volume: '6', pages: '2',
          doi: '10.1186/s40668-019-0028-x'
        }
      ],
      body: String.raw`
This post is hidden from the list. Each section shows the source, then the result.

## Text and links

~~~
Some **bold**, some *italic*, a [link](https://www.tng-project.org), and <code>inline code</code>.
~~~

Some **bold**, some *italic*, a [link](https://www.tng-project.org), and <code>inline code</code>.

## Equations

~~~
Inline: the virial radius $R_{200}$. Display:

$$
u_B = \frac{B^2}{8\pi}
$$
~~~

Inline: the virial radius $R_{200}$. Display:

$$
u_B = \frac{B^2}{8\pi}
$$

## Citations

~~~
TNG data are public [@nelson2019]; see also our note [@mcdonough2025; @nelson2019].
~~~

TNG data are public [@nelson2019]; see also our note [@mcdonough2025; @nelson2019].

## Figures

~~~
{{figure assets/img/pubs/CLADA-home.png | A numbered caption, with math: $\Delta$PDF. | Screenshot of the CLADA window | 80%}}
~~~

{{figure assets/img/pubs/CLADA-home.png | A numbered caption, with math: $\Delta$PDF. | Screenshot of the CLADA window | 80%}}

## Videos

~~~
{{video https://www.youtube.com/watch?v=VIDEO_ID | Caption under the video}}
{{video assets/video/my-simulation.mp4 | A movie file stored in the repo}}
~~~

(Not rendered here, so this page doesn't show a broken video. Paste a real link to see it.)

## Callouts

~~~
::: key
The one sentence you want readers to remember.
:::

::: definition Halo
A gravitationally bound clump of dark matter that hosts galaxies.
:::
~~~

::: key
The one sentence you want readers to remember.
:::

::: definition Halo
A gravitationally bound clump of dark matter that hosts galaxies.
:::

::: note
A side remark. (Also: tip, question.)
:::

## Tutorial and publication cards

~~~
{{tutorial kepler}}
{{pub RNAAS-magnetic-fields-2025}}
~~~

{{tutorial kepler}}

{{pub RNAAS-magnetic-fields-2025}}

## Tables, quotes, dividers

| Run      | Box size   | Purpose        |
|----------|------------|----------------|
| TNG50    | ~50 Mpc    | detail         |
| TNG100   | ~100 Mpc   | balance        |
| TNG300   | ~300 Mpc   | statistics     |

> A quotation, for when someone else said it best.

---

## Code blocks

~~~python
import numpy as np
print(np.mean([1, 2, 3]))
~~~
`
    }

  ];

})(window.Site = window.Site || {});

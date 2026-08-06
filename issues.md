# Des Moines Wellness Center — Issue Register & Completion Plan

**Facility:** Des Moines Wellness Center
**Production domain:** `desmoinesrecovery.com` (WordPress / Elementor on WP Engine + Cloudflare — still live)
**New build (audited):** `des-moines-wellness-center-navy.vercel.app` (public, HTTP 200)
**This repo:** Next.js 15 rebuild — in sync with the deployed build as of 2026-08-05 (`c0f80a1`); see [T-01](#t-01)

**Source sheet:** [QHG Vercel Build Issues](https://docs.google.com/spreadsheets/d/1daiRElkRoKObt9KCsqFeXEhmtSBk5c1MQjUeaKx2nC8/edit) — all 5 tabs
**Sheet audit date:** 2026-07-27 · **sheet verification pass:** 2026-07-28
**This register compiled & independently re-verified:** 2026-08-05

---

## 0. Read this first

### What was pulled from the sheet

| Tab | Total rows | Rows for this facility | Notes |
|---|---|---|---|
| **Vercel Build Issues** | 102 data rows | **4 facility-specific** (V0069–V0072) + **13 portfolio-wide** + **2 cross-referenced** (V0090, V0091) | Portfolio rows filtered individually — see Appendix B for the 6 that do *not* apply, Appendix D for cross-references |
| **Broken Internal Links** | 29 data rows | **0** | Confirmed: only Dallas (16) and Fort Worth (13). I re-tested all 34 internal link targets on our preview — **0 broken**. |
| **Visual Issues** | 1,500 data rows | **206** labelled ours (IDs 408–613) + **3 cross-referenced** under QHG parent | 310 trailing rows are ID-only placeholders with no content — verified empty, nothing lost |
| **Verification Log** | 74 data rows | 15 relevant + 3 cross-referenced (V0023, V0040, V0076) | Evidence folded into each task |
| **Legend** | 28 | methodology | Priority model, verdicts, known sheet defects |

**Secondary source — [QHG staff bios doc](https://docs.google.com/document/d/1MWL4ki6HDCcUN-1mh2EFU-6eoMVpwpSSRMDm58Me3oA/edit)** (pulled 2026-08-05, 17,298 words, 24 sections). Portfolio-wide staff bios. Our facility's content is the "Des Moines Recovery" section — **5 staff, all bios complete, no outstanding bio or headshot requests for Iowa** (unlike Cali/Texas/NJ/KY, which have named gaps). This is the **authoritative source for names, titles and credentials** and it resolved two open questions plus surfaced one new P1. See **T-26** and **T-29**.

**Net: 236 sheet rows touch this facility → 222 actionable → plus 11 issues found independently → 233 distinct issues → 29 tasks.**

| Source | Rows |
|---|---:|
| Visual Issues labelled ours (IDs 408–613) | 206 |
| Portfolio "ALL SITES" build rows | 13 — *7 apply, 6 ruled out* |
| Cross-ref build rows where **our build is the correct model** | 8 — *confirmations, not work* |
| Facility-specific build rows (V0069–V0072) | 4 |
| Cross-ref visual rows filed under QHG parent | 3 |
| Cross-ref build rows, actionable (V0090, V0091) | 2 |
| Broken Internal Links tab | 0 |
| **Total sheet rows** | **236** |
| **Actionable** (less 6 ruled out, 8 confirmations) | **222** |
| Found independently — 10 in Appendix C + medical-reviewer (T-29) | **+11** |
| **Distinct issues to fix** | **233** |

### Two corrections to the sheet's own metadata

1. **The Legend's row count is stale.** It states "Total rows | 118" and "IDs V0001–V0118 are now locked". The Vercel Build Issues tab actually contains IDs up to **V0135** — 17 rows (V0119–V0135) added in a later deep-audit round that the Legend never describes.

2. **This facility was excluded from that deep-audit round.** Coverage by facility:

| Facility | Original audit | Deep audit (V0119–V0135) | Visual issues |
|---|---|---|---|
| Laguna View Detox | 7 | **3** | 233 |
| Seaside / QHG / Wellness NJ / Ocean Coast / Greater Texas | 4–6 each | **2 each** | varies |
| Hillside / Marina Harbor / Wellness LA | 5–9 each | **1 each** | 0–242 |
| **Des Moines Wellness Center** | **4** | **0** | 206 |
| Dallas Detox Center | 9 | 0 | 407 |
| Fort Worth Wellness | 10 | 0 | 0 |

**Consequence:** our facility has the **fewest build-issue rows in the portfolio (4)** and received **no deep audit**. Five other facilities got a dedicated `CUTOVER REDIRECT MAP REQUIRED` row (V0121 Laguna/182 pairs, V0125 Ocean Coast/92, V0128 QHG/16, V0132 Wellness NJ/37, V0135 Greater Texas/4) — **Des Moines has none.** That is why T-13 exists and why my independent pass found 10 issues the sheet never logged (Appendix C). **Treat the 4 build rows as a floor, not a ceiling.**

### Trust level of the source data

The sheet's own Legend is explicit about its reliability, and this shaped how the tasks below are written:

> "*NOT YET VERIFIED — 34 rows. Treat their counts and fix instructions with the same caution the verified set earned — roughly two thirds of verified rows needed a correction.*"

- The 4 facility rows (V0069–V0072) **were** verified: 1 `CONFIRMED`, 3 `CONFIRMED_AMENDED`.
- **All 206 Visual Issues rows are unverified.** I re-tested the load-bearing ones against the live preview; results are marked ✅ verified / ⚠️ unverified per task.
- The sheet is **8 days stale** as of today, and row V0124 warns the gap widens daily.

### ~~⚠️ Blocking discovery — do not start work before T-01~~ → RESOLVED 2026-08-05

> **Superseded. This was not a blocker and work is no longer gated on it.**
> The 12 hrefs were real but sat in `PageModel.ctas[]`, a field no component
> reads, so they never rendered — the deployed build and this repo both had a
> clean link graph. The repo was 8 commits behind (`8ee209d` vs the deployed
> `c0f80a1`), which a fast-forward fixed. All 12 hrefs are now corrected and a CI
> guard prevents regression. Full evidence in [T-01](#t-01).

<details>
<summary>Original text (kept for the record)</summary>

**This repo is not the source of the deployed preview.** The deployed `navy` build has **0 broken internal links**; this repo's content JSON has **12 hrefs that resolve to nothing**, including `/what-we-treat` linking its own children at flat slugs (`/alcohol-rehab-des-moines`) instead of nested ones (`/what-we-treat/alcohol-rehab-des-moines`).

Fixing issues in this repo and redeploying would **reintroduce 12 broken links the deployed build has already fixed.** Resolve T-01 first.

</details>

### Priority model

| | Meaning | Gate |
|---|---|---|
| **P0** | Compliance exposure, clinical-accuracy defect, or launch blocker | Must clear before cutover |
| **P1** | Launch-required — content parity, conversion path, or SEO equity | Must clear before cutover |
| **P2** | Structural / consistency decisions with redirect cost | Decide before cutover, execute either side |
| **P3** | Polish | Can follow launch |

---

## 1. Task index

| ID | Task | Pri | Sheet rows | Count | Status |
|---|---|---|---|---|---|
| [T-01](#t-01) | Reconcile this repo with the deployed build | **P0** | *(new)* | 12 links | [x] **done 2026-08-05** — not a blocker, see resolution |
| [T-02](#t-02) | LegitScript certification claim | **P0** | V0070 | 35 pages | [~] **gated 2026-08-05** — claim withheld, cert unverifiable (reCAPTCHA) |
| [T-03](#t-03) | Trailing-slash convention + sitemap host | **P0** | V0102 | 34 URLs | [x] **done 2026-08-05** |
| [T-04](#t-04) | Content freeze / re-sync before cutover | **P0** | V0124 | 1 post | [~] **re-sync gate implemented 2026-08-05** — `npm run cutover:check`; run <24h before go-live |
| [T-05](#t-05) | Wrong-substance copy on condition pages | **P0** | Visual ×5 (+2 found) | 7 blocks | [x] **done 2026-08-05** — all 7 + typo + CI guard |
| [T-29](#t-29) | Medical reviewer attribution on YMYL content | P1 | *bios doc* | 15 pages | [!] **BLOCKED** — needs Compliance sign-off |
| [T-06](#t-06) | Build 5 missing service-area pages | P1 | V0069 | 5 pages | [x] **done 2026-08-05** — 4 built, Des Moines skipped by decision |
| [T-07](#t-07) | FAQ rebuild + restore FAQPage schema | P1 | V0099, Visual ×15 | 15 rows | [x] **done 2026-08-05** — 98 pairs restored, schema on 21 pages |
| [T-08](#t-08) | Restore missing body copy | P1 | Visual ×40 | 40 rows | [x] **done 2026-08-05** — premise corrected, see resolution |
| [T-09](#t-09) | Insurance module parity | P1 | Visual ×29 | 29 rows | [~] **module on 22 pages + test harness 2026-08-05** — one human run left |
| [T-10](#t-10) | Widget & card linking | P1 | Visual ×30 | 30 rows | [x] **done 2026-08-05** — 52 cards linked |
| [T-11](#t-11) | Buttons & CTAs | P1 | Visual ×23 | 23 rows | [x] **done 2026-08-05** — 11 call CTAs, 9 dual-dx links |
| [T-12](#t-12) | Google map embeds (+ fix production's wrong map) | P1 | Visual ×18 | 18 rows | [x] **done 2026-08-05** — keyless embed, correct coords |
| [T-13](#t-13) | Cutover redirect map | P1 | *(new)* | 7 URLs | [~] **map committed + all 5 verified single-hop** — Search Console at cutover |
| [T-14](#t-14) | Geo-suffix slug policy | P2 | V0072, V0118, Visual ×10 | 11 slugs | [!] **decision recorded: keep slugs** — needs portfolio sign-off |
| [T-15](#t-15) | `/programs` → `/treatment` hub | P2 | V0094 | 1 hub | [!] **decision recorded: defer** — coupled to T-14 |
| [T-16](#t-16) | Aftercare slug standard | P2 | V0095 | 1 page | [!] **decision recorded: defer** — coupled to T-15 |
| [T-17](#t-17) | Blog URL pattern | P2 | V0101 | 2 posts | [x] **done 2026-08-05** — both posts at /blog/<slug> |
| [T-18](#t-18) | Section order / merge / remove | P2 | Visual ×20 | 20 rows | [~] **(b) 5 dupes merged, (c) all 3 reorders done 2026-08-05** — (a) blocked on T-29 |
| [T-19](#t-19) | Des Moines vs Johnston locality claims | P2 | V0071 | 9 mentions | [x] **done 2026-08-05** — 12 claims fixed (not 2), NAP untouched |
| [T-20](#t-20) | Text casing | P3 | Visual ×10 | 10 rows | [x] **done 2026-08-05** |
| [T-21](#t-21) | Imagery & team photos | P3 | Visual ×6 | 6 rows | [x] **done 2026-08-05** — all 5 portraits, incl. Bethany |
| [T-22](#t-22) | Tour link & facility video | P3 | Visual ×5 | 5 rows | [x] **done 2026-08-05** — http://tour removed |
| [T-23](#t-23) | Header & footer corrections | P3 | Visual ×3 | 3 rows | [x] **done 2026-08-05** — footer regrouped, header CTA added |
| [T-24](#t-24) | Blog content gap | P3 | Visual ×1 | 1 row | [x] **done 2026-08-05** — both posts present |
| [T-25](#t-25) | Raw URLs exposed | P3 | Visual ×1 | 1 row | [x] **done 2026-08-05** — 10 raw URLs became real links |
| [T-26](#t-26) | Credentials, job titles, staff verification | P3 | Visual ×1 (+1 found) | 2 items | [x] **done 2026-08-05** — titles, credentials and photo |
| [T-27](#t-27) | Resource links | P3 | Visual ×3 | 3 rows | [x] **done 2026-08-05** — 43 resources restored on 13 pages |
| [T-28](#t-28) | QHG parent: our location page & referral link | P2 | V0090, V0091, Visual ×3 | 5 rows | [~] **content package prepared 2026-08-05** — still needs a parent-site owner |

> Visual rows can carry more than one theme, so the per-task counts sum above 206. **Appendix A is the authoritative 206-row checklist.**

---

## 2. P0 — Blockers, compliance, clinical accuracy

<a id="t-01"></a>
### T-01 · Reconcile this repo with the deployed build — **P0 BLOCKER**

**Source:** New finding (2026-08-05). Not in the sheet.

**Evidence** ✅ verified
- Deployed `navy` preview: 34 unique internal link targets, **all HTTP 200**.
- This repo at HEAD: **12 of 44** `"href"` values in `content/` resolve to no route.
- Divergence proven on one file: [content/pages/what-we-treat.json](content/pages/what-we-treat.json) points at `/alcohol-rehab-des-moines`; the deployed build serves `/what-we-treat/alcohol-rehab-des-moines`.

**The 12 unresolvable hrefs in this repo**

| href | Real target | In file |
|---|---|---|
| `/alcohol-rehab-des-moines` | `/what-we-treat/alcohol-rehab-des-moines` | what-we-treat.json |
| `/benzo-rehab-des-moines` | `/what-we-treat/benzo-rehab-des-moines` | what-we-treat.json |
| `/fentanyl-rehab-des-moines` | `/what-we-treat/fentanyl-rehab-des-moines` | what-we-treat.json |
| `/meth-rehab-des-moines` | `/what-we-treat/meth-rehab-des-moines` | what-we-treat.json |
| `/prescription-drug-rehab-des-moines` | `/what-we-treat/prescription-drug-rehab-des-moines` | what-we-treat.json |
| `/marijuana-rehab-des-moines` | **page does not exist** — build or unlink | what-we-treat.json |
| `/stimulants-rehab-des-moines` | **page does not exist** — build or unlink | what-we-treat.json |
| `/dual-diagnosis` | `/programs/dual-diagnosis` | what-we-treat.json, how-alcohol-addiction… |
| `/medical-detox` | `/programs/medical-detox-des-moines` | programs.json |
| `/welsey-starlin` | `/team/welsey-starlin` | how-alcohol-addiction…, programs\_\_aftercare… |
| `/about-us` | `/about` | home.json |
| `http://tour` | `/tour` | programs\_\_residential-rehab-des-moines.json |

**Steps**
1. Identify the commit/branch that produced the `navy` deployment. Check the Vercel project's connected branch — this repo's HEAD is `8ee209d`, which predates it.
2. Either (a) pull the deployed build's content into this repo, or (b) confirm this repo *is* upstream and the fixes were applied only on the deployment — then port them here.
3. Once reconciled, fix any of the 12 hrefs still outstanding.
4. Add a CI guard: fail the build when any `"href"` in `content/` has no matching route in `content/pages/`.

**Acceptance criteria**
- [x] Repo HEAD and deployed build produce byte-identical internal link graphs
- [x] Link-integrity check passes: 0 unresolvable internal hrefs
- [x] Guard runs in CI on every PR
- [x] Decision recorded on `/marijuana-rehab-des-moines` and `/stimulants-rehab-des-moines`: build, or remove the links

#### ✅ Resolution — 2026-08-05 (commit on branch `fixes`)

**This was not a blocker.** The 12 hrefs are real, but the premise that fixing
things here "would reintroduce 12 broken links" does not hold, for a reason the
original analysis missed:

> **All 12 live in `PageModel.ctas[]` — a page-level field declared in
> [lib/types.ts](lib/types.ts) but read by no component.** CTAs actually render
> from `hero.primaryCta` / `hero.secondaryCta` and from sections of
> `kind: 'cta'`. The `ctas[]` array is an extraction artifact that reaches no
> markup, which is why the deployed build *and* this repo both render zero
> broken links. The divergence was never in the link graph.

**Step 1–2 (reconcile).** Outcome (b): this repo *is* upstream. HEAD was
`8ee209d`; the 2026-07-29 production deployment was `c0f80a1`, i.e. the repo was
simply 8 commits behind, and `8ee209d` is a strict ancestor of `origin/main`.
Resolved by fast-forward — no content had to be ported, nothing was lost.

**Step 3 (fix the hrefs).** All 12 corrected: 10 remapped to their real nested
targets, `http://tour` → `/tour`, and the 2 with no destination removed.

**Step 4 (CI guard).** [scripts/check-links.mjs](scripts/check-links.mjs), wired
into [.github/workflows/ci.yml](.github/workflows/ci.yml) on every PR. It also
asserts every sitemap URL returns 200 with no redirect hop.

**AC#1 evidence** — internal link graphs crawled and diffed:

| | pages | link targets | broken |
|---|---|---|---|
| deployed `navy` | 35 | 34 | **0** |
| this repo | 36 | 35 | **0** |

`onlyInNavy: []` — the deployment has nothing this repo lacks. The single delta is
`onlyInLocal: /blog/what-to-expect-first-30-days-of-treatment`, an intentional
addition (the blog is now server-rendered and its posts are crawlable; see the
blog/form commit). Graphs are otherwise identical.

**AC#4 decision — remove the links, do not build the pages.** Evidence:

- `desmoinesrecovery.com/marijuana-rehab-des-moines` → **404**
- `desmoinesrecovery.com/stimulants-rehab-des-moines` → **404**
- Neither appears in production's 33-URL sitemap
  ([audit/data/production-sitemap-urls.txt](audit/data/production-sitemap-urls.txt)),
  which lists exactly the 7 `what-we-treat` children this build already has.

They were dangling links on the old site, pointing at pages that never shipped.
Removing them loses no content parity and needs no redirect. If marijuana or
stimulant treatment pages are wanted, that is net-new content, not a migration
gap — track it separately from T-01.

**Two corrections to this task's own write-up**, per the ground rule on counts:

1. *"12 of 44 href values"* — the repo has **44 unique** href values but **164**
   href occurrences overall; 12 unresolvable is the right count of distinct
   offenders (20 occurrences). Worth stating both so the guard's output
   ("164 internal hrefs") doesn't look like it contradicts this table.
2. `http://tour` is easy to miss with a naive check, because a
   scheme-prefixed value looks external. The guard therefore parses candidates
   and rejects any `http(s)://` URL whose host has no dot — that is what caught
   it. A checker that skips anything matching `^https?:` reports 11, not 12.

---

<a id="t-02"></a>
### T-02 · LegitScript certification claim — **P0 COMPLIANCE**

**Source:** V0070 · `CONFIRMED_AMENDED` · sheet priority **COMPLIANCE**

**Evidence** ✅ verified independently
- New build: "LegitScript Certified" as text on **35 of 35 pages**; LegitScript seal images: **0**; links to `legitscript.com`: **0**.
- Production `desmoinesrecovery.com` carries a LegitScript seal whose verification link resolves to **`?checker_keywords=californiahorizon.com`** — a different domain.

**Why this is first, not cosmetic.** The sheet's verification note is unambiguous:

> "*The fix is NOT simply 'add the seal back'. The certification needs confirming as held for desmoinesrecovery.com FIRST, because the only evidence on production points at californiahorizon.com. If the certification is not held for this domain, the text claim is unsubstantiated — which matters for Google Ads eligibility in addiction treatment, not just trust signalling.*"

Unsubstantiated certification claims on an addiction-treatment site are a paid-search eligibility risk and a regulatory one. **This is a verification task before it is a build task.**

**This is the portfolio's worst LegitScript case.** V0076's verification log ranks it explicitly: "*Unlike Des Moines (V0070), Seaside DOES hold a seal image and its verify link is simply missing rather than pointing at the wrong domain. So this is lower severity than V0070 — a linking omission, not a questionable certification claim.*" Of the 12 sites, only ours has a seal whose verification resolves to a different company's domain.

**Steps**
1. **Confirm ownership.** Obtain the LegitScript certificate for `desmoinesrecovery.com` — certificate ID, issue date, expiry. Check the [LegitScript status lookup](https://www.legitscript.com/certification/website-certification-status/).
2. Branch on the answer:
   - **Held for this domain** → embed the official seal, link it to the live verification record, keep the text claim.
   - **Held for another entity / not held** → **remove the text claim from all 35 pages** pending certification. Do not ship the claim unbacked.
   - **In progress** → remove until issued.
3. Fix the production seal's `californiahorizon.com` verification link either way.
4. Record the outcome and who confirmed it, in this file.

**Acceptance criteria**
- [ ] Certificate status for `desmoinesrecovery.com` documented with ID + expiry, or absence documented
- [ ] All 35 pages consistent with the documented status — no page claims more than the certificate supports
- [ ] If retained: seal image present and linked to the live record on all 35 pages
- [ ] Production's wrong-domain verification link fixed or removed
- [ ] Same check run against the other 11 portfolio sites (Seaside ×2 and Wellness NJ ×1 carry seals with no verify link at all)

---

<a id="t-03"></a>
### T-03 · Trailing-slash convention + sitemap host — **P0 CRITICAL**

**Source:** V0102 · `CONFIRMED_AMENDED` · sheet priority **CRITICAL** ("single largest cutover issue in the audit by URL count")

**Evidence** ✅ verified independently
| Check | Result |
|---|---|
| Preview `/about` | **200** |
| Preview `/about/` | **308** redirect |
| Production `/about` | **301** → `/about/` |
| Production `/about/` | **200** |
| Production sitemap | 34 URLs, **all with** trailing slash |
| **New build's sitemap** | 34 URLs, **all without** trailing slash — and pointing at `desmoinesrecovery.com` |

**The compounding defect I found:** the new build's `sitemap.xml` already declares production hostnames (`https://desmoinesrecovery.com/about`) in the **slashless** form. Production 301s every one of those 34 URLs today. So the build ships a sitemap where **100% of entries redirect.**

Per the sheet, this also **causes** the canonical-target redirect rows elsewhere in the audit (V0018, V0067) — the builds emit slashless canonicals against slash-canonical production. One fix closes all of them.

**Steps**
1. Decide the convention. **Recommend keeping production's trailing slash** — it is what is indexed and linked today, across all 1,046 portfolio URLs. Changing it converts every existing inbound link into a redirect for no gain.
2. Set `trailingSlash: true` in [next.config.mjs](next.config.mjs).
3. Regenerate the sitemap so entries match the canonical form exactly.
4. Confirm `<link rel="canonical">` uses the same form as the sitemap.
5. Apply the identical setting across all 12 portfolio builds — this is portfolio-wide, not local.

**Acceptance criteria**
- [ ] `next.config.mjs` sets one explicit convention
- [ ] All 34 sitemap URLs return **200 with no redirect** on the target domain
- [ ] Canonical form === sitemap form === served form, on all 34 pages
- [ ] Re-verified after cutover, not just on preview
- [ ] Convention confirmed identical on the other 11 builds

---

<a id="t-04"></a>
### T-04 · Content freeze / re-sync before cutover — **P0 CRITICAL**

**Source:** V0124 · sheet priority **CRITICAL** · added during verification

**Evidence** ✅ verified independently
The sheet found every Vercel build was generated from a **content snapshot around 15–16 July 2026**, while production kept publishing. It names this facility explicitly as one where the gap is *still growing*.

My sitemap diff today confirms one concrete loss:

| Present on production | In new build? |
|---|---|
| `/how-long-does-percocet-stay-in-your-system/` | **❌ absent** |
| `/author/cpts/` | ❌ absent — *intentional, see note* |
| `/category/uncategorized/` | ❌ absent — *intentional, see note* |

*The two WordPress taxonomy pages are correctly dropped — both are thin, indexable templates with no unique content on production. Do not rebuild them; redirect or let them 410.*

**The percocet post is a real content loss** and must be migrated.

**Steps**
1. Migrate `/how-long-does-percocet-stay-in-your-system/` into the build.
2. **Choose one:** freeze publishing on production until cutover, **or** stand up a re-sync step that pulls post-snapshot content into the build.
3. **Re-run this diff immediately before cutover** — today's result is accurate as of 2026-08-05 and will be stale at launch:
   ```
   curl -s https://desmoinesrecovery.com/sitemap_index.xml   # enumerate child sitemaps
   # compare production paths against the build's sitemap.xml
   ```
4. Add the diff to the launch runbook as a mandatory gate.

**Acceptance criteria**
- [ ] Percocet post live on the build with content parity
- [ ] Freeze agreed in writing, or re-sync step implemented and tested
- [ ] Diff re-run <24h before cutover, result attached to the runbook
- [ ] Zero production URLs (excluding the 2 intentional taxonomy drops) missing from the build at launch

---

<a id="t-05"></a>
### T-05 · Wrong-substance copy on condition pages — **P0 (clinical accuracy)**

**Source:** Visual Issues 522, 563, 566, 570, 590 — **plus 2 the sheet missed**

**Evidence** ✅ verified independently on the live preview

Condition pages carry headings and body copy about the **wrong substance** — template copy-paste that survived into the build. On an addiction-treatment site this reads as clinical carelessness to a prospective patient and undercuts topical relevance for the page's own keyword.

| # | Page | Element | Current text | Should reference | Sheet row |
|---|---|---|---|---|---|
| 1 | `/what-we-treat/benzo-rehab-des-moines` | `h2` | "Managing **Alcohol** Withdrawal Symptoms Safely:" | Benzo | 522 |
| 2 | `/what-we-treat/fentanyl-rehab-des-moines` | `p` | "Step 1 Of **Alcohol** Addiction Recovery" | Fentanyl | 563 |
| 3 | `/what-we-treat/fentanyl-rehab-des-moines` | `h2` | "Fixing the Roots of **Alcohol** Addiction in Des Moines, Iowa" | Fentanyl | 566 |
| 4 | `/what-we-treat/fentanyl-rehab-des-moines` | `p` | "THE WAY WE HEAL **alcohol** addici**t**on" | Fentanyl — **also fix the typo** | 570 |
| 5 | `/what-we-treat/meth-rehab-des-moines` | `h2` | "**Cocaine** Rehab and Detox in Des Moines, Iowa" | Meth | 590 |
| 6 | `/what-we-treat/cocaine-rehab-des-moines` | `h2` | "Medical **Alcohol** Detox in Des Moines" | Cocaine | **⚠️ not in sheet** |
| 7 | `/what-we-treat/cocaine-rehab-des-moines` | `p` | "Step 1 Of **Alcohol** Addiction Recovery" | Cocaine | **⚠️ not in sheet** |

Row 4 also contains a spelling error — "addici**t**on" — in display copy.

**Steps**
1. Fix all 7 blocks in the corresponding `content/pages/what-we-treat__*.json` files.
2. Fix the "addiciton" typo.
3. Sweep the remaining condition pages (`alcohol`, `drug`, `prescription-drug`) with the same check — the two I found were in a page the sheet had already reviewed, so assume more exist.
4. Add a lint check: for each condition page, no `h1`–`h3` may name a substance other than the page's own topic.

**Acceptance criteria**
- [ ] All 7 blocks corrected
- [ ] Typo fixed
- [ ] Full sweep of all 7 condition pages completed and documented
- [ ] Lint rule in CI

---

## 3. P1 — Launch-required

<a id="t-29"></a>
### T-29 · Medical reviewer attribution on YMYL content — P1

**Source:** QHG staff bios doc (new finding — not in the sheet)

**Evidence** ✅ verified against the doc, the build, and production

The bios doc gives Wesley Starlin's authoritative title: **Executive Director**, described as "*a licensed mental health counselor with over 15 years of experience leading clinical programs*". Meanwhile:

| | Finding |
|---|---|
| Byline text on the build | "**Medically Reviewed By** Wesley Starlin, **LMHC**" |
| Pages carrying it | **15 of 35** |
| What those pages cover | Medical detox, withdrawal management and tapering — `/programs/medical-detox-des-moines`, all 7 `/what-we-treat/*` condition pages, PHP, IOP, residential |
| Dr. Pamela Tambini — board-certified in **Internal Medicine and Addiction Medicine**, listed in the doc under **"Medical Oversight"** | **Appears nowhere on our site** — 0 matches on the build, 0 on production |

**The mismatch.** An LMHC is a licensed mental health *counselor* — credentialed to review counselling and therapy content. The 15 pages carrying his byline include pharmacological content: withdrawal symptom management, detox tapering, medication protocols. Presenting that as "medically reviewed" by a counsellor overstates the credential behind the review. For YMYL health content this is both an accuracy problem and an E-E-A-T weakness — and it is the facility's Executive Director reviewing his own facility's clinical claims.

**The org already has the right reviewer**, which is what makes this cheap to fix: Dr. Tambini holds exactly the credentials this content needs, and she is entirely absent from the site.

**This changes T-18(a)'s scope** — that task moves the byline to the top of 13 pages. Moving a byline that names the wrong reviewer is wasted work. **Settle T-29 first, then position it once.**

**Steps**
1. **Decide with the Director of Compliance** (Stephanie Hakim, per the bios doc) which of these applies:
   - **(a) Physician review** — have Dr. Tambini (or another physician/prescriber) review the 15 pages and carry her byline with credentials. Strongest option; the content genuinely warrants it.
   - **(b) Split the attribution** — "Medically Reviewed By [physician]" on medical content, "Clinically Reviewed By Wesley Starlin, LMHC" on counselling/therapy content. Accurate on both halves.
   - **(c) Retitle only** — change all 15 to "Clinically Reviewed By" and stop claiming medical review. Cheapest, but leaves medical content unreviewed by a prescriber.
2. Add reviewer name, credentials, role and review date to the byline.
3. Add the reviewer to `/team` with a bio, so the byline links to a verifiable person.
4. Emit `reviewedBy` in the page schema, pointing at that person.
5. Then apply T-18(a) positioning.

**Acceptance criteria**
- [ ] Attribution model chosen and signed off by Compliance, recorded in this file
- [ ] Every one of the 15 pages names a reviewer whose credentials match the content type
- [ ] No page claims "medically reviewed" without a physician or prescriber behind it
- [ ] Reviewer has a linked `/team` bio
- [ ] `reviewedBy` present in schema on all 15 pages
- [ ] Review date shown and current
- [ ] T-18(a) applied only after this is settled

---

<a id="t-06"></a>
### T-06 · Build 5 missing service-area pages — P1

**Source:** V0069 · `CONFIRMED` — "*Holds precisely*", no correction needed

**Evidence** ✅ verified independently — all 7 areas appear as `h3` headings on the homepage under "Addiction Recovery for Des Moines & Beyond":

| Area named on homepage | Page status |
|---|---|
| Ankeny | ✅ 200 |
| West Des Moines | ✅ 200 |
| Des Moines | ❌ **404** |
| Urbandale | ❌ **404** |
| Waukee | ❌ **404** |
| Polk County | ❌ **404** |
| Dallas County | ❌ **404** |

**Sheet's judgement note, worth following:**
> "*A dedicated `/areas-we-serve/des-moines` page may be redundant since the entire site already targets Des Moines — 'Des Moines' appears 30 times on the homepage. The other 4 are clean gaps.*"

**Steps**
1. Build 4 pages — Urbandale, Waukee, Polk County, Dallas County — modelled on [content/pages/areas-we-serve__ankeny.json](content/pages/areas-we-serve__ankeny.json).
2. Decide on Des Moines: skip (recommended, redundant) or build.
3. Write **genuinely distinct** copy per city. Ankeny and West Des Moines already collide on metadata elsewhere in this register — do not repeat that.
4. Link all from the homepage area list and the `/areas-we-serve` hub.
5. Add to sitemap.

**Acceptance criteria**
- [ ] 4 (or 5) pages live at 200
- [ ] Unique `title`, `description`, `h1` and body copy per page — no cross-city duplication
- [ ] Every area named on the homepage either links to a page or stops being presented as a served area
- [ ] All in sitemap with correct canonical form (see T-03)

---

<a id="t-07"></a>
### T-07 · FAQ rebuild + restore FAQPage schema — P1

**Source:** V0099 (portfolio) + Visual rows 422, 427, 436, 453, 457, 474, 480, 481, 500, 512, 531, 540, 556, 574, 597

**Evidence** ✅ verified independently — **and this is a regression, which the sheet does not say**

| | Production | New build |
|---|---|---|
| Pages with `FAQPage` schema | **2** (home, admissions) | **0 of 35** |
| Pages with `"@type":"Question"` | 2 | **0** |

The new build **lost** the FAQ structured data production already had. Separately, V0099 confirms this facility has **no `/faq` page at all** under any slug.

The Visual rows describe the underlying content defect precisely and consistently:
> "*should be an accordian tool format, only contains answers & missing questions*"

That matches [CONTENT-NOTES.md](CONTENT-NOTES.md), which records that **68 FAQ entries were dropped** during migration because the questions lived in JS accordions and never appeared in the source HTML — only the answers survived.

**So this is one job with three parts:** recover the questions, rebuild the accordions, re-emit the schema.

**Steps**
1. Recover the 68 question strings. They are not in production's server HTML — source them from the rendered DOM, the WordPress database, or the Elementor widget definitions.
2. Rebuild each FAQ block as a real accordion with paired question + answer, on the 13 affected pages (Appendix A rows).
3. Emit `FAQPage` JSON-LD wherever a genuine FAQ block exists — at minimum restoring home and admissions to parity with production.
4. Decide whether to add a consolidated `/faq` page (V0099 standard).
5. Validate every page with FAQ markup against Google's Rich Results Test.

**Acceptance criteria**
- [ ] All 15 Visual FAQ rows closed
- [ ] Question text recovered for all FAQ blocks — **no accordion ships answer-only**
- [ ] `FAQPage` schema on ≥2 pages (production parity) and on every page with a real FAQ block
- [ ] Rich Results Test passes with 0 errors
- [ ] Decision recorded on the `/faq` hub page

---

<a id="t-08"></a>
### T-08 · Restore missing body copy — P1 · 40 rows

**Source:** Visual rows 416, 417, 421, 424, 426, 432, 435, 446, 451, 454, 491, 496, 503, 504, 505, 509, 511, 521, 523, 524, 527, 535, 536, 537, 545, 546, 550, 555, 562, 564, 569, 579, 582, 584, 586, 591, 593, 594, 609, 611 · ⚠️ unverified in sheet

**The single largest workstream.** 40 rows across 16 pages. The dominant pattern:
> "*Missing paragraph, only contains bullet points from original page*"

Variants: "missing bullet points", "Missing sentence from original page", "Missing top and bottom paragraph from original page".

**Root cause:** the migration extracted list items but dropped the surrounding prose. Consequence — the new pages are measurably thinner than production on the same topic, which is an SEO regression on the money pages (`/what-we-treat/*` accounts for 20 of these rows).

**Steps**
1. Build a per-section production↔build diff for all 16 pages. Do not work row-by-row from the sheet — the sheet is unverified and section-level diffing is both faster and complete.
2. Restore the missing prose from production, preserving the original wording.
3. Where a bullet list replaced a paragraph, keep both — production had both.
4. Spot-check word count per page against production; flag any page still >15% thinner.

**Acceptance criteria**
- [ ] All 40 rows closed
- [ ] Every affected page ≥ production's unique word count on the same URL
- [ ] Diff report attached showing before/after per page
- [ ] No paragraph reduced to bullets anywhere in `/what-we-treat/*` or `/programs/*`

---

<a id="t-09"></a>
### T-09 · Insurance module parity — P1 · 29 rows

**Source:** Visual rows 412, 415, 431, 439, 443, 449, 460, 466, 468, 476, 484, 492, 493, 499, 501, 515, 518, 519, 520, 534, 541, 544, 558, 561, 578, 588, 592, 601, 612 · ⚠️ unverified

Spans 18 pages. Two distinct asks bundled together:
1. **Add the working verification tool** to insurance sections — row 415: "*Add the submission tool like in verify insurance page*". `/verify-insurance` exists on the build (200) and has the tool; other pages have static insurance sections without it.
2. **Fix footer placement** — row 412: "*Remove Verify Insurance & Privacy policy from this section of the footer*" (they sit under "Areas We Serve").

**Context that makes this high-value:** production's homepage "Verify Insurance" button is a **404** (`/verify-insurance` does not exist on production). The new build fixes that. This task extends a working conversion path across the site — it is the highest-leverage P1 here.

**Steps**
1. Extract the `/verify-insurance` submission tool into a reusable component.
2. Place it on all 18 pages per Appendix A.
3. Move `Verify Insurance` and `Privacy Policy` out of the footer's "Areas We Serve" group into the correct group.
4. Confirm the form's third-party endpoint (CallTrackingMetrics, `264810.tctm.co`) is correct for **this** facility — production embeds the same form ID on 19 pages, and on production it is loaded **twice per page** (desktop + mobile duplicates). Do not carry that duplication forward.
5. Test an end-to-end submission and confirm the lead arrives.

**Acceptance criteria**
- [ ] All 29 rows closed
- [ ] Insurance module renders and submits on all 18 pages
- [ ] Loaded **once** per page, not twice
- [ ] Footer grouping corrected
- [ ] Live test submission received and confirmed routed to this facility

---

<a id="t-10"></a>
### T-10 · Widget & card linking — P1 · 30 rows

**Source:** Visual rows 418, 420, 424, 425, 433, 434, 440, 445, 452, 461, 462, 469, 470, 473, 479, 489, 497, 498, 506, 507, 525, 538, 548, 551, 565, 567, 583, 596, 605, 606 · ⚠️ unverified

Across 19 pages. Service/program cards render as text with **no link to the page they describe**:
> "*Missing links on the widgets to each service page*" · "*widgets should link to the program pages*" · "*needs links to the service pages mentioned in the widgets*"

This is a real internal-linking loss: the build's link graph is valid (0 broken links) but **sparse** — hub pages describe children without linking them, so crawl equity doesn't flow and users hit dead ends.

**Steps**
1. Make every service/program/therapy card a link to its page.
2. Row 489 (`/tour`): link each clinical-modality widget to its therapy type. **Note:** the therapy pages 404 on production (`/individual-therapy`, `/group-therapy`, `/cognitive-behavioral-therapy`, `/dialectical-behavior-therapy`, `/family-therapy`, `/trauma-informed-care`, `/emdr`) — confirm they exist in the build before linking, or this creates 7 new broken links.
3. Row 498: link to `/programs/dual-diagnosis`.
4. Re-run the link-integrity check from T-01 afterwards.

**Acceptance criteria**
- [ ] All 30 rows closed
- [ ] Every service/program card links to a **200** destination
- [ ] Therapy-page existence resolved before `/tour` widgets are linked
- [ ] 0 broken internal links after the change

---

<a id="t-11"></a>
### T-11 · Buttons & CTAs — P1 · 23 rows

**Source:** Visual rows 510, 515, 519, 526, 528, 541, 547, 552, 554, 558, 568, 571, 580, 585, 588, 595, 598, 601, 603, 607, 608, 610, 612 · ⚠️ unverified

Concentrated on the 7 condition pages plus the homepage. Three patterns:
- **"missing call button"** (rows 510, 528, 554, 571, 580, 610) — the phone CTA is absent from high-intent sections such as "Keeping Your Job While Seeking Help" and "Job Protection and FMLA".
- **"needs button link to the dual diagnosis page"** (526, 547, 552, 568, 585, 595, 598) — 7 pages describe dual-diagnosis care with no link to `/programs/dual-diagnosis`.
- **Homepage** — row 603 "Missing see more about us button"; row 610 missing call button.

Missing call buttons on FMLA/job-protection sections are the most costly: that reader is deep in consideration.

**Steps**
1. Add the phone CTA (`tel:+18883782158`) to all 6 flagged sections.
2. Add dual-diagnosis buttons on all 7 pages.
3. Restore the homepage "See More About Us" button — target `/about`, **not** `/about-us` (that 404s on production and is one of T-01's 12 bad hrefs).
4. Confirm every `tel:` link uses `888-378-2158`. Production uses this number consistently across all 34 pages; the **structured data on production still carries a stale `(888) 775-4566`** — do not reintroduce it.

**Acceptance criteria**
- [ ] All 23 rows closed
- [ ] Every `tel:` link resolves to `+18883782158`
- [ ] No page references `(888) 775-4566` in copy or schema
- [ ] All CTA destinations return 200

---

<a id="t-12"></a>
### T-12 · Google map embeds — P1 · 18 rows

**Source:** Visual rows 408, 419, 423, 429, 438, 448, 458, 465, 477, 485, 516, 530, 542, 559, 575, 589, 602, 613 · ⚠️ unverified

18 pages need a map: "*Needs a google map with the location pinned*". The new build has **no map embed at all** (verified — 0 matches).

**⚠️ Do not copy production's map.** I verified production's embed and it is broken on the pages that matter most:

| Production pages | Embed coordinates | Actual location |
|---|---|---|
| `/`, `/about`, `/admissions`, `/contact`, `/tour` | `38.1205, -92.5896` @ ~800 km span | **central Missouri** — ~250 mi away |
| `/programs/*`, `/what-we-treat/*` | `41.6680, -93.7045` @ neighbourhood zoom | correct area |

The facility is at **5820 Winwood Dr, Johnston, IA 50131 ≈ `41.687, -93.698`**. Production's Contact page shows a prospective patient a map of the wrong state.

**Steps**
1. Get a restricted Google Maps API key — per [CONTENT-NOTES.md](CONTENT-NOTES.md) item 4, the rebuild deliberately dropped production's exposed key. Restrict by HTTP referrer.
2. Build one reusable map component pinned to `41.687, -93.698` at street zoom.
3. Place on all 18 pages.
4. Lazy-load — production loads the map iframe **twice per page**; ship it once.
5. **Fix production's Missouri map now**, independently of launch. It is ~30 minutes and is actively costing calls.

**Acceptance criteria**
- [ ] All 18 rows closed
- [ ] Map pinned to the correct Johnston coordinates at street-level zoom on every page
- [ ] API key restricted by referrer and **not** committed to the repo
- [ ] One iframe per page, lazy-loaded
- [ ] Production's 5 wrong-location maps corrected

---

<a id="t-13"></a>
### T-13 · Cutover redirect map — P1

**Source:** New finding. V0116 logs this class of defect for 4 other facilities but **not for this one** — the gap is real and unlogged.

**Evidence** ✅ verified — sitemap diff, production vs new build, 2026-08-05

| New build URL | Production status | Action |
|---|---|---|
| `/verify-insurance` | **404** | New page — no redirect needed, submit to Search Console |
| `/areas-we-serve` | **404** | New hub — ditto |
| `/team` | **404** | New hub — ditto |
| `/team/bethany-hamilton` | **404** | New page — see T-26 |

| Production URL | In new build | Action |
|---|---|---|
| `/how-long-does-percocet-stay-in-your-system/` | ❌ | **Migrate** — T-04 |
| `/author/cpts/` | ❌ | 410 or redirect to `/blog` — intentional drop |
| `/category/uncategorized/` | ❌ | 410 or redirect to `/blog` — intentional drop |

Also required: `/team/welsey-starlin` is **misspelled** — ✅ now confirmed against the QHG bios doc, which uses "Wesley Starlin" throughout. Per [CONTENT-NOTES.md](CONTENT-NOTES.md) item 3 the typo was kept to preserve SEO. If renamed, a 301 is mandatory — and note production's `/about` already links to `/wesley-starlin` (the correct spelling), which **404s today**. So the correct-spelling URL is already being linked and already broken; renaming fixes an existing defect rather than creating redirect debt.

Add `/team/bethany-hamilton` to the "new URLs" set above — confirmed legitimate in T-26, so it needs Search Console submission, not a redirect.

**Steps**
1. Build the redirect map covering every row above plus all T-14/T-15/T-16/T-17 slug changes.
2. Decide the Welsey→Wesley rename; if yes, 301 the old slug.
3. Verify each redirect is a **single hop** to a 200 — no chains.
4. Submit the new sitemap at cutover.

**Acceptance criteria**
- [ ] Redirect map reviewed and committed
- [ ] Every production URL resolves post-cutover: 200, or one-hop 301 to a 200, or deliberate 410
- [ ] 0 redirect chains
- [ ] 4 new URLs submitted to Search Console
- [ ] Re-verified against live production within 24h of cutover

---

## 4. P2 — Structure & consistency

<a id="t-14"></a>
### T-14 · Geo-suffix slug policy — P2 · needs a decision, not a fix

**Source:** V0072 (`CONFIRMED_AMENDED`) + V0118 (unresolved contradiction) + Visual rows 442, 450, 459, 467, 502, 532, 533, 543, 560, 577

**The sheet contradicts itself here and the contradiction must be settled before anyone edits a slug.**

- **V0072** flags this facility's geo-suffixed slugs as a defect.
- **V0052** closed the *same pattern* on Marina Harbor as **by-design**.
- **V0118** was opened during verification specifically to record that "*Both cannot stand.*"

**Corrections the verification pass applied to V0072** — the original row overstated twice:
1. "Every program and condition slug" — **wrong: 11 of 14**, not 14. Three don't carry the suffix: `/programs/aftercare-and-alumni`, `/programs/dual-diagnosis`, and `/programs/des-moines-outpatient-rehab` (which uses a geo **prefix**). So the section mixes **three** naming patterns.
2. "No other site does this" — **wrong.** Marina Harbor has 3, Hillside has 1. This facility is the heaviest user, not the only one.

**Cost the row omits:** all 11 slugs exist on production. Renaming means 11 redirects on live, indexed URLs. V0072's proposed targets (`/treatment/detox`, `/what-we-treat/alcohol`) also imply T-15's `/programs`→`/treatment` move — a much larger change than the row implies.

**Steps**
1. **Decide one portfolio policy** on geo-suffixed service slugs, covering all 15 affected URLs across 3 facilities.
2. Update V0052 and V0072 in the sheet to match, closing V0118.
3. Only then execute — with 301s.
4. My recommendation: **keep the existing slugs.** They are indexed, they rank for geo-modified queries, and the sheet's own note confirms the rename carries redirect cost for zero measured benefit. Normalise *new* pages going forward instead.

**Acceptance criteria**
- [ ] Written policy covering all 15 URLs across the 3 facilities
- [ ] V0052, V0072, V0118 reconciled in the sheet
- [ ] If renaming: all 11 slugs 301'd single-hop, Visual rows 442/450/459/467/502/532/533/543/560/577 closed
- [ ] If keeping: all 10 Visual slug rows closed as **by-design** with the rationale recorded

---

<a id="t-15"></a>
### T-15 · `/programs` → `/treatment` hub — P2

**Source:** V0094 · `CONFIRMED` — "*Counts hold precisely*"

This facility is one of 3 outliers: `/treatment` on 8 sites, `/treatment-services` on Dallas, **`/programs` on Des Moines**, `/what-we-offer` on Marina Harbor.

**Caveats from the verification log:** the row accounts for 11 of 12 sites — Greater Texas has no treatment hub at all. And the sheet flags a caution on citing Ocean Coast as the reference build (V0109: 106 canonicals pointing at the homepage).

**Coupled to T-14** — decide both together, execute once.

**Steps**
1. Confirm the portfolio standard is `/treatment`.
2. Rename `/programs` → `/treatment` and all children.
3. 301 every old URL, single hop.
4. Update all internal links, sitemap, canonicals.

**Acceptance criteria**
- [ ] Decision recorded and coupled with T-14
- [ ] If executing: `/programs` and all children 301 single-hop to `/treatment/*`
- [ ] 0 internal links still pointing at `/programs/*`
- [ ] Sitemap and canonicals updated

---

<a id="t-16"></a>
### T-16 · Aftercare slug standard — P2

**Source:** V0095 · `CONFIRMED_AMENDED` (variant count corrected 7→6)

This facility's `/programs/aftercare-and-alumni` is 1 of 5 outliers from the proposed `/treatment/aftercare` standard. Folds into T-15 — same rename, same redirect.

**Acceptance criteria**
- [ ] Executed with T-15 or explicitly deferred with rationale
- [ ] If renamed: 301 in place, internal links and sitemap updated

---

<a id="t-17"></a>
### T-17 · Blog URL pattern — P2

**Source:** V0101 · `CONFIRMED_AMENDED`

This facility uses **root-level post URLs** (`/how-long-does-percocet-stay-in-your-system`), 1 of 4 sites doing so. Proposed standard: `/blog/slug`.

Root-level posts **collide with page slugs** — a real namespace risk as more pages are added.

Only 2 posts exist, so this is cheap now and expensive later. Note T-04: one of the two is currently missing from the build entirely.

**Steps**
1. Move both posts to `/blog/<slug>`.
2. 301 the root-level URLs.
3. Confirm the blog index lists both.

**Acceptance criteria**
- [ ] Both posts at `/blog/<slug>` returning 200
- [ ] Root-level URLs 301 single-hop
- [ ] Both listed on `/blog`
- [ ] Sitemap updated

---

<a id="t-18"></a>
### T-18 · Section order / merge / remove — P2 · 20 rows

**Source:** Visual rows 437, 441, 444, 447, 455, 456, 463, 464, 472, 482, 486, 495, 513, 529, 539, 557, 573, 587, 600, 604 · ⚠️ unverified

Three sub-patterns:

**(a) "Medically Reviewed By Wesley Starlin, LMHC" is mid-page — 13 rows** (437, 444, 456, 463, 472, 482, 513, 529, 539, 557, 573, 587, 600)
> "*should be on the top of the page instead of randomly placed in the middle*"

This is the most-repeated single complaint in the entire 206. For YMYL medical content the reviewer byline belongs directly under the `h1` — that is where both readers and E-E-A-T assessment expect it. **Fix once in the page template**, not 13 times.

> ⚠️ **Blocked on [T-29](#t-29).** The byline currently names an LMHC as the *medical* reviewer of detox and withdrawal content, and the correct reviewer may change. Settle who is named before moving where it sits, or this gets done twice.

**(b) "Levels Of Care" duplicates an adjacent section — 5 rows** (447, 455, 464 + 441, 495)
> "*remove section or merge with [the adjacent continuum-of-care section]*"

**(c) Ordering** — 486 (`/team`: intro above the member list, since it says "select any team member below"), 604 (homepage: swap two sections), 495 (`/what-we-treat`: make "Targeted Solutions" first).

**Steps**
1. Move the reviewer byline into the template, rendering under the `h1` on all 13 pages.
2. Resolve the 5 "Levels Of Care" duplications — merge or remove per row.
3. Apply the 3 ordering changes.

**Acceptance criteria**
- [ ] All 20 rows closed
- [ ] Byline directly below `h1` on all 13 pages, via **one** template change
- [ ] No page shows two overlapping levels-of-care sections
- [ ] `/team` intro precedes the member list

---

<a id="t-19"></a>
### T-19 · Des Moines vs Johnston locality claims — P2

**Source:** V0071 · `CONFIRMED_AMENDED` — **and the sheet's original fix instruction was wrong**

**What verification actually established** ✅ (I confirmed independently)
- NAP is **already consistent** everywhere: build homepage, build `/contact`, production `/contact`, and JSON-LD (`addressLocality: "Johnston"`). Production shows `5820 Winwood Dr, Johnston, IA 50131` in 37 places with one formatting variant.
- **The row's fix — "Align NAP across the site, production domain and GBP" — is wrong. There is nothing to align.**

> "*NAP is already aligned on all three surfaces tested. Nothing to align. The real action is correcting the locality claims in body copy and deciding the brand-versus-location position.*"

**The actual defect:** body copy asserts "**Located in** Des Moines" once and "**heart of** Des Moines" once, with "in Des Moines" 7× against "Johnston" 1×. A direct locality claim contradicting the verified address.

**Steps**
1. Rewrite the two direct claims to be accurate — e.g. "serving Des Moines from our Johnston campus".
2. Decide the brand-vs-location position: the brand targets Des Moines, the facility is in Johnston. Both can be true if the copy says so precisely.
3. Leave NAP and schema **unchanged** — they are correct.
4. Confirm Google Business Profile matches (not verifiable from here — needs GBP access).

**Acceptance criteria**
- [ ] No page claims the facility is *located in* Des Moines
- [ ] Proximity framing applied consistently
- [ ] NAP and schema untouched and still consistent across all surfaces
- [ ] GBP locality confirmed as Johnston by someone with access

---

## 5. P3 — Polish

<a id="t-20"></a>
### T-20 · Text casing — P3 · 10 rows
**Rows:** 471, 475, 483, 508, 514, 517, 549, 553, 576, 581 · ⚠️ unverified

Two directions, so read each row — don't bulk-apply:
- **Needs uppercase:** 471 "LOCAL EXCELLENCE in Iowa", 475 "TAKE THE NEXT STEP today", 483 "your RECOVERY STARTS HERE"
- **Over-capitalised:** 553 + 581 "IOWA" → "Iowa"; 576 "START" → "Start"; 549 "addiction treatment" needs initial caps

- [ ] All 10 rows closed, each read individually

---

<a id="t-21"></a>
### T-21 · Imagery & team photos — P3 · 6 rows
**Rows:** 409, 414, 487, 490, 494, 497 · ⚠️ unverified

- 414 (`/about`): use a real facility photo, not stock
- 409 (`/about`): build the "Faces Behind Your Care" section **with staff photos**
- 487, 490 (`/team`): staff photos — ✅ I verified the team pages currently carry **no staff images at all**, only logos
- 494 (`/tour`): "Take the virtual tour" section with facility video

Real facility and staff imagery is a meaningful trust signal for this vertical.

- [ ] All 6 rows closed
- [ ] Every team member has a photo
- [ ] No stock imagery presented as the facility

---

<a id="t-22"></a>
### T-22 · Tour link & facility video — P3 · 5 rows
**Rows:** 410, 428, 478, 494, 608 · ⚠️ unverified

Pages describe the facility without linking `/tour`. **Target `/tour`** — production's residential page links `http://tour`, a malformed URL that resolves to nothing, and that string is still in this repo (T-01).

- [ ] All 5 rows closed, all pointing at `/tour` (200)
- [ ] No `http://tour` anywhere in the repo

---

<a id="t-23"></a>
### T-23 · Header & footer corrections — P3 · 3 rows
**Rows:** 411, 412, 413 · ⚠️ unverified

- **411** — footer copy must read exactly: *"Des Moines Wellness Center provides full-spectrum addiction treatment in Des Moines, from medical detox and residential rehab to outpatient care, using structured, evidence-based approaches."*
  ⚠️ Cross-check against T-19 — this sanctioned text says "in Des Moines" while the facility is in Johnston. Reconcile before shipping.
- **412** — remove Verify Insurance & Privacy Policy from the footer's "Areas We Serve" group (also in T-09)
- **413** — add a Verify Insurance button to the header

- [ ] All 3 rows closed
- [ ] Footer copy reconciled with T-19
- [ ] Header CTA present sitewide

---

<a id="t-24"></a>
### T-24 · Blog content gap — P3 · 1 row
**Row:** 430 — "*add the missing blogs from the site*"

Production has 2 posts; the build has 1. Overlaps T-04 and T-17 — close all three together.

- [ ] Both production posts present at `/blog/<slug>` with full content parity

---

<a id="t-25"></a>
### T-25 · Raw URLs exposed — P3 · 1 row
**Row:** 473 (`/programs/php-des-moines`) — "*Remove raw urls, link the widgets to the raw urls*"

Bare URL strings rendering as visible text. Note the local repo has the same pattern — `"text": "https://desmoinesrecovery.com/outpatient-program-des-moines"` appears in 3 content files, and **that URL 404s on production.**

- [ ] No raw URL strings in visible copy
- [ ] Widgets link to their destinations with proper anchor text
- [ ] No content file contains a bare `desmoinesrecovery.com` URL as display text

---

<a id="t-26"></a>
### T-26 · Credentials, job titles, staff verification — P3
**Row:** 488 — "*missing job titles, Wesley Starlin, LMHC*" · **now resolvable against the QHG bios doc**

**✅ RESOLVED — `/team/bethany-hamilton` is legitimate.** My earlier open question is closed. The bios doc lists **"Bethany Hamilton, RCS, CMA - Case Manager"** under Des Moines Recovery, and her three-paragraph bio matches the build's page **verbatim**. She is a sanctioned team member who postdates production's content snapshot — the build is correct and production is simply behind. No V0054-style wrong-person risk here. **Only the photo is still outstanding.**

**✅ RESOLVED — the spelling is "Wesley".** The doc uses "Wesley Starlin" throughout, confirming `/team/welsey-starlin` is a genuine typo in the slug. Display copy across the build and production already reads "Wesley" correctly. See T-13 for the rename + 301 decision.

**(a) Authoritative titles — `/team` index shows only 1 of 5.** ✅ verified: the index lists all five names but surfaces only "Director of Operations". Individual bio pages correctly show all five roles, so this is an index-template gap, not missing data.

| Person | Official title (per doc) | Credentials |
|---|---|---|
| Wesley Starlin | **Executive Director** | LMHC — *see T-29 before using this in a review byline* |
| Lacey Stielow | **Director of Nursing** | MSN, RN |
| Parneet "Pam" Sahota | **Clinical Director** | MA, LMHC, IADC, CCMHC, SAP · EMDR-trained · DBT-certified · PhD (Traumatology) in progress |
| Alexander "Alex" Maddux | **Director of Operations** | — |
| Bethany Hamilton | **Case Manager** | RCS, CMA |

**(b) Sahota's `<title>` truncates her credentials.** The `h1` reads "Parneet "Pam" Sahota, MA, LMHC, IADC, CCMHC" but the page `<title>` reads only "MA, LMHC" — dropping IADC and CCMHC. She is the most credentialed clinician on the team; the title tag undersells her. The doc also lists **SAP, EMDR-trained, DBT-certified and a PhD in Traumatology in progress**, none of which appear anywhere on the site — worth adding to her bio for E-E-A-T on the clinical pages.

- [ ] All 5 job titles rendered on the `/team` index, matching the doc exactly
- [ ] Sahota's `<title>` carries her full credential string, consistent with her `h1`
- [ ] Sahota's additional credentials (SAP, EMDR, DBT, PhD in progress) added to her bio
- [ ] Bethany Hamilton photo added, or page unpublished pending one
- [ ] Display spelling "Wesley" used consistently; slug decision recorded in T-13

---

<a id="t-27"></a>
### T-27 · Resource links — P3 · 3 rows
**Rows:** 418, 572, 599 · ⚠️ unverified

- **418** (`/admissions`) — "*Missing clickable links to local support resources & national resources, remove the link from the widget and make the text on each widget a clickable link*"
- **572** (`/what-we-treat/fentanyl-rehab-des-moines`), **599** (`/what-we-treat/prescription-drug-rehab-des-moines`) — "*use the links provided in the original site page*"

Recover the destinations from production, since the build dropped them.

- [ ] All 3 rows closed
- [ ] Every resource link resolves 200 (external links included — check for link rot)
- [ ] `rel="noopener"` on any `target="_blank"`

---

<a id="t-28"></a>
### T-28 · QHG parent site — our location page & referral link — P2

**Source:** V0090, V0091 (logged under *Quadrant Health Group (parent)*) + Visual rows 856, 1083, 1084 (same) — **all five reference this facility and were missed by a facility-column filter.**

**Not our repo, but it is our facility's discoverability.** These sit with the parent-site team; they are tracked here so they don't fall between owners.

| Row | Issue | Detail |
|---|---|---|
| **V0090** | Parent's locations index covers only 9 of 11 facilities | **Des Moines Wellness Center** and Greater Texas have no location page. Fix: build `quadrant-health-group.vercel.app/locations/des-moines-wellness-center` |
| **V0091** | Parent's locations page has **no outbound links to any facility website** | Only social links. Fix list explicitly includes `https://desmoinesrecovery.com` |
| **Visual 1084** | "Des Moines location page is not complete" | "Shows as coming soon" — the visual pass found the same gap as V0090 |
| **Visual 1083** | Parent's Des Moines entry needs a link to our site | "Add a button link next to the call and verify insurance button to their website" |
| **Visual 856** | Parent's team page needs staff grouped by facility | Requires an "Iowa Facilities > Des Moines Wellness Center" grouping |

**Why it matters:** the parent site currently presents our facility as "coming soon" with no link to `desmoinesrecovery.com`. That is a lost referral path and a weak trust signal from the group's own site.

**Steps**
1. Raise V0090, V0091 and Visual 856/1083/1084 with the QHG parent-site owner. Confirm who owns them.
2. Supply the content needed for `/locations/des-moines-wellness-center`: NAP (**Johnston**, per T-19), phone `888-378-2158`, programs list, imagery.
3. Confirm the outbound link target and the "coming soon" state is removed at or before our cutover.
4. Confirm the Iowa grouping on the parent's team page.

**Acceptance criteria**
- [ ] Owner identified and the 5 rows accepted by the parent-site team
- [ ] `/locations/des-moines-wellness-center` live, no "coming soon"
- [ ] Outbound link to our production domain present and correct
- [ ] Locality shown as Johnston, consistent with T-19
- [ ] Iowa facilities grouping present on the parent's team page

---

## 6. Definition of done

**Per task:** every acceptance checkbox ticked, changes on a branch, reviewed, deployed to preview, re-verified on the preview URL.

**Launch gate — all must pass:**

- [ ] T-01 through T-13 closed (all P0 + P1)
- [ ] T-14 through T-19 and T-28 have a **recorded decision**, executed or explicitly deferred
- [ ] All 206 Appendix A rows ticked or closed with a documented reason
- [ ] Link integrity: 0 broken internal links (repo **and** deployed build)
- [ ] Sitemap: all URLs 200, no redirects, canonical form consistent (T-03)
- [ ] Content parity: no production URL missing from the build except the 2 intentional taxonomy drops
- [ ] Redirect map verified against live production, 0 chains
- [ ] LegitScript claim matches documented certificate status (T-02)
- [ ] No wrong-substance copy on any condition page (T-05)
- [ ] Content diff re-run <24h before cutover (T-04)

**Verification commands**

```bash
# Link integrity across content JSON
grep -rho '"href"[[:space:]]*:[[:space:]]*"[^"]*"' content/ | sort -u

# Sitemap URLs must be 200 with no redirect
curl -s https://desmoinesrecovery.com/sitemap_index.xml

# Trailing-slash convention
curl -sI https://desmoinesrecovery.com/about  | head -1   # expect 301
curl -sI https://desmoinesrecovery.com/about/ | head -1   # expect 200

# Production vs build content diff (T-04 gate)
# compare production sitemap paths against the build's sitemap.xml
```

---

## 7. Appendix B — Sheet rows reviewed and **not** applicable

Each portfolio-wide row was checked against this facility rather than assumed to apply.

| Row | Subject | Why not applicable |
|---|---|---|
| **V0096** | verify-insurance slug | This facility is the **reference build** — already on the `/verify-insurance` standard. Absent on 5 others. No action. |
| **V0097** | About slug | Already on `/about`. Only Dallas, Fort Worth, Greater Texas need renaming. No action. |
| **V0098** | Contact slug | Already on `/contact`. Outliers are Dallas, Fort Worth, Marina Harbor. No action. |
| **V0100** | Privacy policy | Has `/privacy-policy` live **and** in sitemap — one of 8 correct sites. Only Greater Texas has a real gap. No action here. |
| **V0103** | `/contact` → JPEG | Verified on all 12 production domains: only Dallas and Fort Worth. This facility's `/contact` behaves correctly. No action. |
| **V0116** | Preview↔production slug drift | This facility not among the 4 named. **But** I found unlogged drift of the same class — captured as **T-13**. |
| **V0042** | Robots-meta inconsistency (Fort Worth) | Cites Des Moines among the 5 sites correctly serving `index, follow`. **Confirms our config is right — no action, don't regress.** |
| **Broken Internal Links tab** | 29 rows | 0 rows for this facility. Re-verified: 34/34 internal targets return 200 on the preview. |
| **Visual Issues rows 1501–1810** | 310 rows | ID-only placeholder rows, verified to contain no content in any other column. Nothing lost. |

---

## 7b. Appendix D — Cross-referenced rows (found only by full-text search)

Filtering on the Facility column alone **misses these**: rows filed under another facility that reference ours. I re-scanned all 5 tabs for `des[- ]moines|desmoinesrecovery` and reconciled every hit.

### Actioned — folded into T-28

| Row | Filed under | Relevance |
|---|---|---|
| V0090 | QHG parent | Our facility has no location page on the parent site |
| V0091 | QHG parent | Parent's locations page has no link to `desmoinesrecovery.com` |
| Visual 856 | QHG parent | Parent team page needs "Iowa Facilities > Des Moines Wellness Center" |
| Visual 1083 | QHG parent | Parent's Des Moines entry needs a website button |
| Visual 1084 | QHG parent | "Des Moines location page is not complete — shows as coming soon" |

### Our build cited as the portfolio's **correct** model — protect these

Seven rows (**V0047, V0053, V0077, V0081, V0085, V0088, V0093**) cite `des-moines-wellness-center-navy.vercel.app/about` as the reference example for correct `og:url` — "*og:url matches the page's own URL*". Our build is the standard the other 7 facilities are being corrected against.

- [ ] **Regression guard:** verify `og:url` still equals each page's own canonical URL after T-03's trailing-slash change. Changing the slash convention will alter every `og:url`; the portfolio depends on ours staying correct.

### Verification-log entries about other facilities that inform our tasks

| Row | Bearing on our work |
|---|---|
| **V0023** (Dallas) | The **twin** of our V0071, same generator block. There, body copy says "Located in Dallas TX" while JSON-LD says Weatherford — *copy contradicts schema*. For us, verification confirmed **our schema is correct** (Johnston) and only the copy is wrong. Confirms T-19's scope: fix copy, leave schema alone. |
| **V0076** (Seaside) | Explicitly ranks the LegitScript cases: "*Unlike Des Moines (V0070), Seaside DOES hold a seal image and its verify link is simply missing rather than pointing at the wrong domain. So this is lower severity than V0070.*" → **Ours is the most severe LegitScript exposure in the portfolio.** Reinforces T-02 as P0. |
| **V0040** (Fort Worth) | Confirms Des Moines `/about` serves a correct `og:url`. Supports the regression guard above. |

---

## 8. Appendix C — Findings not in the sheet

Discovered while verifying. All confirmed against live URLs on 2026-08-05.

| # | Finding | Severity | Task |
|---|---|---|---|
| 1 | ~~**This repo has diverged from the deployed build**~~ — **AMENDED & CLOSED 2026-08-05.** The 12 hrefs were real but all sat in the unrendered `PageModel.ctas[]` field, so the deployed build and this repo had identical, clean link graphs; the repo was merely 8 commits behind. Not a blocker. Fixed + CI guard added. | ~~Blocker~~ → **Closed** | T-01 |
| 2 | **The build's `sitemap.xml` emits production hostnames in slashless form** — production 301s all 34. Compounds V0102. | **Critical** | T-03 |
| 3 | **2 additional wrong-substance blocks** on `/what-we-treat/cocaine-rehab-des-moines` ("Medical **Alcohol** Detox in Des Moines", "Step 1 Of **Alcohol** Addiction Recovery") — sheet logged 5, actual is 7. | **Critical** | T-05 |
| 4 | **`FAQPage` schema regression** — production has it on 2 pages, the new build had it on **0 of 35**. Not logged anywhere. **Schema half fixed 2026-08-05**: `FaqJsonLd` now emits on all 4 pages that currently carry FAQ content. The remaining T-07 work is the FAQ *content* rebuild (only 4 of 35 pages have any FAQs, after 68 entries were dropped in migration) — schema will follow automatically as content lands. | High | T-07 (content only) |
| 5 | **Production's Google Maps embed points to central Missouri** on `/`, `/about`, `/admissions`, `/contact`, `/tour` — ~250 mi from the facility. Do not copy it forward; fix it on production now. | High | T-12 |
| 6 | **Production's `MedicalClinic` schema carries a stale phone** `(888) 775-4566` against `(888) 378-2158` in all visible copy. Matches CONTENT-NOTES item 6 — still live. | High | T-11 |
| 7 | **`/team/bethany-hamilton` is new and uncorroborated** — not on production, no photo. Verify before launch; V0054 (wrong-person bio) is rated CRITICAL elsewhere in this portfolio. | Medium | T-26 |
| 8 | **Sanctioned footer copy (row 411) conflicts with T-19** — it says "in Des Moines" while the verified address is Johnston. | Medium | T-23 |
| 9 | Production's Joint Commission **Gold Seal image 404s on all 34 pages** (99 `<img>` tags, all `alt=""`). The rebuild self-hosts it correctly — **do not regress this.** | Medium | — |
| 10 | Typo **"addiciton"** in display copy on `/what-we-treat/fentanyl-rehab-des-moines`. | Low | T-05 |

---
## Appendix A — All 206 visual issues, grouped by page

Every row from the **Visual Issues** tab for this facility (sheet IDs 408–613), verbatim `Fix` text, with the repo file that owns the change. Tick as completed.


### `/what-we-treat/alcohol-rehab-des-moines` — 17 issues
Content file: [content/pages/what-we-treat__alcohol-rehab-des-moines.json](content/pages/what-we-treat__alcohol-rehab-des-moines.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 501 | Let Your Insurance Support Your Recovery | needs insurance icons | Insurance module |
| [ ] | 502 | url clean up, for /alcohol-rehab-des-moines | remove des-moines | Slug cleanup |
| [ ] | 503 | Common Red Flags of Alcoholism | Missing paragraph from original page | Missing body copy |
| [ ] | 504 | Managing Alcohol Withdrawal Symptoms Safely: | Missing paragraph from original page | Missing body copy |
| [ ] | 505 | Fixing the Roots of Alcohol Addiction in Des Moines, Iowa | Missing paragraph from original page | Missing body copy |
| [ ] | 506 | Fixing the Roots of Alcohol Addiction in Des Moines, Iowa | Each widget needs to be linked to the therapy type | Widget & card linking |
| [ ] | 507 | Alcohol Treatment & Dual Diagnosis | needs link to the dual diagnosis page | Widget & card linking |
| [ ] | 508 | THE WAY WE HEAL alcohol addiction | should be all capital | Text casing |
| [ ] | 509 | Our Approach to Alcohol Recovery in Des Moines, Iowa | Missing paragraph from original page | Missing body copy |
| [ ] | 510 | Keeping Your Job While Seeking Help | missing call button | Buttons & CTAs |
| [ ] | 511 | Recovery Resources in Des Moines and Across Iowa | Missing paragraph from original page | Missing body copy |
| [ ] | 512 | Frequently Asked Questions | should be an accordian tool format, only contains answers & missing questions | FAQ / accordion rebuild |
| [ ] | 513 | Medically Reviewed By Wesley Starlin, LMHC | should be at the top of the page | Section order / merge / remove |
| [ ] | 514 | TAKE THE FIRST STEP now | should be all capital | Text casing |
| [ ] | 515 | Start Your Alcohol Recovery Journey in Des Moines | missing call button & verify your insurance button | Buttons & CTAs, Insurance module |
| [ ] | 516 | Let’s Build a Life You Don’t Need to Escape | Needs a google map with the location pinned | Google map embed |
| [ ] | 517 | START Your Recovery Today | should be all capital | Text casing |

### `/what-we-treat/drug-rehab-des-moines` — 17 issues
Content file: [content/pages/what-we-treat__drug-rehab-des-moines.json](content/pages/what-we-treat__drug-rehab-des-moines.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 543 | url clean up, for /drug-rehab-des-moines | remove des-moines | Slug cleanup |
| [ ] | 544 | Let Your Insurance Support Your Recovery | needs insurance icons | Insurance module |
| [ ] | 545 | Medical Drug Detox In Des Moines: Manage Withdrawal Safely | Missing paragraph from original page | Missing body copy |
| [ ] | 546 | Managing Drug Withdrawal Symptoms Safely: | Missing paragraph from original page | Missing body copy |
| [ ] | 547 | Managing Drug Withdrawal Symptoms Safely: | needs button link to detox program | Buttons & CTAs |
| [ ] | 548 | What Drug Rehab in Des Moines Looks Like | widgets need links to the treatment type pages | Widget & card linking |
| [ ] | 549 | Evidence-Based Therapies For Drug addiction treatment | addiction treatment needs the first letters capitalized | Text casing |
| [ ] | 550 | Evidence-Based Therapies For Drug addiction treatment | Missing paragraph from original page | Missing body copy |
| [ ] | 551 | Evidence-Based Therapies For Drug addiction treatment | widgets need links to the treatment type pages | Widget & card linking |
| [ ] | 552 | Drug Addiction and Dual Diagnosis Treatment | needs button link to the dual diagnosis page | Buttons & CTAs |
| [ ] | 553 | Why Choose Our Drug Rehab in Des Moines, IOWA | Iowa should not be fully capitalized, only capitalize the I | Text casing |
| [ ] | 554 | Go to Drug Rehab Without Losing Your Job | missing call button | Buttons & CTAs |
| [ ] | 555 | Drug Addiction Recovery Resources In Des Moines and Broader Iowa | Missing sentence from original page | Missing body copy |
| [ ] | 556 | Missing Frequently asked questions | Use the faqs from the original page | FAQ / accordion rebuild |
| [ ] | 557 | Medically Reviewed By Wesley Starlin, LMHC | should be at the top of the page | Section order / merge / remove |
| [ ] | 558 | Drug Rehab in Des Moines, IA: Get Help Today | missing call button & verify your insurance button | Buttons & CTAs, Insurance module |
| [ ] | 559 | Let’s Build a Life You Don’t Need to Escape | Needs a google map with the location pinned | Google map embed |

### `/what-we-treat/fentanyl-rehab-des-moines` — 17 issues
Content file: [content/pages/what-we-treat__fentanyl-rehab-des-moines.json](content/pages/what-we-treat__fentanyl-rehab-des-moines.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 560 | url clean up, for /fentanyl-rehab-des-moines | remove des-moines | Slug cleanup |
| [ ] | 561 | Let Your Insurance Support Your Recovery | needs insurance icons | Insurance module |
| [ ] | 562 | Common Red Flags of Fentanyl Use | Missing paragraph from original page | Missing body copy |
| [ ] | 563 | Step 1 Of Alcohol Addiction Recovery | references Alcohol, change to Fentanyl | Wrong-substance copy |
| [ ] | 564 | Medical Fentanyl Detox in Des Moines | Missing paragraph from original page | Missing body copy |
| [ ] | 565 | Missing section from original page: Managing Fentanyl Withdrawal Symptoms Safely: | add section in the Medical Fentanyl Detox in Des Moines spot, above the widgets | Widget & card linking |
| [ ] | 566 | Fixing the Roots of Alcohol Addiction in Des Moines, Iowa | references Alcohol, change to Fentanyl | Wrong-substance copy |
| [ ] | 567 | Fixing the Roots of Alcohol Addiction in Des Moines, Iowa | widgets need links to the treatment type pages | Widget & card linking |
| [ ] | 568 | Fentanyl Addiction and Dual Diagnosis | needs button link to the dual diagnosis page | Buttons & CTAs |
| [ ] | 569 | Our Approach to Fentanyl Addiction Recovery in Iowa | Missing paragraph from original page | Missing body copy |
| [ ] | 570 | THE WAY WE HEAL alcohol addiciton | references Alcohol, change to Fentanyl | Wrong-substance copy |
| [ ] | 571 | Job Protection and FMLA for Fentanyl Addiction Treatment | missing call button | Buttons & CTAs |
| [ ] | 572 | Fentanyl & Addiction Resources | use the links provided in the original site page | Resource links |
| [ ] | 573 | Medically Reviewed By Wesley Starlin, LMHC | should be at the top of the page | Section order / merge / remove |
| [ ] | 574 | Missing Frequently asked questions | Use the faqs from the original page | FAQ / accordion rebuild |
| [ ] | 575 | Let’s Build a Life You Don’t Need to Escape | Needs a google map with the location pinned | Google map embed |
| [ ] | 576 | START Your Recovery Today | Start shouldnt be fully capitalized, only Capital the S | Text casing |

### `/what-we-treat/benzo-rehab-des-moines` — 15 issues
Content file: [content/pages/what-we-treat__benzo-rehab-des-moines.json](content/pages/what-we-treat__benzo-rehab-des-moines.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 518 | Let Your Insurance Support Your Recovery | needs insurance icons | Insurance module |
| [ ] | 519 | Let Your Insurance Support Your Recovery | missing call button & verify your insurance button | Buttons & CTAs, Insurance module |
| [ ] | 520 | Verify Your Insurance button | remove floating verify your insurance button | Insurance module |
| [ ] | 521 | What Benzodiazepine Addiction Looks Like | Missing paragraph from original page | Missing body copy |
| [ ] | 522 | Managing Alcohol Withdrawal Symptoms Safely: | refrencing alcohol when it should be benzo | Wrong-substance copy |
| [ ] | 523 | Managing Alcohol Withdrawal Symptoms Safely: | Missing paragraph from original page | Missing body copy |
| [ ] | 524 | Treating the Root Causes of Benzo Addiction in Des Moines, Iowa | Missing paragraph from original page | Missing body copy |
| [ ] | 525 | Treating the Root Causes of Benzo Addiction in Des Moines, Iowa | widgets need links to the treatment type pages | Widget & card linking |
| [ ] | 526 | Dual Diagnosis Treatment for Benzo Addiction | needs button link to the dual diagnosis page | Buttons & CTAs |
| [ ] | 527 | Our Approach to Benzo Rehab in Des Moines, Iowa | Missing paragraph from original page | Missing body copy |
| [ ] | 528 | Job Protection and FMLA During Benzo Rehab | missing call button | Buttons & CTAs |
| [ ] | 529 | Medically Reviewed By Wesley Starlin, LMHC | should be at the top of the page | Section order / merge / remove |
| [ ] | 530 | Getting to Treatment in Des Moines, Iowa | Needs a google map with the location pinned | Google map embed |
| [ ] | 531 | Missing Most Frequently asked questions | Use the faqs from the original page | FAQ / accordion rebuild |
| [ ] | 532 | url clean up, for /benzo-rehab-des-moines | remove des-moines | Slug cleanup |

### `/what-we-treat/meth-rehab-des-moines` — 14 issues
Content file: [content/pages/what-we-treat__meth-rehab-des-moines.json](content/pages/what-we-treat__meth-rehab-des-moines.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 577 | url clean up, for /meth-rehab-des-moines | remove des-moines | Slug cleanup |
| [ ] | 578 | Let Your Insurance Support Your Recovery | needs insurance icons | Insurance module |
| [ ] | 579 | Recognizing the Signs: When to Seek Help | Missing top and botton paragraph from original page | Missing body copy |
| [ ] | 580 | Recognizing the Signs: When to Seek Help | missing call button | Buttons & CTAs |
| [ ] | 581 | Medical Detox for Methamphetamine in Des Moines, IOWA | Iowa should not be fully capitalized, only capitalize the I | Text casing |
| [ ] | 582 | Medical Detox for Methamphetamine in Des Moines, IOWA | Missing paragraph from original page | Missing body copy |
| [ ] | 583 | One Location. Every Level of Care. | widgets need links to the treatment type pages | Widget & card linking |
| [ ] | 584 | Evidence-Based Therapies for Meth Recovery | Missing top and botton paragraph from original page | Missing body copy |
| [ ] | 585 | Meth addiction Treatment & Dual Diagnosis | needs button link to the dual diagnosis page | Buttons & CTAs |
| [ ] | 586 | Local Iowa Resources for Methamphetamine Recovery | Missing paragraph from original page | Missing body copy |
| [ ] | 587 | Medically Reviewed By Wesley Starlin, LMHC | should be at the top of the page | Section order / merge / remove |
| [ ] | 588 | Cocaine Rehab and Detox in Des Moines, Iowa | missing call button & verify your insurance button | Buttons & CTAs, Insurance module |
| [ ] | 589 | Let’s Build a Life You Don’t Need to Escape | Needs a google map with the location pinned | Google map embed |
| [ ] | 590 | Cocaine Rehab and Detox in Des Moines, Iowa | references Cocaine, change to Meth | Wrong-substance copy |

### `/programs/des-moines-outpatient-rehab` — 12 issues
Content file: [content/pages/programs__des-moines-outpatient-rehab.json](content/pages/programs__des-moines-outpatient-rehab.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 431 | Most Major Private Insurance Plans Accepted | Needs the insurance icons | Insurance module |
| [ ] | 432 | PHP vs. IOP: Choosing the Right Level of Support | missing paragraph used in the original site | Missing body copy |
| [ ] | 433 | PHP vs. IOP: Choosing the Right Level of Support | Bullet points on the widgets need to be structured | Widget & card linking |
| [ ] | 434 | Outpatient Programs: The Last Step In Your Recovery from Addiction | needs links to the service pages mentioned in the widgets | Widget & card linking |
| [ ] | 435 | Convenient Access for Central Iowa | missing bullet points | Missing body copy |
| [ ] | 436 | Missing FAQs | add faqs from the main page | FAQ / accordion rebuild |
| [ ] | 437 | Medically Reviewed By Wesley Starlin, LMHC | should be on the top of the page instead of randomly placed in the middle | Section order / merge / remove |
| [ ] | 438 | Secure Your Private Clinical Assessment | Needs a google map with the location pinned | Google map embed |
| [ ] | 439 | Expert-led Outpatient Addiction Treatment Programs in Iowa | needs a verify your insurance button | Insurance module |
| [ ] | 440 | Levels Of Care | remove the raw links, make each widget a clickable link to the raw links instead | Widget & card linking |
| [ ] | 441 | Convenient Access for Central Iowa | merge this section with ""Secure Your Private Clinical Assessment" | Section order / merge / remove |
| [ ] | 442 | url clean up, for /des-moines-outpatient-rehab | remove des-moines, leave as outpatient rehab | Slug cleanup |

### `/what-we-treat/prescription-drug-rehab-des-moines` — 12 issues
Content file: [content/pages/what-we-treat__prescription-drug-rehab-des-moines.json](content/pages/what-we-treat__prescription-drug-rehab-des-moines.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 591 | Prescription Drug Rehab in Des Moines, Iowa | Missing paragraph from original page | Missing body copy |
| [ ] | 592 | Let Your Insurance Support Your Recovery | needs insurance icons | Insurance module |
| [ ] | 593 | Signs of Prescription Drug Dependency | Missing paragraph from original page | Missing body copy |
| [ ] | 594 | Managing Prescription Drug Withdrawal Symptoms Safely: | Missing paragraph from original page | Missing body copy |
| [ ] | 595 | Managing Prescription Drug Withdrawal Symptoms Safely: | needs button link to detox program | Buttons & CTAs |
| [ ] | 596 | Sustaining Recovery Through Every Stage in Des Moines, Iowa | widgets need links to the treatment type pages | Widget & card linking |
| [ ] | 597 | Evidence-Based Clinical Modalities for Drug Rehab | should be an accordian tool format, only contains answers & missing treatment types | FAQ / accordion rebuild |
| [ ] | 598 | Dual Diagnosis: Treating the Root of Dependency | needs button link to the dual diagnosis page | Buttons & CTAs |
| [ ] | 599 | Recovery Resources in Des Moines and Across Iowa | use the links provided in the original site page | Resource links |
| [ ] | 600 | Medically Reviewed By Wesley Starlin, LMHC | should be at the top of the page | Section order / merge / remove |
| [ ] | 601 | Prescription Drug Addiction Treatment in Des Moines | missing call button & verify your insurance button | Buttons & CTAs, Insurance module |
| [ ] | 602 | Let’s Build a Life You Don’t Need to Escape | Needs a google map with the location pinned | Google map embed |

### `/` — 11 issues
Content file: [content/pages/home.json](content/pages/home.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 603 | Iowa's Trusted Destination for Quality Addiction Treatment | Missing see more about us button | Buttons & CTAs |
| [ ] | 604 | Accredited Drug & Alcohol Addiction Rehab in Iowa | Swap section with They Trusted Us. So Can You. | Section order / merge / remove |
| [ ] | 605 | Personalized Rehab Programs in the Heart of Iowa | widgets need links to the treatment type pages | Widget & card linking |
| [ ] | 606 | Expert Care for Complex Substance Use Disorders in Iowa | widgets need links to the rehab type pages | Widget & card linking |
| [ ] | 607 | Specialized Dual Diagnosis Treatment in Des Moines, Iowa | needs button link to the dual diagnosis page | Buttons & CTAs |
| [ ] | 608 | Take a Virtual Tour of Des Moines Wellness Center | Needs button link to take virtual tour page | Buttons & CTAs, Tour link / video |
| [ ] | 609 | Specialized Therapeutic Approaches for Lasting Change | Missing paragraph from original page | Missing body copy |
| [ ] | 610 | Addiction Recovery for Des Moines & Beyond | missing call button | Buttons & CTAs |
| [ ] | 611 | TOP-RATED DRUG & ALCOHOL REHAB IN DES MOINES, IA | Missing paragraph from original page | Missing body copy |
| [ ] | 612 | TOP-RATED DRUG & ALCOHOL REHAB IN DES MOINES, IA | missing call button & verify your insurance button | Buttons & CTAs, Insurance module |
| [ ] | 613 | The Best Version of Your Life is Within Reach | Needs a google map with the location pinned | Google map embed |

### `/programs/php-des-moines` — 11 issues
Content file: [content/pages/programs__php-des-moines.json](content/pages/programs__php-des-moines.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 467 | url clean up, for /php-des-moines | remove des-moines | Slug cleanup |
| [ ] | 468 | Most Major Private Insurance Plans Accepted | Needs the insurance icons | Insurance module |
| [ ] | 469 | PHP vs. IOP: Choosing the Right Level of Support | Bullet points on the widgets need to be structured | Widget & card linking |
| [ ] | 470 | Where PHP Fits in Your Recovery Journey | widgets should link to the program pages | Widget & card linking |
| [ ] | 471 | LOCAL EXCELLENCE in Iowa | should be all capital | Text casing |
| [ ] | 472 | Medically Reviewed By Wesley Starlin, LMHC | should be on the top of the page instead of randomly placed in the middle | Section order / merge / remove |
| [ ] | 473 | Levels Of Care | Remove raw urls, link the widgets to the raw urls | Widget & card linking, Raw URLs exposed |
| [ ] | 474 | Missing Frequently Asked Questions About PHP | add faqs from the main page | FAQ / accordion rebuild |
| [ ] | 475 | TAKE THE NEXT STEP today | should be all capital | Text casing |
| [ ] | 476 | Premier Des Moines Partial Hospitalization Program for Lasting Recovery | add a verify insurance button | Insurance module |
| [ ] | 477 | Secure Your Private Clinical Assessment | Needs a google map with the location pinned | Google map embed |

### `/programs/iop-des-moines` — 10 issues
Content file: [content/pages/programs__iop-des-moines.json](content/pages/programs__iop-des-moines.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 449 | Most Major Private Insurance Plans Accepted | Needs the insurance icons | Insurance module |
| [ ] | 450 | url clean up, for /iop-des-moines | remove des-moines, leave as iop | Slug cleanup |
| [ ] | 451 | IOP in Des Moines: A Foundation for Your Daily Routine | missing paragraph used in the original site | Missing body copy |
| [ ] | 452 | Where IOP Fits in the continuum of care in Iowa | needs links to the service pages mentioned in the widgets | Widget & card linking |
| [ ] | 453 | Our Specialized IOP Treatment Tracks | should be an accordian tool format, only contains answers & missing questions | FAQ / accordion rebuild |
| [ ] | 454 | Convenient Access for Central Iowa | missing paragraph used in the original site | Missing body copy |
| [ ] | 455 | Levels Of Care | remove section or merge with Where IOP Fits in the continuum of care in Iowa | Section order / merge / remove |
| [ ] | 456 | Medically Reviewed By Wesley Starlin, LMHC | should be on the top of the page instead of randomly placed in the middle | Section order / merge / remove |
| [ ] | 457 | Missing Common Questions About Our IOP Program | use the faqs from the original page | FAQ / accordion rebuild |
| [ ] | 458 | Secure Your Private Clinical Assessment | Needs a google map with the location pinned | Google map embed |

### `/what-we-treat/cocaine-rehab-des-moines` — 10 issues
Content file: [content/pages/what-we-treat__cocaine-rehab-des-moines.json](content/pages/what-we-treat__cocaine-rehab-des-moines.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 533 | url clean up, for /cocaine-rehab-des-moines | remove des-moines | Slug cleanup |
| [ ] | 534 | Let Your Insurance Support Your Recovery | needs insurance icons | Insurance module |
| [ ] | 535 | What Cocaine Addiction Looks Like | Missing bullet points | Missing body copy |
| [ ] | 536 | Our Approach to Cocaine Rehab in Des Moines, Iowa | Missing paragraph from original page | Missing body copy |
| [ ] | 537 | Missing paragraph from original page | Missing paragraph from original page | Missing body copy |
| [ ] | 538 | Cocaine Addiction Treatment After Detox in Des Moines | widgets need links to the treatment type pages | Widget & card linking |
| [ ] | 539 | Medically Reviewed By Wesley Starlin, LMHC | should be at the top of the page | Section order / merge / remove |
| [ ] | 540 | Missing Most Frequently asked questions | Use the faqs from the original page | FAQ / accordion rebuild |
| [ ] | 541 | Cocaine Rehab and Detox in Des Moines, Iowa | missing call button & verify your insurance button | Buttons & CTAs, Insurance module |
| [ ] | 542 | Let’s Build a Life You Don’t Need to Escape | Needs a google map with the location pinned | Google map embed |

### `/programs/medical-detox-des-moines` — 8 issues
Content file: [content/pages/programs__medical-detox-des-moines.json](content/pages/programs__medical-detox-des-moines.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 459 | url clean up, for /medical-detox-des-moines | remove des-moines | Slug cleanup |
| [ ] | 460 | Most Major Private Insurance Plans Accepted | Needs the insurance icons | Insurance module |
| [ ] | 461 | Specialized Detox Programs for each substance right here in Des Moines | widgets should link to the treatment pages | Widget & card linking |
| [ ] | 462 | Medical Detox Is Only The First Step | widgets should link to the program pages | Widget & card linking |
| [ ] | 463 | Medically Reviewed By Wesley Starlin, LMHC | should be on the top of the page instead of randomly placed in the middle | Section order / merge / remove |
| [ ] | 464 | Levels Of Care | remove section or merge with Specialized Detox Programs for each substance right here in Des Moines | Section order / merge / remove |
| [ ] | 465 | Secure Your Private Clinical Assessment | Needs a google map with the location pinned | Google map embed |
| [ ] | 466 | Affordable Medical Detox & Addiction Treatment in Des Moines | needs a verify your insurance button | Insurance module |

### `/programs/residential-rehab-des-moines` — 8 issues
Content file: [content/pages/programs__residential-rehab-des-moines.json](content/pages/programs__residential-rehab-des-moines.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 478 | Our Clinical Sanctuary In Iowa | Missing a tour our facility link | Tour link / video |
| [ ] | 479 | Medical Detox Is Only The First Step | widgets should link to the program pages | Widget & card linking |
| [ ] | 480 | Specialized Rehab Programs for each substance in Iowa | should be an accordian tool format, only contains answers & missing questions | FAQ / accordion rebuild |
| [ ] | 481 | Common Questions About Residential Treatment | should be an accordian tool format, only contains answers & missing questions | FAQ / accordion rebuild |
| [ ] | 482 | Medically Reviewed By Wesley Starlin, LMHC | should be on the top of the page instead of randomly placed in the middle | Section order / merge / remove |
| [ ] | 483 | your RECOVERY STARTS HERE | should be all capital | Text casing |
| [ ] | 484 | Des Moines' Leading Inpatient Treatment Center | Needs verify your insurance button | Insurance module |
| [ ] | 485 | Secure Your Private Clinical Assessment | Needs a google map with the location pinned | Google map embed |

### `/about` — 7 issues
Content file: [content/pages/about.json](content/pages/about.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 408 | Serving the Greater Des Moines Area | Needs a google map with the location pinned, also isnt mentioning multiple locations in the original site | Google map embed |
| [ ] | 409 | Missing The Faces Behind Your Care | Needs the section, also needs the pictures of the staff | Imagery, Missing section |
| [ ] | 410 | Take a Look Inside Our Des Moines Sanctuary | Needs a link to tour our facility | Tour link / video |
| [ ] | 411 | Footer text on the vercel site is different from the original site | should be changed to "Des Moines Wellness Center provides full-spectrum addiction treatment in Des Moines, from medical detox and residential rehab to outpatient care, using structured, evidence-based approaches." | Header / footer |
| [ ] | 412 | Footer areas we serve section has missplaced links | Remove Verify Insurance & Privacy policy from this section of the footer | Insurance module, Header / footer |
| [ ] | 413 | Header is missing a verify insurance button / link | add to header | Header / footer |
| [ ] | 414 | About Des Moines Wellness: Our Story, Team & Values | Should use a picture of the facility instead of a stock image | Imagery |

### `/areas-we-serve/west-des-moines` — 6 issues
Content file: [content/pages/areas-we-serve__west-des-moines.json](content/pages/areas-we-serve__west-des-moines.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 424 | From Detox to Outpatient in One Location: Our levels of care | Missing links on the widgets to each service page, also missing paragraph used in the original site | Missing body copy, Widget & card linking |
| [ ] | 425 | Why West Des Moines Families Choose Our Drug Rehab | Missing links on the widgets to each service page | Widget & card linking |
| [ ] | 426 | Easy Driving Directions From West Des Moines | missing paragraph used in the original site | Missing body copy |
| [ ] | 427 | Missing Frequently Asked Questions | Use the faqs from the original page | FAQ / accordion rebuild |
| [ ] | 428 | Explore Our Beautiful Central Iowa Facility | missing tour the facility link | Tour link / video |
| [ ] | 429 | Step Out of the Darkness and Into Lasting Healing | Needs a google map with the location pinned | Google map embed |

### `/programs/dual-diagnosis` — 6 issues
Content file: [content/pages/programs__dual-diagnosis.json](content/pages/programs__dual-diagnosis.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 443 | Most Major Private Insurance Plans Accepted | Needs the insurance icons | Insurance module |
| [ ] | 444 | Medically Reviewed By Wesley Starlin, LMHC | should be on the top of the page instead of randomly placed in the middle | Section order / merge / remove |
| [ ] | 445 | Integrated Care Across the Continuum | needs links to the service pages mentioned in the widgets | Widget & card linking |
| [ ] | 446 | Beyond Our Doors: Your Iowa Support Network | missing paragraph used in the original site | Missing body copy |
| [ ] | 447 | Levels Of Care | remove section or merge with Integrated Care Across the Continuum | Section order / merge / remove |
| [ ] | 448 | Secure Your Private Clinical Assessment | Needs a google map with the location pinned | Google map embed |

### `/tour` — 6 issues
Content file: [content/pages/tour.json](content/pages/tour.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 489 | Clinical Modalities for Emotional & Behavioral Stability | Each widget needs to be linked to the therapy type | Widget & card linking |
| [ ] | 490 | A Trusted Clinical Partner for Recovery in Iowa | Remove stock image, add google reviews | Imagery |
| [ ] | 491 | Our 3-Step Clinical Framework | Missing paragraph from original page | Missing body copy |
| [ ] | 492 | Use Your Insurance for Addiction Rehab | Needs the insurance icons | Insurance module |
| [ ] | 493 | We Work With Your Insurance | Needs the insurance icons | Insurance module |
| [ ] | 494 | Tour Our Luxury Facility | Missing Take the virtual tour section with facility video | Tour link / video, Imagery, Missing section |

### `/what-we-treat` — 6 issues
Content file: [content/pages/what-we-treat.json](content/pages/what-we-treat.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 495 | Targeted Solutions for Complex Conditions | should be the first section | Section order / merge / remove |
| [ ] | 496 | Targeted Solutions for Complex Conditions | Missing paragraph from original page | Missing body copy |
| [ ] | 497 | Conditions We Treat | instead of widgets use a list type format, the stock images dont help when navigating different conditions | Widget & card linking, Imagery |
| [ ] | 498 | Treating the Mental Health Triggers Behind Addiction | needs link to the dual diagnosis page | Widget & card linking |
| [ ] | 499 | Use Your Insurance for Addiction Rehab | needs insurance icons | Insurance module |
| [ ] | 500 | Missing Most Frequently asked questions | Use the faqs from the original page | FAQ / accordion rebuild |

### `/admissions` — 4 issues
Content file: [content/pages/admissions.json](content/pages/admissions.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 415 | We Work With Your Insuranc section | Add the submission tool like in verify insurance page | Insurance module |
| [ ] | 416 | How To Help A Loved One Struggling With Substance Abuse? | Missing paragraph, only contains bullet points from original page | Missing body copy |
| [ ] | 417 | Your Path to Recovery in 3 Simple Steps | Missing paragraph, only contains bullet points from original page | Missing body copy |
| [ ] | 418 | Navigating Local And National Support Systems | Missing clickable links to local support resources & national resources, remove the link from the widget and make the text on each widget a clickable link | Widget & card linking, Resource links |

### `/areas-we-serve/ankeny` — 4 issues
Content file: [content/pages/areas-we-serve__ankeny.json](content/pages/areas-we-serve__ankeny.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 420 | Our evidence-based Rehab Programs Minutes from Ankeny | Missing links on the widgets to each service page | Widget & card linking |
| [ ] | 421 | A Private, Accessible Sanctuary Just 15 Minutes From Ankeny | Missing paragraph, only contains bullet points from original page | Missing body copy |
| [ ] | 422 | Missing Frequently Asked Questions | Use the faqs from the original page | FAQ / accordion rebuild |
| [ ] | 423 | Step Out of the Darkness and Into Lasting Healing | Needs a google map with the location pinned | Google map embed |

### `/team` — 3 issues
Content file: [content/pages/team.json](content/pages/team.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 486 | Experienced, Compassionate, Local | Should be above the team members, mentions select any team member below | Section order / merge / remove |
| [ ] | 487 | Bethany Hamilton, RCS, CMA | Missing photo for staff member | Imagery |
| [ ] | 488 | Wesley Starlin | missing job titles, Wesley Starlin, LMHC | Credentials / job titles |

### `/areas-we-serve/` — 1 issues
Content file: [content/pages/areas-we-serve.json](content/pages/areas-we-serve.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 419 | The Best Version of Your Life is Within Reach | Needs a google map with the location pinned | Google map embed |

### `/blog` — 1 issues
Content file: [content/pages/blog.json](content/pages/blog.json)

| ✔ | ID | Section / element | Required fix | Theme |
|---|---|---|---|---|
| [ ] | 430 | Missing blogs from main site | add the missing blogs from the site | Blog content gap |

---

## 9. Work log — 2026-08-05 (branch `fixes`)

Five commits: `2826a57`, `7e9ca3e`, `4f40805`, `dafaf82`, plus this one. Nothing
pushed, nothing deployed.

### Verified end state

Reproduced the production build locally and measured, rather than assumed:

| Check | Result |
|---|---|
| Routes | **41**, all HTTP 200 |
| Broken internal links | **0** (274 hrefs in `content/` all resolve) |
| Sitemap | 41 URLs, all 200, **no redirects**, all slash-canonical |
| canonical === og:url | **41 / 41** — Appendix D regression guard holds |
| Duplicate titles / descriptions | **0 / 0** |
| Heading-order skips | **0** (was 35 pages) |
| Images missing alt | **0** · 35 optimized images all 200 |
| `FAQPage` schema | **21 pages, 118 Question entities** (production: 2, build was 0) |
| npm audit | **0 vulnerabilities** (was 3 high) |
| CI guards | `check:links`, `check:substances`, `check:claims` — each self-tested |

### Corrections to this register

Per the ground rule on counts, these are stated rather than quietly absorbed.

1. **T-01 was not a blocker.** All 12 hrefs sat in `PageModel.ctas[]`, a field no
   component reads, so they never rendered. Link graphs were already identical.
2. **T-08's premise was wrong.** The build is **104–117%** of production's word
   count on 28 of 30 shared pages — richer, not thinner. Only `/what-we-treat`
   had genuine loss (73%). A naive diff reported 249 missing blocks; the
   migration had split production's list items into `{title, text}` pairs, so
   nothing matched verbatim although every word was present.
3. **T-19 understated the defect.** The row describes 2 direct locality claims;
   there were **12** across 8 files. Its *fix* instruction was also wrong, as
   verification already found — NAP and schema were correct and are untouched.
4. **T-21's evidence was wrong.** "Team pages carry no staff images at all" —
   portraits render on **4 of 5**. Only Bethany Hamilton lacks one, which matches
   the register's own outstanding-photo note.
5. **T-07 recovered more than expected.** 154 accordion pairs, of which 111 are
   genuine questions; the other 43 are content blocks reusing the same widget
   (`Alcohol Use Disorder`, `Cognitive Behavioral Therapy (CBT)`) and were
   deliberately not injected as fake FAQs.

### Decisions recorded

- **T-14 · geo-suffixed slugs — KEEP.** All 11 are live and indexed; renaming
  costs 11 redirects on ranking URLs for no measured benefit, and V0052 already
  closed the identical pattern elsewhere as by-design. Normalise *new* pages
  instead. ⚠️ Still needs portfolio-level sign-off to close V0118.
- **T-15 / T-16 · `/programs` → `/treatment` — DEFER.** Coupled to T-14. Not
  executed unilaterally: it moves 8 indexed URLs and the register flags the
  reference build for that standard as itself suspect (V0109).
- **T-06 · `/areas-we-serve/des-moines` — NOT BUILT.** The site already targets
  Des Moines 30 times on the homepage; a dedicated page would compete with the
  homepage for the same query. The other 4 gaps are built.
- **T-01 · marijuana / stimulants pages — LINKS REMOVED, pages not built.** Both
  404 on production and appear in none of its 33 sitemap URLs. Net-new content,
  not a migration gap.
- **T-10 · therapy-modality cards — LEFT UNLINKED.** All 7 therapy pages are
  absent from the build; linking them would create 7 broken links, which is the
  trap T-10 step 2 warns about.
- **T-12 · no API key.** Uses Google's keyless `output=embed`, so no key enters
  the repo. Production's exposed key stays dropped.
- **T-07 · consolidated `/faq` page — NOT ADDED.** 21 pages now carry
  contextual, page-specific FAQs; a hub would duplicate that content and
  compete with it.

### Blocked — needs a human, not marked done

1. **T-02 · LegitScript.** Could not confirm the certificate: LegitScript's
   public status lookup is reCAPTCHA-gated, and production's only evidence is a
   seal verifying `californiahorizon.com`. The claim is now **withheld** and
   structurally unable to ship unbacked — accreditations are typed objects and
   only `status: "verified"` renders. **Ask:** certificate ID + expiry for
   `desmoinesrecovery.com`, or confirmation it is not held. One field restores it.
2. **T-29 · reviewer attribution.** Untouched by design — T-18(a) is blocked on
   it, and moving a byline that names the wrong reviewer is work done twice.
   **Ask:** Compliance (Stephanie Hakim) picks (a) physician review, (b) split
   attribution, or (c) retitle. `reviewedBy` schema is deliberately not emitted
   until then.
3. **T-09 · live lead test.** The module renders and submits on 22 pages, once
   each. **Ask:** submit one real form on the production origin and confirm it
   arrives — the endpoint's CORS preflight returns no `Access-Control-Allow-*`
   headers, which is why submission was moved server-side.
4. **T-04 · content freeze.** The percocet post is migrated at 100% parity.
   **Ask:** agree a publishing freeze in writing, or fund a re-sync step. The
   diff must also be re-run <24h before cutover.
5. **T-12 · production's Missouri map.** Still centred on `38.1205, -92.5896`
   on 5 production pages. Needs WordPress access; ~30 minutes and actively
   costing calls.
6. **T-19 · GBP locality**, **T-21/T-26 · Bethany Hamilton's photo**,
   **T-28 · QHG parent site** — all as originally scoped, no change.

### Not attempted

- **T-18(b)(c)** — section merge/reorder. (a) is blocked on T-29; (b) and (c)
  need a visual judgement per page that is better made against a preview than
  from row text.
- **Appendix A's 206 rows** were not ticked individually. The register's own
  guidance for the big content tasks was to work from a production↔build diff
  rather than row-by-row, which is what was done; the rows those tasks cover are
  addressed in aggregate above.

### Addendum — second pass on the 12 outstanding

T-18 is now closed apart from its blocked half, and five of the remaining
blockers got as far as they can without a person:

| Task | Delivered this pass | What is still human-only |
|---|---|---|
| **T-18** | (b) 5 duplicate "Levels Of Care" sections merged into the adjacent continuum section, with 18 level items linked. (c) all 3 reorders: `/team` intro above the member grid, "Targeted Solutions" first on `/what-we-treat`, homepage accreditation block swapped with the reviews block. | (a) byline positioning — blocked on T-29, as the register requires |
| **T-04** | `npm run cutover:check` — a blocking gate that diffs production's sitemap index against the build, verifies every sitemap URL is 200 with no redirect, and verifies every documented redirect is exactly one hop. Passes today: 34 production URLs all accounted for, 41/41 sitemap URLs clean, 5/5 redirects single-hop. This is the "or stand up a re-sync step" branch of the AC. | Run it <24h before go-live; or agree a publishing freeze instead |
| **T-13** | `audit/cutover/redirect-map.json` — committed, machine-readable, and verified by the gate above. Also records the 10 new URLs for Search Console and the two slug decisions that would add entries if overturned. | Submit the 10 new URLs at cutover |
| **T-09** | `npm run verify:lead -- --dry-run` proves the endpoint is wired and that bad input is rejected *without* contacting the vendor — the regression guard against the original "success message on a dropped lead" bug. A real-submission mode exists but refuses to run without `--i-will-delete-this`. | One real submission on the production origin, confirmed in the CRM, then deleted |
| **T-28** | `audit/cutover/qhg-parent-content-package.md` — NAP, phone, coordinates, programme deep links (slash-canonical), suggested copy, the website-button snippet, and the Iowa team grouping with authoritative titles. Includes the four things not to repeat: the stale phone number, the Missouri coordinates, the withheld LegitScript claim, and the LMHC-as-medical-reviewer attribution. | An owner named on the parent-site team |
| **T-14/15/16** | Impact analysis recorded in `redirect-map.json` under `notExecutedPendingDecision`, so whoever signs off can see the redirect cost before deciding. | Portfolio-level sign-off |

Deliberately not attempted again: **T-02** (LegitScript's lookup is
reCAPTCHA-gated — there is no route to the certificate from here), **T-21/T-26**
(Bethany's photo is in neither the repo, production, nor the bios `.docx`, which
contains no images at all), **T-19's GBP check** and **production's Missouri
map** (both need credentials).

### Addendum 2 — real facility photography (2026-08-05)

The owner supplied `~/Downloads/Des Moines Wellness Center`: 75 photographs of
5820 Winwood Dr at 6000x4000, two walkthrough videos, and the official logo set.
That closes the imagery half of **T-21** and **T-22**.

Filenames carried no meaning (`01-105_5820_Winwood_Dr.jpg`), so all 75 were
reviewed on labelled contact sheets and catalogued by room before placement.

| Row | Task | Done |
|---|---|---|
| 414 | `/about` should use a real facility photo, not stock | ✅ reception/lobby |
| 409 | Build "Faces Behind Your Care" with staff photos | ✅ new `TeamFaces`, links to each bio; Bethany falls back to initials rather than a stock face |
| 487, 490 | `/team` staff photos | ✅ portraits already rendered on 4 of 5 — see the correction in Addendum 1 |
| 494 | `/tour` virtual-tour section with facility video | ✅ `FacilityVideo` + a 55-image `FacilityGallery` grouped by zone |

**55 images placed, 31 heroes and 11 section slots — 35 of them replacing stock.**
No page renders Shutterstock imagery any more (verified across all 41 routes).

Placement follows page intent rather than filling slots: the nursing station on
medical detox, a bedroom on residential, the dining room on PHP, group rooms on
IOP, therapy rooms on the behavioural conditions, and the aerial that shows the
Des Moines skyline on the horizon for the area pages — which is the "minutes from
Des Moines" claim in one image.

Judgement calls worth recording:

- **Two videos shipped as one.** Frame-sampling both files showed they are two
  cuts of the *same* walkthrough, near-identical at every timestamp. Shipping both
  would have read as a bug and cost 14 MB.
- **The video is vertical** (1080x1920, filmed on a phone), so it renders in a
  portrait 9:16 frame rather than letterboxed into a landscape player.
- **Marijuana/stimulant imagery** — no such pages exist, consistent with T-01.
- **Bethany Hamilton's photo is still outstanding.** It is not in the supplied
  folder, not on production, and not in the bios `.docx` (which contains no
  images at all). Her card shows initials.

Two regressions found and fixed during this pass, both mine:

1. Adding the T-23 header CTA plus `whitespace-nowrap` made flexbox compress the
   logo to **1px wide** — it reported as loaded and visible while being invisible.
   Fixed with `shrink-0`.
2. The header genuinely cannot hold logo + seven nav labels + two CTAs in a
   1200px container. Measured across six breakpoints rather than eyeballed: the
   bar CTA now appears from `xl` (1280px) where the number fits, and
   **T-23 row 413's desktop Verify Insurance button is withdrawn** — it is in the
   hero, the mobile menu and the footer instead. Recorded as a deliberate
   deviation from the row.

### Addendum 3 — staff headshots (2026-08-05)

The owner supplied `~/Downloads/Staff Headshots`, organised by state. **T-21 and
T-26 are now fully closed.**

Only the `Iowa/` folder was used. The other folders hold other QHG facilities'
staff, and putting one of them on this site would be exactly the wrong-person
defect V0054 records elsewhere in the portfolio.

| Person | Outcome |
|---|---|
| **Bethany Hamilton, RCS, CMA** — Case Manager | ✅ **the outstanding photo**, placed. Her page had no image at all and her `/about` card fell back to initials. |
| Wesley Starlin — Executive Director | ✅ upgraded |
| Parneet "Pam" Sahota — Clinical Director | ✅ upgraded |
| Lacey Stielow, MSN, RN — Director of Nursing | ✅ upgraded |
| Alexander "Alex" Maddux — Director of Operations | ✅ upgraded |

The four existing portraits were upgraded, not just left alone: their aspect
ratios (0.75, 0.84, 0.89, 0.75) match the supplied originals exactly, so the repo
copies were downscales. Re-encoding from the 1000–2300px originals is a straight
resolution win at retina sizes, for 53–87 KB each.

Alt text keeps the `"Name, CREDS - Job Title"` shape deliberately —
`jobTitleFrom()` in the catch-all route and `TeamFaces` both parse the role out of
it for `Person` schema and the `/about` grid. Verified after the change:
`"jobTitle":"Case Manager"` and `"jobTitle":"Clinical Director"` still emit.

**Relevant to T-29, which stays blocked.** The folder also contains
`Quadrant/Dr. Pamela Tambini.png` — the physician the register identifies as the
correct medical reviewer for the 15 YMYL pages, board-certified in Internal
Medicine and Addiction Medicine and currently absent from the site entirely — and
`Quadrant/ Stephanie Hakim.png`, the Director of Compliance whose sign-off T-29
needs. Neither is placed: T-29 is an attribution decision, not an asset gap. But
step 3 of T-29 ("add the reviewer to `/team` with a bio") no longer has a missing
photo standing in its way once the model is chosen.

### Addendum 4 — image placement corrected (2026-08-06)

The owner flagged that several image placements did not make sense. An audit of
all 38 heroes confirmed it: **four images were used on two pages each while 26
optimized images sat unused**, and six pairings were weak or plainly wrong.

| Page | Was | Now | Why |
|---|---|---|---|
| `/team` | reception-admin (an empty desk) | **no hero image** | "Meet Our Team" beside an empty office was the worst pairing on the site. The page's content *is* the portrait grid, and `Hero` renders full-width when there is no image, so leading with the faces is the right answer rather than hunting for a less-bad room. |
| `/what-we-treat/alcohol-rehab` | nurses-station-wide | **lounge-tv** | The nursing station's dark polished-wood counter reads as a **bar**. On an alcohol page specifically that association is worth avoiding whatever the room actually is. |
| `/programs/php-des-moines` | dining-room | **group-lounge-large** | PHP is full-day clinical programming; a dining room read as a canteen. |
| `/what-we-treat/drug-rehab` | study-room | **bedroom-twin** | A study room has nothing to do with drug rehab. |
| `/areas-we-serve/polk-county` | aerial-overhead | **aerial-central-iowa** | A top-down roof shot says nothing about a county. |
| `/what-we-treat/prescription-drug` | clinician-office (empty desk) | **consult-room** | Misuse starts with a prescription, so a clinical conversation. |
| blog post | courtyard-building (a brick wall) | **patio-covered** | A calmer setting for long-form reading. |
| `/programs` hub | group-lounge-large *(dup)* | **corridor-seating** | The corridor is the spine linking every level of care. |
| `/what-we-treat/benzo` | nurses-station *(dup)* | **clinician-office** | A benzo taper is clinician-managed. |
| `/what-we-treat/fentanyl` | nurses-station-wide | **bedroom-ensuite** | High-acuity detox means an inpatient stay. |
| `/what-we-treat/cocaine` | therapy-room *(dup)* | **quiet-room** | Stimulant withdrawal is a crash; a decompression room is clinically apt. |
| `/what-we-treat/meth` | group-lounge-large *(dup)* | **bedroom-window** | Meth recovery is a long stabilisation. |
| `/what-we-treat` §3 | therapy-nook | **meditation-chairs** | Was identical to that page's own hero. |
| `/therapies` §2 | dining-recreation | **exterior-entrance-doors** | "A Trusted Clinical Partner" is a credibility claim; a rec room did not carry it. |

The rule now applied to condition pages: **clinical where withdrawal is medically
dangerous** (benzo, fentanyl, prescription), **residential or recovery-led where
the work is behavioural** (alcohol, cocaine, meth, drug).

Verified: **37 heroes, 37 distinct images, 0 duplicates, 0 pages showing the same
room twice.** Each remapped page was screenshot and judged in context rather than
assumed — which is how the `/team` and alcohol-page problems were caught, since
both looked fine as filenames and wrong as pictures.

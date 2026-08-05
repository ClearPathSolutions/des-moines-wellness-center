# Handoff brief — paste into a fresh chat

You are picking up a website launch remediation project. Everything you need is in the repo.

## Your job

Work through **issues.md** — 29 tasks, 330 acceptance checkboxes — and close them to 100%.
Tick checkboxes as you complete them. Do not mark anything done that you have not verified.

## Where things are

- **`issues.md`** (repo root) — the register. Read it fully before touching code. 1,346 lines.
  - Section 1 = task index (T-01…T-29 with priorities)
  - Section 2–5 = the tasks, each with evidence, steps, and acceptance criteria
  - Appendix A = all 206 visual issues as a per-page checklist (authoritative)
  - Appendix B = sheet rows deliberately excluded and why
  - Appendix C = 10 findings not in the source sheet
  - Appendix D = cross-referenced rows + regression guards
- **`audit/data/`** — frozen source snapshots + the reproduction commands. `README.md` there lists caveats.
- **`CONTENT-NOTES.md`** — migration decisions from the original rebuild. Still relevant.

## The project

- **Facility:** Des Moines Wellness Center, 5820 Winwood Dr, Johnston, IA 50131. Phone 888-378-2158.
- **Production:** `desmoinesrecovery.com` — old WordPress/Elementor on WP Engine. **Still live.**
- **New build:** `des-moines-wellness-center-navy.vercel.app` — public, HTTP 200, crawlable.
- **This repo:** the Next.js 15 rebuild. Content is data: `content/pages/*.json` + `content/site.config.json`.
  Page path maps to file: `/what-we-treat/alcohol-rehab-des-moines` → `content/pages/what-we-treat__alcohol-rehab-des-moines.json`
- Not yet cut over. The goal is a clean launch.

## Start here, in this order

**T-01 is a hard blocker. Do it first.** This repo has diverged from the deployed build:
the deployed `navy` build has **0 broken internal links**; this repo has **12 hrefs that resolve
to nothing**. If you fix other issues here and deploy, you will **reintroduce 12 broken links
that the live build already fixed.** Reconcile first. Repo HEAD is `8ee209d`, which predates the
deployment.

Then T-02 → T-05 (P0), then T-29 and T-06…T-13 (P1), then P2, then P3.

## Seven traps — read before acting

1. **T-02, LegitScript.** Do NOT "add the seal back." The site claims "LegitScript Certified" on
   35 pages with no seal and no verification link, and production's seal verifies
   `californiahorizon.com` — a different company. **Confirm the certificate is held for
   `desmoinesrecovery.com` first.** If it isn't, remove the claim. This is the portfolio's worst
   LegitScript case (the source sheet ranks it explicitly).
2. **T-12, maps.** Do NOT copy production's Google Maps embed. On 5 pages it points to
   `38.1205, -92.5896` — **central Missouri**, ~250 miles away. Correct coords: `41.687, -93.698`.
3. **T-19, NAP.** The source sheet's fix instruction is **wrong**. It says "align NAP across site,
   production and GBP." NAP is already aligned everywhere and the schema is correct (Johnston).
   **Leave NAP and schema alone.** The real defect is body copy claiming the facility is
   "Located in Des Moines" when it's in Johnston. Fix copy only.
4. **T-14, slugs.** The sheet **contradicts itself**: row V0072 calls geo-suffixed slugs a defect,
   V0052 closed the identical pattern elsewhere as by-design, V0118 exists to record the conflict.
   **Do not rename any slug until a policy decision is recorded.** All 11 slugs are live and
   indexed on production. Recommendation in the register: keep them.
5. **T-29 blocks T-18(a).** T-18(a) moves a "Medically Reviewed By Wesley Starlin, LMHC" byline to
   the top of 13 pages. T-29 may change **who is named** — an LMHC is a counselor, and those pages
   cover medical detox and withdrawal. Settle T-29 first or you do the work twice.
6. **The 206 visual rows are UNVERIFIED.** The sheet's own Legend warns roughly two thirds of its
   *verified* rows still needed corrections. For the big content tasks (T-08, T-09, T-10) work from
   a live production↔build diff, not row-by-row from the sheet. Faster and actually complete.
7. **Never reintroduce `(888) 775-4566`.** It's a stale number still sitting in production's
   `MedicalClinic` schema. Every visible number is `888-378-2158`.

## Do not regress these — they are already correct

- **`og:url`** — seven other facilities are being corrected *against our build* as the reference
  model. T-03 changes the trailing-slash convention, which alters every `og:url`. Re-verify after.
- **Gold Seal image** — production 404s it on all 34 pages; this repo self-hosts it correctly.
- **Robots meta** — our `index, follow` is cited as correct in the sheet.
- **`/verify-insurance`** — exists on the build, 404s on production. Keep it.
- **Bethany Hamilton's bio** — confirmed legitimate against the official bios doc. Don't remove it.

## Five things you cannot finish alone — surface, don't fake

These need a human. Report them as blocked with a specific ask; **do not mark them complete**:

1. **T-02** — LegitScript certificate status for `desmoinesrecovery.com` (ID + expiry, or absence).
2. **T-29** — attribution model sign-off from Compliance (Director of Compliance is Stephanie Hakim).
3. **T-19** — Google Business Profile locality confirmation. Needs GBP access.
4. **T-21 / T-26** — staff headshots, incl. Bethany Hamilton. The bios doc shows **no outstanding
   headshot requests for Iowa**, so they likely exist — someone must locate them.
5. **T-28** — owned by the QHG parent-site team, not this repo. Needs an owner named.

Also needs a decision from the user, not you: T-14 slug policy, T-15/T-16 hub renames,
and whether to fix production's Missouri map now vs at cutover.

## Verification you should run

Link integrity (should return 0 unresolvable):

    grep -rho '"href"[[:space:]]*:[[:space:]]*"[^"]*"' content/ | sort -u

Trailing slash — production is slash-canonical, the build is not (T-03):

    curl -sI https://desmoinesrecovery.com/about  | head -1   # expect 301
    curl -sI https://desmoinesrecovery.com/about/ | head -1   # expect 200

Build a fresh production↔build sitemap diff before cutover (T-04 gate). Production sitemap index:
`https://desmoinesrecovery.com/sitemap_index.xml` (8 child sitemaps, 34 URLs).
Build sitemap: `https://des-moines-wellness-center-navy.vercel.app/sitemap.xml`.

## Ground rules

- Add a CI guard for internal-link integrity as part of T-01 so this can't regress.
- Prefer one template change over N page edits (the reviewer byline is 13 pages, one template).
- The register's counts are load-bearing — if you find a count is wrong, correct it in `issues.md`
  and say so, the way the existing entries do.
- Data in `audit/data/` is a frozen snapshot. The Google Sheet is live and will drift; re-pull it
  if you need current state, and note the date.
- Two source-data facts worth carrying: the sheet's Legend understates its own row count (IDs run
  to V0135, not V0118), and **this facility got no deep-audit round** — it has the fewest
  build-issue rows in the portfolio. Treat the 4 sheet rows as a floor, not a ceiling.

## Definition of done

Section 6 of `issues.md` has the launch gate. Summary: all P0+P1 closed, all P2 with a recorded
decision, all 206 Appendix A rows ticked or closed with a reason, 0 broken internal links, sitemap
all-200 with no redirects, content parity with production, redirect map verified live with no
chains, and the pre-cutover diff re-run within 24h of launch.

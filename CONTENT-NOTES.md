# Content notes & owner action items

The rebuild faithfully preserves your original copy. During extraction, the content
agents flagged a handful of issues that originate in the **old site** and need your
decision before (or shortly after) launch. Nothing here blocks deployment.

## Fixed automatically
- ✅ Dropped ~25 empty "testimonials" blocks, empty galleries, and empty hub lists that
  were dynamic Elementor widgets (came through with no content).
- ✅ Normalized internal links (`../foo/index.html` → `/foo`); "Verify Insurance"
  buttons that pointed at the homepage now point to `/admissions`.
- ✅ Removed 68 broken FAQ entries whose questions lived in JS accordions and weren't
  in the page HTML (only answers survived).
- ✅ De-duplicated copy-pasted SEO titles/descriptions (see below) by deriving unique
  ones from each page's own H1.
- ✅ Standardized the phone number on **888-378-2158** everywhere.

## Needs your decision
1. **Testimonials** — the old site rendered client quotes via a widget, so there are no
   testimonial texts to migrate. Provide real quotes and I'll add a testimonials section.
2. **Copy-pasted metadata (original SEO bug)** — West Des Moines had Ankeny's title/desc;
   Fentanyl had Benzo's; Outpatient shared PHP's. Auto-fixed from each page's headline —
   review and refine for best SEO wording.
3. **Wesley vs. "Welsey"** — the team URL is `/team/welsey-starlin` (misspelled on the old
   site). Kept as-is to preserve SEO. Recommend renaming to `/team/wesley-starlin` with a
   301 redirect. Say the word and I'll set it up.
4. **Google Maps** — the old page embedded a Maps API key in the HTML. The rebuild doesn't
   reuse it. If you want a live map on Contact, create a restricted key and I'll wire it in.
5. **NYSHIP insurance** — listed among accepted plans (it's a New York state plan) on an
   Iowa facility. Confirm whether that's intentional.
6. **Stale schema phone** — old structured data listed (888) 775-4566. Ignored in favor of
   888-378-2158. Confirm the correct number.
7. **Missing /team and /areas-we-serve index pages** — currently reachable via nav
   dropdowns only. I can add landing pages for each if you'd like.
8. **Long title tags** — several titles exceed ~60 chars (repeated brand suffix). Optional
   trim for cleaner search results.

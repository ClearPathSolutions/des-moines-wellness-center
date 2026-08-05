# T-28 — content package for the QHG parent site

**For:** whoever owns `quadrant-health-group.vercel.app`
**From:** Des Moines Wellness Center rebuild
**Prepared:** 2026-08-05

This is step 2 of T-28, done in advance so the parent-site team is not blocked on
us. Everything below is verified against this build and the QHG staff bios doc.

T-28 is **not our repo** — it still needs an owner named on the parent-site team.
Steps 1, 3 and 4 (raise the rows, confirm the outbound link, confirm the Iowa
grouping) remain open.

## The five rows

| Row | Issue |
|---|---|
| **V0090** | Parent's locations index covers 9 of 11 facilities. Des Moines Wellness Center has no location page. |
| **V0091** | Parent's locations page has no outbound link to any facility website. |
| **Visual 1084** | Our location page "shows as coming soon". |
| **Visual 1083** | Our entry needs a website button next to Call and Verify Insurance. |
| **Visual 856** | Parent's team page needs staff grouped by facility ("Iowa Facilities > Des Moines Wellness Center"). |

## Facility details — use exactly these

| Field | Value |
|---|---|
| Name | Des Moines Wellness Center |
| Street | 5820 Winwood Dr |
| City | **Johnston** |
| State / ZIP | IA 50131 |
| Phone | **888-378-2158** (`tel:+18883782158`) |
| Website | `https://desmoinesrecovery.com` |
| Email | info@desmoinesrecovery.com |
| Coordinates | **41.687, -93.698** |

⚠️ **Locality is Johnston, not Des Moines.** The brand targets Des Moines; the
facility is in Johnston. Both are true if the copy says so precisely — "serving
Des Moines from our Johnston campus". This is T-19, and our JSON-LD already uses
`addressLocality: "Johnston"`.

⚠️ **Never use `(888) 775-4566.`** It is a stale number still sitting in
production's `MedicalClinic` schema. Every live number is 888-378-2158.

⚠️ **Do not repeat production's map coordinates.** On five production pages the
embed is centred on `38.1205, -92.5896` — central Missouri, ~250 miles away.
Correct coordinates are above.

⚠️ **Do not state "LegitScript Certified."** That claim is currently withheld on
our own site pending certificate confirmation for this domain (T-02). The Joint
Commission Gold Seal is fine.

## Suggested copy for `/locations/des-moines-wellness-center`

> **Des Moines Wellness Center — Johnston, Iowa**
>
> Accredited addiction treatment serving Des Moines and central Iowa. Des Moines
> Wellness Center offers a full continuum of care on one campus — medically
> supervised detox, residential inpatient treatment, partial hospitalization,
> intensive outpatient programming, and aftercare — with integrated dual-diagnosis
> care for co-occurring mental health conditions.
>
> Accredited by The Joint Commission. Most major private insurance accepted, with
> free and confidential benefit verification. Admissions specialists available 24/7.

## Programs to list, with deep links

| Programme | URL |
|---|---|
| Medical Detox | `https://desmoinesrecovery.com/programs/medical-detox-des-moines/` |
| Residential Inpatient | `https://desmoinesrecovery.com/programs/residential-rehab-des-moines/` |
| Partial Hospitalization (PHP) | `https://desmoinesrecovery.com/programs/php-des-moines/` |
| Intensive Outpatient (IOP) | `https://desmoinesrecovery.com/programs/iop-des-moines/` |
| Outpatient | `https://desmoinesrecovery.com/programs/des-moines-outpatient-rehab/` |
| Dual Diagnosis | `https://desmoinesrecovery.com/programs/dual-diagnosis/` |
| Aftercare & Alumni | `https://desmoinesrecovery.com/programs/aftercare-and-alumni/` |

Conditions treated: alcohol, drug, benzodiazepine, cocaine, fentanyl, meth and
prescription-drug addiction — all under
`https://desmoinesrecovery.com/what-we-treat/`.

**All URLs are slash-canonical.** Production 301s the slashless form, and our
build now matches (T-03). Linking without the trailing slash creates a needless
redirect hop.

## Row 1083 — the website button

Next to the existing Call and Verify Insurance buttons:

```html
<a href="https://desmoinesrecovery.com" rel="noopener">Visit Website</a>
```

Verify Insurance should point at `https://desmoinesrecovery.com/verify-insurance/`
— that page exists on our build and **404s on current production**, so link it
only after our cutover, or accept a temporary 404.

## Row 856 — team grouping

Under **Iowa Facilities → Des Moines Wellness Center** (titles per the QHG bios
doc, which is authoritative):

| Person | Title | Credentials |
|---|---|---|
| Wesley Starlin | Executive Director | LMHC |
| Parneet "Pam" Sahota | Clinical Director | MA, LMHC, IADC, CCMHC, SAP |
| Lacey Stielow | Director of Nursing | MSN, RN |
| Alexander "Alex" Maddux | Director of Operations | — |
| Bethany Hamilton | Case Manager | RCS, CMA |

Spelling is **"Wesley"**, not "Welsey" — the latter survives only in our URL slug,
kept deliberately to preserve its indexed URL.

⚠️ Do **not** describe Wesley Starlin as the medical reviewer of clinical content.
An LMHC is a counsellor, and that attribution is under review by Compliance
(T-29). Executive Director is correct and safe.

## Imagery

Our optimized assets live in this repo under `public/images/`. Staff portraits
exist for all but Bethany Hamilton — hers is outstanding on our side too (T-21 /
T-26). Ask us and we will supply files rather than having you re-scrape
production, whose Gold Seal image 404s on all 34 pages.

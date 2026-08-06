# Audit data — snapshot 2026-08-05

Durable copies of everything [../../issues.md](../../issues.md) is derived from. The Google Sheet
is live and will drift; these files are the frozen inputs that the register's counts and
row IDs refer to.

| File | What it is |
|---|---|
| `QHG-sheet-snapshot-2026-08-05.xlsx` | Byte copy of the source Google Sheet, all 5 tabs, exported 2026-08-05 |
| `sheet-all-tabs.json` | All 5 tabs parsed to JSON — every non-empty row, all facilities |
| `des-moines-visual-issues-206.json` | The 206 Visual Issues rows for this facility, with theme tags |
| `production-sitemap-urls.txt` | 34 URLs from `desmoinesrecovery.com/sitemap_index.xml` (all trailing-slash) |
| `build-sitemap-urls.txt` | 34 URLs from the new build's `sitemap.xml` (all slashless, production hostnames — see T-03) |
| `cutover-sitemap-diff.json` | Production↔build path diff feeding T-04 and T-13 |
| `production-linkcheck.json` | Status code for all 188 internal links + assets on production; 16 non-200 |
| `QHG-staff-bios-snapshot-2026-08-05.docx` | Full portfolio staff-bios doc, all 24 sections, exported 2026-08-05 |
| `des-moines-staff-bios.md` | Verbatim extract of the "Des Moines Recovery" section — **source of record for names, titles, credentials** |

## Sources

Sheet: `https://docs.google.com/spreadsheets/d/1daiRElkRoKObt9KCsqFeXEhmtSBk5c1MQjUeaKx2nC8/edit`
Sheet audit date 2026-07-27 · sheet verification pass 2026-07-28 · this snapshot 2026-08-05.

Bios doc: `https://docs.google.com/document/d/1MWL4ki6HDCcUN-1mh2EFU-6eoMVpwpSSRMDm58Me3oA/edit`
Pulled 2026-08-05. 17,298 words. Iowa content is entirely one section (5 staff).

```bash
DOC=1MWL4ki6HDCcUN-1mh2EFU-6eoMVpwpSSRMDm58Me3oA
curl -sL "https://docs.google.com/document/d/$DOC/export?format=txt" -o doc.txt
```

## Reproducing the extract

```bash
ID=1daiRElkRoKObt9KCsqFeXEhmtSBk5c1MQjUeaKx2nC8
curl -sL "https://docs.google.com/spreadsheets/d/$ID/export?format=xlsx" -o sheet.xlsx
```

The sheet is link-shared and readable without auth. Parse with `openpyxl`
(`data_only=True` to resolve formulas to values).

## Known caveats in the source data

- The **Legend tab understates the row count**: it claims 118 rows / IDs locked to
  V0001–V0118, but the Vercel Build Issues tab contains IDs up to **V0135**.
- **All 206 Visual Issues rows are unverified** by the sheet's own verification pass.
  The Legend warns roughly two thirds of *verified* rows still needed a correction.
- **Visual Issues rows 1501–1810** are ID-only placeholders with no content.
- Filtering on the Facility column alone **misses cross-references** — 5 rows filed under
  *Quadrant Health Group (parent)* concern this facility. See Appendix D in `issues.md`.
- This facility received **no deep-audit round** (V0119–V0135) and has the fewest
  build-issue rows in the portfolio. The 4 rows are a floor, not a ceiling.

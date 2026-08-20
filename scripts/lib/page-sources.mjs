/**
 * Hand-authored page sources, for the content guards.
 *
 * The claim and service guards were written when every page's copy lived in
 * content/*.json, so they walk JSON and nothing else. Pages built directly in
 * TSX — campaign landing pages, whose copy is in the component — sat outside all
 * of them. That is the worst place to have a gap: a paid landing page is exactly
 * where an unsubstantiated accreditation or a service the facility does not
 * offer costs Google Ads eligibility.
 *
 * Comments are stripped before scanning, so that a comment explaining why a
 * claim is forbidden does not itself read as making the claim.
 */
import fs from 'node:fs'
import path from 'node:path'

/** Remove block, JSX and line comments. The `(?<!:)` guard keeps `https://`
 *  and other protocol-relative text from being read as a line comment. */
export function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(?<!:)\/\/[^\n]*/g, ' ')
}

/** Every `page.tsx` under app/, as { label, text } with comments stripped. */
export function pageSources(root = process.cwd()) {
  const app = path.join(root, 'app')
  const out = []

  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
      } else if (entry.name === 'page.tsx') {
        out.push({
          label: path.relative(root, full),
          text: stripComments(fs.readFileSync(full, 'utf-8')),
        })
      }
    }
  }

  if (fs.existsSync(app)) walk(app)
  return out
}

# CTM + Clarion attribution — rollout spec

Reference implementation: this repo (`desmoinesrecovery.com`), commits `bfe67ff`, `743ae5a`, `0e45322`.

You are applying this to **one other facility site**. Read all of section 1 before changing
anything: the correct fix differs per site, and applying the wrong one creates duplicate lead
submissions.

Everything below was verified by reading the live `t.js` for CTM account 264810 and the
published `forms-capture.v1.js`, and by driving this repo's implementation end-to-end in a
browser. Where something is unknown for your site, it is called out as a question to answer,
not an assumption to carry.

---

## 0. The three faults

Independent. A site can have any combination. Fixing one does nothing for the others.

| | Fault | Symptom |
|---|---|---|
| **A** | CTM `t.js` missing | No CTM session exists, so nothing can attach to a lead. No dynamic number swap. |
| **B** | Campaign lost after the first pageview | Attribution read from `location.search` at submit time. Land on an ad → read two pages → submit, and the lead reads as direct traffic. |
| **C** | CTM session id absent, wrong, or in the wrong place | CTM files the lead against no visit. |

**All three fail silently.** Clarion returns `200 OK`, the dashboard says delivered, and the
lead really does arrive — a rep can call the person back. Only the link to the ad click is
missing. Never treat "the lead arrived" as evidence that attribution works.

### The two ids

```
6a88a9cc00040a6a4743909d              CTM's — 24 hex, no dashes.  ← what CTM wants
f01079ad-73b9-4e58-abbb-a2dc68b7faac  a UUID from the site's own session store
```

If it has dashes it is not CTM's. Never substitute one for the other; returning `null` is
correct, substituting a UUID is the bug.

---

## 1. Triage — do this first

Open the deployed site with devtools. Answer all four.

### Q1 — Is `t.js` present exactly once?

```js
window.__ctm && window.__ctm.config.aid                      // expect 264810
document.querySelectorAll('script[src*="tctm.co"]').length   // expect 1
```

- `undefined` → **Fault A**. Do section 2 first; nothing else works without it.
- `2` or more → two copies. Double-counts sessions, makes number swap unpredictable. Remove the
  extra before anything else. A tag in GTM plus one in the template is the usual cause.
- a different `aid` → different CTM account. **Stop and ask.** Do not assume 264810.

### Q2 — How do forms reach Clarion?

```js
document.querySelectorAll('script[src*="forms-capture"]').length
```

- `1` → vendor script handles submission. Go to **section 3**.
- `0` → the site posts to its own endpoint. Go to **section 4**.
- `1` **and** a custom submit handler → **stop**. Both paths active means every lead is sent
  twice. `forms-capture.v1.js` does not check `defaultPrevented`. Pick one path.

### Q3 — Does campaign data survive a second pageview?

1. Visit `/?utm_source=test&utm_medium=cpc&gclid=TEST123`
2. Navigate to the form page (the query string should now be gone)
3. Submit with the Network tab open and read the request payload

`utm` and `gclid` missing → **Fault B**. Expect this on every site.

### Q4 — Does a browser POST to Clarion work from this origin?

This decides whether the site can use the vendor script at all.

- Works → the origin is on Clarion's allowlist. **Keep the vendor script.** It is the simpler path.
- 403 / CORS failure → origin not allowlisted. Either get it added (preferred), or move to the
  server relay in section 4.

> **This repo uses a server-side relay only because Clarion's endpoint answers no CORS preflight
> and pins this site key to an allowlist excluding `desmoinesrecovery.com`. That is a
> site-specific workaround, not the fleet template.** Do not port the relay to a site where the
> browser POST already works.

---

## 2. Fault A — install `t.js`

```html
<script src="https://264810.tctm.co/t.js"></script>
```

- Absolute `https://`, not the protocol-relative `//264810.tctm.co/...` form.
- Every page, including campaign landing pages. In a framework that means the **root** layout,
  not a per-route include that landing pages skip.
- Load it **eagerly** — it performs the dynamic number swap, so deferring it lets a visitor read
  and dial the wrong number.
- After deploying, re-run Q1 and confirm exactly one copy.

CSP, if the site has one: add `264810.tctm.co` to `script-src` and `connect-src`, plus
`frame-src` if the site embeds a CTM FormReactor.

---

## 3. Sites using `forms-capture.v1.js`

I read the currently published script. Two things to know.

### It already handles Fault C — do not rebuild this

It sends `ctm_visitor_sid`, hooks `window.__ctm_loaded`, polls up to 20s as a fallback, and
caches to `sessionStorage` under `clarion_ctm_sid`. **No work needed for the CTM id.**

### It does NOT handle Fault B

| Field | Source | Survives navigation |
|---|---|---|
| `ctm_visitor_sid` | `__ctm.config.sid`, cached | yes |
| `landing_page_url` | first touch, `clarion_ft_landing` | yes |
| `referrer` | first touch, `clarion_ft_referrer` | yes |
| `utm` | **live** `new URLSearchParams(location.search)` | **no** |
| `gclid` | **live** `location.search` | **no** |
| `wbraid` / `gbraid` | not collected at all | never |

Landing page and referrer are persisted; **the campaign itself is not**. Any visitor who reads a
second page before converting arrives with a correct landing page and no campaign. The CRM
record looks populated, so this is invisible — it shows up only as paid spend that appears to
convert at zero.

It also never collects `wbraid`/`gbraid` (Google's `gclid` substitutes under iOS and consent
mode), and CTM account 264810's own routing rules key on both — so CTM attributes those clicks
while Clarion cannot.

### Fix: persist the campaign before the vendor script reads it

Load this **before** `forms-capture.v1.js`.

```html
<script>
(function () {
  // forms-capture reads utm/gclid from location.search at submit time, so a visitor
  // who browses before converting loses the campaign. Persist on first touch and
  // restore into the query string on later pageviews.
  // localStorage, not sessionStorage: a second tab is the same visit.
  var KEY = 'campaign.first_touch.v1', TTL = 30 * 24 * 60 * 60 * 1000;
  var KEYS = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content',
              'gclid','gbraid','wbraid','fbclid','msclkid'];

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || 'null');
      return v && Date.now() - v.at < TTL ? v : null;
    } catch (e) { return null; }
  }

  var now = new URLSearchParams(location.search), found = {};
  KEYS.forEach(function (k) { if (now.get(k)) found[k] = now.get(k); });

  // A fresh click always wins — that is a new campaign, not a continuation.
  if (Object.keys(found).length) {
    try { localStorage.setItem(KEY, JSON.stringify({ p: found, at: Date.now() })); } catch (e) {}
    return;
  }

  var saved = read();
  if (!saved) return;

  var url = new URL(location.href), changed = false;
  Object.keys(saved.p).forEach(function (k) {
    if (!url.searchParams.get(k)) { url.searchParams.set(k, saved.p[k]); changed = true; }
  });
  if (changed) try { history.replaceState(null, '', url.toString()); } catch (e) {}
})();
</script>
```

**Trade-off to check before shipping:** this puts campaign parameters into the URL on internal
pages. On these sites the path already implies a diagnosis, so confirm it does not end up
anywhere that logs full URLs against a person. If that is a concern, use the section 4 approach
and send the fields explicitly instead.

---

## 4. Sites with their own form endpoint

### What the browser must send

Clarion reads the CTM id from a **flat, top-level `ctm_visitor_sid`**. Nesting it is the entire
Fault C on this repo — we had it at `session.ctm.session_id` and their parser never found it.

```
{
  name, phone, email, ...        // the person's answers

  page_url,                      // current page
  landing_page_url,              // the real entry page, with its campaign
  referrer,                      // external referrer, not the previous internal page
  utm,                           // { source, medium, campaign, term, content }
  gclid,                         // fall back to wbraid / gbraid

  ctm_visitor_sid                // ← FLAT, TOP-LEVEL. 24 hex, no dashes.
}
```

### Reading the CTM id

```js
function ctmSessionId() {
  var sid = null, vid = null;
  try { sid = window.__ctm && window.__ctm.config && window.__ctm.config.sid; } catch (e) {}
  try {
    var m = document.cookie.match(/(?:^|;\s*)__ctmid=([^;]*)/);
    vid = m ? decodeURIComponent(m[1]) : null;
  } catch (e) {}

  var CTM = /^[0-9a-f]{24}$/i;
  if (CTM.test(sid || '')) return sid;
  if (CTM.test(vid || '')) return vid;
  // Never fall back to the app's own session id.
  return sid || vid || null;
}
```

**Do not stash a copy in `sessionStorage`.** CTM already persists this: `__ctmid` is a
first-party cookie with a 30-day lifetime, and `t.js` reconciles `config.sid` against it on
load. The cookie survives a full page load and a second tab; `sessionStorage` does not. A
stashed copy can only be staler.

### Recover it server-side too

`__ctmid` is first-party, so it rides along on the submission request. This means a client-side
regression cannot silently un-attribute every lead.

```js
const CTM_ID = /^[0-9a-f]{24}$/i

function ctmVisitorSid(body, request) {
  const fromClient = typeof body.ctm_visitor_sid === 'string' ? body.ctm_visitor_sid : null
  if (fromClient && CTM_ID.test(fromClient)) return fromClient

  const raw = request.headers.get('cookie')?.match(/(?:^|;\s*)__ctmid=([^;]*)/)?.[1]
  const fromCookie = raw ? decodeURIComponent(raw) : null
  if (fromCookie && CTM_ID.test(fromCookie)) {
    if (fromClient) console.warn('[lead] non-CTM sid from browser; using __ctmid cookie')
    return fromCookie
  }
  if (fromClient) { console.warn('[lead] sid not CTM-shaped and no cookie — no visit will attach'); return fromClient }
  console.warn('[lead] no CTM session id — t.js likely blocked')
  return null
}
```

### If you also forward a rich `session` object

- **Rebuild it, do not pass it through.** The endpoint is public and unauthenticated and the
  object is shaped entirely by the client. Cap depth, key count, array length, string length and
  total bytes. Ours reduces a hostile 60 KB payload to 1.3 KB and strips `__proto__`.
- **Retry once without it if the vendor returns 4xx.** `session` is a key Clarion had not been
  asked to accept; if their validation is strict, an unknown field turns every lead into an
  error. Losing admissions enquiries to gain attribution is not a trade worth making.

### Fault B on these sites

Capture attribution on the first pageview into `localStorage`, read it at submit time. Copy
`lib/session.ts` from this repo — framework-agnostic logic, ~200 lines without comments. It uses
a 30-minute inactivity window and re-attributes when a fresh ad click arrives mid-visit.

Record a pageview on **every route change**, not just first paint. In Next.js App Router use
`usePathname` — `useSearchParams` forces a Suspense boundary and opts every static page into
dynamic rendering.

### The CTM-hosted FormReactor iframe, if the site has one

Cross-origin; unreachable from your code. Attribution reaches it via
`window.__ctm_cvars.push({...})`, which `t.js` serialises onto every event. Push **once per
session**, and keep it to attribution only — `t.js` already sends the page URL, and on these
sites a path discloses what someone is seeking treatment for.

---

## 5. Acceptance criteria

Do not report done until all of these pass.

**In the browser, on the deployed site:**

- [ ] Land on `/?utm_source=test&utm_medium=cpc&gclid=TEST123`, navigate to the form page, confirm the query string is gone
- [ ] Submit with the Network tab open and read the actual request payload
- [ ] `ctm_visitor_sid` is 24 hex, no dashes, and equals **both** `__ctm.config.sid` and the `__ctmid` cookie
- [ ] `utm` and `gclid` are populated despite the clean URL
- [ ] `landing_page_url` is the campaign entry page, not the form page
- [ ] Exactly **one** submission request fired

**In CTM:**

- [ ] Open the visit and confirm the form is attached to it — this is the only real proof, and no `200` response substitutes for it
- [ ] Confirm the lead routed to the correct facility (one CTM account serves the whole fleet)

**If you built a test script:** it cannot prove attribution. The CTM id only exists in a real
browser, so any curl/node harness produces a lead with no visit attached — *exactly the symptom
being investigated*. Our `scripts/verify-lead.mjs` did this and would have reported the fix as
failed. It now takes `--ctm-sid=<24 hex>`, refuses a UUID outright, and warns loudly without
one. Make any equivalent harness do the same.

---

## 6. Do not

- **Do not add `forms-capture.v1.js` to a site that already posts to its own endpoint.** Every
  lead gets sent twice. Run Q2 first.
- **Do not assume a missing script means a missing feature.** On this repo, two of the three
  things originally requested needed no change: CTM was already installed on the correct
  account, and submissions were already arriving by a different route. Verify behaviour, not the
  presence of a tag.
- **Do not port the server relay** to a site where the browser POST works (Q4).
- **Do not use `sessionStorage`** for a value CTM already keeps in a 30-day first-party cookie.
- **Do not send the app's own session id** as `ctm_visitor_sid`, ever. `null` is the correct
  value when CTM's id is unavailable.
- **Do not forget the trailing slash** on the submit URL if the site normalises to trailing
  slashes — otherwise every lead pays a 308 first.

---

## 7. Reference implementation

| File | What it does |
|---|---|
| `lib/session.ts` | Session + attribution store, CTM identity, `ctm_visitor_sid` |
| `components/SessionTracker.tsx` | Records pageviews on route change |
| `app/api/verify-insurance/route.ts` | Server relay, sanitiser, cookie fallback, 4xx retry |
| `scripts/verify-lead.mjs` | Lead test harness with the `--ctm-sid` guard |

## 8. Fleet

Derived from the routing rules inside CTM account 264810's own `t.js` — this reflects what CTM
is configured for, not necessarily the list of live sites. Reconcile before scoping.

`desmoinesrecovery.com` (done), `dallasdetoxcenter.com`, `hillsidemission.com`,
`lagunaviewdetox.com`, `marinaharbordetox.com`, `harbordetox.com`, `wellnessrecoverynj.com`,
`wellnessdetoxla.com`, `oceancoastrecovery.com`, `seasidewellnesspb.com`,
`fortworthwellness.org`, `greatertexasbehavioral.com`

Two more facilities appear as rule names with no domain attached — **The Ohio RC** and
**Encinitas Detox**. If either has a website it is missing from this list. That is 12 domains
against the 11 in the original request; reconcile the two.

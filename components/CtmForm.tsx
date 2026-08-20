import Script from 'next/script'

type Props = {
  /** CTM-hosted FormReactor page for this campaign. */
  formUrl: string
  /** Frame title — required for assistive tech, and Lighthouse fails
   *  `frame-title` without it. The site is at accessibility 100; keep it there. */
  title: string
}

/** CallTrackingMetrics FormReactor embed.
 *
 *  This is CTM's own snippet, unchanged in the two parts that are load-bearing:
 *  the `ctm-call-widget` class is what formreactor.js selects on, and the 300px
 *  height is only a starting value — the script listens for a `resize` message
 *  from the frame and grows the iframe to fit its content.
 *
 *  It resizes reliably on desktop — measured 300px growing to 449px — but at a
 *  phone width it left the height at 300px and only added `max-width: 100vw`.
 *  The form's submit button sits 414px down at every width, so on a phone the
 *  one control the page exists to get pressed was 114px below the cut, reachable
 *  only by scrolling inside the frame. Hence the min-height floor: it cannot
 *  clip the form, and formreactor is still free to grow the iframe past it for
 *  validation messages.
 *
 *  The floor doubles as the fallback for the script failing outright. It is
 *  third-party and cross-origin, so that is a real possibility, and without the
 *  floor a blocked formreactor.js means a permanently clipped form. The script
 *  still loads `afterInteractive` rather than on window load, because it also
 *  carries the form's submission plumbing. */
export default function CtmForm({ formUrl, title }: Props) {
  return (
    <>
      <iframe
        className="ctm-call-widget min-h-[460px]"
        src={formUrl}
        title={title}
        style={{ width: '100%', height: '300px', border: 'none' }}
      />
      <Script src="https://264810.tctm.co/formreactor.js" strategy="afterInteractive" />
    </>
  )
}

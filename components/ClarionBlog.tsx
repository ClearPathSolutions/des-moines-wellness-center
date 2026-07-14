'use client'

import { useEffect } from 'react'

const SITE_KEY = 'cpx__fSy1X8JikCR2mQQMFTF81zFCiT5KP33'
const API = 'https://api.clarionlabs.ai'
const SRC = 'https://www.clarionlabs.ai/blog-embed.v1.js'

/**
 * Mount point + loader for Clarion Labs' blog embed. Clarion renders the blog
 * index / posts inside the `data-clarion-blog` element and manages content
 * remotely, mirroring the chat-widget and forms-capture integrations.
 *
 * The script is injected imperatively (rather than via next/script) so we get
 * a real, executing <script> element with the data-site-key / data-api
 * attributes present in the live DOM. next/script rendered this as a
 * <link rel="preload"> in the SSR HTML and did not reliably forward the
 * data-* attributes to the injected tag, so the embed read an empty site key
 * (SITE_KEY = script.getAttribute('data-site-key')) and bailed out.
 */
export default function ClarionBlog() {
  useEffect(() => {
    // Avoid double-injecting on client-side navigation / re-mount.
    if (document.querySelector(`script[data-clarion-blog-embed]`)) return

    const s = document.createElement('script')
    s.src = SRC
    s.async = true
    s.setAttribute('data-site-key', SITE_KEY)
    s.setAttribute('data-api', API)
    s.setAttribute('data-clarion-blog-embed', '') // marker for the guard above
    document.body.appendChild(s)
  }, [])

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
      <div data-clarion-blog />
    </section>
  )
}

'use client'

import Script from 'next/script'

const SITE_KEY = 'cpx__fSy1X8JikCR2mQQMFTF81zFCiT5KP33'
const API = 'https://api.clarionlabs.ai'

/**
 * Mount point + loader for Clarion Labs' blog embed. Clarion renders the blog
 * index / posts inside the `data-clarion-blog` element and manages content
 * remotely, mirroring the chat-widget and forms-capture integrations.
 */
export default function ClarionBlog() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
      <div data-clarion-blog />
      <Script
        src="https://www.clarionlabs.ai/blog-embed.v1.js"
        data-site-key={SITE_KEY}
        data-api={API}
        strategy="afterInteractive"
      />
    </section>
  )
}

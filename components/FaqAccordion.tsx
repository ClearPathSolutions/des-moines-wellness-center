'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Faq } from '@/lib/types'

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="mx-auto max-w-3xl divide-y divide-line rounded-2xl border border-line bg-white">
      {faqs.map((f, i) => {
        const isOpen = open === i
        return (
          <div key={i}>
            <button
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="font-heading text-lg font-semibold text-brand-dark">{f.q}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-gold transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isOpen ? (
              <div className="px-5 pb-5 prose-brand">
                <p>{f.a}</p>
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

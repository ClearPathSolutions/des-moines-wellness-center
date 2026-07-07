'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Menu, X, ChevronDown } from 'lucide-react'
import type { NavItem } from '@/lib/types'

type Props = {
  nav: NavItem[]
  phone: string
  phoneHref: string
  siteName: string
}

export default function Header({ nav, phone, phoneHref, siteName }: Props) {
  const [open, setOpen] = useState(false)

  // Mobile drawer: close on Escape and lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-line/70 bg-cream/90 backdrop-blur-md">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label={`${siteName} home`}>
          <Image
            src="/images/logo-horizontal.png"
            alt={siteName}
            width={220}
            height={56}
            priority
            className="h-11 w-auto"
          />
        </Link>

        {/* Desktop nav — submenus reveal on hover AND keyboard focus (group-focus-within) */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {nav.map((item) =>
            item.children?.length ? (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-ink/80 hover:bg-brand-50 hover:text-brand group-focus-within:bg-brand-50 group-focus-within:text-brand"
                  aria-haspopup="true"
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </Link>
                <div className="absolute left-1/2 top-full hidden -translate-x-1/2 pt-2 group-hover:block group-focus-within:block">
                  <ul className="w-64 rounded-2xl border border-line bg-white p-2 shadow-soft">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className="block rounded-xl px-3 py-2 text-sm text-ink/80 hover:bg-brand-50 hover:text-brand"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-ink/80 hover:bg-brand-50 hover:text-brand"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={phoneHref} className="btn-primary">
            <Phone className="h-4 w-4" />
            {phone}
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden rounded-full p-2 text-brand-dark"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <Menu className="h-7 w-7" />
        </button>
      </div>
    </header>

    {/* Mobile drawer — kept OUTSIDE <header> so its `fixed` positioning is relative to
        the viewport (the header's backdrop-blur would otherwise trap it). */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-brand-dark/40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm overflow-y-auto bg-cream p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-heading text-lg font-semibold text-brand-dark">Menu</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-7 w-7 text-brand-dark" />
              </button>
            </div>
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {nav.map((item) => (
                <div key={item.label} className="border-b border-line/60 py-1">
                  <Link
                    href={item.href}
                    className="block py-2 font-medium text-brand-dark"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.children?.length ? (
                    <ul className="mb-2 ml-3 flex flex-col gap-1">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            className="block py-1.5 text-sm text-muted"
                            onClick={() => setOpen(false)}
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </nav>
            <a href={phoneHref} className="btn-primary mt-6 w-full">
              <Phone className="h-4 w-4" />
              {phone}
            </a>
          </div>
        </div>
      )}
    </>
  )
}

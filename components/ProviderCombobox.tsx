'use client'

import { useId, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { INSURANCE_PROVIDERS } from '@/lib/insuranceProviders'

type Props = {
  value: string
  onChange: (value: string) => void
  name?: string
  required?: boolean
  placeholder?: string
  className?: string
  id?: string
}

/**
 * Accessible provider picker: a text input with a filtered dropdown of known
 * payers. Users can pick from the list or type any provider that isn't listed
 * (free-text fallback). Follows the ARIA combobox (editable) pattern.
 */
export default function ProviderCombobox({
  value,
  onChange,
  name,
  required,
  placeholder,
  className = '',
  id,
}: Props) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const listId = `${inputId}-list`

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const wrapRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const matches = useMemo(() => {
    const q = value.trim().toLowerCase()
    if (!q) return INSURANCE_PROVIDERS
    return INSURANCE_PROVIDERS.filter((p) => p.toLowerCase().includes(q))
  }, [value])

  const commit = (provider: string) => {
    onChange(provider)
    setOpen(false)
    setActive(-1)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) {
        setOpen(true)
        return
      }
      setActive((i) => (matches.length ? (i + 1) % matches.length : -1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) return
      setActive((i) => (matches.length ? (i - 1 + matches.length) % matches.length : -1))
    } else if (e.key === 'Enter') {
      if (open && active >= 0 && active < matches.length) {
        e.preventDefault()
        commit(matches[active])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActive(-1)
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <input
          id={inputId}
          name={name}
          value={value}
          required={required}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-opt-${active}` : undefined}
          onChange={(e) => {
            onChange(e.target.value)
            setOpen(true)
            setActive(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            // Delay so an option click registers before we close.
            closeTimer.current = setTimeout(() => setOpen(false), 120)
          }}
          className={`${className} pr-10`}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={open ? 'Hide providers' : 'Show providers'}
          onMouseDown={(e) => {
            // Prevent the input's blur from firing before we toggle.
            e.preventDefault()
            setOpen((o) => !o)
          }}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && matches.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1.5 max-h-64 w-full overflow-auto rounded-xl border border-line bg-white py-1 shadow-card"
        >
          {matches.map((provider, i) => {
            const selected = provider === value
            return (
              <li
                key={provider}
                id={`${listId}-opt-${i}`}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  // Commit before the input's blur closes the list.
                  e.preventDefault()
                  if (closeTimer.current) clearTimeout(closeTimer.current)
                  commit(provider)
                }}
                className={`flex cursor-pointer items-center justify-between px-4 py-2 text-sm text-ink ${
                  i === active ? 'bg-brand/10' : ''
                }`}
              >
                <span>{provider}</span>
                {selected && <Check className="h-4 w-4 text-brand" />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

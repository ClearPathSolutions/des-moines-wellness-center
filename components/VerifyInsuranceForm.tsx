'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShieldCheck, Lock, CheckCircle2, Phone, AlertTriangle, Loader2 } from 'lucide-react'
import ProviderCombobox from './ProviderCombobox'
import { submissionAttribution } from '@/lib/session'

const PHONE = '888-378-2158'
const PHONE_HREF = `tel:+1${PHONE.replace(/\D/g, '')}`

type Fields = {
  name: string
  phone: string
  email: string
  dob: string
  provider: string
  memberId: string
  message: string
}

const EMPTY: Fields = { name: '', phone: '', email: '', dob: '', provider: '', memberId: '', message: '' }

type Status = 'idle' | 'submitting' | 'sent' | 'error'

export default function VerifyInsuranceForm() {
  const [f, setF] = useState<Fields>(EMPTY)
  const [status, setStatus] = useState<Status>('idle')
  const [consented, setConsented] = useState(false)

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'submitting') return
    setStatus('submitting')

    try {
      // Trailing slash matters: next.config sets `trailingSlash: true`, so the
      // unslashed path 308s and every submission pays a second round trip.
      const res = await fetch('/api/verify-insurance/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.name,
          phone: f.phone,
          email: f.email,
          date_of_birth: f.dob,
          provider: f.provider,
          member_id: f.memberId,
          message: f.message,
          // Attribution the vendor's own capture script used to collect,
          // plus the full session — see lib/session.ts. Read from the stored
          // session rather than the current URL, because by the time someone
          // reaches this form the campaign query string is usually gone.
          ...submissionAttribution(),
        }),
      })
      // Only claim success when the lead was actually accepted. The previous
      // version showed the confirmation unconditionally, so a failed submission
      // looked identical to a successful one and the lead was lost silently.
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const field =
    'w-full rounded-xl border border-line bg-white px-4 py-3 text-ink placeholder:text-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold'

  if (status === 'sent') {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-line bg-white p-8 text-center shadow-card">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand" />
        <h3 className="mt-4">Thank you for submitting your insurance details.</h3>
        <p className="prose-brand mt-3">
          We&rsquo;re now running a verification of your coverage. An admissions specialist will
          reach out to you shortly to review your benefits and next steps. Prefer to talk now?
        </p>
        <a href={PHONE_HREF} className="btn-primary mt-6">
          <Phone className="h-4 w-4" />
          Call {PHONE}
        </a>
      </div>
    )
  }

  const submitting = status === 'submitting'

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-2xl rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8"
    >
      {status === 'error' ? (
        // A failed submission must never look like a successful one. Give the
        // visitor the phone number so the enquiry isn't simply lost.
        <div
          role="alert"
          className="mb-6 flex gap-3 rounded-xl border border-gold bg-cream p-4 text-sm"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" />
          <div>
            <p className="font-semibold text-brand-dark">We couldn&rsquo;t submit your details.</p>
            <p className="mt-1 text-muted">
              Nothing was sent. Please try again, or call us at{' '}
              <a href={PHONE_HREF} className="font-semibold text-brand underline">
                {PHONE}
              </a>{' '}
              and we&rsquo;ll verify your benefits over the phone right now.
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-brand-dark">
          Full name<span className="text-gold-dark"> *</span>
          <input required name="name" value={f.name} onChange={set('name')} className={`mt-1.5 ${field}`} autoComplete="name" />
        </label>
        <label className="block text-sm font-medium text-brand-dark">
          Phone<span className="text-gold-dark"> *</span>
          <input required type="tel" name="phone" value={f.phone} onChange={set('phone')} className={`mt-1.5 ${field}`} autoComplete="tel" />
        </label>
        <label className="block text-sm font-medium text-brand-dark">
          Email<span className="text-gold-dark"> *</span>
          <input required type="email" name="email" value={f.email} onChange={set('email')} className={`mt-1.5 ${field}`} autoComplete="email" />
        </label>
        <label className="block text-sm font-medium text-brand-dark">
          Date of birth<span className="text-gold-dark"> *</span>
          <input required type="date" name="date_of_birth" value={f.dob} onChange={set('dob')} className={`mt-1.5 ${field}`} autoComplete="bday" />
        </label>
        <label className="block text-sm font-medium text-brand-dark">
          Insurance provider<span className="text-gold-dark"> *</span>
          <ProviderCombobox
            required
            name="provider"
            value={f.provider}
            onChange={(v) => setF((prev) => ({ ...prev, provider: v }))}
            placeholder="Start typing, e.g. Aetna, Cigna, UMR"
            className={`mt-1.5 ${field}`}
          />
        </label>
        <label className="block text-sm font-medium text-brand-dark sm:col-span-2">
          Member ID <span className="font-normal text-muted">(optional — we can verify with your date of birth)</span>
          <input name="member_id" value={f.memberId} onChange={set('memberId')} className={`mt-1.5 ${field}`} />
        </label>
        <label className="block text-sm font-medium text-brand-dark sm:col-span-2">
          Anything else we should know? <span className="font-normal text-muted">(optional)</span>
          <textarea name="message" value={f.message} onChange={set('message')} rows={3} className={`mt-1.5 ${field}`} />
        </label>
      </div>

      {/* Explicit consent. The form collects health information and a phone
          number we will call back, so the visitor should be agreeing to both. */}
      <label className="mt-6 flex gap-3 text-sm text-muted">
        <input
          type="checkbox"
          required
          checked={consented}
          onChange={(e) => setConsented(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-line text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        />
        <span>
          I agree that Des Moines Wellness Center may use the information above to verify my
          insurance benefits and contact me by phone, text, or email about treatment. See our{' '}
          <Link href="/privacy-policy" className="font-semibold text-brand underline">
            Privacy Policy
          </Link>
          .<span className="text-gold-dark"> *</span>
        </span>
      </label>

      <button type="submit" className="btn-gold mt-6 w-full" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifying&hellip;
          </>
        ) : (
          <>
            <ShieldCheck className="h-4 w-4" />
            Verify My Insurance
          </>
        )}
      </button>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted">
        <Lock className="h-3.5 w-3.5" />
        Your details are sent securely and reviewed only by our admissions team.
      </p>
    </form>
  )
}

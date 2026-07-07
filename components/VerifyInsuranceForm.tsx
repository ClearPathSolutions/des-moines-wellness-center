'use client'

import { useState } from 'react'
import { ShieldCheck, Lock, CheckCircle2, Phone } from 'lucide-react'

const RECIPIENT = 'info@desmoinesrecovery.com'
const PHONE = '888-378-2158'

type Fields = {
  name: string
  phone: string
  email: string
  provider: string
  memberId: string
  message: string
}

const EMPTY: Fields = { name: '', phone: '', email: '', provider: '', memberId: '', message: '' }

export default function VerifyInsuranceForm() {
  const [f, setF] = useState<Fields>(EMPTY)
  const [sent, setSent] = useState(false)

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body = [
      `Name: ${f.name}`,
      `Phone: ${f.phone}`,
      `Email: ${f.email}`,
      `Insurance provider: ${f.provider}`,
      `Member ID: ${f.memberId || '(not provided)'}`,
      '',
      `Message: ${f.message || '(none)'}`,
    ].join('\n')
    const href = `mailto:${RECIPIENT}?subject=${encodeURIComponent(
      'Insurance Verification Request'
    )}&body=${encodeURIComponent(body)}`
    window.location.href = href
    setSent(true)
  }

  const field =
    'w-full rounded-xl border border-line bg-white px-4 py-3 text-ink placeholder:text-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold'

  if (sent) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-line bg-white p-8 text-center shadow-card">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand" />
        <h3 className="mt-4">Thank you — your request is on its way.</h3>
        <p className="prose-brand mt-3">
          Your email app should have opened with your details ready to send. Once you hit send, our
          admissions team will reach out shortly. Prefer to talk now?
        </p>
        <a href={`tel:+1${PHONE.replace(/\D/g, '')}`} className="btn-primary mt-6">
          <Phone className="h-4 w-4" />
          Call {PHONE}
        </a>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-2xl rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-brand-dark">
          Full name<span className="text-gold"> *</span>
          <input required value={f.name} onChange={set('name')} className={`mt-1.5 ${field}`} autoComplete="name" />
        </label>
        <label className="block text-sm font-medium text-brand-dark">
          Phone<span className="text-gold"> *</span>
          <input required type="tel" value={f.phone} onChange={set('phone')} className={`mt-1.5 ${field}`} autoComplete="tel" />
        </label>
        <label className="block text-sm font-medium text-brand-dark">
          Email<span className="text-gold"> *</span>
          <input required type="email" value={f.email} onChange={set('email')} className={`mt-1.5 ${field}`} autoComplete="email" />
        </label>
        <label className="block text-sm font-medium text-brand-dark">
          Insurance provider<span className="text-gold"> *</span>
          <input required value={f.provider} onChange={set('provider')} className={`mt-1.5 ${field}`} placeholder="e.g. Aetna, Cigna, UMR" />
        </label>
        <label className="block text-sm font-medium text-brand-dark sm:col-span-2">
          Member ID <span className="font-normal text-muted">(optional)</span>
          <input value={f.memberId} onChange={set('memberId')} className={`mt-1.5 ${field}`} />
        </label>
        <label className="block text-sm font-medium text-brand-dark sm:col-span-2">
          Anything else we should know? <span className="font-normal text-muted">(optional)</span>
          <textarea value={f.message} onChange={set('message')} rows={3} className={`mt-1.5 ${field}`} />
        </label>
      </div>

      <button type="submit" className="btn-gold mt-6 w-full">
        <ShieldCheck className="h-4 w-4" />
        Verify My Insurance
      </button>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted">
        <Lock className="h-3.5 w-3.5" />
        100% confidential. Verifying your benefits carries no obligation to enroll.
      </p>
    </form>
  )
}

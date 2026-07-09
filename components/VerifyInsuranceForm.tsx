'use client'

import { useState } from 'react'
import { ShieldCheck, Lock, CheckCircle2, Phone } from 'lucide-react'
import ProviderCombobox from './ProviderCombobox'

const PHONE = '888-378-2158'

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

const CLARION_FORM_KEY = 'insurance_verification'

declare global {
  interface Window {
    ClarionForms?: {
      submit: (opts: { form_key?: string; data?: Record<string, string> }) => Promise<unknown>
      scan: () => void
    }
  }
}

export default function VerifyInsuranceForm() {
  const [f, setF] = useState<Fields>(EMPTY)
  const [sent, setSent] = useState(false)

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Submit the lead to Clarion Labs.
    window.ClarionForms?.submit({
      form_key: CLARION_FORM_KEY,
      data: {
        name: f.name,
        phone: f.phone,
        email: f.email,
        date_of_birth: f.dob,
        provider: f.provider,
        member_id: f.memberId,
        message: f.message,
      },
    })

    setSent(true)
  }

  const field =
    'w-full rounded-xl border border-line bg-white px-4 py-3 text-ink placeholder:text-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold'

  if (sent) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-line bg-white p-8 text-center shadow-card">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand" />
        <h3 className="mt-4">Thank you for submitting your insurance details.</h3>
        <p className="prose-brand mt-3">
          We&rsquo;re now running a verification of your coverage. An admissions specialist will
          reach out to you shortly to review your benefits and next steps. Prefer to talk now?
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
      data-clarion-form={CLARION_FORM_KEY}
      className="mx-auto max-w-2xl rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-brand-dark">
          Full name<span className="text-gold"> *</span>
          <input required name="name" value={f.name} onChange={set('name')} className={`mt-1.5 ${field}`} autoComplete="name" />
        </label>
        <label className="block text-sm font-medium text-brand-dark">
          Phone<span className="text-gold"> *</span>
          <input required type="tel" name="phone" value={f.phone} onChange={set('phone')} className={`mt-1.5 ${field}`} autoComplete="tel" />
        </label>
        <label className="block text-sm font-medium text-brand-dark">
          Email<span className="text-gold"> *</span>
          <input required type="email" name="email" value={f.email} onChange={set('email')} className={`mt-1.5 ${field}`} autoComplete="email" />
        </label>
        <label className="block text-sm font-medium text-brand-dark">
          Date of birth<span className="text-gold"> *</span>
          <input required type="date" name="date_of_birth" value={f.dob} onChange={set('dob')} className={`mt-1.5 ${field}`} autoComplete="bday" />
        </label>
        <label className="block text-sm font-medium text-brand-dark">
          Insurance provider<span className="text-gold"> *</span>
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

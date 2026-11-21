import { useEffect, useRef, type FormEvent, useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { QuoteSelection } from '../types';

type QuoteModalProps = {
  selected: QuoteSelection;
  onClose: () => void;
};

type SubmitState = 'idle' | 'busy' | 'saved' | 'saved_no_email' | 'error';

export function QuoteModal({ selected, onClose }: QuoteModalProps) {
  const [state, setState] = useState<SubmitState>('idle');
  const [message, setMessage] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selected, onClose]);

  useEffect(() => {
    if (selected) {
      setState('idle');
      setMessage('');
    }
  }, [selected]);

  if (!selected) return null;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) {
      setState('error');
      setMessage('Quotation submissions require a configured Supabase connection.');
      return;
    }
    setState('busy');
    setMessage('');
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const productId = selected!.id && !selected!.id.startsWith('draft-') ? selected!.id : null;

    const { data, error } = await supabase.functions.invoke('submit-quote', {
      body: {
        ...payload,
        product_id: productId,
        product_name: selected!.name,
      },
    });

    const body = (typeof data === 'string' ? JSON.parse(data) : data) as {
      received?: boolean;
      email_sent?: boolean;
      email_not_configured?: boolean;
      error?: string;
    } | null;

    if (error || body?.error) {
      setState('error');
      if (body?.error === 'rate_limited') {
        setMessage('Too many requests. Please wait a few minutes and try again.');
      } else {
        setMessage('Submission unavailable. Please try again later.');
      }
      return;
    }
    if (body?.email_not_configured) {
      setState('saved_no_email');
      setMessage(
        'Your request was saved. Email notification is not configured yet — the team will follow up through the admin dashboard.',
      );
    } else if (body?.email_sent === false) {
      setState('saved_no_email');
      setMessage('Your request was saved. We could not confirm email delivery — please contact us if you need urgent follow-up.');
    } else {
      setState('saved');
      setMessage('Your quotation request has been received. Thank you.');
    }
  }

  const fields: [string, string, boolean?][] = [
    ['full_name', 'Full name', true],
    ['company', 'Company name'],
    ['email', 'Email address', true],
    ['phone', 'Contact number', true],
    ['quantity', 'Quantity'],
    ['project_location', 'Project location'],
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 overflow-y-auto p-3 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={dialogRef} className="mx-auto max-w-2xl bg-white rounded-lg shadow-xl p-6 md:p-10 w-full">
        <div className="flex justify-between gap-3 mb-6">
          <div>
            <p className="text-amber-600 font-bold text-sm">PRODUCT INQUIRY</p>
            <h2 id="quote-title" className="text-2xl font-extrabold">
              Request a Quotation
            </h2>
            <p className="text-slate-500 mt-2">Selected: {selected.name}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close quotation form" className="p-2 hover:bg-slate-100 rounded">
            <X size={22} />
          </button>
        </div>
        <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
          <input type="hidden" name="product_name" value={selected.name} readOnly />
          <div className="hidden" aria-hidden="true">
            <label>
              Website
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          {fields.map(([key, label, required]) => (
            <label key={key}>
              <span className="label">{label}</span>
              <input
                className="field"
                name={key}
                type={key === 'email' ? 'email' : key === 'quantity' ? 'number' : 'text'}
                min={key === 'quantity' ? 1 : undefined}
                required={Boolean(required)}
                disabled={state === 'busy' || state === 'saved' || state === 'saved_no_email'}
              />
            </label>
          ))}
          <label className="md:col-span-2">
            <span className="label">Additional requirements</span>
            <textarea
              name="message"
              rows={4}
              className="field"
              disabled={state === 'busy' || state === 'saved' || state === 'saved_no_email'}
            />
          </label>
          <label className="md:col-span-2 flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="privacy_consent"
              value="yes"
              required
              className="mt-1"
              disabled={state === 'busy' || state === 'saved' || state === 'saved_no_email'}
            />
            <span>
              I agree that NC Elektric may use my contact details to respond to this quotation request and related project
              inquiries. (Privacy notice — finalize with legal counsel.)
            </span>
          </label>
          <div className="md:col-span-2 flex flex-wrap items-center gap-4">
            <button
              disabled={state === 'busy' || state === 'saved' || state === 'saved_no_email'}
              className="btn btn-yellow"
              type="submit"
            >
              {state === 'busy' ? 'Submitting…' : 'Send Quotation Request'}
            </button>
            <span
              role="status"
              className={`text-sm ${state === 'error' ? 'text-red-700' : 'text-slate-600'}`}
            >
              {message}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
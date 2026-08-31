import { createElement } from 'react';
import { FileText, AlertCircle } from 'lucide-react';

export default function TermsPage() {
  return createElement(
    'div',
    { className: 'max-w-4xl mx-auto space-y-6' },
    createElement(
      'div',
      { className: 'bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm space-y-6' },
      createElement(
        'div',
        { className: 'flex items-center gap-3 border-b border-slate-100 pb-4' },
        createElement(FileText, { className: 'w-7 h-7 text-blue-600' }),
        createElement(
          'div',
          null,
          createElement('h1', { className: 'text-xl font-bold text-slate-900' }, 'Terms of Service'),
          createElement('p', { className: 'text-xs text-slate-500' }, 'Rules and applicant responsibilities')
        )
      ),
      createElement(
        'div',
        { className: 'space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed' },
        createElement('h3', { className: 'font-bold text-slate-900 text-sm' }, '1. Candidate Registration'),
        createElement(
          'p',
          null,
          'By submitting your details via this portal, you confirm that all provided personal information, academic qualifications, and verification documents (Passport, ID, DCI Conduct) are accurate and authentic.'
        ),
        createElement('h3', { className: 'font-bold text-slate-900 text-sm' }, '2. Verification & Background Checks'),
        createElement(
          'p',
          null,
          'Broadshore reserves the right to cross-check submitted documents against relevant authorities (e.g., eCitizen, DCI, and Ministry of Labour databases) to verify candidate eligibility.'
        )
      )
    )
  );
}

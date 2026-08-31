import { createElement } from 'react';
import { ShieldCheck, CheckCircle } from 'lucide-react';

export default function NeaInfoPage() {
  return createElement(
    'div',
    { className: 'max-w-4xl mx-auto space-y-6' },
    createElement(
      'div',
      { className: 'bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm space-y-6' },
      createElement(
        'div',
        { className: 'flex items-center gap-3 border-b border-slate-100 pb-4' },
        createElement(ShieldCheck, { className: 'w-7 h-7 text-emerald-600' }),
        createElement(
          'div',
          null,
          createElement('h1', { className: 'text-xl font-bold text-slate-900' }, 'NEA Registration & Licensing Info'),
          createElement('p', { className: 'text-xs text-slate-500' }, 'National Employment Authority Compliance')
        )
      ),
      createElement(
        'div',
        { className: 'space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed' },
        createElement(
          'p',
          null,
          'Broadshore International operates in strict adherence to the regulations established by the National Employment Authority (NEA) of Kenya under the Ministry of Labour and Social Protection.'
        ),
        createElement(
          'div',
          { className: 'bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-2' },
          createElement('h3', { className: 'font-bold text-slate-900 text-sm' }, 'Key Compliance Standards'),
          createElement(
            'ul',
            { className: 'space-y-2 text-xs text-slate-700' },
            createElement(
              'li',
              { className: 'flex items-start gap-2' },
              createElement(CheckCircle, { className: 'w-4 h-4 text-emerald-500 shrink-0 mt-0.5' }),
              'Verified database registration via the NEAMIS online system.'
            ),
            createElement(
              'li',
              { className: 'flex items-start gap-2' },
              createElement(CheckCircle, { className: 'w-4 h-4 text-emerald-500 shrink-0 mt-0.5' }),
              'Strict adherence to zero hidden charges for candidate registration.'
            ),
            createElement(
              'li',
              { className: 'flex items-start gap-2' },
              createElement(CheckCircle, { className: 'w-4 h-4 text-emerald-500 shrink-0 mt-0.5' }),
              'Mandatory pre-departure orientation and contract attestation.'
            )
          )
        )
      )
    )
  );
}

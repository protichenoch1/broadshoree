import { createElement } from 'react';
import { Lock, Eye } from 'lucide-react';

export default function PrivacyPage() {
  return createElement(
    'div',
    { className: 'max-w-4xl mx-auto space-y-6' },
    createElement(
      'div',
      { className: 'bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm space-y-6' },
      createElement(
        'div',
        { className: 'flex items-center gap-3 border-b border-slate-100 pb-4' },
        createElement(Lock, { className: 'w-7 h-7 text-blue-600' }),
        createElement(
          'div',
          null,
          createElement('h1', { className: 'text-xl font-bold text-slate-900' }, 'Privacy Policy'),
          createElement('p', { className: 'text-xs text-slate-500' }, 'Data Protection & Security')
        )
      ),
      createElement(
        'div',
        { className: 'space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed' },
        createElement('h3', { className: 'font-bold text-slate-900 text-sm' }, '1. Collection of Data'),
        createElement(
          'p',
          null,
          'We collect identification details, contact records, employment histories, and verification documents necessary for international employment processing and visa application requirements.'
        ),
        createElement('h3', { className: 'font-bold text-slate-900 text-sm' }, '2. Data Usage & Sharing'),
        createElement(
          'p',
          null,
          'Your data is encrypted and strictly used for recruitment matching, NEA portal compliance, and official visa processing with verified international partners.'
        )
      )
    )
  );
}

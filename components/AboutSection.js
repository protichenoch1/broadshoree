'use client';

import { createElement } from 'react';
import { Globe2, ShieldCheck, Award, Users, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  return createElement(
    'div',
    { className: 'bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6' },
    /* Header Banner */
    createElement(
      'div',
      { className: 'bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-6 rounded-xl space-y-3' },
      createElement(
        'div',
        { className: 'flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider' },
        createElement(Globe2, { className: 'w-4 h-4' }),
        'About Broadshore International'
      ),
      createElement(
        'h2',
        { className: 'text-xl font-bold leading-snug' },
        'Connecting Qualified Kenyan Talent with Global Career Opportunities'
      ),
      createElement(
        'p',
        { className: 'text-slate-300 text-xs leading-relaxed' },
        'Broadshore is a registered, NEAMIS-compliant foreign employment recruitment agency dedicated to ethical placement, visa processing, and candidate preparation for global positions across Europe, Canada, the UK, and the Gulf region.'
      )
    ),

    /* Feature Grid */
    createElement(
      'div',
      { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 text-xs' },
      createElement(
        'div',
        { className: 'p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2' },
        createElement(
          'div',
          { className: 'flex items-center gap-2 text-slate-900 font-bold' },
          createElement(ShieldCheck, { className: 'w-4 h-4 text-emerald-600' }),
          'Ethical Recruitment'
        ),
        createElement(
          'p',
          { className: 'text-slate-600 leading-relaxed' },
          'We strictly enforce fair labor recruitment guidelines with zero hidden fees and direct employer connections.'
        )
      ),
      createElement(
        'div',
        { className: 'p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2' },
        createElement(
          'div',
          { className: 'flex items-center gap-2 text-slate-900 font-bold' },
          createElement(Award, { className: 'w-4 h-4 text-blue-600' }),
          'End-to-End Processing'
        ),
        createElement(
          'p',
          { className: 'text-slate-600 leading-relaxed' },
          'From eCitizen passport setup to medical clearance, police checks, and visa submissions, we guide candidates every step.'
        )
      ),
      createElement(
        'div',
        { className: 'p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2' },
        createElement(
          'div',
          { className: 'flex items-center gap-2 text-slate-900 font-bold' },
          createElement(Users, { className: 'w-4 h-4 text-blue-600' }),
          'NEAMIS Compliant'
        ),
        createElement(
          'p',
          { className: 'text-slate-600 leading-relaxed' },
          'Fully aligned with National Employment Authority standards to ensure safe candidate deployment overseas.'
        )
      )
    )
  );
}

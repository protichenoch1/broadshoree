'use client';

import { useState, createElement } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'What is Broadshore International?',
      answer:
        'Broadshore is a registered recruitment and labor export agency compliant with the National Employment Authority (NEA) and NEAMIS in Kenya. We connect qualified professionals with verified international job opportunities.',
    },
    {
      question: 'How long does the application process take?',
      answer:
        'Initial document screening takes 24–48 hours. Depending on the target destination and visa requirements, full placement and processing take between 2 to 8 weeks.',
    },
    {
      question: 'Do I need a valid passport before applying?',
      answer:
        'Having a valid passport with at least 6 months validity speeds up processing. If you do not have one, you can use our eCitizen Passport Service to apply for guidance.',
    },
    {
      question: 'Are job placements compliant with Kenyan Labor Export laws?',
      answer:
        'Yes. All candidates are cross-referenced with the NEAMIS database to ensure ethical recruitment, legal contracts, and safe deployment.',
    },
  ];

  return createElement(
    'div',
    { className: 'bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4', id: 'faqs' },
    createElement(
      'div',
      { className: 'flex items-center gap-2 border-b border-slate-100 pb-3' },
      createElement(HelpCircle, { className: 'w-5 h-5 text-blue-600' }),
      createElement('h2', { className: 'text-base font-bold text-slate-900' }, 'Frequently Asked Questions (FAQs)')
    ),
    createElement(
      'div',
      { className: 'space-y-3' },
      faqs.map((faq, index) =>
        createElement(
          'div',
          { key: index, className: 'border border-slate-200 rounded-lg overflow-hidden' },
          createElement(
            'button',
            {
              type: 'button',
              onClick: () => setOpenIndex(openIndex === index ? null : index),
              className:
                'w-full flex items-center justify-between p-4 text-left font-semibold text-xs sm:text-sm text-slate-800 bg-slate-50 hover:bg-slate-100 transition',
            },
            createElement('span', null, faq.question),
            openIndex === index
              ? createElement(ChevronUp, { className: 'w-4 h-4 text-blue-600 shrink-0' })
              : createElement(ChevronDown, { className: 'w-4 h-4 text-slate-400 shrink-0' })
          ),
          openIndex === index &&
            createElement(
              'div',
              { className: 'p-4 text-xs text-slate-600 bg-white border-t border-slate-200 leading-relaxed' },
              faq.answer
            )
        )
      )
    )
  );
}

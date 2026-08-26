'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [jobs] = useState([
    { id: 1, title: 'Registered Nurse (ER)', country: 'United Kingdom', salary: 'KSh 350,000 - 450,000 / mo', tag: 'NHS Sponsorship' },
    { id: 2, title: 'Heavy Machinery Driver', country: 'Canada', salary: 'KSh 400,000 / mo', tag: 'LMIA Approved' },
    { id: 3, title: 'Hospitality & Front Desk', country: 'Dubai, UAE', salary: 'KSh 150,000 / mo', tag: 'Visa + Housing' },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Overseas Employment Opportunities</h1>
        <p className="text-slate-600 text-sm mt-1">Verified international placements open exclusively for Kenyan citizens.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white border border-slate-200 p-6 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition">
            <div>
              <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full">{job.tag}</span>
              <h2 className="text-lg font-bold mt-4 text-slate-900">{job.title}</h2>
              <p className="text-slate-500 text-sm font-medium">{job.country}</p>
              <p className="text-emerald-600 font-bold mt-3 text-sm">{job.salary}</p>
            </div>
            <Link
              href={`/apply?job=${encodeURIComponent(job.title)}`}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2.5 rounded-lg font-medium text-sm transition block shadow-sm"
            >
              Apply Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

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
        <h1 className="text-2xl md:text-3xl font-bold text-slate-100">Overseas Employment Portal</h1>
        <p className="text-slate-400 text-sm">Verified job opportunities open exclusively for Kenyan citizens.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-slate-800/80 border border-slate-700 p-5 rounded-xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold bg-blue-950 text-blue-400 border border-blue-800 px-2.5 py-1 rounded-full">{job.tag}</span>
              <h2 className="text-lg font-bold mt-4 text-slate-100">{job.title}</h2>
              <p className="text-slate-400 text-sm">{job.country}</p>
              <p className="text-emerald-400 font-semibold mt-3 text-sm">{job.salary}</p>
            </div>
            <Link
              href={`/apply?job=${encodeURIComponent(job.title)}`}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white text-center py-2.5 rounded-lg font-medium text-sm transition block"
            >
              Apply Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

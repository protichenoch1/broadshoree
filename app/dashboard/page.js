'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [jobs] = useState([
    { 
      id: 1, 
      title: 'Registered Nurse (ER)', 
      country: 'United Kingdom', 
      salary: 'KSh 350,000 - 450,000 / mo', 
      tag: 'NHS Sponsorship',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'
    },
    { 
      id: 2, 
      title: 'Heavy Machinery Driver', 
      country: 'Canada', 
      salary: 'KSh 400,000 / mo', 
      tag: 'LMIA Approved',
      image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=80'
    },
    { 
      id: 3, 
      title: 'Hospitality & Front Desk', 
      country: 'Dubai, UAE', 
      salary: 'KSh 150,000 / mo', 
      tag: 'Visa + Housing',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
    },
  ]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Overseas Employment Opportunities</h1>
        <p className="text-slate-600 text-sm mt-1">Verified international placements open exclusively for Kenyan citizens.</p>
      </div>

      {/* Grid limited to strictly 2 jobs per row on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition">
            <div>
              {/* Scaled down height from h-44 to h-36 */}
              <div className="h-36 w-full overflow-hidden relative bg-slate-100">
                <img 
                  src={job.image} 
                  alt={job.title} 
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2.5 left-2.5 text-[11px] font-semibold bg-white/90 backdrop-blur-md text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full shadow-sm">
                  {job.tag}
                </span>
              </div>

              {/* Listing Details */}
              <div className="p-4">
                <h2 className="text-base font-bold text-slate-900">{job.title}</h2>
                <p className="text-slate-500 text-xs font-medium mt-0.5">{job.country}</p>
                <p className="text-emerald-600 font-bold mt-2 text-xs">{job.salary}</p>
              </div>
            </div>

            <div className="px-4 pb-4">
              <Link
                href={`/apply?job=${encodeURIComponent(job.title)}`}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg font-medium text-xs transition block shadow-sm"
              >
                Apply Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

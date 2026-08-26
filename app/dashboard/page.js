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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Overseas Employment Opportunities</h1>
        <p className="text-slate-600 text-sm mt-1">Verified international placements open exclusively for Kenyan citizens.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition">
            <div>
              {/* Job Image Banner */}
              <div className="h-44 w-full overflow-hidden relative bg-slate-100">
                <img 
                  src={job.image} 
                  alt={job.title} 
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
                <span className="absolute top-3 left-3 text-xs font-semibold bg-white/90 backdrop-blur-md text-blue-700 border border-blue-200 px-3 py-1 rounded-full shadow-sm">
                  {job.tag}
                </span>
              </div>

              {/* Listing Details */}
              <div className="p-5">
                <h2 className="text-lg font-bold text-slate-900">{job.title}</h2>
                <p className="text-slate-500 text-sm font-medium mt-1">{job.country}</p>
                <p className="text-emerald-600 font-bold mt-3 text-sm">{job.salary}</p>
              </div>
            </div>

            <div className="px-5 pb-5">
              <Link
                href={`/apply?job=${encodeURIComponent(job.title)}`}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2.5 rounded-lg font-medium text-sm transition block shadow-sm"
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

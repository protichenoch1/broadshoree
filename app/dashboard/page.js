'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [selectedCountry, setSelectedCountry] = useState('All');

  const countries = [
    { name: 'All', code: '🌐' },
    { name: 'United Kingdom', code: '🇬🇧' },
    { name: 'Canada', code: '🇨🇦' },
    { name: 'Dubai, UAE', code: '🇦🇪' },
    { name: 'Saudi Arabia', code: '🇸🇦' },
    { name: 'Qatar', code: '🇶🇦' },
    { name: 'Germany', code: '🇩🇪' },
    { name: 'Australia', code: '🇦🇺' },
  ];

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

  // Filter jobs based on selected country slider
  const filteredJobs = selectedCountry === 'All' 
    ? jobs 
    : jobs.filter(job => job.country.toLowerCase() === selectedCountry.toLowerCase());

  return (
    <div className="space-y-4 max-w-5xl mx-auto p-2 sm:p-4">
      <div>
        <h1 className="text-xl md:text-3xl font-bold text-slate-900">Overseas Employment Opportunities</h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">Verified international placements open exclusively for Kenyan citizens.</p>
      </div>

      {/* HORIZONTAL SLIDING COUNTRY FILTER */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-2 px-2">
        {countries.map((item) => {
          const isActive = selectedCountry === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setSelectedCountry(item.name)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{item.code}</span>
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* JOB LISTINGS GRID (2 PER ROW ON ALL SCREENS) */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-5">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition">
              <div>
                <div className="h-24 sm:h-36 w-full overflow-hidden relative bg-slate-100">
                  <img 
                    src={job.image} 
                    alt={job.title} 
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-1.5 left-1.5 text-[9px] sm:text-[11px] font-semibold bg-white/90 backdrop-blur-md text-blue-700 border border-blue-200 px-1.5 sm:px-2.5 py-0.5 rounded-full shadow-sm truncate max-w-[90%]">
                    {job.tag}
                  </span>
                </div>

                <div className="p-2.5 sm:p-4">
                  <h2 className="text-xs sm:text-base font-bold text-slate-900 line-clamp-1">{job.title}</h2>
                  <p className="text-slate-500 text-[10px] sm:text-xs font-medium mt-0.5">{job.country}</p>
                  <p className="text-emerald-600 font-bold mt-1.5 text-[10px] sm:text-xs">{job.salary}</p>
                </div>
              </div>

              <div className="px-2.5 pb-2.5 sm:px-4 sm:pb-4">
                <Link
                  href={`/apply?job=${encodeURIComponent(job.title)}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-1.5 sm:py-2 rounded-lg font-medium text-[11px] sm:text-xs transition block shadow-sm"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center space-y-1">
          <p className="text-sm font-bold text-slate-700">No active positions found</p>
          <p className="text-xs text-slate-500">There are currently no open listings in {selectedCountry}.</p>
        </div>
      )}
    </div>
  );
}

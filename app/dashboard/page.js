'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase'; // Adjust path based on your setup

export default function DashboardPage() {
  // Navigation & Search State
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'track'
  const [selectedCountry, setSelectedCountry] = useState('All');
  
  // Application Tracking State
  const [idNumber, setIdNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [trackedApplications, setTrackedApplications] = useState({
    passports: [],
    jobs: []
  });

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
    { 
      id: 4, 
      title: 'Taxi Driver', 
      country: 'Saudi Arabia', 
      salary: 'KSh 100,000 / mo', 
      tag: 'Transport',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80'
    },
  ]);

  // Handle Application Search
  const handleTrackSearch = async (e) => {
    e.preventDefault();
    if (!idNumber.trim()) return;

    setIsSearching(true);
    setSearchAttempted(true);

    try {
      // Fetch Passport Applications matching ID Number
      const { data: passports } = await supabase
        .from('passport_applications')
        .select('*')
        .eq('id_number', idNumber.trim());

      // Fetch Job Applications matching ID Number
      const { data: jobApps } = await supabase
        .from('job_applications')
        .select('*')
        .eq('id_number', idNumber.trim());

      setTrackedApplications({
        passports: passports || [],
        jobs: jobApps || []
      });
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const filteredJobs = selectedCountry === 'All' 
    ? jobs 
    : jobs.filter(job => job.country.toLowerCase() === selectedCountry.toLowerCase());

  return (
    <div className="space-y-4 max-w-5xl mx-auto p-2 sm:p-4">
      {/* HEADER & MAIN NAVIGATION TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-slate-900">Broadshore Services Portal</h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">Explore opportunities or track your application status.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeTab === 'browse' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            Browse Jobs
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeTab === 'track' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            Track Application
          </button>
        </div>
      </div>

      {/* VIEW 1: BROWSE JOBS */}
      {activeTab === 'browse' && (
        <div className="space-y-4">
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
      )}

      {/* VIEW 2: TRACK APPLICATION */}
      {activeTab === 'track' && (
        <div className="space-y-6 max-w-2xl mx-auto py-2">
          {/* SEARCH BOX */}
          <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900">Check Your Status</h2>
            <p className="text-slate-500 text-xs">Enter your National ID or Passport Number to view submitted applications.</p>
            
            <form onSubmit={handleTrackSearch} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. 12345678"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-sm shrink-0"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>

          {/* SEARCH RESULTS DISPLAY */}
          {searchAttempted && (
            <div className="space-y-4">
              {/* PASSPORT APPLICATIONS */}
              {trackedApplications.passports.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Passport Applications</h3>
                  {trackedApplications.passports.map((app) => (
                    <div key={app.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-slate-900">{app.full_name}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          {app.status || 'Under Review'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Category: {app.passport_type || 'Standard Passport'}</span>
                        <span>Date: {new Date(app.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* JOB APPLICATIONS */}
              {trackedApplications.jobs.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Job Placement Applications</h3>
                  {trackedApplications.jobs.map((app) => (
                    <div key={app.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-slate-900">{app.target_position || app.job_title}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {app.status || 'Received'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Applicant: {app.full_name}</span>
                        <span>Date: {new Date(app.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* NO RECORDS FOUND */}
              {trackedApplications.passports.length === 0 && trackedApplications.jobs.length === 0 && (
                <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-1">
                  <p className="text-sm font-bold text-slate-700">No records found</p>
                  <p className="text-xs text-slate-500">We couldn't find any applications registered under ID number "{idNumber}".</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

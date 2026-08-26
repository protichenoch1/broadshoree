'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ApplyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedJob = searchParams.get('job') || '';

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Application submitted successfully!');
    router.push('/dashboard');
  };

  const handlePassportChange = (e) => {
    if (e.target.value === 'no') {
      if (confirm('No passport detected. Would you like to request eCitizen passport guidance first?')) {
        router.push('/passport');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Full Official Name (National ID / Passport)</label>
        <input type="text" required placeholder="e.g. Wanjiku Mary Kamau" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">National ID Number</label>
        <input type="text" required placeholder="12345678" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Target Position</label>
        <input type="text" defaultValue={preselectedJob} required placeholder="e.g. Registered Nurse" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Do you have a Passport?</label>
        <select onChange={handlePassportChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900">
          <option value="yes">Yes, I have an active Kenyan Passport</option>
          <option value="processing">Applied on eCitizen (In progress)</option>
          <option value="no">No (Redirect to Passport Support)</option>
        </select>
      </div>

      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition mt-2 shadow-sm">
        Submit Application
      </button>
    </form>
  );
}

export default function ApplyPage() {
  return (
    <div className="max-w-xl mx-auto bg-white border border-slate-200 p-6 md:p-8 rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Candidate Application</h1>
      <p className="text-slate-600 text-sm mb-6">Register your candidate profile with Broadshore Kenya.</p>
      
      <Suspense fallback={<div className="text-slate-500 text-sm">Loading application form...</div>}>
        <ApplyForm />
      </Suspense>
    </div>
  );
}

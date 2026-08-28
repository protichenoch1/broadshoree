'use client';

import { useState } from 'react';
import { ShieldCheck, CreditCard, Upload, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export default function PassportPage() {
  const [applicationType, setApplicationType] = useState('new');
  const [passportType, setPassportType] = useState('series_a');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const fees = {
    series_a: { name: 'Ordinary Series A (32 Pages)', officialFee: 7500, serviceFee: 1000 },
    series_b: { name: 'Ordinary Series B (48 Pages)', officialFee: 9500, serviceFee: 1000 },
    series_c: { name: 'Ordinary Series C (64 Pages)', officialFee: 12500, serviceFee: 1000 },
  };

  const selectedFee = fees[passportType];
  const totalAmount = selectedFee.officialFee + selectedFee.serviceFee;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert(`Details & documents saved! M-Pesa prompt sent to ${phoneNumber} for KSh ${totalAmount.toLocaleString()}.`);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">eCitizen Passport Application Portal</h1>
        <p className="text-slate-600 text-sm mt-1">Submit your details and mandatory documents for guided eCitizen application processing.</p>
      </div>

      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Application Intake Section */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Category & Type */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">1. Application Type & Booklet Size</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'new', label: 'New Passport' },
                { id: 'renewal', label: 'Renewal' },
                { id: 'lost', label: 'Lost' },
                { id: 'mutilated', label: 'Mutilated' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setApplicationType(cat.id)}
                  className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition ${
                    applicationType === cat.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Select Passport Size</label>
              <select
                value={passportType}
                onChange={(e) => setPassportType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
              >
                <option value="series_a">Ordinary Series A - 32 Pages (KSh 7,500)</option>
                <option value="series_b">Ordinary Series B - 48 Pages (KSh 9,500)</option>
                <option value="series_c">Ordinary Series C - 64 Pages (KSh 12,500)</option>
              </select>
            </div>
          </div>

          {/* Step 2: Personal Details */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">2. Applicant Personal Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Full Legal Name (ID Card)</label>
                <input type="text" required placeholder="e.g. Wanjiku Mary Kamau" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">National ID Number</label>
                <input type="text" required placeholder="12345678" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Recommender Full Name</label>
                <input type="text" required placeholder="Recommender's Full Name" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Recommender ID Number</label>
                <input type="text" required placeholder="87654321" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Preferred Biometrics Center</label>
              <select className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 font-medium">
                <option value="nairobi">Nairobi (Nyayo House)</option>
                <option value="mombasa">Mombasa</option>
                <option value="kisumu">Kisumu</option>
                <option value="nakuru">Nakuru</option>
                <option value="eldoret">Eldoret</option>
                <option value="embu">Embu</option>
                <option value="kisii">Kisii</option>
              </select>
            </div>
          </div>

          {/* Step 3: File Uploads */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">3. Upload Required Supporting Documents</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div className="border border-dashed border-slate-300 p-3 rounded-lg bg-slate-50">
                <label className="block font-bold text-slate-800 mb-1">Birth Certificate (PDF/Image)</label>
                <input type="file" required accept="image/*,.pdf" className="w-full text-slate-500" />
              </div>

              <div className="border border-dashed border-slate-300 p-3 rounded-lg bg-slate-50">
                <label className="block font-bold text-slate-800 mb-1">National ID Card (Front & Back)</label>
                <input type="file" required accept="image/*,.pdf" className="w-full text-slate-500" />
              </div>

              <div className="border border-dashed border-slate-300 p-3 rounded-lg bg-slate-50">
                <label className="block font-bold text-slate-800 mb-1">Passport Size Photo (White Background)</label>
                <input type="file" required accept="image/*" className="w-full text-slate-500" />
              </div>

              <div className="border border-dashed border-slate-300 p-3 rounded-lg bg-slate-50">
                <label className="block font-bold text-slate-800 mb-1">Recommender's ID Copy</label>
                <input type="file" required accept="image/*,.pdf" className="w-full text-slate-500" />
              </div>

              <div className="border border-dashed border-slate-300 p-3 rounded-lg bg-slate-50 sm:col-span-2">
                <label className="block font-bold text-slate-800 mb-1">Parents' ID Cards / Death Certificates</label>
                <input type="file" accept="image/*,.pdf" className="w-full text-slate-500" />
              </div>

              {/* Conditional Uploads based on Category */}
              {(applicationType === 'renewal' || applicationType === 'mutilated') && (
                <div className="border border-dashed border-blue-300 p-3 rounded-lg bg-blue-50 sm:col-span-2">
                  <label className="block font-bold text-blue-900 mb-1">Old Passport Copy (Last 3 Pages)</label>
                  <input type="file" required accept="image/*,.pdf" className="w-full text-blue-800" />
                </div>
              )}

              {applicationType === 'lost' && (
                <div className="border border-dashed border-amber-300 p-3 rounded-lg bg-amber-50 sm:col-span-2 space-y-2">
                  <label className="block font-bold text-amber-900">Lost Passport Extras (Sworn Affidavit + Police Abstract)</label>
                  <input type="file" required accept="image/*,.pdf" className="w-full text-amber-800" />
                </div>
              )}

              {applicationType === 'mutilated' && (
                <div className="border border-dashed border-amber-300 p-3 rounded-lg bg-amber-50 sm:col-span-2 space-y-2">
                  <label className="block font-bold text-amber-900">Mutilated Passport Sworn Affidavit & Explanation</label>
                  <input type="file" required accept="image/*,.pdf" className="w-full text-amber-800" />
                </div>
              )}

            </div>
          </div>

          {/* Step 4: Payment Submission */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">4. Payment & Final Submission</h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">M-Pesa Phone Number</label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="07XX XXX XXX"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-lg transition flex items-center justify-center gap-2 shadow-sm text-sm"
            >
              <CreditCard className="w-5 h-5" />
              {loading ? 'Processing Submission...' : `Submit Application & Pay KSh ${totalAmount.toLocaleString()}`}
            </button>
          </div>

        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md sticky top-24 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-4">
                <ShieldCheck className="w-5 h-5" /> Broadshore Managed Service
              </div>
              
              <h3 className="text-base font-bold border-b border-slate-800 pb-3">Fee Breakdown</h3>
              
              <div className="space-y-3 mt-4 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>{selectedFee.name}</span>
                  <span>KSh {selectedFee.officialFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Concierge Service Fee</span>
                  <span>KSh {selectedFee.serviceFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-800 pt-3 flex justify-between font-bold text-sm text-white">
                  <span>Total Payable</span>
                  <span className="text-emerald-400">KSh {totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-lg text-xs text-slate-400 space-y-2 border border-slate-700">
              <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Submission Workflow
              </div>
              <p className="text-slate-400 leading-relaxed">
                1. Submit form & documents.<br/>
                2. Complete M-Pesa payment.<br/>
                3. Our team files your eCitizen forms.<br/>
                4. Receive official application PDF & biometrics appointment date in your portal.
              </p>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}

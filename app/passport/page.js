'use client';

import { useState } from 'react';
import { ShieldCheck, CreditCard, FileText, CheckCircle2, AlertTriangle, Printer } from 'lucide-react';

export default function PassportPage() {
  const [applicationType, setApplicationType] = useState('new');
  const [passportType, setPassportType] = useState('series_a');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  // Broadshore concierge package pricing
  const fees = {
    series_a: { name: 'Ordinary Series A (32 Pages)', officialFee: 7500, serviceFee: 1000 },
    series_b: { name: 'Ordinary Series B (48 Pages)', officialFee: 9500, serviceFee: 1000 },
    series_c: { name: 'Ordinary Series C (64 Pages)', officialFee: 12500, serviceFee: 1000 },
  };

  const selectedFee = fees[passportType];
  const totalAmount = selectedFee.officialFee + selectedFee.serviceFee;

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert(`M-Pesa STK Push sent to ${phoneNumber} for KSh ${totalAmount.toLocaleString()}. Enter your PIN to complete application assistance.`);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">eCitizen Passport Guidance & Application</h1>
        <p className="text-slate-600 text-sm mt-1">Direct assistance for eCitizen form filing, fee processing, and biometrics booking.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Application Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">1. Select Application Category</h2>

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
                  className={`py-2.5 px-3 text-xs font-bold rounded-lg border text-center transition ${
                    applicationType === cat.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <form onSubmit={handlePayment} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Passport Booklet Type</label>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Full Name (ID Card)</label>
                  <input type="text" required placeholder="Official Name" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">National ID Number</label>
                  <input type="text" required placeholder="12345678" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Biometric Enrollment Center</label>
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
                {loading ? 'Initiating M-Pesa...' : `Pay KSh ${totalAmount.toLocaleString()} via M-Pesa`}
              </button>
            </form>
          </div>

          {/* Interactive Dynamic Biometric Document Checklist */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Printer className="w-4 h-4 text-blue-600" /> Mandatory Biometric Appointment Checklist
              </h3>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full">In-Person Appearance Required</span>
            </div>

            <p className="text-xs text-slate-600">
              Applicants MUST appear in person for Biometric Enrollment at your selected center. Carry the following printed & original documents:
            </p>

            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Downloaded & printed eCitizen passport application form.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Two copies of payment receipts (One Government & One Customer copy).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Original Birth Certificate and one photocopy.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Original National ID Card and one photocopy.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Three (3) current passport-size photos (white background).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>One photocopy of recommender's National ID card.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Photocopies of parents' National ID cards (or Death Certificates if deceased).</span>
              </li>

              {/* Conditional Items for Renewal / Replacement */}
              {(applicationType === 'renewal' || applicationType === 'mutilated') && (
                <li className="flex items-start gap-2 bg-blue-50 p-2 rounded border border-blue-100 text-blue-900 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Old passport for replacement plus photocopies of the last three (3) pages.</span>
                </li>
              )}

              {applicationType === 'lost' && (
                <li className="flex items-start gap-2 bg-amber-50 p-2.5 rounded border border-amber-200 text-amber-900 font-medium space-y-1 block">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" /> Lost Passport Extras Required:
                  </div>
                  <p className="text-xs pl-5.5">• Sworn Affidavit</p>
                  <p className="text-xs pl-5.5">• Official Police Abstract</p>
                  <p className="text-xs pl-5.5">• Personal Explanation Letter explaining the loss</p>
                </li>
              )}

              {applicationType === 'mutilated' && (
                <li className="flex items-start gap-2 bg-amber-50 p-2.5 rounded border border-amber-200 text-amber-900 font-medium space-y-1 block">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" /> Mutilated Passport Extras Required:
                  </div>
                  <p className="text-xs pl-5.5">• Written explanation letter explaining circumstances of mutilation.</p>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Payment Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-4">
                <ShieldCheck className="w-5 h-5" /> Broadshore Concierge
              </div>
              
              <h3 className="text-base font-bold border-b border-slate-800 pb-3">Cost Breakdown</h3>
              
              <div className="space-y-3 mt-4 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>{selectedFee.name}</span>
                  <span>KSh {selectedFee.officialFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Concierge & Booking Fee</span>
                  <span>KSh {selectedFee.serviceFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-800 pt-3 flex justify-between font-bold text-sm text-white">
                  <span>Total Payable</span>
                  <span className="text-emerald-400">KSh {totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-lg text-xs text-slate-400 space-y-1 border border-slate-700">
              <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                <FileText className="w-4 h-4 text-blue-400" /> What happens next?
              </div>
              <p className="text-slate-400 leading-relaxed">
                Once paid, our support team files your eCitizen forms, generates official payment receipts, and books your biometrics appointment at your chosen center.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

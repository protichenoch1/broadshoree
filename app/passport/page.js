'use client';
import { useState } from 'react';
import { ShieldCheck, CreditCard, FileText, CheckCircle2 } from 'lucide-react';

export default function PassportPage() {
  const [passportType, setPassportType] = useState('series_a');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const fees = {
    series_a: { name: 'Ordinary Series A (32 Pages)', officialFee: 7500, serviceFee: 50 },
    series_b: { name: 'Ordinary Series B (48 Pages)', officialFee: 9500, serviceFee: 50 },
    series_c: { name: 'Ordinary Series C (64 Pages)', officialFee: 12500, serviceFee: 50 },
  };

  const selected = fees[passportType];
  const totalAmount = selected.officialFee + selected.serviceFee;

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulated M-Pesa STK Push Trigger
    setTimeout(() => {
      setLoading(false);
      alert(`M-Pesa payment prompt sent to ${phoneNumber} for KSh ${totalAmount.toLocaleString()}. Enter your PIN to complete application.`);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Apply for Kenyan Passport</h1>
        <p className="text-slate-600 text-sm mt-1">Direct eCitizen application assistance & expedited biometrics booking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="md:col-span-2 bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-5">
          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Select Passport Type</label>
              <select
                value={passportType}
                onChange={(e) => setPassportType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
              >
                <option value="series_a">Series A - 32 Pages (KSh 7,500)</option>
                <option value="series_b">Series B - 48 Pages (KSh 9,500)</option>
                <option value="series_c">Series C - 64 Pages (KSh 12,500)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input type="text" required placeholder="As on National ID" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">National ID Number</label>
                <input type="text" required placeholder="e.g. 12345678" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Preferred Biometrics Center</label>
              <select className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900">
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
              <label className="block text-sm font-semibold text-slate-700 mb-1">M-Pesa Phone Number (Payment Prompt)</label>
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
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
            >
              <CreditCard className="w-5 h-5" />
              {loading ? 'Initiating M-Pesa...' : `Pay KSh ${totalAmount.toLocaleString()} via M-Pesa`}
            </button>
          </form>
        </div>

        {/* Payment Summary Sidebar */}
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md flex flex-col justify-between h-fit space-y-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-4">
              <ShieldCheck className="w-5 h-5" /> Verified Processing
            </div>
            
            <h3 className="text-lg font-bold border-b border-slate-800 pb-3">Payment Summary</h3>
            
            <div className="space-y-3 mt-4 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>{selected.name}</span>
                <span>KSh {selected.officialFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Broadshore Service Fee</span>
                <span>KSh {selected.serviceFee.toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between font-bold text-base text-white">
                <span>Total Due</span>
                <span className="text-emerald-400">KSh {totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-lg text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated E-Receipt
            </div>
            <p>You will receive your official booking slip and invoice PDF inside your dashboard after payment.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

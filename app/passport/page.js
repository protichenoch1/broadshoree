'use client';

export default function PassportPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Passport assistance request received!');
  };

  return (
    <div className="max-w-xl mx-auto bg-white border border-slate-200 p-6 md:p-8 rounded-xl shadow-sm">
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg text-sm mb-6">
        💡 <strong>Kenyan Passport Support:</strong> We assist candidates with eCitizen profile setup, invoice generation, and biometrics appointment booking.
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">eCitizen Passport Guidance</h1>
      <p className="text-slate-600 text-sm mb-6">Fill in your details to get assistance from our team.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input type="text" required placeholder="e.g. John Mwangi" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp / Phone Number</label>
          <input type="tel" required placeholder="0712 345 678" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">County of Residence</label>
          <input type="text" required placeholder="e.g. Nairobi, Nakuru, Kisumu" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900" />
        </div>

        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition mt-2 shadow-sm">
          Request Assistance
        </button>
      </form>
    </div>
  );
}

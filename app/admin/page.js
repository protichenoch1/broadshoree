'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Users, 
  FileCheck, 
  Search, 
  Eye, 
  Download, 
  ShieldCheck,
  CreditCard,
  Lock,
  LogOut,
  RefreshCw,
  Loader2
} from 'lucide-react';

export default function AdminDashboard() {
  const supabase = createClientComponentClient();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState('passports'); // 'passports' | 'jobs'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const [passportApplications, setPassportApplications] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);

  const ADMIN_SECRET = 'Bett2026#';

  // Fetch real data from Supabase
  const fetchData = async () => {
    setLoading(true);
    
    // Fetch Passport Applications
    const { data: passports, error: passportErr } = await supabase
      .from('passport_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (!passportErr && passports) {
      setPassportApplications(passports);
    }

    // Fetch Job Applications
    const { data: jobs, error: jobErr } = await supabase
      .from('job_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (!jobErr && jobs) {
      setJobApplications(jobs);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === ADMIN_SECRET) {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode('');
    setSelectedItem(null);
  };

  const updateStatus = async (id, newStatus, table) => {
    const tableName = table === 'passport' ? 'passport_applications' : 'job_applications';
    
    const { error } = await supabase
      .from(tableName)
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      if (table === 'passport') {
        setPassportApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
      } else {
        setJobApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
      }
      if (selectedItem?.id === id) {
        setSelectedItem(prev => ({ ...prev, status: newStatus }));
      }
    }
  };

  // Generate secure download link from Supabase Storage
  const handleDownloadDoc = async (filePath) => {
    const { data, error } = await supabase.storage
      .from('applicant-documents')
      .createSignedUrl(filePath, 60); // Link valid for 60 seconds

    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank');
    } else {
      alert('Could not generate download link. Please verify bucket permissions.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
          <div className="text-center space-y-3">
            <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto text-blue-600 border border-blue-100 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Broadshore Admin Portal</h1>
            <p className="text-slate-500 text-xs">Enter your passcode to view live applicant data.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Admin Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
              {authError && (
                <p className="text-rose-600 text-xs mt-2 font-semibold text-center">Incorrect passcode. Try again.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-sm"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-blue-600" /> Broadshore Live Processing Desk
          </h1>
          <p className="text-sm text-slate-500 mt-1">Live database records from eCitizen and candidate portal.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            title="Refresh Data"
            className="p-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
            <button
              onClick={() => { setActiveTab('passports'); setSelectedItem(null); }}
              className={`px-4 py-2.5 rounded-lg transition flex items-center gap-2 ${
                activeTab === 'passports' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-4 h-4" /> Passports ({passportApplications.length})
            </button>
            <button
              onClick={() => { setActiveTab('jobs'); setSelectedItem(null); }}
              className={`px-4 py-2.5 rounded-lg transition flex items-center gap-2 ${
                activeTab === 'jobs' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" /> Jobs ({jobApplications.length})
            </button>
          </div>

          <button
            onClick={handleLogout}
            title="Lock Dashboard"
            className="p-2.5 text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 border border-slate-200 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input
              type="text"
              placeholder="Search by full name or ID number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[300px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-slate-400 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-xs font-semibold">Loading live records from Supabase...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="p-3.5">Applicant / ID</th>
                      <th className="p-3.5">{activeTab === 'passports' ? 'Category' : 'Position'}</th>
                      <th className="p-3.5">{activeTab === 'passports' ? 'Payment' : 'Passport'}</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeTab === 'passports' ? (
                      passportApplications
                        .filter(app => (app.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (app.id_number || '').includes(searchTerm))
                        .map((app) => (
                          <tr key={app.id} className={`hover:bg-slate-50 transition cursor-pointer ${selectedItem?.id === app.id ? 'bg-blue-50/50' : ''}`}>
                            <td className="p-3.5">
                              <div className="font-bold text-slate-900">{app.full_name}</div>
                              <div className="text-[11px] text-slate-500">ID: {app.id_number}</div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-medium text-slate-800">{app.passport_type || 'New Passport'}</div>
                              <div className="text-[11px] text-slate-500">{app.biometric_center}</div>
                            </td>
                            <td className="p-3.5">
                              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                <CreditCard className="w-3 h-3" /> KSh {app.amount_paid || '8,500'}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                {app.status || 'Pending Filing'}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => setSelectedItem(app)}
                                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded flex items-center gap-1 ml-auto"
                              >
                                <Eye className="w-3.5 h-3.5" /> Inspect
                              </button>
                            </td>
                          </tr>
                        ))
                    ) : (
                      jobApplications
                        .filter(app => (app.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (app.id_number || '').includes(searchTerm))
                        .map((app) => (
                          <tr key={app.id} className={`hover:bg-slate-50 transition cursor-pointer ${selectedItem?.id === app.id ? 'bg-blue-50/50' : ''}`}>
                            <td className="p-3.5">
                              <div className="font-bold text-slate-900">{app.full_name}</div>
                              <div className="text-[11px] text-slate-500">ID: {app.id_number}</div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-medium text-slate-800">{app.target_position}</div>
                              <div className="text-[11px] text-slate-500">{app.destination}</div>
                            </td>
                            <td className="p-3.5">
                              <div className="text-xs font-medium text-slate-700">{app.passport_status}</div>
                            </td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                {app.status || 'Under Review'}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => setSelectedItem(app)}
                                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded flex items-center gap-1 ml-auto"
                              >
                                <Eye className="w-3.5 h-3.5" /> Inspect
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {selectedItem ? (
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-md space-y-6 sticky top-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedItem.full_name}</h3>
                  <p className="text-xs text-slate-500">ID: {selectedItem.id_number}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                  {selectedItem.status || 'Pending'}
                </span>
              </div>

              {activeTab === 'passports' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1 text-slate-700">
                    <p><strong>DOB:</strong> {selectedItem.dob}</p>
                    <p><strong>KRA PIN:</strong> {selectedItem.kra_pin}</p>
                    <p><strong>Phone:</strong> {selectedItem.phone}</p>
                    <p><strong>Email:</strong> {selectedItem.email}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900">Document Bucket Files</h4>
                    {selectedItem.document_paths && selectedItem.document_paths.length > 0 ? (
                      selectedItem.document_paths.map((path, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-slate-700">
                          <span className="truncate pr-2">{path.split('/').pop()}</span>
                          <button 
                            onClick={() => handleDownloadDoc(path)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
                          >
                            <Download className="w-3.5 h-3.5" /> Download
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 italic">No files attached to this record.</p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <h4 className="font-bold text-slate-900">Update Stage</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => updateStatus(selectedItem.id, 'Filing Completed', 'passport')}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs transition"
                      >
                        Mark eCitizen Filed
                      </button>
                      <button
                        onClick={() => updateStatus(selectedItem.id, 'Appointment Booked', 'passport')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded text-xs transition"
                      >
                        Book Biometrics
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'jobs' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1 text-slate-700">
                    <p><strong>Target Position:</strong> {selectedItem.target_position}</p>
                    <p><strong>Destination:</strong> {selectedItem.destination}</p>
                    <p><strong>Passport:</strong> {selectedItem.passport_status}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <h4 className="font-bold text-slate-900">Recruitment Action</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => updateStatus(selectedItem.id, 'Shortlisted', 'job')}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs transition"
                      >
                        Shortlist Candidate
                      </button>
                      <button
                        onClick={() => updateStatus(selectedItem.id, 'NEAMIS Cleared', 'job')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded text-xs transition"
                      >
                        NEAMIS Verify
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-300 p-8 rounded-xl text-center space-y-3">
              <Eye className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-700">No Record Selected</div>
              <p className="text-xs text-slate-500">Select any live submission from the table to view files and update processing stages.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

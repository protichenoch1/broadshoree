'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  FileCheck, 
  Search, 
  Eye, 
  Download, 
  CreditCard,
  LogOut,
  RefreshCw,
  Loader2,
  Plus,
  X,
  Upload,
  Mail,
  Phone,
  Calendar,
  FileText,
  UserCheck,
  ImageIcon
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState('passports');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const [passportApplications, setPassportApplications] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [newJob, setNewJob] = useState({
    title: '',
    destination: '',
    category: '',
    description: ''
  });

  const ADMIN_SECRET = 'Bett2026#';

  const fetchData = async () => {
    setLoading(true);
    
    const { data: passports } = await supabase
      .from('passport_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (passports) setPassportApplications(passports);

    const { data: jobs } = await supabase
      .from('job_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (jobs) setJobApplications(jobs);

    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
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

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let imageUrl = null;

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `posters/${fileName}`;

      const { error: uploadErr } = await supabase.storage
        .from('job-logos')
        .upload(filePath, imageFile);

      if (!uploadErr) {
        const { data: urlData } = supabase.storage
          .from('job-logos')
          .getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      }
    }

    const { error } = await supabase
      .from('jobs')
      .insert([
        {
          title: newJob.title,
          destination: newJob.destination,
          category: newJob.category,
          description: newJob.description,
          image_url: imageUrl,
          status: 'Active'
        }
      ]);

    setIsSubmitting(false);

    if (error) {
      alert(`Error creating job: ${error.message}`);
    } else {
      alert('Job listing posted successfully!');
      setNewJob({ title: '', destination: '', category: '', description: '' });
      setImageFile(null);
      setIsModalOpen(false);
      fetchData();
    }
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

  // Dynamic URL & Storage Resolver
  const handleDownloadDoc = async (rawPath) => {
    if (!rawPath) return;

    if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
      window.open(rawPath, '_blank');
      return;
    }

    const cleanPath = rawPath.replace(/^\/+/, '');
    let bucket = 'applicant-documents';
    let path = cleanPath;

    if (cleanPath.startsWith('job-logos/')) {
      bucket = 'job-logos';
      path = cleanPath.replace('job-logos/', '');
    } else if (cleanPath.startsWith('applicant-documents/')) {
      bucket = 'applicant-documents';
      path = cleanPath.replace('applicant-documents/', '');
    }

    const { data } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 60);

    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank');
    } else {
      const { data: pubData } = supabase.storage.from(bucket).getPublicUrl(path);
      if (pubData?.publicUrl) {
        window.open(pubData.publicUrl, '_blank');
      } else {
        alert('Unable to load document.');
      }
    }
  };

  // Render Documents and Image Previews
  const renderApplicantMedia = (item) => {
    const fields = [
      { key: 'passport_url', label: 'Passport Photo / Bio' },
      { key: 'photo_url', label: 'Applicant Photo' },
      { key: 'cv_url', label: 'Resume / CV' },
      { key: 'id_url', label: 'National ID' },
      { key: 'dci_url', label: 'Good Conduct (DCI)' },
      { key: 'certificate_url', label: 'Certificates' }
    ];

    const docsObj = item.documents || {};
    const allMedia = [];

    fields.forEach(f => {
      const val = item[f.key] || docsObj[f.key];
      if (val) allMedia.push({ label: f.label, path: val });
    });

    if (Array.isArray(item.document_paths)) {
      item.document_paths.forEach((p, idx) => {
        allMedia.push({ label: `Uploaded Document ${idx + 1}`, path: p });
      });
    }

    if (allMedia.length === 0) {
      return <p className="text-slate-400 italic text-xs">No media or documents uploaded.</p>;
    }

    const isImageFile = (path) => {
      return /\.(jpg|jpeg|png|webp|gif)($|\?)/i.test(path);
    };

    return (
      <div className="space-y-3">
        {allMedia.map((media, idx) => {
          const isImg = isImageFile(media.path);

          return (
            <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold flex items-center gap-1.5 truncate">
                  {isImg ? (
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  )}
                  {media.label}
                </span>
                <button 
                  onClick={() => handleDownloadDoc(media.path)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-[11px] shrink-0"
                >
                  <Download className="w-3 h-3" /> View / Download
                </button>
              </div>

              {isImg && (
                <div className="relative w-full h-36 bg-slate-200 rounded-md overflow-hidden border border-slate-300">
                  <img 
                    src={media.path} 
                    alt={media.label}
                    className="w-full h-full object-contain cursor-pointer hover:opacity-90 transition bg-slate-900/5"
                    onClick={() => handleDownloadDoc(media.path)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
          <div className="text-center space-y-3">
            <h1 className="text-xl font-bold text-slate-900">Broadshore Admin Portal</h1>
            <p className="text-slate-500 text-xs">Enter your passcode to view live applicant data.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Admin Passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {authError && <p className="text-rose-600 text-xs font-semibold text-center">Incorrect passcode.</p>}
            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-sm transition">
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">Broadshore Live Processing Desk</h1>

        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2">
            <Plus className="w-4 h-4" /> Post New Job
          </button>

          <button onClick={fetchData} className="p-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
            <button
              onClick={() => { setActiveTab('passports'); setSelectedItem(null); }}
              className={`px-4 py-2.5 rounded-lg ${activeTab === 'passports' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
            >
              Passports ({passportApplications.length})
            </button>
            <button
              onClick={() => { setActiveTab('jobs'); setSelectedItem(null); }}
              className={`px-4 py-2.5 rounded-lg ${activeTab === 'jobs' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
            >
              Job Applications ({jobApplications.length})
            </button>
          </div>

          <button onClick={handleLogout} className="p-2.5 text-slate-500 hover:text-rose-600 bg-slate-100 border border-slate-200 rounded-xl">
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
              <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                <p className="text-xs font-semibold">Loading live records...</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="p-3.5">Applicant / ID</th>
                    <th className="p-3.5">{activeTab === 'passports' ? 'Category' : 'Position'}</th>
                    <th className="p-3.5">{activeTab === 'passports' ? 'Payment' : 'Passport'}</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(activeTab === 'passports' ? passportApplications : jobApplications)
                    .filter(app => (app.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (app.id_number || '').includes(searchTerm))
                    .map((app) => (
                      <tr key={app.id} className={`hover:bg-slate-50 ${selectedItem?.id === app.id ? 'bg-blue-50/50' : ''}`}>
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{app.full_name}</div>
                          <div className="text-[11px] text-slate-500">ID: {app.id_number}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-medium text-slate-800">{app.target_position || app.passport_type || 'N/A'}</div>
                          <div className="text-[11px] text-slate-500">{app.destination || app.destination_country || app.biometric_center}</div>
                        </td>
                        <td className="p-3.5">
                          {activeTab === 'passports' ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CreditCard className="w-3 h-3" /> KSh {app.amount_paid || '8,500'}
                            </span>
                          ) : (
                            app.passport_status || 'Yes'
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {app.status || 'Under Review'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button onClick={() => setSelectedItem(app)} className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded flex items-center gap-1 ml-auto">
                            <Eye className="w-3.5 h-3.5" /> Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Dynamic Details & Media Panel */}
        <div className="space-y-6">
          {selectedItem ? (
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-md space-y-6 sticky top-6 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedItem.full_name}</h3>
                  <p className="text-xs text-slate-500">ID / Passport No: {selectedItem.id_number || 'N/A'}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  {selectedItem.status || 'Pending'}
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-slate-700">
                  <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400"/> <strong>Phone:</strong> {selectedItem.phone_number || selectedItem.phone || selectedItem.mobile || 'N/A'}</p>
                  <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400"/> <strong>Email:</strong> {selectedItem.email_address || selectedItem.email || 'N/A'}</p>
                  <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-slate-400"/> <strong>DOB:</strong> {selectedItem.dob || selectedItem.date_of_birth || 'N/A'}</p>
                  <p className="flex items-center gap-2"><UserCheck className="w-3.5 h-3.5 text-slate-400"/> <strong>KRA PIN:</strong> {selectedItem.kra_pin || 'N/A'}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Applicant Media & Documents
                  </h4>
                  {renderApplicantMedia(selectedItem)}
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <h4 className="font-bold text-slate-900">Recruitment Action</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => updateStatus(selectedItem.id, 'Shortlisted', activeTab === 'passports' ? 'passport' : 'job')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs transition">
                      Shortlist Candidate
                    </button>
                    <button onClick={() => updateStatus(selectedItem.id, 'NEAMIS Cleared', activeTab === 'passports' ? 'passport' : 'job')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded text-xs transition">
                      NEAMIS Verify
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-300 p-8 rounded-xl text-center space-y-3">
              <Eye className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-700">No Record Selected</div>
              <p className="text-xs text-slate-500">Select any candidate from the list to view full profile details and media uploads.</p>
            </div>
          )}
        </div>
      </div>

      {/* CREATE NEW JOB MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden space-y-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Post New Job Listing</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Security Officer, Driver, Nurse"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destination</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Qatar, Saudi Arabia, UAE"
                    value={newJob.destination}
                    onChange={(e) => setNewJob({ ...newJob, destination: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Hospitality, Security"
                    value={newJob.category}
                    onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Job Poster / Company Logo</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition">
                    <div className="flex flex-col items-center justify-center pt-2 pb-2">
                      <Upload className="w-5 h-5 text-slate-400 mb-1" />
                      <p className="text-[11px] text-slate-500 font-semibold">
                        {imageFile ? imageFile.name : 'Click to upload image file'}
                      </p>
                      <p className="text-[10px] text-slate-400">PNG, JPG or WEBP (Max 5MB)</p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Job Requirements & Details</label>
                <textarea
                  rows={3}
                  placeholder="Enter key requirements, salary details, or experience needed..."
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

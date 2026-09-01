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
  UserCheck
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

  // --- NEW JOB MODAL STATE ---
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
    
    const { data: passports, error: passportErr } = await supabase
      .from('passport_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (!passportErr && passports) {
      setPassportApplications(passports);
    }

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

  // --- ADD JOB WITH IMAGE UPLOAD HANDLER ---
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

      if (uploadErr) {
        alert(`Image upload failed: ${uploadErr.message}`);
        setIsSubmitting(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('job-logos')
        .getPublicUrl(filePath);

      imageUrl = urlData.publicUrl;
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

  // Universal document opener (Handles both direct Storage URLs and bucket file paths)
  const handleDownloadDoc = async (filePath) => {
    if (!filePath) return;

    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      window.open(filePath, '_blank');
      return;
    }

    const { data } = await supabase.storage
      .from('applicant-documents')
      .createSignedUrl(filePath, 60);

    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank');
    } else {
      alert('Could not generate download link.');
    }
  };

  // Extract documents from JSON or Arrays across different schemas
  const renderDocumentLinks = (item) => {
    // Check array format (e.g. passport_applications)
    if (Array.isArray(item.document_paths) && item.document_paths.length > 0) {
      return item.document_paths.map((path, idx) => (
        <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-slate-700">
          <span className="truncate pr-2">{path.split('/').pop()}</span>
          <button 
            onClick={() => handleDownloadDoc(path)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      ));
    }

    // Check JSON Object or columns format (e.g. job_applications)
    const docsObj = item.documents || {};
    const docKeys = [
      { key: 'passport_url', label: 'Passport Bio Copy' },
      { key: 'cv_url', label: 'Resume / CV' },
      { key: 'id_url', label: 'National ID' },
      { key: 'dci_url', label: 'Good Conduct (DCI)' }
    ];

    const availableDocs = docKeys.filter(doc => docsObj[doc.key] || item[doc.key]);

    if (availableDocs.length > 0) {
      return availableDocs.map((doc, idx) => {
        const url = docsObj[doc.key] || item[doc.key];
        return (
          <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-slate-700">
            <span className="font-medium flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              {doc.label}
            </span>
            <button 
              onClick={() => handleDownloadDoc(url)}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
            >
              <Download className="w-3.5 h-3.5" /> View File
            </button>
          </div>
        );
      });
    }

    return <p className="text-slate-400 italic text-xs">No documents attached to this record.</p>;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
          <div className="text-center space-y-3">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto border border-blue-100 shadow-inner p-2">
              <Image 
                src="/logoo.png" 
                alt="Broadshore Logo" 
                width={48} 
                height={48} 
                className="h-10 w-auto object-contain"
              />
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
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Image 
              src="/logoo.png" 
              alt="Broadshore Logo" 
              width={36} 
              height={36} 
              className="h-9 w-auto object-contain"
            />
            <span>Broadshore Live Processing Desk</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Live database records from eCitizen and candidate portal.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Post New Job
          </button>

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
              <Users className="w-4 h-4" /> Job Applications ({jobApplications.length})
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
                              <div className="text-[11px] text-slate-500">{app.destination || app.destination_country}</div>
                            </td>
                            <td className="p-3.5">
                              <div className="text-xs font-medium text-slate-700">{app.passport_status || 'Yes'}</div>
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

        {/* Right Inspection Panel */}
        <div className="space-y-6">
          {selectedItem ? (
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-md space-y-6 sticky top-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedItem.full_name}</h3>
                  <p className="text-xs text-slate-500">ID / Passport No: {selectedItem.id_number}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  {selectedItem.status || 'Pending'}
                </span>
              </div>

              {/* Passport Applicant Section */}
              {activeTab === 'passports' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-slate-700">
                    <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-slate-400"/> <strong>DOB:</strong> {selectedItem.dob || 'N/A'}</p>
                    <p className="flex items-center gap-2"><UserCheck className="w-3.5 h-3.5 text-slate-400"/> <strong>KRA PIN:</strong> {selectedItem.kra_pin || 'N/A'}</p>
                    <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400"/> <strong>Phone:</strong> {selectedItem.phone || selectedItem.phone_number || 'N/A'}</p>
                    <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400"/> <strong>Email:</strong> {selectedItem.email || selectedItem.email_address || 'N/A'}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900">Uploaded Documents</h4>
                    {renderDocumentLinks(selectedItem)}
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

              {/* Job Applicant Section */}
              {activeTab === 'jobs' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-slate-700">
                    <p><strong>Target Position:</strong> {selectedItem.target_position}</p>
                    <p><strong>Destination:</strong> {selectedItem.destination || selectedItem.destination_country || 'Not Specified'}</p>
                    <p><strong>Passport Status:</strong> {selectedItem.passport_status || 'Yes'}</p>
                    <p className="flex items-center gap-2 pt-1 border-t border-slate-200"><Phone className="w-3.5 h-3.5 text-slate-400"/> <strong>Phone:</strong> {selectedItem.phone_number || selectedItem.phone || 'N/A'}</p>
                    <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400"/> <strong>Email:</strong> {selectedItem.email_address || selectedItem.email || 'N/A'}</p>
                    <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-slate-400"/> <strong>DOB:</strong> {selectedItem.dob || 'N/A'}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900">Uploaded Documents</h4>
                    {renderDocumentLinks(selectedItem)}
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

      {/* --- CREATE NEW JOB POPUP MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden space-y-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Post New Job Listing</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
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

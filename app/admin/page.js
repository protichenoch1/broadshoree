'use client';

import { useState } from 'react';
import { 
  Users, 
  FileCheck, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  MapPin,
  Briefcase,
  Lock,
  LogOut
} from 'lucide-react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState('passports'); // 'passports' | 'jobs'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // Preferred admin access passcode
  const ADMIN_SECRET = 'Broadshore2026!';

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

  // Mock Passport Submissions (Captured from your /passport intake form)
  const [passportApplications, setPassportApplications] = useState([
    {
      id: 'PASS-8921',
      fullName: 'Wanjiku Mary Kamau',
      idNumber: '32849102',
      dob: '1996-05-14',
      gender: 'Female',
      eyeColor: 'Brown',
      height: "5' 6\"",
      kraPin: 'A019283746Z',
      citizenship: 'Birth',
      occupation: 'Registered Nurse',
      maritalStatus: 'Single',
      reasonForTravel: 'Employment',
      birthDetails: { country: 'Kenya', county: 'Kiambu', place: 'Pumwani Hospital' },
      residential: { county: 'Nairobi', subLocation: 'Roysambu', village: 'House 14B', postal: 'P.O. Box 43844 Nairobi', phone: '0712345678', email: 'mary.wanjiku@gmail.com' },
      type: 'New Passport',
      size: 'Series A (32 Pages)',
      biometricCenter: 'Nairobi (Nyayo House)',
      amountPaid: 8500,
      paymentStatus: 'Paid (M-Pesa)',
      mpesaRef: 'QHD81923KL',
      submittedAt: '2026-08-28 14:30',
      status: 'Pending Filing',
      documents: ['Birth_Cert.pdf', 'National_ID.pdf', 'Passport_Photo.jpg', 'Recommender_ID.pdf']
    },
    {
      id: 'PASS-8922',
      fullName: 'John Ochieng Otieno',
      idNumber: '28491029',
      dob: '1992-11-02',
      gender: 'Male',
      eyeColor: 'Black',
      height: "6' 0\"",
      kraPin: 'A009182736X',
      citizenship: 'Birth',
      occupation: 'Heavy Equipment Driver',
      maritalStatus: 'Married',
      reasonForTravel: 'Employment',
      birthDetails: { country: 'Kenya', county: 'Kisumu', place: 'Kisumu County Referral' },
      residential: { county: 'Uasin Gishu', subLocation: 'Eldoret Central', village: 'Plot 42', postal: 'P.O. Box 30 Eldoret', phone: '0722987654', email: 'j.ochieng@gmail.com' },
      type: 'Renewal',
      size: 'Series B (48 Pages)',
      biometricCenter: 'Eldoret',
      amountPaid: 10500,
      paymentStatus: 'Paid (M-Pesa)',
      mpesaRef: 'QHD90182MN',
      submittedAt: '2026-08-28 11:15',
      status: 'Appointment Booked',
      documents: ['Birth_Cert.pdf', 'National_ID.pdf', 'Old_Passport.pdf', 'Recommender_ID.pdf']
    }
  ]);

  // Mock Job Applications (Captured from your /apply intake form)
  const [jobApplications, setJobApplications] = useState([
    {
      id: 'JOB-4401',
      fullName: 'Wanjiku Mary Kamau',
      idNumber: '32849102',
      targetPosition: 'Registered Nurse',
      destination: 'United Kingdom (NHS)',
      passportStatus: 'Valid Passport (6+ months)',
      languageScore: 'IELTS General: 7.5',
      submittedAt: '2026-08-28 14:35',
      status: 'Under Review',
      documents: ['CV_Resume.pdf', 'Academic_Transcripts.pdf', 'Nursing_License.pdf', 'Good_Conduct_Cert.pdf', 'Medical_Fitness.pdf']
    },
    {
      id: 'JOB-4402',
      fullName: 'Peter Kiprop Langat',
      idNumber: '31092841',
      targetPosition: 'Construction Foreman',
      destination: 'Canada (LMIA)',
      passportStatus: 'Processing on eCitizen',
      languageScore: 'N/A',
      submittedAt: '2026-08-27 09:40',
      status: 'Shortlisted',
      documents: ['CV_Resume.pdf', 'Trade_Test_Cert.pdf', 'Good_Conduct_Cert.pdf']
    }
  ]);

  const updateStatus = (id, newStatus, category) => {
    if (category === 'passport') {
      setPassportApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    } else {
      setJobApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    }
    if (selectedItem?.id === id) {
      setSelectedItem(prev => ({ ...prev, status: newStatus }));
    }
  };

  // 1. Render Password Authentication Shield
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
          <div className="text-center space-y-3">
            <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto text-blue-600 border border-blue-100 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Broadshore Admin Portal</h1>
            <p className="text-slate-500 text-xs">Enter your passcode to manage passport submissions and candidates.</p>
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

  // 2. Render Main Admin Dashboard when Authenticated
  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-6">
      
      {/* Header & Overview Cards */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-blue-600" /> Broadshore Concierge & Processing Desk
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage eCitizen passport submissions, candidate intakes, and document verifications.</p>
        </div>

        {/* Tab Selection Switcher & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
            <button
              onClick={() => { setActiveTab('passports'); setSelectedItem(null); }}
              className={`px-4 py-2.5 rounded-lg transition flex items-center gap-2 ${
                activeTab === 'passports' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-4 h-4" /> Passport Processing ({passportApplications.length})
            </button>
            <button
              onClick={() => { setActiveTab('jobs'); setSelectedItem(null); }}
              className={`px-4 py-2.5 rounded-lg transition flex items-center gap-2 ${
                activeTab === 'jobs' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" /> Candidate Applications ({jobApplications.length})
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

      {/* Main Grid: Data Table vs Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Submissions List (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input
              type="text"
              placeholder={`Search by name, ID number, or application ID...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-900 focus:outline-none"
            />
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3.5">Applicant / ID</th>
                    <th className="p-3.5">{activeTab === 'passports' ? 'Category / Center' : 'Position / Destination'}</th>
                    <th className="p-3.5">{activeTab === 'passports' ? 'Payment' : 'Passport Status'}</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeTab === 'passports' ? (
                    passportApplications
                      .filter(app => app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || app.idNumber.includes(searchTerm))
                      .map((app) => (
                        <tr key={app.id} className={`hover:bg-slate-50 transition cursor-pointer ${selectedItem?.id === app.id ? 'bg-blue-50/50' : ''}`}>
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{app.fullName}</div>
                            <div className="text-[11px] text-slate-500">ID: {app.idNumber} | <span className="text-blue-600 font-medium">{app.id}</span></div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-medium text-slate-800">{app.type}</div>
                            <div className="text-[11px] text-slate-500">{app.biometricCenter}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CreditCard className="w-3 h-3" /> KSh {app.amountPaid.toLocaleString()}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              app.status === 'Pending Filing' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {app.status}
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
                      .filter(app => app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || app.idNumber.includes(searchTerm))
                      .map((app) => (
                        <tr key={app.id} className={`hover:bg-slate-50 transition cursor-pointer ${selectedItem?.id === app.id ? 'bg-blue-50/50' : ''}`}>
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{app.fullName}</div>
                            <div className="text-[11px] text-slate-500">ID: {app.idNumber} | <span className="text-blue-600 font-medium">{app.id}</span></div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-medium text-slate-800">{app.targetPosition}</div>
                            <div className="text-[11px] text-slate-500">{app.destination}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="text-xs font-medium text-slate-700">{app.passportStatus}</div>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              app.status === 'Under Review' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {app.status}
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
          </div>
        </div>

        {/* Detailed Inspector Drawer (1 Column) */}
        <div className="space-y-6">
          {selectedItem ? (
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-md space-y-6 sticky top-6">
              
              {/* Top Details Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{selectedItem.id}</span>
                  <h3 className="text-lg font-bold text-slate-900">{selectedItem.fullName}</h3>
                  <p className="text-xs text-slate-500">Submitted: {selectedItem.submittedAt}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                  {selectedItem.status}
                </span>
              </div>

              {/* Passport Specific Inspection Details */}
              {activeTab === 'passports' && (
                <div className="space-y-4 text-xs">
                  
                  {/* eCitizen Vital Attributes */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-blue-600">eCitizen Vital Stats</h4>
                    <div className="grid grid-cols-2 gap-2 text-slate-700">
                      <div><strong className="text-slate-900">DOB:</strong> {selectedItem.dob}</div>
                      <div><strong className="text-slate-900">Gender:</strong> {selectedItem.gender}</div>
                      <div><strong className="text-slate-900">Eyes / Height:</strong> {selectedItem.eyeColor} / {selectedItem.height}</div>
                      <div><strong className="text-slate-900">KRA PIN:</strong> {selectedItem.kraPin}</div>
                      <div><strong className="text-slate-900">Citizenship:</strong> {selectedItem.citizenship}</div>
                      <div><strong className="text-slate-900">Marital:</strong> {selectedItem.maritalStatus}</div>
                    </div>
                  </div>

                  {/* Birth & Residential */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-blue-600">Birth & Residence</h4>
                    <p><strong>Birth Place:</strong> {selectedItem.birthDetails.place}, {selectedItem.birthDetails.county}</p>
                    <p><strong>Residence:</strong> {selectedItem.residential.subLocation}, {selectedItem.residential.county}</p>
                    <p><strong>Contact:</strong> {selectedItem.residential.phone} | {selectedItem.residential.email}</p>
                  </div>

                  {/* Uploaded Verification Files */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900">Uploaded Verification Files</h4>
                    <div className="space-y-1.5">
                      {selectedItem.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-slate-700">
                          <span className="truncate pr-2">{doc}</span>
                          <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold">
                            <Download className="w-3.5 h-3.5" /> View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Workflow Buttons */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <h4 className="font-bold text-slate-900">Update Application Stage</h4>
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

              {/* Job Candidate Inspection Details */}
              {activeTab === 'jobs' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-blue-600">Candidate Recruitment File</h4>
                    <p><strong>Target Job:</strong> {selectedItem.targetPosition}</p>
                    <p><strong>Destination:</strong> {selectedItem.destination}</p>
                    <p><strong>Passport Status:</strong> {selectedItem.passportStatus}</p>
                    <p><strong>Language Proficiency:</strong> {selectedItem.languageScore}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900">Uploaded Clearances & CV</h4>
                    <div className="space-y-1.5">
                      {selectedItem.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-slate-700">
                          <span className="truncate pr-2">{doc}</span>
                          <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold">
                            <Download className="w-3.5 h-3.5" /> Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <h4 className="font-bold text-slate-900">Recruitment Decision</h4>
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
              <p className="text-xs text-slate-500">Click on any applicant row from the list to review physical attributes, residential data, and uploaded documents.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

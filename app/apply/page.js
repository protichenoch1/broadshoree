'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Briefcase, FileText, ShieldCheck, Upload, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function FormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedJob = searchParams.get('job') || '';

  const [loading, setLoading] = useState(false);
  const [hasPassport, setHasPassport] = useState('yes');

  // Form State
  const [formData, setFormData] = useState({
    targetPosition: preselectedJob,
    destination: 'uk',
    fullName: '',
    idNumber: '',
    languageScore: '',
  });

  // File Upload States
  const [passportFile, setPassportFile] = useState(null);
  const [idFile, setIdFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [dciFile, setDciFile] = useState(null);

  const handlePassportCheck = (e) => {
    const val = e.target.value;
    setHasPassport(val);
    if (val === 'no') {
      if (
        confirm(
          'A valid passport with at least 6 months validity is required. Would you like to request eCitizen passport guidance now?'
        )
      ) {
        router.push('/passport');
      }
    }
  };

  // Helper function to upload files to Supabase Storage
  const uploadFile = async (file, folder) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadErr } = await supabase.storage
      .from('job-logos') // Uses your default public bucket
      .upload(filePath, file);

    if (uploadErr) {
      console.error(`Upload error for ${folder}:`, uploadErr);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('job-logos')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload files to Storage
      const passportUrl = await uploadFile(passportFile, 'passports');
      const cvUrl = await uploadFile(cvFile, 'cvs');
      const idUrl = await uploadFile(idFile, 'identifications');
      const dciUrl = await uploadFile(dciFile, 'clearances');

      // 2. Build JSON documents payload for the jsonb column
      const documentsPayload = {
        passport_url: passportUrl,
        cv_url: cvUrl,
        id_url: idUrl,
        dci_url: dciUrl,
      };

      // 3. Insert record matching exact database columns
      const { data, error } = await supabase
        .from('job_applications')
        .insert([
          {
            full_name: formData.fullName,
            id_number: formData.idNumber,
            target_position: formData.targetPosition || preselectedJob || 'General Application',
            destination_country: formData.destination, // Mapped to destination_country
            passport_status: hasPassport,
            language_score: formData.languageScore || null,
            status: 'Pending',
            documents: documentsPayload, // Stored in the jsonb column
          },
        ])
        .select();

      if (error) throw error;

      alert('Application and verification documents submitted successfully!');
      router.push('/dashboard');
    } catch (err) {
      console.error('Submission Error:', err);
      alert(`Database Error: ${err.message || 'Failed to process submission.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Job & Destination Selection */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" /> Target Position & Placement Country
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Target Position
            </label>
            <input
              type="text"
              required
              value={formData.targetPosition}
              onChange={(e) => setFormData({ ...formData, targetPosition: e.target.value })}
              placeholder="e.g. Registered Nurse, Heavy Equipment Driver"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Destination Country
            </label>
            <select
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="uk">United Kingdom (NHS / Healthcare / Care Work)</option>
              <option value="canada">Canada (LMIA / Construction / Transport)</option>
              <option value="uae">Dubai / UAE (Hospitality / Logistics)</option>
              <option value="germany">Germany (Technical / Trade / Nursing)</option>
              <option value="qatar">Qatar / Gulf Region</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Personal & Travel Documents */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" /> 1. Personal & Travel Documents
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Full Name (As on ID / Passport)
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Wanjiku Mary Kamau"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              National ID Number
            </label>
            <input
              type="text"
              required
              value={formData.idNumber}
              onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
              placeholder="12345678"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Kenyan Passport Status
          </label>
          <select
            value={hasPassport}
            onChange={handlePassportCheck}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 font-medium"
          >
            <option value="yes">Valid Passport (6+ months validity & blank pages available)</option>
            <option value="processing">Applied on eCitizen (Biometrics / Processing)</option>
            <option value="no">No Passport (Redirect for Assistance)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="border border-dashed border-slate-300 p-3 rounded-lg bg-slate-50">
            <label className="block font-bold text-slate-800 mb-1">Passport Copy (Bio Page)</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setPassportFile(e.target.files[0])}
              className="w-full text-slate-500"
            />
          </div>

          <div className="border border-dashed border-slate-300 p-3 rounded-lg bg-slate-50">
            <label className="block font-bold text-slate-800 mb-1">National ID & Birth Cert</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setIdFile(e.target.files[0])}
              className="w-full text-slate-500"
            />
          </div>

          <div className="border border-dashed border-slate-300 p-3 rounded-lg bg-slate-50">
            <label className="block font-bold text-slate-800 mb-1">Passport & Full-Size Photo</label>
            <input type="file" accept="image/*" className="w-full text-slate-500" />
          </div>
        </div>
      </div>

      {/* 3. Professional & Educational Records */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" /> 2. Professional & Educational Records
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="border border-dashed border-slate-300 p-3 rounded-lg bg-slate-50">
            <label className="block font-bold text-slate-800 mb-1">Tailored CV / Resume (PDF)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setCvFile(e.target.files[0])}
              className="w-full text-slate-500"
            />
          </div>

          <div className="border border-dashed border-slate-300 p-3 rounded-lg bg-slate-50">
            <label className="block font-bold text-slate-800 mb-1">Academic Certificates & Transcripts</label>
            <input type="file" accept="image/*,.pdf" className="w-full text-slate-500" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Language Proficiency Score (IELTS / German Level / TOEFL - if applicable)
          </label>
          <input
            type="text"
            value={formData.languageScore}
            onChange={(e) => setFormData({ ...formData, languageScore: e.target.value })}
            placeholder="e.g. IELTS General Score: 7.0 or N/A"
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900"
          />
        </div>
      </div>

      {/* 4. Legal, Background & Health Clearances */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" /> 3. Legal Clearances & Health Records
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="border border-dashed border-slate-300 p-3 rounded-lg bg-slate-50">
            <label className="block font-bold text-slate-800 mb-1">Certificate of Good Conduct (DCI)</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setDciFile(e.target.files[0])}
              className="w-full text-slate-500"
            />
          </div>

          <div className="border border-dashed border-slate-300 p-3 rounded-lg bg-slate-50">
            <label className="block font-bold text-slate-800 mb-1">Medical Fitness Certificate</label>
            <input type="file" accept="image/*,.pdf" className="w-full text-slate-500" />
          </div>

          <div className="border border-dashed border-slate-300 p-3 rounded-lg bg-slate-50">
            <label className="block font-bold text-slate-800 mb-1">Vaccination Records (Yellow Card)</label>
            <input type="file" accept="image/*,.pdf" className="w-full text-slate-500" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3 rounded-lg text-xs flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p>
            <strong>NEAMIS Registration Notice:</strong> Broadshore cross-references candidate applications with the
            National Employment Authority Integrated Management System (NEAMIS) for legitimate Kenya labor export compliance.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-base"
      >
        <Upload className="w-5 h-5" />
        {loading ? 'Uploading Application Profile...' : 'Submit Complete Candidate Application'}
      </button>
    </form>
  );
}

export default function ApplyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Overseas Candidate Registration</h1>
        <p className="text-slate-600 text-sm mt-1">
          Upload your verified documents to apply for international job openings.
        </p>
      </div>

      <Suspense fallback={<div className="text-slate-500 text-sm">Loading application portal...</div>}>
        <FormContent />
      </Suspense>
    </div>
  );
}

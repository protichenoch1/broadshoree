'use client';

import { useState } from 'react';
import { ShieldCheck, CreditCard, Upload, CheckCircle2, UserCheck, MapPin, FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { uploadApplicantFile } from '@/lib/upload';

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

  const selectedFee = fees[passportType as keyof typeof fees];
  const totalAmount = selectedFee.officialFee + selectedFee.serviceFee;

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formElement = e.currentTarget;
      const formData = new FormData(formElement);
      const uploadedDocs: Array<{ label: string; [key: string]: any }> = [];

      const filesToUpload = [
        { field: 'birthCert', label: 'Birth Certificate' },
        { field: 'nationalId', label: 'National ID' },
        { field: 'passportPhoto', label: 'Passport Photo' },
        { field: 'recommenderId', label: 'Recommender ID' },
        { field: 'parentsId', label: 'Parents ID' },
        { field: 'oldPassport', label: 'Old Passport' },
        { field: 'lostPoliceAbstract', label: 'Police Abstract / Affidavit' },
      ];

      for (const item of filesToUpload) {
        const file = formData.get(item.field);
        if (file && file instanceof File && file.size > 0) {
          const uploaded = await uploadApplicantFile(file, 'passport-docs');
          if (uploaded) {
            uploadedDocs.push({ label: item.label, ...uploaded });
          }
        }
      }

      const { data, error } = await supabase
        .from('passport_applications')
        .insert([
          {
            full_name: formData.get('fullName'),
            id_number: formData.get('idNumber'),
            dob: formData.get('dob'),
            gender: formData.get('gender'),
            eye_color: formData.get('eyeColor'),
            height: formData.get('height'),
            kra_pin: formData.get('kraPin'),
            citizenship: formData.get('citizenship'),
            occupation: formData.get('occupation'),
            marital_status: formData.get('maritalStatus'),
            reason_for_travel: formData.get('reasonForTravel'),
            country_of_birth: formData.get('countryOfBirth'),
            county_of_birth: formData.get('countyOfBirth'),
            place_of_birth: formData.get('placeOfBirth'),
            county_of_residence: formData.get('countyOfResidence'),
            sub_location: formData.get('subLocation'),
            village_house_no: formData.get('villageHouseNo'),
            postal_address: formData.get('postalAddress'),
            phone_number: phoneNumber,
            email_address: formData.get('email'),
            passport_type: passportType,
            biometrics_center: formData.get('biometricCenter'),
            amount_paid: totalAmount,
            status: 'Pending Filing',
            documents: uploadedDocs,
          },
        ]);

      if (error) throw error;

      alert(`Application successfully saved to Supabase! STK prompt sent to ${phoneNumber}.`);
      formElement.reset();
      setPhoneNumber('');
    } catch (err: any) {
      alert(`Error submitting application: ${err.message || 'Submission failed'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">eCitizen Passport Application Portal</h1>
        <p className="text-slate-600 text-sm mt-1">Complete your full eCitizen intake details and upload mandatory documents for concierge processing.</p>
      </div>

      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Category, Size & Biometric Center */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" /> 1. Passport Category & Enrollment Location
            </h2>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Select Passport Size</label>
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Select Biometrics Location</label>
                <select name="biometricCenter" required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 font-medium">
                  <option value="Nairobi (Nyayo House)">Nairobi (Nyayo House)</option>
                  <option value="Mombasa">Mombasa</option>
                  <option value="Kisumu">Kisumu</option>
                  <option value="Nakuru">Nakuru</option>
                  <option value="Eldoret">Eldoret</option>
                  <option value="Embu">Embu</option>
                  <option value="Kisii">Kisii</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Personal & Physical Attributes */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" /> 2. Personal & Physical Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Full Legal Name (National ID)</label>
                <input name="fullName" type="text" required placeholder="e.g. Wanjiku Mary Kamau" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">National ID Number</label>
                <input name="idNumber" type="text" required placeholder="12345678" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Date of Birth</label>
                <input name="dob" type="date" required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Gender</label>
                <select name="gender" required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 font-medium">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Color of Eyes</label>
                <select name="eyeColor" required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 font-medium">
                  <option value="Brown">Brown</option>
                  <option value="Black">Black</option>
                  <option value="Blue">Blue</option>
                  <option value="Green">Green</option>
                  <option value="Hazel">Hazel</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Height (Feet & Inches)</label>
                <input name="height" type="text" required placeholder="e.g. 5 ft 8 in" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">KRA PIN Number</label>
                <input name="kraPin" type="text" required placeholder="A012345678Z" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 font-medium uppercase" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Citizenship By</label>
                <select name="citizenship" required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 font-medium">
                  <option value="Birth">Birth</option>
                  <option value="Registration">Registration</option>
                  <option value="Naturalization">Naturalization</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Profession / Occupation</label>
                <input name="occupation" type="text" required placeholder="e.g. Nurse, Driver, Engineer" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Marital Status</label>
                <select name="maritalStatus" required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 font-medium">
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Reason for Travel</label>
                <select name="reasonForTravel" required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 font-medium">
                  <option value="Employment">Employment / Work</option>
                  <option value="Education">Education / Studies</option>
                  <option value="Tourism">Tourism / Business</option>
                  <option value="Medical">Medical Treatment</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Birth Location Details */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> 3. Birth Location Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Country of Birth</label>
                <input name="countryOfBirth" type="text" required defaultValue="Kenya" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">County of Birth</label>
                <input name="countyOfBirth" type="text" required placeholder="e.g. Kiambu, Kakamega" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Place / Hospital of Birth</label>
                <input name="placeOfBirth" type="text" required placeholder="e.g. Pumwani, Nakuru Town" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900" />
              </div>
            </div>
          </div>

          {/* 4. Residential & Contact Details */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" /> 4. Residential & Contact Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">County of Residence</label>
                <input name="countyOfResidence" type="text" required placeholder="e.g. Nairobi, Uasin Gishu" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Sub-Location / Estate</label>
                <input name="subLocation" type="text" required placeholder="e.g. Roysambu, Westlands" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Village / House No. / Street</label>
                <input name="villageHouseNo" type="text" required placeholder="e.g. House No. 12B, Kimathi St" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Postal Address</label>
                <input name="postalAddress" type="text" required placeholder="P.O. Box 00100 Nairobi" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Phone Number (M-Pesa)</label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="07XX XXX XXX"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Email Address</label>
                <input name="email" type="email" required placeholder="applicant@gmail.com" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900" />
              </div>
            </div>
          </div>

          {/* 5. Document Upload Section */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" /> 5. Document Uploads
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="border border-dashed border-slate-300 p-3 rounded-lg bg-slate-50">
                <label className="block font-bold text-slate-800 mb-1">Birth Certificate (PDF/Image)</label>
                <input name="birthCert" type="file" required accept="image/*,.pdf" className="w-full text-slate-500" />
              </div>

              <div className="border border-dashed border-slate-300 p-3 rounded-lg bg-slate-50">
                <label className="block font-bold text-slate-800 mb-1">National ID Card (Front & Back)</label>
                <input name="nationalId" type="file" required accept="image/*,.pdf" className="w-full text-slate-500" />
              </div>

              <div className="border border-dashed border-slate-300 p-3 rounded-lg bg-slate-50">
                <label className="block font-bold text-slate-800 mb-1">Passport Size Photo (White Background)</label>
                <input name="passportPhoto" type="file" required accept="image/*" className="w-full text-slate-500" />
              </div>

              <div className="border border-dashed border-slate-300 p-3 rounded-lg bg-slate-50">
                <label className="block font-bold text-slate-800 mb-1">Recommender's ID Copy</label>
                <input name="recommenderId" type="file" required accept="image/*,.pdf" className="w-full text-slate-500" />
              </div>

              <div className="border border-dashed border-slate-300 p-3 rounded-lg bg-slate-50 sm:col-span-2">
                <label className="block font-bold text-slate-800 mb-1">Parents' ID Cards / Death Certificates</label>
                <input name="parentsId" type="file" accept="image/*,.pdf" className="w-full text-slate-500" />
              </div>

              {(applicationType === 'renewal' || applicationType === 'mutilated') && (
                <div className="border border-dashed border-blue-300 p-3 rounded-lg bg-blue-50 sm:col-span-2">
                  <label className="block font-bold text-blue-900 mb-1">Old Passport Copy (Last 3 Pages)</label>
                  <input name="oldPassport" type="file" required accept="image/*,.pdf" className="w-full text-blue-800" />
                </div>
              )}

              {(applicationType === 'lost' || applicationType === 'mutilated') && (
                <div className="border border-dashed border-amber-300 p-3 rounded-lg bg-amber-50 sm:col-span-2 space-y-2">
                  <label className="block font-bold text-amber-900">Police Abstract & Sworn Affidavit</label>
                  <input name="lostPoliceAbstract" type="file" required accept="image/*,.pdf" className="w-full text-amber-800" />
                </div>
              )}
            </div>
          </div>

          {/* 6. Payment & Final Submission */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" /> 6. Payment & Final Submission
            </h2>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3.5 rounded-lg transition flex items-center justify-center gap-2 shadow-sm text-sm cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Uploading Files & Submitting...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" /> Submit Intake & Pay KSh {totalAmount.toLocaleString()} via M-Pesa
                </>
              )}
            </button>
          </div>

        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md sticky top-24 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-4">
                <ShieldCheck className="w-5 h-5" /> Broadshore Passport Engine
              </div>
              
              <h3 className="text-base font-bold border-b border-slate-800 pb-3">Fee Breakdown</h3>
              
              <div className="space-y-3 mt-4 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>{selectedFee.name}</span>
                  <span>KSh {selectedFee.officialFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Broadshore Concierge Fee</span>
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
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Supabase Connected
              </div>
              <p className="text-slate-400 leading-relaxed">
                1. Intakes are securely written to your Supabase SQL database.<br/>
                2. Verification files are stored in your Supabase Storage bucket.<br/>
                3. Applications render immediately on your Admin Dashboard.
              </p>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}

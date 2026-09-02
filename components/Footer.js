'use client';

import Link from 'next/link';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Broadshore Logo"
                  className="w-full h-full object-contain p-0.5"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextSibling) {
                      e.currentTarget.nextSibling.style.display = 'block';
                    }
                  }}
                />
                <Globe className="hidden w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-wider text-white">
                BROAD<span className="text-blue-400">SHORE</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Kenya’s premier overseas placement agency connecting qualified local talent with verified global employers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/dashboard" className="hover:text-blue-400 transition">Job Dashboard</Link>
              </li>
              <li>
                <Link href="/apply" className="hover:text-blue-400 transition">Candidate Registration</Link>
              </li>
              <li>
                <Link href="/passport" className="hover:text-blue-400 transition">eCitizen Passport Support</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/faqs" className="hover:text-blue-400 transition">FAQs & Support</Link>
              </li>
              <li>
                <Link href="/nea-info" className="hover:text-blue-400 transition">NEA Registration Info</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-400 transition">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+254 111 721 048</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@broadshore.co.ke</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 BROADSHORE KENYA. All rights reserved.</p>
          <p className="text-slate-500">Licensed Recruitment Agency</p>
        </div>
      </div>
    </footer>
  );
}

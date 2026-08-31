import Link from 'next/link';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import './globals.css';

export const metadata = {
  title: 'Broadshore Kenya',
  description: 'Overseas Placements for Kenyan Citizens',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
        {/* Top Header & Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="bg-white border-t border-slate-200 mt-12">
          <div className="max-w-7xl mx-auto px-6 py-10 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              
              {/* Col 1: Brand Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="text-blue-600 w-6 h-6" />
                  <span className="text-xl font-bold tracking-wider text-slate-900">
                    BROAD<span className="text-blue-600">SHORE</span> 🇰🇪
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Kenya’s premier overseas placement agency connecting qualified local talent with verified global employers.
                </p>
              </div>

              {/* Col 2: Quick Links */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>
                    <Link href="/dashboard" className="hover:text-blue-600 transition">Job Dashboard</Link>
                  </li>
                  <li>
                    <Link href="/apply" className="hover:text-blue-600 transition">Candidate Registration</Link>
                  </li>
                  <li>
                    <Link href="/passport" className="hover:text-blue-600 transition">eCitizen Passport Support</Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-blue-600 transition">About Us</Link>
                  </li>
                </ul>
              </div>

              {/* Col 3: Support & Legal */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Resources</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>
                    <Link href="/faqs" className="hover:text-blue-600 transition">FAQs & Support</Link>
                  </li>
                  <li><a href="#" className="hover:text-blue-600 transition">NEA Registration Info</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition">Privacy Policy</a></li>
                </ul>
              </div>

              {/* Col 4: Contact Us */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Contact Us</h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Nairobi, Kenya</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>+254 700 000 000</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>support@broadshore.co.ke</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Bottom Copyright Bar */}
            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>© 2026 BROADSHORE KENYA. All rights reserved.</p>
              <p>Licensed Recruitment Agency</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

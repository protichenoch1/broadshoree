'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Briefcase, FileText, ShieldCheck, Info, HelpCircle, Globe } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard & Jobs', href: '/dashboard', icon: Briefcase },
    { name: 'Apply Now', href: '/apply', icon: FileText },
    { name: 'eCitizen Passport Help', href: '/passport', icon: ShieldCheck },
    { name: 'About Us', href: '/about', icon: Info },
    { name: 'FAQs & Support', href: '/faqs', icon: HelpCircle },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Top Header Bar */}
      <header className="w-full bg-white border-b border-slate-200 px-5 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Hamburger Button */}
          <button
            onClick={toggleMenu}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition focus:outline-none"
          >
            <Menu className="w-7 h-7" />
          </button>

          {/* Logo Brand - Increased size */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
              <img
                src="/broadlogo.png"
                alt="Broadshore Logo"
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <Globe className="hidden w-6 h-6 text-blue-500" />
            </div>
            <span className="text-xl font-extrabold tracking-wider text-slate-900">
              BROAD<span className="text-blue-600">SHORE</span>
            </span>
          </Link>
        </div>

        <div className="text-xs text-slate-500 font-semibold bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
          Official Portal
        </div>
      </header>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
        />
      )}

      {/* Slide-out Sidebar Menu */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white p-6 flex flex-col justify-between border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header - Increased size */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                <img
                  src="/logo.png"
                  alt="Broadshore Logo"
                  className="w-full h-full object-contain p-1"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <Globe className="hidden w-7 h-7 text-blue-500" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-wider">
                BROAD<span className="text-blue-600">SHORE</span>
              </h2>
            </div>
            <button
              onClick={toggleMenu}
              aria-label="Close Menu"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg font-medium text-sm transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-100 text-xs text-slate-500 space-y-1">
          <p className="font-bold text-slate-800">Broadshore Kenya</p>
          <p>Global Recruitment Gateway</p>
          <p className="text-[10px] text-slate-400">NEAMIS Compliant</p>
        </div>
      </aside>
    </>
  );
}

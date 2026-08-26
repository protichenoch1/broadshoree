'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Briefcase, FileText, Globe, ShieldCheck } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard & Jobs', href: '/dashboard', icon: Briefcase },
    { name: 'Apply Now', href: '/apply', icon: FileText },
    { name: 'eCitizen Passport Help', href: '/passport', icon: ShieldCheck },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Top Header Bar with 3-Line Menu Icon */}
      <header className="w-full bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          {/* Three Short Lines (Hamburger Button) */}
          <button
            onClick={toggleMenu}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <Globe className="text-blue-500 w-6 h-6" />
            <span className="text-lg font-bold tracking-wider text-slate-100">
              BROAD<span className="text-blue-400">SHORE</span> 🇰🇪
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium">Portal</div>
      </header>

      {/* Darkened Backdrop Overlay when Drawer is Open */}
      {isOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        />
      )}

      {/* Slide-out Sidebar Menu */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-slate-950 p-6 flex flex-col justify-between border-r border-slate-800 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Menu Drawer Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Globe className="text-blue-500 w-6 h-6" />
              <h2 className="text-lg font-bold text-slate-100">
                BROAD<span className="text-blue-400">SHORE</span>
              </h2>
            </div>
            {/* Close Button (X) */}
            <button
              onClick={toggleMenu}
              aria-label="Close Menu"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)} // Closes drawer on navigate
                  className={`flex items-center gap-3 p-3 rounded-lg font-medium text-sm transition ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Menu Drawer Footer */}
        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500">
          <p className="font-semibold text-slate-400">Broadshore Kenya</p>
          <p>Global Placement Services</p>
        </div>
      </aside>
    </>
  );
}

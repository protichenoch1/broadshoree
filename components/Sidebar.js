'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, FileText, Globe, ShieldCheck } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard & Jobs', href: '/dashboard', icon: Briefcase },
    { name: 'Apply Now', href: '/apply', icon: FileText },
    { name: 'eCitizen Passport Help', href: '/passport', icon: ShieldCheck },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-950 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 shrink-0">
      <div>
        <div className="flex items-center gap-2 mb-8">
          <Globe className="text-blue-500 w-7 h-7" />
          <h1 className="text-xl font-bold tracking-wider text-slate-100">
            BROAD<span className="text-blue-400">SHORE</span> 🇰🇪
          </h1>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
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

      <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 hidden md:block">
        <p className="font-semibold text-slate-400">Broadshore Kenya</p>
        <p>Global Career Gateway</p>
      </div>
    </aside>
  );
}

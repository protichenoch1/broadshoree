import Sidebar from '@/components/Sidebar';
import './globals.css';

export const metadata = {
  title: 'Broadshore Kenya',
  description: 'Overseas Placements for Kenyan Citizens',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}

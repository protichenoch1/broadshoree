import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata = {
  title: 'Broadshore Kenya',
  description: 'Overseas Placements for Kenyan Citizens',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
        <Sidebar />

        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OASIS BI PRO - Enterprise Business Intelligence Platform",
  description: "Real-time Business Intelligence & Analytics Platform dengan AI-Powered Insights untuk akselerasi revenue bisnis Anda",
  keywords: ["business intelligence", "analytics", "data visualization", "AI insights", "Indonesia"],
  authors: [{ name: "OASIS Team" }],
  openGraph: {
    title: "OASIS BI PRO - Enterprise Business Intelligence Platform",
    description: "Platform Business Intelligence dengan AI-Powered Insights",
    type: "website",
  },
    generator: 'v0.app'
};

import { Navigation } from '@/components/navigation'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Navigation />
        
        {children}
        
        <footer className="bg-gray-900 text-white mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">OASIS BI PRO</h3>
                <p className="text-gray-400">Enterprise Business Intelligence Platform untuk transformasi data menjadi revenue</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Produk</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/#features" className="hover:text-white transition-colors">Fitur</a></li>
                  <li><a href="/pricing" className="hover:text-white transition-colors">Harga</a></li>
                  <li><a href="/payment-methods" className="hover:text-white transition-colors">Metode Pembayaran</a></li>
                  <li><a href="/security" className="hover:text-white transition-colors">Keamanan</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Member & Admin
                </h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/member/dashboard" className="hover:text-white transition-colors">Member Dashboard</a></li>
                  <li><a href="/member/transactions" className="hover:text-white transition-colors">Member Transaksi</a></li>
                  <li><a href="/admin/dashboard" className="hover:text-white transition-colors">Admin Dashboard</a></li>
                  <li><a href="/admin/users" className="hover:text-white transition-colors">Admin Users</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Perusahaan</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/about" className="hover:text-white transition-colors">Tentang Kami</a></li>
                  <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="/legal/contact" className="hover:text-white transition-colors">Kontak</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="/legal/dpa" className="hover:text-white transition-colors">DPA</a></li>
                  <li><a href="/legal/cookies" className="hover:text-white transition-colors">Cookie Policy</a></li>
                  <li><a href="/legal/refund" className="hover:text-white transition-colors">Refund Policy</a></li>
                  <li><a href="/legal/faq" className="hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 OASIS BI PRO. All rights reserved.</p>
              <p className="mt-2 text-sm">Merchant Code: DS26335 | Duitku Integrated Payment Gateway</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

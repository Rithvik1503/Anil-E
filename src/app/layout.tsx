import type { Metadata } from "next";
import { Inter, Comfortaa } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from '@/components/Footer'
import AnimatedLayout from '@/components/AnimatedLayout'

const inter = Inter({ subsets: ["latin"] });
const comfortaa = Comfortaa({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-comfortaa',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Anil Eravathri - Official Website",
  description: "Official website of Anil Eravathri, Member of Legislative Assembly",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${comfortaa.variable}`}>
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen">
          <AnimatedLayout>
            {children}
          </AnimatedLayout>
        </main>
        <Footer />
      </body>
    </html>
  );
}

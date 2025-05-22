'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';  
import localFont from 'next/font/local';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
 
import { usePathname } from 'next/navigation';
import { Montserrat } from 'next/font/google';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],  
  variable: '--font-montserrat',
});

export default function RootLayout({ children }) {
  const router = useRouter();  
  const pathname = usePathname();   

  useEffect(() => {
     
    if (pathname === '/') {
      router.push('/rooms');  
    }
  }, [pathname, router]);   
  const isLoginPage = pathname === '/login';   
  const isCreatePage = pathname === '/create';   
  
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}  ${montserrat.variable} antialiased `} >
        
        <main className="flex bg-white  ">
          {/* Conditionally render Sidebar based on the pathname */}
          {!isLoginPage && !isCreatePage && <Sidebar />}
          
        
            {children}
        
        </main>
      </body>
    </html>
  );
}  
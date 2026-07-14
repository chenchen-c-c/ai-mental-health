'use client';

import ClientOnly from './ClientOnly';
import Navbar from './Navbar';

export default function FrontendLayout({ children }) {
  return (
    <>
      <ClientOnly>
        <Navbar />
      </ClientOnly>
      <main className="pt-20">
        {children}
      </main>
    </>
  );
}
'use client';

import { useState, useEffect } from 'react';

export default function ClientOnly({ children, fallback }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>{fallback || null}</div>;
  }

  return <>{children}</>;
}
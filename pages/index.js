import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home({ session }) {
  const router = useRouter();
  useEffect(() => {
    if (session) {
      router.replace('/exercises');
    } else {
      router.replace('/login');
    }
  }, [session, router]);
  return <p>Cargando…</p>;
}

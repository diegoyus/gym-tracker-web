import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Redirect users from the root route to either the login or
 * exercises page depending on authentication state. The session
 * is passed in from MyApp via pageProps.
 */
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

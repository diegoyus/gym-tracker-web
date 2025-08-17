import '../styles.css';
import { supabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MyApp({ Component, pageProps }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <nav className="nav">
        <div className="container">
          <Link href="/">GymTracker</Link>
          <div className="right">
            {session ? (
              <>
                <Link href="/exercises">Ejercicios</Link>
                <button onClick={logout}>Salir</button>
              </>
            ) : (
              <>
                <Link href="/login">Entrar</Link>
                <Link href="/signup">Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="container">
        <Component {...pageProps} session={session} />
      </main>
    </>
  );
}

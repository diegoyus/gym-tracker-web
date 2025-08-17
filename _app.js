import '../styles.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

/**
 * Global application component.
 *
 * This component wraps every page and provides a basic navigation bar
 * along with session handling for logged‑in users. When a user is
 * authenticated, links to the exercises page and a logout button are
 * shown. Otherwise, links to the login and signup pages appear. The
 * navigation bar is deliberately simple to focus on functionality.
 */
export default function MyApp({ Component, pageProps }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Fetch current session on mount and subscribe to changes.
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Log the user out and clear session.
  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <nav className="nav">
        <div className="container">
          <Link href="/">
            GymTracker
          </Link>
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
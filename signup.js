import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

/**
 * Signup page for new users. After registering via Supabase Auth,
 * a row is created in the custom `users` table to store additional
 * metadata like username. The user is then redirected to the
 * exercises page.
 */
export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }
    const user = data.user;
    if (user) {
      const { error: err2 } = await supabase.from('users').insert([
        { id: user.id, username },
      ]);
      if (err2) alert(err2.message);
    }
    setLoading(false);
    alert('Registro correcto. Revisa tu correo si necesitas verificarlo.');
    router.push('/exercises');
  };

  return (
    <div className="card">
      <h2>Crear cuenta</h2>
      <form onSubmit={onSubmit}>
        <label>Nombre de usuario</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button disabled={loading}>{loading ? 'Creando…' : 'Registrarse'}</button>
      </form>
    </div>
  );
}
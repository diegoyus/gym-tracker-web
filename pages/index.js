import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

/**
 * List and filter the user's exercises. Logged in users can see
 * their own exercises, filter them by muscle group and navigate to
 * create new ones. Video URLs are converted to embeddable form for
 * YouTube.
 */
export default function Exercises() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    // Ensure the user is authenticated; otherwise redirect to login
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/login');
      } else {
        loadExercises();
      }
    });
  }, []);

  // Load exercises with optional filtering
  const loadExercises = async () => {
    let query = supabase
      .from('exercises')
      .select('*')
      .order('created_at', { ascending: false });
    if (filter) query = query.eq('muscle_group', filter);
    const { data, error } = await query;
    if (error) {
      alert(error.message);
    } else {
      setItems(data || []);
    }
  };

  // Reload when filter changes
  useEffect(() => {
    if (filter !== undefined) loadExercises();
  }, [filter]);

  // Convert YouTube URLs into embeddable format
  const toEmbed = (url) => {
    if (!url) return null;
    return url
      .replace('watch?v=', 'embed/')
      .replace('youtu.be/', 'www.youtube.com/embed/');
  };

  return (
    <>
      <div className="row" style={{ alignItems: 'center' }}>
        <h2 style={{ marginRight: 'auto' }}>Mis ejercicios</h2>
        <Link href="/exercises/new">
          <button>Nuevo ejercicio</button>
        </Link>
      </div>

      <label>Filtrar por grupo muscular</label>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="">Todos</option>
        <option value="Pecho">Pecho</option>
        <option value="Espalda">Espalda</option>
        <option value="Pierna">Pierna</option>
        <option value="Hombro">Hombro</option>
        <option value="Bíceps">Bíceps</option>
        <option value="Tríceps">Tríceps</option>
        <option value="Core">Core</option>
      </select>

      {items.map((it) => (
        <div className="card" key={it.id}>
          <h3>{it.name}</h3>
          {it.muscle_group && (
            <p>
              <strong>Grupo:</strong> {it.muscle_group}
            </p>
          )}
          {it.description && <p>{it.description}</p>}
          <p>
            <strong>Reps:</strong> {it.reps || '-'} · <strong>1RM:</strong> {it.max_weight || '-'}
          </p>
          {it.image_url && (
            <img
              src={it.image_url}
              alt={it.name}
              style={{ maxWidth: '100%', borderRadius: 8 }}
            />
          )}
          {it.video_url && (
            <div
              style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginTop: 12 }}
            >
              <iframe
                src={toEmbed(it.video_url)}
                title="Video"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                allowFullScreen
              />
            </div>
          )}
        </div>
      ))}
    </>
  );
}

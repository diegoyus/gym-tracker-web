import { useEffect, useState } from 'react';
import { supabase } from '../../lib/.aseClient';
import { useRouter } from 'next/router';./lib/supabaseClient

/** './lib/supabaseClient'
 * Form page for creating a new exercise. Handles file uploads to
 * Supabase Storage and inserts a record into the `exercises` table.
 */
export default function NewExercise() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [muscle, setMuscle] = useState('');
  const [maxWeight, setMaxWeight] = useState('');
  const [reps, setReps] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Check auth and capture user ID
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/login');
      else setUserId(session.user.id);
    });
  }, [router]);

  // Upload the image to Supabase Storage and return its public URL
  const uploadImage = async () => {
    if (!file || !userId) return null;
    const ext = file.name.split('.').pop();
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('exercise-images').upload(path, file);
    if (error) {
      alert('Error al subir imagen: ' + error.message);
      return null;
    }
    const { data } = supabase.storage.from('exercise-images').getPublicUrl(path);
    return data.publicUrl;
  };

  // Submit form: upload image then insert exercise row
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      alert('Pon un nombre');
      return;
    }
    setLoading(true);
    let imageUrl = null;
    if (file) imageUrl = await uploadImage();
    const { error } = await supabase.from('exercises').insert([
      {
        user_id: userId,
        name,
        description,
        muscle_group: muscle || null,
        max_weight: maxWeight ? Number(maxWeight) : null,
        reps: reps ? Number(reps) : null,
        image_url: imageUrl,
        video_url: videoUrl || null,
      },
    ]);
    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      alert('Ejercicio creado');
      router.push('/exercises');
    }
  };

  return (
    <div className="card">
      <h2>Nuevo ejercicio</h2>
      <form onSubmit={onSubmit}>
        <label>Nombre</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Descripción (opcional)</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Grupo muscular</label>
        <select value={muscle} onChange={(e) => setMuscle(e.target.value)}>
          <option value="">—</option>
          <option value="Pecho">Pecho</option>
          <option value="Espalda">Espalda</option>
          <option value="Pierna">Pierna</option>
          <option value="Hombro">Hombro</option>
          <option value="Bíceps">Bíceps</option>
          <option value="Tríceps">Tríceps</option>
          <option value="Core">Core</option>
        </select>

        <div className="row">
          <div style={{ flex: 1 }}>
            <label>Reps (habituales)</label>
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              min="0"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>1RM (kg)</label>
            <input
              type="number"
              value={maxWeight}
              onChange={(e) => setMaxWeight(e.target.value)}
              min="0"
              step="0.5"
            />
          </div>
        </div>

        <label>Imagen (opcional)</label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />

        <label>Enlace vídeo (YouTube opcional)</label>
        <input
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />

        <button disabled={loading}>{loading ? 'Guardando…' : 'Crear'}</button>
      </form>
    </div>
  );
}

import { useState } from 'react';
import type { Review } from '../types/movie';
import type { ReviewFormValues } from '../hooks/useMovieDetail';

interface ReviewSectionProps {
  reviews?: Review[];
  onSubmit: (form: ReviewFormValues) => Promise<boolean>;
}

const emptyReview: ReviewFormValues = { nome: '', nota: 5, comentario: '' };

export function ReviewSection({ reviews, onSubmit }: ReviewSectionProps) {
  const [form, setForm] = useState(emptyReview);

  const handleSubmit = async () => {
    const ok = await onSubmit(form);
    if (ok) setForm(emptyReview);
  };

  return (
    <>
      <hr style={{ margin: '1.5rem 0' }} />
      <h3>Avaliações</h3>

      {reviews?.length ? (
        reviews.map((review) => (
          <div key={review.sk_movie_review_id} style={{ background: '#f1f1f1', padding: '0.75rem', borderRadius: '4px', marginBottom: '0.75rem' }}>
            <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>{review.nome} - ⭐ {review.nota}</p>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>{review.comentario}</p>
          </div>
        ))
      ) : (
        <p>Ainda não existem avaliações.</p>
      )}

      <div style={{ marginTop: '1.5rem', background: '#fafafa', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 1rem 0' }}>Adicionar Avaliação</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input type="text" placeholder="O seu nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} style={{ padding: '0.5rem' }} />
          <label>Nota (0 a 10):
            <input type="number" min="0" max="10" value={form.nota} onChange={(e) => setForm({ ...form, nota: Number(e.target.value) })} style={{ padding: '0.5rem', marginLeft: '0.5rem', width: '60px' }} />
          </label>
          <textarea placeholder="Escreva a sua resenha..." value={form.comentario} onChange={(e) => setForm({ ...form, comentario: e.target.value })} style={{ padding: '0.5rem', minHeight: '60px' }} />
          <button onClick={handleSubmit} style={{ background: '#2196F3', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>Enviar Avaliação</button>
        </div>
      </div>
    </>
  );
}

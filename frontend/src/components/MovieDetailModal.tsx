import { useState } from 'react';
import type { MovieDetail } from '../types/movie';
import type { ReviewFormValues } from '../hooks/useMovieDetail';
import { Modal } from './Modal';
import { MovieForm, movieToFormValues, type MovieFormValues } from './MovieForm';
import { ReviewSection } from './ReviewSection';

interface MovieDetailModalProps {
  movie: MovieDetail;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (form: MovieFormValues) => Promise<boolean>;
  onCreateReview: (form: ReviewFormValues) => Promise<boolean>;
}

const actionButton = { color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', flex: 1 } as const;

export function MovieDetailModal({ movie, onClose, onDelete, onUpdate, onCreateReview }: MovieDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<MovieFormValues>(movieToFormValues(movie));

  const startEditing = () => {
    setEditForm(movieToFormValues(movie));
    setIsEditing(true);
  };

  const handleSave = async () => {
    const ok = await onUpdate(editForm);
    if (ok) setIsEditing(false);
  };

  return (
    <Modal scrollable>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2>{isEditing ? 'Editar Filme' : `${movie.titulo} (${movie.ano_lancamento})`}</h2>
        <button onClick={onClose} style={{ background: '#ccc', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Fechar</button>
      </div>

      {isEditing ? (
        <MovieForm
          values={editForm}
          onChange={setEditForm}
          onSubmit={handleSave}
          onCancel={() => setIsEditing(false)}
          submitLabel="Guardar"
        />
      ) : (
        <>
          <p><strong>Duração:</strong> {movie.duracao_minutos ? `${movie.duracao_minutos} minutos` : 'N/D'}</p>
          <p><strong>Estado:</strong> {movie.status_filme || 'N/D'}</p>
          <p><strong>Média de Avaliações:</strong> ⭐ {movie.media_avaliacoes ?? 'Sem avaliações'}</p>
          <p><strong>Sinopse:</strong> {movie.sinopse || 'Sem sinopse disponível.'}</p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={startEditing} style={{ ...actionButton, background: '#2196F3' }}>✏️ Editar</button>
            <button onClick={() => onDelete(movie.sk_movie_id)} style={{ ...actionButton, background: '#ff4d4d' }}>🗑️ Eliminar</button>
          </div>

          <ReviewSection reviews={movie.reviews} onSubmit={onCreateReview} />
        </>
      )}
    </Modal>
  );
}

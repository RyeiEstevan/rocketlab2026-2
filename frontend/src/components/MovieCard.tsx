import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onClick: (id: string) => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <div
      onClick={() => onClick(movie.sk_movie_id)}
      style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', textAlign: 'center', background: '#f9f9f9', cursor: 'pointer' }}
    >
      {movie.url_poster ? (
        <img 
          src={movie.url_poster} 
          alt={movie.titulo} 
          style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '4px' }} 
        />
      ) : (
        <div style={{ width: '100%', height: '280px', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Sem Poster
        </div>
      )}
      <h3 style={{ fontSize: '1rem', margin: '0.5rem 0', color: '#333' }}>{movie.titulo}</h3>
      <p style={{ fontSize: '0.85rem', color: '#666' }}>{movie.ano_lancamento || 'N/D'}</p>
    </div>
  );
}
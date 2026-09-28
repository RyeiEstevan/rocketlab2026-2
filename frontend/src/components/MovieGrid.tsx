import type { Movie } from '../types/movie';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  onMovieClick: (id: string) => void;
}

export function MovieGrid({ movies, onMovieClick }: MovieGridProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
      {movies.map((movie) => (
        <MovieCard key={movie.sk_movie_id} movie={movie} onClick={onMovieClick} />
      ))}
    </div>
  );
}

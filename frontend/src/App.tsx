import { useState } from 'react';
import './App.css';
import { useMovies } from './hooks/useMovies';
import { useMovieDetail } from './hooks/useMovieDetail';
import { SearchBar } from './components/SearchBar';
import { MovieGrid } from './components/MovieGrid';
import { Pagination } from './components/Pagination';
import { CreateMovieModal } from './components/CreateMovieModal';
import { MovieDetailModal } from './components/MovieDetailModal';

function App() {
  const { movies, setMovies, search, skip, limit, fetchMovies, handleSearchChange, prevPage, nextPage } = useMovies();
  const { selectedMovie, openMovie, closeMovie, deleteMovie, updateMovie, createReview } = useMovieDetail({ setMovies });
  const [isCreatingMovie, setIsCreatingMovie] = useState(false);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <h1>Catálogo de Filmes 🎬</h1>
        <SearchBar
          value={search}
          onChange={handleSearchChange}
          onOpenCreateModal={() => setIsCreatingMovie(true)}
        />
      </header>

      <MovieGrid movies={movies} onMovieClick={openMovie} />

      <Pagination
        skip={skip}
        limit={limit}
        isNextDisabled={movies.length < limit}
        onPrev={prevPage}
        onNext={nextPage}
      />

      {isCreatingMovie && (
        <CreateMovieModal
          onClose={() => setIsCreatingMovie(false)}
          onCreated={fetchMovies}
        />
      )}

      {selectedMovie && (
        <MovieDetailModal
          key={selectedMovie.sk_movie_id}
          movie={selectedMovie}
          onClose={closeMovie}
          onDelete={deleteMovie}
          onUpdate={updateMovie}
          onCreateReview={createReview}
        />
      )}
    </div>
  );
}

export default App;

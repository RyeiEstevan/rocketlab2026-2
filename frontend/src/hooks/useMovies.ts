import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import type { Movie } from '../types/movie';

export const PAGE_LIMIT = 10;

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState('');
  const [skip, setSkip] = useState(0);

  const fetchMovies = useCallback(async () => {
    try {
      const response = await api.get('/movies/', {
        params: { skip, limit: PAGE_LIMIT, titulo: search || undefined },
      });
      setMovies(response.data);
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
    }
  }, [skip, search]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setSkip(0);
  };

  const prevPage = () => setSkip((s) => Math.max(0, s - PAGE_LIMIT));
  const nextPage = () => setSkip((s) => s + PAGE_LIMIT);

  return {
    movies,
    setMovies,
    search,
    skip,
    limit: PAGE_LIMIT,
    fetchMovies,
    handleSearchChange,
    prevPage,
    nextPage,
  };
}
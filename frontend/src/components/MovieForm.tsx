import type { MovieDetail } from '../types/movie';

export interface MovieFormValues {
  titulo: string;
  ano_lancamento: string;
  duracao_minutos: string;
  status_filme: string;
  sinopse: string;
}

export const emptyMovieForm: MovieFormValues = {
  titulo: '',
  ano_lancamento: '',
  duracao_minutos: '',
  status_filme: '',
  sinopse: '',
};

export function movieToFormValues(movie: MovieDetail): MovieFormValues {
  return {
    titulo: movie.titulo ?? '',
    ano_lancamento: movie.ano_lancamento?.toString() ?? '',
    duracao_minutos: movie.duracao_minutos?.toString() ?? '',
    status_filme: movie.status_filme ?? '',
    sinopse: movie.sinopse ?? '',
  };
}

/** Converte os campos de texto do formulário para o formato que a API espera. */
export function toMoviePayload(form: MovieFormValues) {
  return {
    titulo: form.titulo,
    status_filme: form.status_filme || undefined,
    sinopse: form.sinopse || undefined,
    ano_lancamento: form.ano_lancamento ? Number(form.ano_lancamento) : undefined,
    duracao_minutos: form.duracao_minutos ? Number(form.duracao_minutos) : undefined,
  };
}

interface MovieFormProps {
  values: MovieFormValues;
  onChange: (values: MovieFormValues) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}

const buttonBase = { color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', flex: 1 } as const;

export function MovieForm({ values, onChange, onSubmit, onCancel, submitLabel }: MovieFormProps) {
  const set = (field: keyof MovieFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ ...values, [field]: e.target.value });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label>Título: <input type="text" value={values.titulo} onChange={set('titulo')} style={{ width: '100%' }} /></label>
      <label>Ano: <input type="number" value={values.ano_lancamento} onChange={set('ano_lancamento')} style={{ width: '100%' }} /></label>
      <label>Duração (min): <input type="number" value={values.duracao_minutos} onChange={set('duracao_minutos')} style={{ width: '100%' }} /></label>
      <label>Estado: <input type="text" value={values.status_filme} onChange={set('status_filme')} style={{ width: '100%' }} /></label>
      <label>Sinopse: <textarea value={values.sinopse} onChange={set('sinopse')} style={{ width: '100%', minHeight: '80px' }} /></label>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button onClick={onSubmit} style={{ ...buttonBase, background: '#4CAF50' }}>{submitLabel}</button>
        <button onClick={onCancel} style={{ ...buttonBase, background: '#f44336' }}>Cancelar</button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import api from '../services/api';
import { Modal } from './Modal';
import { MovieForm, emptyMovieForm, toMoviePayload } from './MovieForm';

interface CreateMovieModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export function CreateMovieModal({ onClose, onCreated }: CreateMovieModalProps) {
  const [form, setForm] = useState(emptyMovieForm);

  const handleCreate = async () => {
    try {
      await api.post('/movies/', toMoviePayload(form));
      alert('Filme criado com sucesso!');
      onCreated();
      onClose();
    } catch (error) {
      console.error('Erro ao criar filme:', error);
      alert('Erro ao criar filme.');
    }
  };

  return (
    <Modal>
      <h2>Adicionar Novo Filme</h2>
      <MovieForm
        values={form}
        onChange={setForm}
        onSubmit={handleCreate}
        onCancel={onClose}
        submitLabel="Criar Filme"
      />
    </Modal>
  );
}

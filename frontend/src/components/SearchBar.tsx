interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onOpenCreateModal: () => void;
  }
  
  export function SearchBar({ value, onChange, onOpenCreateModal }: SearchBarProps) {
    return (
      <div style={{ display: 'flex', gap: '1rem', width: '50%', margin: '0 auto' }}>
        <input
          type="text"
          placeholder="Pesquisar por título..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ padding: '0.5rem 1rem', flex: 1, fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={onOpenCreateModal} 
          style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          + Novo Filme
        </button>
      </div>
    );
  }
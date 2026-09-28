import type { ReactNode } from 'react';

interface ModalProps {
  children: ReactNode;
  scrollable?: boolean;
}

export function Modal({ children, scrollable = false }: ModalProps) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div
        className="modal-box"
        style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '600px',
          width: '90%',
          color: '#333',
          ...(scrollable ? { maxHeight: '80vh', overflowY: 'auto' } : {}),
        }}
      >
        {children}
      </div>
    </div>
  );
}
'use client'
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom'; // Para usar Portals
import { FaXmark } from 'react-icons/fa6'; // Ícone para o botão de fechar (certifique-se de ter 'react-icons' instalado)

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title = "Confirmar Ação", 
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",   
}) => {
  if (!isOpen) return null;

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 animate-fadeIn">
      <div className="relative bg-white p-8 rounded-xl shadow-2xl w-[500px] text-center transform animate-slideIn">
        {/* Botão de fechar (X) */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Fechar"
        >
          <FaXmark className="h-5 w-5" />
        </button>

        <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">{message}</p>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onCancel}
            className="py-3 px-6 rounded-lg text-lg font-semibold transition-colors duration-200 flex-1 max-w-[150px]
                       bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="py-3 px-6 rounded-lg text-lg font-semibold transition-colors duration-200 flex-1 max-w-[150px]
                       bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body // Anexa o modal diretamente ao body do documento
  );
};

export default ConfirmationModal;
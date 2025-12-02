"use client"

import React, { useEffect, useState } from 'react';
import { JSX } from 'react';
import {
  FaRegCircleCheck ,
  FaXmark, 
} from 'react-icons/fa6';
import { MdErrorOutline } from "react-icons/md";
import { IoMdInformationCircleOutline, IoIosWarning  } from "react-icons/io";


export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  id: string;
  message: string;
  type: NotificationType;
  onClose: (id: string) => void; 
  duration?: number; 
}

// Mapeamento de estilos Tailwind para cada tipo de notificação
const typeStyles: Record<NotificationType, string> = {
  success: 'bg-emerald-500/50', 
  error: 'bg-red-500/80',      
  warning: 'bg-amber-500/50',  
  info: 'bg-sky-500/50'        
};

// Ícones do React-Icons para cada tipo de notificação
const typeIcons: Record<NotificationType, JSX.Element> = {
  success: <FaRegCircleCheck className="h-6 w-6" />,
  error: <MdErrorOutline className="h-6 w-6" />,
  warning: <IoIosWarning className="h-6 w-6" />,
  info: <IoMdInformationCircleOutline className="h-6 w-6" />,
};

const Notification: React.FC<NotificationProps> = ({ id, message, type, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false); 
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      className={`
        flex items-center gap-3
        p-4 pr-10 rounded-lg shadow-lg
        text-white font-medium
        transform transition-all ease-out duration-300
        ${typeStyles[type]}
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      role="alert" // Para acessibilidade
    >
      <div className="flex-shrink-0">
        {typeIcons[type]}
      </div>
      <div className="flex-grow">
        {message}
      </div>
      <button
        onClick={handleClose}
        className="absolute right-2 p-1 rounded-full hover:bg-white/20 transition-colors focus:outline-none cursor-pointer focus:ring-2 focus:ring-white focus:ring-opacity-50"
        aria-label="Fechar notificação"
      >
        {/* Usando o ícone FaXmark do React-Icons para o botão de fechar */}
        <FaXmark className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Notification;
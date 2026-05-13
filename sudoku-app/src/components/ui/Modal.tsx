import React from 'react';
import { X } from 'lucide-react';
import { cn } from './Card';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-sm">
      <div 
        className={cn("bg-surface border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]", className)}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          {title && <h2 className="text-lg font-bold text-tx-primary">{title}</h2>}
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 ml-auto">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

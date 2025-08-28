import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

// Card Component
interface CardProps {
  children: ReactNode;
  className?: string;
}
export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-surface border border-border rounded-xl shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => {
    return <div className={`p-4 md:p-6 border-b border-border ${className}`}>{children}</div>;
}

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => {
    return <div className={`p-4 md:p-6 ${className}`}>{children}</div>;
}

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary';
}
export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
    const baseClasses = "inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = variant === 'primary' 
        ? 'bg-primary text-on-primary hover:bg-secondary focus:ring-primary' 
        : 'bg-surface border border-border text-on-surface hover:bg-gray-700/50 focus:ring-gray-500';
    return <button className={`${baseClasses} ${variantClasses} ${className}`} {...props}>{children}</button>
}

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export const Input: React.FC<InputProps> = ({ className, ...props }) => {
    return <input className={`w-full px-3 py-2 bg-background border border-border rounded-lg text-on-background focus:ring-2 focus:ring-primary focus:border-primary outline-none ${className}`} {...props} />
}

// Select Component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    children: ReactNode;
}
export const Select: React.FC<SelectProps> = ({ className, children, ...props }) => {
    return (
        <select className={`w-full px-3 py-2 bg-background border border-border rounded-lg text-on-background focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none ${className}`} {...props}>
            {children}
        </select>
    );
};

// Modal Component
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-surface rounded-xl shadow-lg w-full max-w-lg border border-border animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-border">
                    <h3 className="text-xl font-bold text-on-surface">{title}</h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};
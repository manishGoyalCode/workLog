/**
 * Toast/Notification Component
 */

import React, { useEffect, useState } from 'react';
import './Toast.css';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'success',
    duration = 3000,
    onClose,
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 200);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`toast toast--${type} ${isVisible ? 'toast--visible' : ''}`}>
            <span className="toast__icon">
                {type === 'success' && '✓'}
                {type === 'error' && '✕'}
                {type === 'info' && 'ℹ'}
            </span>
            <span className="toast__message">{message}</span>
            <button className="toast__close" onClick={() => onClose()}>×</button>
        </div>
    );
};

// Toast Container for managing multiple toasts
interface ToastItem {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface ToastContainerProps {
    toasts: ToastItem[];
    onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => onRemove(toast.id)}
                />
            ))}
        </div>
    );
};

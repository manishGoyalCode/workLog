/**
 * Input Component
 */

import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    className = '',
    id,
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`input-wrapper ${error ? 'input-wrapper--error' : ''} ${className}`}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className="input"
                {...props}
            />
            {error && <span className="input-error">{error}</span>}
        </div>
    );
};

/**
 * TextArea Component
 */

import React, { useEffect, useRef } from 'react';
import './TextArea.css';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    autoFocus?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
    label,
    error,
    autoFocus,
    className = '',
    id,
    ...props
}) => {
    const ref = useRef<HTMLTextAreaElement>(null);
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    useEffect(() => {
        if (autoFocus && ref.current) {
            ref.current.focus();
        }
    }, [autoFocus]);

    return (
        <div className={`textarea-wrapper ${error ? 'textarea-wrapper--error' : ''} ${className}`}>
            {label && (
                <label htmlFor={inputId} className="textarea-label">
                    {label}
                </label>
            )}
            <textarea
                ref={ref}
                id={inputId}
                className="textarea"
                {...props}
            />
            {error && <span className="textarea-error">{error}</span>}
        </div>
    );
};

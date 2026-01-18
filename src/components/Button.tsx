/**
 * Button Component
 * Reusable button with variants
 */

import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    loading?: boolean;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    loading = false,
    children,
    className = '',
    disabled,
    ...props
}) => {
    const classNames = [
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth && 'btn--full-width',
        loading && 'btn--loading',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button className={classNames} disabled={disabled || loading} {...props}>
            {loading ? <span className="btn__spinner" /> : children}
        </button>
    );
};

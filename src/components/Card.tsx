/**
 * Card Component
 */

import React from 'react';
import './Card.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    onClick,
    hoverable = false,
}) => {
    const classNames = [
        'card',
        hoverable && 'card--hoverable',
        onClick && 'card--clickable',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classNames} onClick={onClick}>
            {children}
        </div>
    );
};

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
    <div className={`card-header ${className}`}>{children}</div>
);

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => (
    <div className={`card-content ${className}`}>{children}</div>
);

interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
    <div className={`card-footer ${className}`}>{children}</div>
);

/**
 * Log Entry Card Component
 * Displays a preview of a daily log entry
 */

import React from 'react';
import type { DailyLog } from '../domain/types';
import { formatDate, formatDayOfWeek, isToday } from '../utils/dateUtils';
import { Card } from './Card';
import './LogEntryCard.css';

interface LogEntryCardProps {
    log: DailyLog;
    onClick?: () => void;
    compact?: boolean;
}

export const LogEntryCard: React.FC<LogEntryCardProps> = ({ log, onClick, compact = false }) => {
    const truncate = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    };

    return (
        <Card
            className={`log-entry-card ${compact ? 'log-entry-card--compact' : ''}`}
            onClick={onClick}
            hoverable
        >
            <div className="log-entry-card__header">
                <div className="log-entry-card__date">
                    <span className="log-entry-card__day">{formatDayOfWeek(log.date)}</span>
                    <span className="log-entry-card__full-date">{formatDate(log.date)}</span>
                </div>
                {isToday(log.date) && <span className="log-entry-card__badge">Today</span>}
            </div>
            <div className="log-entry-card__content">
                <p className="log-entry-card__work">
                    {compact ? truncate(log.workDescription, 80) : truncate(log.workDescription, 150)}
                </p>
                {log.impact && !compact && (
                    <p className="log-entry-card__impact">
                        <span className="log-entry-card__impact-label">Impact:</span> {truncate(log.impact, 100)}
                    </p>
                )}
            </div>
            {log.links.length > 0 && !compact && (
                <div className="log-entry-card__links">
                    {log.links.slice(0, 2).map(link => (
                        <span key={link.id} className="log-entry-card__link-badge">
                            🔗 {link.label || 'Link'}
                        </span>
                    ))}
                    {log.links.length > 2 && (
                        <span className="log-entry-card__link-more">+{log.links.length - 2} more</span>
                    )}
                </div>
            )}
        </Card>
    );
};

/**
 * Timeline View Page
 */

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, LogEntryCard } from '../components';
import { useDailyLogs } from '../hooks/useData';
import { getWeekRange, getPreviousWeek, getNextWeek, formatDate, getWeekDays, toDateString, formatDateShort } from '../utils/dateUtils';
import { parseISO, format, startOfWeek, endOfWeek } from 'date-fns';
import './Timeline.css';

export const Timeline: React.FC = () => {
    const navigate = useNavigate();
    const { logs, loading } = useDailyLogs();

    const currentWeek = getWeekRange();
    const [selectedWeek, setSelectedWeek] = useState(currentWeek);

    // Group logs by week
    const groupedLogs = useMemo(() => {
        const groups: { [key: string]: typeof logs } = {};

        logs.forEach(log => {
            const logDate = parseISO(log.date);
            const weekStart = format(startOfWeek(logDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');

            if (!groups[weekStart]) {
                groups[weekStart] = [];
            }
            groups[weekStart].push(log);
        });

        return groups;
    }, [logs]);

    // Get all weeks that have logs
    const weeks = useMemo(() => {
        return Object.keys(groupedLogs).sort((a, b) =>
            new Date(b).getTime() - new Date(a).getTime()
        );
    }, [groupedLogs]);

    // Get logs for selected week
    const selectedWeekLogs = useMemo(() => {
        return groupedLogs[selectedWeek.start] || [];
    }, [groupedLogs, selectedWeek.start]);

    // Get all days in selected week
    const weekDays = getWeekDays(selectedWeek.start);

    const handlePrevWeek = () => {
        setSelectedWeek(getPreviousWeek(selectedWeek.start));
    };

    const handleNextWeek = () => {
        const next = getNextWeek(selectedWeek.start);
        if (new Date(next.start) <= new Date()) {
            setSelectedWeek(next);
        }
    };

    const handleThisWeek = () => {
        setSelectedWeek(currentWeek);
    };

    const isCurrentWeek = selectedWeek.start === currentWeek.start;
    const canGoNext = new Date(getNextWeek(selectedWeek.start).start) <= new Date();

    return (
        <div className="timeline">
            <header className="timeline__header">
                <h1 className="timeline__title">Timeline</h1>
                <p className="timeline__subtitle">View and manage your work history</p>
            </header>

            <div className="timeline__content">
                <aside className="timeline__sidebar">
                    <div className="timeline__week-nav">
                        <Button variant="ghost" size="small" onClick={handlePrevWeek}>
                            ← Prev
                        </Button>
                        <span className="timeline__week-range">
                            {formatDateShort(selectedWeek.start)} - {formatDateShort(selectedWeek.end)}
                        </span>
                        <Button
                            variant="ghost"
                            size="small"
                            onClick={handleNextWeek}
                            disabled={!canGoNext}
                        >
                            Next →
                        </Button>
                    </div>

                    {!isCurrentWeek && (
                        <Button variant="secondary" size="small" onClick={handleThisWeek} fullWidth>
                            Go to this week
                        </Button>
                    )}

                    <div className="timeline__weeks-list">
                        <h3 className="timeline__weeks-title">Weeks with entries</h3>
                        {weeks.length > 0 ? (
                            <ul className="timeline__weeks">
                                {weeks.map(weekStart => {
                                    const weekEnd = format(endOfWeek(parseISO(weekStart), { weekStartsOn: 1 }), 'yyyy-MM-dd');
                                    const isSelected = weekStart === selectedWeek.start;
                                    return (
                                        <li key={weekStart}>
                                            <button
                                                className={`timeline__week-btn ${isSelected ? 'timeline__week-btn--active' : ''}`}
                                                onClick={() => setSelectedWeek({ start: weekStart, end: weekEnd })}
                                            >
                                                <span>{formatDateShort(weekStart)} - {formatDateShort(weekEnd)}</span>
                                                <span className="timeline__week-count">
                                                    {groupedLogs[weekStart].length} entries
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="timeline__no-weeks">No entries yet</p>
                        )}
                    </div>
                </aside>

                <main className="timeline__main">
                    <div className="timeline__week-header">
                        <h2 className="timeline__week-title">
                            Week of {formatDate(selectedWeek.start)}
                        </h2>
                    </div>

                    {loading ? (
                        <div className="timeline__loading">Loading...</div>
                    ) : (
                        <div className="timeline__days">
                            {weekDays.map(day => {
                                const log = selectedWeekLogs.find(l => l.date === day);
                                const isToday = day === toDateString();
                                const isPast = new Date(day) < new Date(toDateString());

                                return (
                                    <div
                                        key={day}
                                        className={`timeline__day ${isToday ? 'timeline__day--today' : ''} ${!log && isPast ? 'timeline__day--empty' : ''}`}
                                    >
                                        {log ? (
                                            <LogEntryCard
                                                log={log}
                                                onClick={() => navigate(`/entry/${day}`)}
                                                compact
                                            />
                                        ) : (
                                            <Card
                                                className="timeline__empty-day"
                                                onClick={() => navigate(`/entry/${day}`)}
                                                hoverable
                                            >
                                                <div className="timeline__empty-day-content">
                                                    <span className="timeline__empty-day-date">
                                                        {format(parseISO(day), 'EEEE, MMM d')}
                                                    </span>
                                                    {new Date(day) <= new Date() && (
                                                        <span className="timeline__empty-day-action">
                                                            + Add entry
                                                        </span>
                                                    )}
                                                </div>
                                            </Card>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

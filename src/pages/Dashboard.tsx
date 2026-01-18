/**
 * Dashboard / Home Page
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, LogEntryCard } from '../components';
import { useDailyLogs } from '../hooks/useData';
import { formatDate, toDateString } from '../utils/dateUtils';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { logs, loading } = useDailyLogs();
    const today = toDateString();

    const recentLogs = logs.slice(0, 3);
    const todayLog = logs.find(log => log.date === today);

    return (
        <div className="dashboard">
            <section className="dashboard__hero">
                <div className="dashboard__date">
                    <span className="dashboard__date-label">Today</span>
                    <h1 className="dashboard__date-value">{formatDate(today)}</h1>
                </div>

                <Button
                    size="large"
                    onClick={() => navigate(`/entry/${today}`)}
                >
                    {todayLog ? '✏️ Edit today\'s work' : '➕ Add today\'s work'}
                </Button>
            </section>

            <section className="dashboard__actions">
                <Card className="dashboard__action-card" onClick={() => navigate('/standup')} hoverable>
                    <div className="dashboard__action-icon">🎯</div>
                    <div className="dashboard__action-content">
                        <h3 className="dashboard__action-title">Generate Standup</h3>
                        <p className="dashboard__action-desc">Get yesterday's work and today's plan</p>
                    </div>
                </Card>

                <Card className="dashboard__action-card" onClick={() => navigate('/weekly')} hoverable>
                    <div className="dashboard__action-icon">📊</div>
                    <div className="dashboard__action-content">
                        <h3 className="dashboard__action-title">Weekly Summary</h3>
                        <p className="dashboard__action-desc">Compile this week's achievements</p>
                    </div>
                </Card>

                <Card className="dashboard__action-card" onClick={() => navigate('/review')} hoverable>
                    <div className="dashboard__action-icon">⭐</div>
                    <div className="dashboard__action-content">
                        <h3 className="dashboard__action-title">Performance Review</h3>
                        <p className="dashboard__action-desc">Generate evidence for reviews</p>
                    </div>
                </Card>
            </section>

            <section className="dashboard__recent">
                <div className="dashboard__section-header">
                    <h2 className="dashboard__section-title">Recent Entries</h2>
                    <Button variant="ghost" size="small" onClick={() => navigate('/timeline')}>
                        View all →
                    </Button>
                </div>

                {loading ? (
                    <div className="dashboard__loading">Loading...</div>
                ) : recentLogs.length > 0 ? (
                    <div className="dashboard__logs">
                        {recentLogs.map(log => (
                            <LogEntryCard
                                key={log.id}
                                log={log}
                                onClick={() => navigate(`/entry/${log.date}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <Card className="dashboard__empty">
                        <div className="dashboard__empty-content">
                            <span className="dashboard__empty-icon">📝</span>
                            <h3 className="dashboard__empty-title">No entries yet</h3>
                            <p className="dashboard__empty-desc">Start logging your work to build your impact record</p>
                            <Button onClick={() => navigate(`/entry/${today}`)}>
                                Add your first entry
                            </Button>
                        </div>
                    </Card>
                )}
            </section>
        </div>
    );
};

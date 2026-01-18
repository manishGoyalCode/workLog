/**
 * Daily Work Entry Page
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextArea, Input, LinksManager, Card } from '../components';
import { useDailyLog } from '../hooks/useData';
import { formatDate, toDateString } from '../utils/dateUtils';
import type { Link } from '../domain/types';
import './DailyEntry.css';

export const DailyEntry: React.FC = () => {
    const { date } = useParams<{ date: string }>();
    const navigate = useNavigate();
    const entryDate = date || toDateString();

    const { log, loading, saving, saveLog, deleteLog } = useDailyLog(entryDate);

    const [workDescription, setWorkDescription] = useState('');
    const [impact, setImpact] = useState('');
    const [links, setLinks] = useState<Link[]>([]);
    const [blockers, setBlockers] = useState('');
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    // Populate form when log loads
    useEffect(() => {
        if (log) {
            setWorkDescription(log.workDescription);
            setImpact(log.impact || '');
            setLinks(log.links || []);
            setBlockers(log.blockers || '');
        }
    }, [log]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!workDescription.trim()) {
            setError('Please describe what you worked on');
            return;
        }

        try {
            await saveLog({
                workDescription: workDescription.trim(),
                impact: impact.trim() || undefined,
                links,
                blockers: blockers.trim() || undefined,
            });
            setSaved(true);
            setError('');

            // Reset saved indicator after 2 seconds
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            setError('Failed to save entry');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            try {
                await deleteLog();
                navigate('/');
            } catch (err) {
                setError('Failed to delete entry');
            }
        }
    };

    if (loading) {
        return (
            <div className="daily-entry">
                <div className="daily-entry__loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="daily-entry">
            <header className="daily-entry__header">
                <Button variant="ghost" size="small" onClick={() => navigate(-1)}>
                    ← Back
                </Button>
                <div className="daily-entry__date">
                    <h1 className="daily-entry__title">
                        {log ? 'Edit Entry' : 'New Entry'}
                    </h1>
                    <span className="daily-entry__date-value">{formatDate(entryDate)}</span>
                </div>
            </header>

            <form className="daily-entry__form" onSubmit={handleSubmit}>
                <Card className="daily-entry__card">
                    <div className="daily-entry__fields">
                        <TextArea
                            label="What did you work on? *"
                            placeholder="Describe your work today... (e.g., 'Implemented user authentication flow, fixed bug in payment processing')"
                            value={workDescription}
                            onChange={(e) => setWorkDescription(e.target.value)}
                            autoFocus
                            rows={4}
                            error={error && !workDescription.trim() ? error : undefined}
                        />

                        <TextArea
                            label="Why did it matter?"
                            placeholder="What was the impact? (e.g., 'Reduced page load time by 40%, unblocked the team')"
                            value={impact}
                            onChange={(e) => setImpact(e.target.value)}
                            rows={2}
                        />

                        <LinksManager links={links} onChange={setLinks} />

                        <TextArea
                            label="Blockers / Follow-ups"
                            placeholder="Any blockers or things to follow up on tomorrow?"
                            value={blockers}
                            onChange={(e) => setBlockers(e.target.value)}
                            rows={2}
                        />
                    </div>
                </Card>

                <div className="daily-entry__actions">
                    <div className="daily-entry__actions-left">
                        {log && (
                            <Button type="button" variant="danger" onClick={handleDelete}>
                                Delete
                            </Button>
                        )}
                    </div>
                    <div className="daily-entry__actions-right">
                        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={saving}>
                            {saved ? '✓ Saved!' : 'Save Entry'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

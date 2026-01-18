/**
 * Standup Summary Page
 */

import React, { useState } from 'react';
import { Button, Card, TextArea } from '../components';
import { useStandupSummary } from '../hooks/useData';
import { formatDate, toDateString } from '../utils/dateUtils';
import './Standup.css';

export const Standup: React.FC = () => {
    const { summary, loading, generate } = useStandupSummary();
    const [copied, setCopied] = useState(false);

    // Editable fields
    const [yesterday, setYesterday] = useState('');
    const [today, setToday] = useState('');
    const [blockers, setBlockers] = useState('');

    React.useEffect(() => {
        if (summary) {
            setYesterday(summary.yesterday);
            setToday(summary.today);
            setBlockers(summary.blockers);
        }
    }, [summary]);

    const handleGenerate = async () => {
        await generate();
    };

    const handleCopy = () => {
        const text = `**Yesterday:**
${yesterday}

**Today:**
${today}

**Blockers:**
${blockers}`;

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const hasContent = yesterday || today || blockers;

    return (
        <div className="standup">
            <header className="standup__header">
                <div className="standup__header-content">
                    <h1 className="standup__title">Standup Summary</h1>
                    <p className="standup__date">{formatDate(toDateString())}</p>
                </div>
                <Button onClick={handleGenerate} loading={loading}>
                    {summary ? '🔄 Regenerate' : '✨ Generate Standup'}
                </Button>
            </header>

            {!summary && !loading && (
                <Card className="standup__empty">
                    <div className="standup__empty-content">
                        <span className="standup__empty-icon">🎯</span>
                        <h3 className="standup__empty-title">Ready to generate your standup?</h3>
                        <p className="standup__empty-desc">
                            We'll pull yesterday's work and suggest today's plan based on your logs.
                        </p>
                        <Button size="large" onClick={handleGenerate}>
                            Generate Standup
                        </Button>
                    </div>
                </Card>
            )}

            {loading && (
                <Card className="standup__loading">
                    <div className="standup__loading-content">
                        <span className="standup__loading-spinner"></span>
                        <p>Generating your standup...</p>
                    </div>
                </Card>
            )}

            {summary && !loading && (
                <div className="standup__content">
                    <Card className="standup__section">
                        <TextArea
                            label="Yesterday"
                            value={yesterday}
                            onChange={(e) => setYesterday(e.target.value)}
                            rows={4}
                        />
                    </Card>

                    <Card className="standup__section">
                        <TextArea
                            label="Today"
                            value={today}
                            onChange={(e) => setToday(e.target.value)}
                            rows={4}
                        />
                    </Card>

                    <Card className="standup__section">
                        <TextArea
                            label="Blockers"
                            value={blockers}
                            onChange={(e) => setBlockers(e.target.value)}
                            rows={3}
                        />
                    </Card>

                    <div className="standup__actions">
                        <Button
                            variant="primary"
                            size="large"
                            onClick={handleCopy}
                            disabled={!hasContent}
                        >
                            {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

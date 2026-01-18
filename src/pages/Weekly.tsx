/**
 * Weekly Summary Page
 */

import React, { useState } from 'react';
import { Button, Card, TextArea } from '../components';
import { useWeeklySummary } from '../hooks/useData';
import { getWeekRange, getPreviousWeek, getNextWeek, formatDate, formatDateShort } from '../utils/dateUtils';
import './Weekly.css';

export const Weekly: React.FC = () => {
    const currentWeek = getWeekRange();
    const [selectedWeek, setSelectedWeek] = useState(currentWeek);
    const { summary, loading, generate } = useWeeklySummary();
    const [copied, setCopied] = useState(false);

    // Editable fields
    const [keyContributions, setKeyContributions] = useState('');
    const [impact, setImpact] = useState('');
    const [challengesAndLearnings, setChallengesAndLearnings] = useState('');
    const [nextWeekFocus, setNextWeekFocus] = useState('');

    React.useEffect(() => {
        if (summary) {
            setKeyContributions(summary.keyContributions);
            setImpact(summary.impact);
            setChallengesAndLearnings(summary.challengesAndLearnings);
            setNextWeekFocus(summary.nextWeekFocus);
        }
    }, [summary]);

    const handleGenerate = async () => {
        await generate(selectedWeek.start, selectedWeek.end);
    };

    const handlePrevWeek = () => {
        setSelectedWeek(getPreviousWeek(selectedWeek.start));
    };

    const handleNextWeek = () => {
        const next = getNextWeek(selectedWeek.start);
        if (new Date(next.start) <= new Date()) {
            setSelectedWeek(next);
        }
    };

    const handleCopy = () => {
        const text = `# Weekly Summary: ${formatDateShort(selectedWeek.start)} - ${formatDateShort(selectedWeek.end)}

## Key Contributions
${keyContributions}

## Impact
${impact}

## Challenges & Learnings
${challengesAndLearnings}

## Next Week Focus
${nextWeekFocus}`;

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExport = () => {
        const text = `Weekly Summary: ${formatDateShort(selectedWeek.start)} - ${formatDateShort(selectedWeek.end)}
${'='.repeat(50)}

KEY CONTRIBUTIONS
${keyContributions}

IMPACT
${impact}

CHALLENGES & LEARNINGS
${challengesAndLearnings}

NEXT WEEK FOCUS
${nextWeekFocus}

---
Generated on ${formatDate(new Date().toISOString())}`;

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `weekly-summary-${selectedWeek.start}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const canGoNext = new Date(getNextWeek(selectedWeek.start).start) <= new Date();
    const hasContent = keyContributions || impact || challengesAndLearnings || nextWeekFocus;

    return (
        <div className="weekly">
            <header className="weekly__header">
                <div className="weekly__header-content">
                    <h1 className="weekly__title">Weekly Summary</h1>
                    <p className="weekly__subtitle">Compile your week's achievements for manager updates</p>
                </div>
            </header>

            <div className="weekly__week-selector">
                <Button variant="ghost" size="small" onClick={handlePrevWeek}>
                    ← Previous
                </Button>
                <span className="weekly__week-range">
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

            <div className="weekly__generate">
                <Button onClick={handleGenerate} loading={loading} size="large">
                    {summary ? '🔄 Regenerate Summary' : '✨ Generate Weekly Summary'}
                </Button>
            </div>

            {loading && (
                <Card className="weekly__loading">
                    <div className="weekly__loading-content">
                        <span className="weekly__loading-spinner"></span>
                        <p>Generating your weekly summary...</p>
                    </div>
                </Card>
            )}

            {!loading && summary && (
                <div className="weekly__content">
                    <Card className="weekly__section">
                        <TextArea
                            label="Key Contributions"
                            value={keyContributions}
                            onChange={(e) => setKeyContributions(e.target.value)}
                            rows={5}
                        />
                    </Card>

                    <Card className="weekly__section">
                        <TextArea
                            label="Impact"
                            value={impact}
                            onChange={(e) => setImpact(e.target.value)}
                            rows={4}
                        />
                    </Card>

                    <Card className="weekly__section">
                        <TextArea
                            label="Challenges & Learnings"
                            value={challengesAndLearnings}
                            onChange={(e) => setChallengesAndLearnings(e.target.value)}
                            rows={4}
                        />
                    </Card>

                    <Card className="weekly__section">
                        <TextArea
                            label="Next Week Focus"
                            value={nextWeekFocus}
                            onChange={(e) => setNextWeekFocus(e.target.value)}
                            rows={3}
                        />
                    </Card>

                    <div className="weekly__actions">
                        <Button
                            variant="secondary"
                            onClick={handleExport}
                            disabled={!hasContent}
                        >
                            📄 Export as Text
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleCopy}
                            disabled={!hasContent}
                        >
                            {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
                        </Button>
                    </div>
                </div>
            )}

            {!loading && !summary && (
                <Card className="weekly__empty">
                    <div className="weekly__empty-content">
                        <span className="weekly__empty-icon">📊</span>
                        <h3 className="weekly__empty-title">Generate your weekly summary</h3>
                        <p className="weekly__empty-desc">
                            Select a week above and click generate to compile your work into a manager-ready summary.
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
};

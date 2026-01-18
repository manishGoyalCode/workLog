/**
 * Performance Review Page
 */

import React, { useState } from 'react';
import { Button, Card, TextArea, Input } from '../components';
import { usePerformanceReview } from '../hooks/useData';
import { formatDate, toDateString } from '../utils/dateUtils';
import { subMonths, format } from 'date-fns';
import './Review.css';

export const Review: React.FC = () => {
    const today = toDateString();
    const threeMonthsAgo = format(subMonths(new Date(), 3), 'yyyy-MM-dd');

    const [startDate, setStartDate] = useState(threeMonthsAgo);
    const [endDate, setEndDate] = useState(today);
    const { review, loading, generate } = usePerformanceReview();
    const [copied, setCopied] = useState(false);

    // Editable category fields
    const [ownership, setOwnership] = useState<string[]>([]);
    const [execution, setExecution] = useState<string[]>([]);
    const [impact, setImpact] = useState<string[]>([]);
    const [collaboration, setCollaboration] = useState<string[]>([]);
    const [technicalDepth, setTechnicalDepth] = useState<string[]>([]);

    React.useEffect(() => {
        if (review) {
            setOwnership(review.categories.ownership.bullets);
            setExecution(review.categories.execution.bullets);
            setImpact(review.categories.impact.bullets);
            setCollaboration(review.categories.collaboration.bullets);
            setTechnicalDepth(review.categories.technicalDepth.bullets);
        }
    }, [review]);

    const handleGenerate = async () => {
        await generate(startDate, endDate);
    };

    const formatBullets = (bullets: string[]) => {
        return bullets.map(b => `• ${b}`).join('\n');
    };

    const handleCopy = () => {
        const text = `# Performance Review Evidence
Period: ${formatDate(startDate)} - ${formatDate(endDate)}

## Ownership
${formatBullets(ownership)}

## Execution
${formatBullets(execution)}

## Impact
${formatBullets(impact)}

## Collaboration
${formatBullets(collaboration)}

## Technical Depth
${formatBullets(technicalDepth)}`;

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExport = () => {
        const text = `PERFORMANCE REVIEW EVIDENCE
Period: ${formatDate(startDate)} - ${formatDate(endDate)}
${'='.repeat(50)}

OWNERSHIP
${formatBullets(ownership)}

EXECUTION
${formatBullets(execution)}

IMPACT
${formatBullets(impact)}

COLLABORATION
${formatBullets(collaboration)}

TECHNICAL DEPTH
${formatBullets(technicalDepth)}

---
Generated on ${formatDate(new Date().toISOString())} using ImpactLog`;

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-review-${startDate}-to-${endDate}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const updateCategory = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        value: string
    ) => {
        const bullets = value.split('\n').map(line =>
            line.replace(/^[•\-\*]\s*/, '').trim()
        ).filter(line => line.length > 0);
        setter(bullets);
    };

    const hasContent = ownership.length > 0 || execution.length > 0 ||
        impact.length > 0 || collaboration.length > 0 ||
        technicalDepth.length > 0;

    return (
        <div className="review">
            <header className="review__header">
                <div className="review__header-content">
                    <h1 className="review__title">Performance Review</h1>
                    <p className="review__subtitle">Generate evidence for your performance reviews</p>
                </div>
            </header>

            <div className="review__date-range">
                <Input
                    type="date"
                    label="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <span className="review__date-separator">to</span>
                <Input
                    type="date"
                    label="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    max={today}
                />
            </div>

            <div className="review__generate">
                <Button onClick={handleGenerate} loading={loading} size="large">
                    {review ? '🔄 Regenerate Review' : '⭐ Generate Review Evidence'}
                </Button>
            </div>

            {loading && (
                <Card className="review__loading">
                    <div className="review__loading-content">
                        <span className="review__loading-spinner"></span>
                        <p>Analyzing your work logs...</p>
                    </div>
                </Card>
            )}

            {!loading && review && (
                <div className="review__content">
                    <Card className="review__category">
                        <h3 className="review__category-title">
                            <span className="review__category-icon">🎯</span>
                            Ownership
                        </h3>
                        <TextArea
                            value={ownership.map(b => `• ${b}`).join('\n')}
                            onChange={(e) => updateCategory(setOwnership, e.target.value)}
                            rows={4}
                            placeholder="Add ownership examples..."
                        />
                    </Card>

                    <Card className="review__category">
                        <h3 className="review__category-title">
                            <span className="review__category-icon">🚀</span>
                            Execution
                        </h3>
                        <TextArea
                            value={execution.map(b => `• ${b}`).join('\n')}
                            onChange={(e) => updateCategory(setExecution, e.target.value)}
                            rows={4}
                            placeholder="Add execution examples..."
                        />
                    </Card>

                    <Card className="review__category">
                        <h3 className="review__category-title">
                            <span className="review__category-icon">📈</span>
                            Impact
                        </h3>
                        <TextArea
                            value={impact.map(b => `• ${b}`).join('\n')}
                            onChange={(e) => updateCategory(setImpact, e.target.value)}
                            rows={4}
                            placeholder="Add impact examples..."
                        />
                    </Card>

                    <Card className="review__category">
                        <h3 className="review__category-title">
                            <span className="review__category-icon">🤝</span>
                            Collaboration
                        </h3>
                        <TextArea
                            value={collaboration.map(b => `• ${b}`).join('\n')}
                            onChange={(e) => updateCategory(setCollaboration, e.target.value)}
                            rows={4}
                            placeholder="Add collaboration examples..."
                        />
                    </Card>

                    <Card className="review__category">
                        <h3 className="review__category-title">
                            <span className="review__category-icon">🔧</span>
                            Technical Depth
                        </h3>
                        <TextArea
                            value={technicalDepth.map(b => `• ${b}`).join('\n')}
                            onChange={(e) => updateCategory(setTechnicalDepth, e.target.value)}
                            rows={4}
                            placeholder="Add technical depth examples..."
                        />
                    </Card>

                    <div className="review__actions">
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

            {!loading && !review && (
                <Card className="review__empty">
                    <div className="review__empty-content">
                        <span className="review__empty-icon">⭐</span>
                        <h3 className="review__empty-title">Ready to build your review?</h3>
                        <p className="review__empty-desc">
                            Select a date range and generate categorized evidence from your work logs.
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
};

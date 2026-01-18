/**
 * Summary Service
 * Generates standup, weekly, and performance review summaries.
 * Currently uses deterministic logic; designed for easy AI integration later.
 */

import type { DailyLog, StandupSummary, WeeklySummary, PerformanceReview, SummaryService } from '../domain/types';
import { format, parseISO, subDays, isAfter, isBefore, isEqual } from 'date-fns';

class LocalSummaryService implements SummaryService {
    async generateStandup(logs: DailyLog[], currentDate: string): Promise<StandupSummary> {
        const today = parseISO(currentDate);
        const yesterday = subDays(today, 1);
        const yesterdayStr = format(yesterday, 'yyyy-MM-dd');
        const todayStr = format(today, 'yyyy-MM-dd');

        const yesterdayLog = logs.find(log => log.date === yesterdayStr);
        const todayLog = logs.find(log => log.date === todayStr);

        // Generate yesterday's summary
        let yesterdaySummary = "No work logged for yesterday.";
        if (yesterdayLog) {
            yesterdaySummary = this.formatWorkDescription(yesterdayLog.workDescription);
            if (yesterdayLog.impact) {
                yesterdaySummary += `\n• Impact: ${yesterdayLog.impact}`;
            }
        }

        // Generate today's plan (based on yesterday's blockers or today's log if exists)
        let todaySummary = "Continue with ongoing work.";
        if (todayLog) {
            todaySummary = this.formatWorkDescription(todayLog.workDescription);
        } else if (yesterdayLog?.blockers) {
            todaySummary = `Follow up on: ${yesterdayLog.blockers}`;
        }

        // Collect blockers
        let blockersSummary = "No blockers.";
        const recentBlockers: string[] = [];
        if (yesterdayLog?.blockers) recentBlockers.push(yesterdayLog.blockers);
        if (todayLog?.blockers) recentBlockers.push(todayLog.blockers);
        if (recentBlockers.length > 0) {
            blockersSummary = recentBlockers.join('\n• ');
        }

        return {
            yesterday: yesterdaySummary,
            today: todaySummary,
            blockers: blockersSummary,
            generatedAt: new Date().toISOString(),
        };
    }

    async generateWeeklySummary(logs: DailyLog[], weekStart: string, weekEnd: string): Promise<WeeklySummary> {
        const startDate = parseISO(weekStart);
        const endDate = parseISO(weekEnd);

        const weekLogs = logs.filter(log => {
            const logDate = parseISO(log.date);
            return (isAfter(logDate, startDate) || isEqual(logDate, startDate)) &&
                (isBefore(logDate, endDate) || isEqual(logDate, endDate));
        });

        // Extract key contributions
        const contributions = weekLogs
            .map(log => this.extractKeyPoints(log.workDescription))
            .flat();

        // Extract impacts
        const impacts = weekLogs
            .filter(log => log.impact)
            .map(log => log.impact!);

        // Extract blockers/challenges
        const challenges = weekLogs
            .filter(log => log.blockers)
            .map(log => log.blockers!);

        return {
            weekStart,
            weekEnd,
            keyContributions: contributions.length > 0
                ? contributions.map(c => `• ${c}`).join('\n')
                : "No contributions logged this week.",
            impact: impacts.length > 0
                ? impacts.map(i => `• ${i}`).join('\n')
                : "No impact statements logged this week.",
            challengesAndLearnings: challenges.length > 0
                ? challenges.map(c => `• ${c}`).join('\n')
                : "No challenges or blockers logged this week.",
            nextWeekFocus: this.inferNextWeekFocus(weekLogs),
            generatedAt: new Date().toISOString(),
        };
    }

    async generatePerformanceReview(logs: DailyLog[], startDate: string, endDate: string): Promise<PerformanceReview> {
        const start = parseISO(startDate);
        const end = parseISO(endDate);

        const periodLogs = logs.filter(log => {
            const logDate = parseISO(log.date);
            return (isAfter(logDate, start) || isEqual(logDate, start)) &&
                (isBefore(logDate, end) || isEqual(logDate, end));
        });

        // Categorize work based on keywords and patterns
        const categorized = this.categorizeWork(periodLogs);

        return {
            dateRangeStart: startDate,
            dateRangeEnd: endDate,
            categories: {
                ownership: {
                    title: "Ownership",
                    bullets: categorized.ownership.length > 0
                        ? categorized.ownership
                        : ["Review your logs to identify ownership examples."]
                },
                execution: {
                    title: "Execution",
                    bullets: categorized.execution.length > 0
                        ? categorized.execution
                        : ["Review your logs to identify execution examples."]
                },
                impact: {
                    title: "Impact",
                    bullets: categorized.impact.length > 0
                        ? categorized.impact
                        : ["Review your logs to identify impact examples."]
                },
                collaboration: {
                    title: "Collaboration",
                    bullets: categorized.collaboration.length > 0
                        ? categorized.collaboration
                        : ["Review your logs to identify collaboration examples."]
                },
                technicalDepth: {
                    title: "Technical Depth",
                    bullets: categorized.technicalDepth.length > 0
                        ? categorized.technicalDepth
                        : ["Review your logs to identify technical depth examples."]
                },
            },
            generatedAt: new Date().toISOString(),
        };
    }

    private formatWorkDescription(description: string): string {
        // Split by common delimiters and format as bullets
        const points = description
            .split(/[.\n]/g)
            .map(p => p.trim())
            .filter(p => p.length > 0);

        if (points.length === 1) {
            return `• ${points[0]}`;
        }
        return points.map(p => `• ${p}`).join('\n');
    }

    private extractKeyPoints(description: string): string[] {
        return description
            .split(/[.\n]/g)
            .map(p => p.trim())
            .filter(p => p.length > 10); // Filter out very short fragments
    }

    private inferNextWeekFocus(logs: DailyLog[]): string {
        const lastLog = logs[0]; // Already sorted by date desc
        if (lastLog?.blockers) {
            return `• Address blockers: ${lastLog.blockers}`;
        }
        return "• Continue with ongoing work items.";
    }

    private categorizeWork(logs: DailyLog[]): {
        ownership: string[];
        execution: string[];
        impact: string[];
        collaboration: string[];
        technicalDepth: string[];
    } {
        const result = {
            ownership: [] as string[],
            execution: [] as string[],
            impact: [] as string[],
            collaboration: [] as string[],
            technicalDepth: [] as string[],
        };

        const ownershipKeywords = ['led', 'owned', 'drove', 'initiated', 'championed', 'designed', 'architected'];
        const executionKeywords = ['completed', 'shipped', 'delivered', 'fixed', 'resolved', 'implemented', 'built'];
        const impactKeywords = ['improved', 'reduced', 'increased', 'saved', 'enabled', 'unblocked'];
        const collaborationKeywords = ['with', 'team', 'helped', 'reviewed', 'mentored', 'pair', 'collaborated'];
        const technicalKeywords = ['refactored', 'optimized', 'debugged', 'investigated', 'analyzed', 'migrated', 'upgraded'];

        logs.forEach(log => {
            const text = log.workDescription.toLowerCase();
            const points = this.extractKeyPoints(log.workDescription);

            points.forEach(point => {
                const lowerPoint = point.toLowerCase();

                if (ownershipKeywords.some(k => lowerPoint.includes(k))) {
                    result.ownership.push(point);
                }
                if (executionKeywords.some(k => lowerPoint.includes(k))) {
                    result.execution.push(point);
                }
                if (impactKeywords.some(k => lowerPoint.includes(k)) || log.impact) {
                    const impactText = log.impact ? `${point} - ${log.impact}` : point;
                    if (!result.impact.includes(impactText)) {
                        result.impact.push(impactText);
                    }
                }
                if (collaborationKeywords.some(k => lowerPoint.includes(k))) {
                    result.collaboration.push(point);
                }
                if (technicalKeywords.some(k => lowerPoint.includes(k))) {
                    result.technicalDepth.push(point);
                }
            });
        });

        return result;
    }
}

// Export singleton instance
export const summaryService = new LocalSummaryService();

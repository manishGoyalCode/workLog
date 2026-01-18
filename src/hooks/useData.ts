/**
 * Custom Hooks for ImpactLog
 */

import { useState, useEffect, useCallback } from 'react';
import type { DailyLog, StandupSummary, WeeklySummary, PerformanceReview } from '../domain/types';
import { dailyLogRepository } from '../services/dailyLogRepository';
import { summaryService } from '../services/summaryService';
import { toDateString, getWeekRange } from '../utils/dateUtils';

// Hook for managing all daily logs
export const useDailyLogs = () => {
    const [logs, setLogs] = useState<DailyLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLogs = useCallback(async () => {
        try {
            setLoading(true);
            const allLogs = await dailyLogRepository.getAll();
            setLogs(allLogs);
            setError(null);
        } catch (err) {
            setError('Failed to load logs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return { logs, loading, error, refetch: fetchLogs };
};

// Hook for a single daily log
export const useDailyLog = (date: string) => {
    const [log, setLog] = useState<DailyLog | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLog = async () => {
            try {
                setLoading(true);
                const existingLog = await dailyLogRepository.getByDate(date);
                setLog(existingLog);
                setError(null);
            } catch (err) {
                setError('Failed to load log');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLog();
    }, [date]);

    const saveLog = async (data: Partial<DailyLog> & { workDescription: string }) => {
        try {
            setSaving(true);
            const savedLog = await dailyLogRepository.save({
                ...log,
                ...data,
                date,
            });
            setLog(savedLog);
            setError(null);
            return savedLog;
        } catch (err) {
            setError('Failed to save log');
            console.error(err);
            throw err;
        } finally {
            setSaving(false);
        }
    };

    const deleteLog = async () => {
        if (!log) return;
        try {
            await dailyLogRepository.delete(log.id);
            setLog(null);
        } catch (err) {
            setError('Failed to delete log');
            console.error(err);
            throw err;
        }
    };

    return { log, loading, saving, error, saveLog, deleteLog };
};

// Hook for standup summary
export const useStandupSummary = () => {
    const [summary, setSummary] = useState<StandupSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generate = async () => {
        try {
            setLoading(true);
            const logs = await dailyLogRepository.getAll();
            const today = toDateString();
            const generated = await summaryService.generateStandup(logs, today);
            setSummary(generated);
            setError(null);
            return generated;
        } catch (err) {
            setError('Failed to generate standup');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { summary, setSummary, loading, error, generate };
};

// Hook for weekly summary
export const useWeeklySummary = (weekStart?: string, weekEnd?: string) => {
    const [summary, setSummary] = useState<WeeklySummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generate = async (start?: string, end?: string) => {
        const { start: defaultStart, end: defaultEnd } = getWeekRange();
        const actualStart = start || weekStart || defaultStart;
        const actualEnd = end || weekEnd || defaultEnd;

        try {
            setLoading(true);
            const logs = await dailyLogRepository.getByDateRange(actualStart, actualEnd);
            const generated = await summaryService.generateWeeklySummary(logs, actualStart, actualEnd);
            setSummary(generated);
            setError(null);
            return generated;
        } catch (err) {
            setError('Failed to generate weekly summary');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { summary, setSummary, loading, error, generate };
};

// Hook for performance review
export const usePerformanceReview = () => {
    const [review, setReview] = useState<PerformanceReview | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generate = async (startDate: string, endDate: string) => {
        try {
            setLoading(true);
            const logs = await dailyLogRepository.getByDateRange(startDate, endDate);
            const generated = await summaryService.generatePerformanceReview(logs, startDate, endDate);
            setReview(generated);
            setError(null);
            return generated;
        } catch (err) {
            setError('Failed to generate performance review');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { review, setReview, loading, error, generate };
};

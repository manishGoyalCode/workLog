/**
 * Date Utility Functions
 */

import { format, parseISO, startOfWeek, endOfWeek, subWeeks, addWeeks, eachDayOfInterval } from 'date-fns';

export const formatDate = (date: string | Date): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'MMMM d, yyyy');
};

export const formatDateShort = (date: string | Date): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'MMM d');
};

export const formatDayOfWeek = (date: string | Date): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'EEEE');
};

export const toDateString = (date: Date = new Date()): string => {
    return format(date, 'yyyy-MM-dd');
};

export const getWeekRange = (date: Date = new Date()): { start: string; end: string } => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
    const end = endOfWeek(date, { weekStartsOn: 1 }); // Sunday
    return {
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd'),
    };
};

export const getWeekDays = (weekStart: string): string[] => {
    const start = parseISO(weekStart);
    const end = endOfWeek(start, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end }).map(d => format(d, 'yyyy-MM-dd'));
};

export const getPreviousWeek = (weekStart: string): { start: string; end: string } => {
    const date = parseISO(weekStart);
    const prevWeek = subWeeks(date, 1);
    return getWeekRange(prevWeek);
};

export const getNextWeek = (weekStart: string): { start: string; end: string } => {
    const date = parseISO(weekStart);
    const nextWeek = addWeeks(date, 1);
    return getWeekRange(nextWeek);
};

export const isToday = (date: string): boolean => {
    return date === toDateString();
};

export const isYesterday = (date: string): boolean => {
    const yesterday = format(subWeeks(new Date(), 0), 'yyyy-MM-dd');
    return date === yesterday;
};

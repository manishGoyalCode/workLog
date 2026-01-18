/**
 * Domain Types for ImpactLog
 * These interfaces define the core data structures of the application.
 * They are designed to be storage-agnostic, allowing easy migration to a backend.
 */

export interface Link {
  id: string;
  url: string;
  label?: string;
}

export interface DailyLog {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  workDescription: string; // Required: What did you work on?
  impact?: string; // Optional: Why did it matter?
  links: Link[];
  blockers?: string; // Optional: Blockers / follow-ups
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface StandupSummary {
  yesterday: string;
  today: string;
  blockers: string;
  generatedAt: string;
}

export interface WeeklySummary {
  weekStart: string; // ISO date string
  weekEnd: string;
  keyContributions: string;
  impact: string;
  challengesAndLearnings: string;
  nextWeekFocus: string;
  generatedAt: string;
}

export interface PerformanceReviewCategory {
  title: string;
  bullets: string[];
}

export interface PerformanceReview {
  dateRangeStart: string;
  dateRangeEnd: string;
  categories: {
    ownership: PerformanceReviewCategory;
    execution: PerformanceReviewCategory;
    impact: PerformanceReviewCategory;
    collaboration: PerformanceReviewCategory;
    technicalDepth: PerformanceReviewCategory;
  };
  generatedAt: string;
}

// Repository interfaces for dependency injection / future backend support
export interface DailyLogRepository {
  getAll(): Promise<DailyLog[]>;
  getById(id: string): Promise<DailyLog | null>;
  getByDate(date: string): Promise<DailyLog | null>;
  getByDateRange(startDate: string, endDate: string): Promise<DailyLog[]>;
  save(log: DailyLog): Promise<DailyLog>;
  delete(id: string): Promise<void>;
}

export interface SummaryService {
  generateStandup(logs: DailyLog[], currentDate: string): Promise<StandupSummary>;
  generateWeeklySummary(logs: DailyLog[], weekStart: string, weekEnd: string): Promise<WeeklySummary>;
  generatePerformanceReview(logs: DailyLog[], startDate: string, endDate: string): Promise<PerformanceReview>;
}

// Storage adapter interface for abstraction
export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

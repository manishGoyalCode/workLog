# ImpactLog - Feature Roadmap & Implementation Plan

This document outlines the roadmap to evolve ImpactLog from an MVP into a professional-grade daily driver for engineers.

## Phase 1: Taxonomy & Organization (High Priority)
**Objective**: Allow users to categorize work for better filtering and reporting.

### 1.1 Tags System
- **Schema Update**: Add `tags: string[]` and `projectId?: string` to `DailyLog` interface.
- **UI Components**: 
  - Create `TagInput` component (auto-complete + creation).
  - Add tag filtering to **Timeline** and **Dashboard**.
- **Impact**: Enables specific queries like *"Show all my performance related work for the performance review."*

### 1.2 Project Context
- **Feature**: Allow assigning a log entry to a specific "Project" or "Epic".
- **UI**: Simple dropdown or pill selector in the entry form.

---

## Phase 2: Visual Experience & Polish
**Objective**: Make the app feel "premium" and reduce eye strain.

### 2.1 Dark Mode 🌗
- **Implementation**: 
  - Define CSS variables for semantic colors (`--bg-primary`, `--text-primary`, etc.).
  - Create a `ThemeContext` to manage state.
  - Add a toggle switch in the Sidebar.
- **Goal**: Full support for system preference and manual toggle.

### 2.2 Micro-Interactions
- **Tech**: Integrate `framer-motion`.
- **Animations**:
  - Smooth page transitions.
  - List items appearing with a stagger effect.
  - Satisfying "Save" animations.

---

## Phase 3: "Smart" Features & Integrations
**Objective**: Reduce the friction of manual data entry.

### 3.1 GitHub Activity Import 🐙
- **Problem**: "What did I do yesterday?" is the hardest question.
- **Solution**: 
  - Add a "Fetch GitHub Activity" button.
  - User provides a Personal Access Token (stored in `localStorage`).
  - App fetches commits/PRs from the last 24h and auto-fills the description.
- **Privacy**: Token never leaves the user's browser.

### 3.2 "Polisher" (Text AI) ✨
- **Feature**: A button to rewrite "fixed bug in api" -> "Resolved critical race condition in API Gateway".
- **Implementation**: 
  - Simple heuristical rules initially.
  - (Optional) Integration with a user-provided API Key (OpenAI/Gemini) for advanced rewriting.

---

## Phase 4: Data Safety
**Objective**: Ensure users don't lose their data since we rely on LocalStorage.

### 4.1 Export & Import
- **Feature**: "JSON Backup" button.
- **Function**: Downloads `impactlog_backup_YYYY-MM-DD.json`.
- **Restore**: Drag & drop JSON file to restore data.

---

## Recommended Execution Order
1. **Tags System** (Structured Data)
2. **Dark Mode** (User Satisfaction)
3. **GitHub Import** (Utility/Star Feature)
4. **Data Export** (Safety)

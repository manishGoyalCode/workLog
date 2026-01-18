import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

export const Navigation: React.FC = () => {
    const location = useLocation();

    // Helper to check if link is active
    const isActive = (path: string) => location.pathname === path;

    return (
        <aside className="sidebar">
            <div className="sidebar__header">
                <Link to="/" className="sidebar__logo">
                    <span className="sidebar__logo-icon">📊</span>
                    <span className="sidebar__logo-text">ImpactLog</span>
                </Link>
            </div>

            <nav className="sidebar__nav">
                <div className="sidebar__section">
                    <h3 className="sidebar__section-title">Overview</h3>
                    <Link
                        to="/"
                        className={`sidebar__link ${isActive('/') ? 'sidebar__link--active' : ''}`}
                    >
                        <span className="sidebar__icon">🏠</span>
                        Dashboard
                    </Link>
                    <Link
                        to="/timeline"
                        className={`sidebar__link ${isActive('/timeline') ? 'sidebar__link--active' : ''}`}
                    >
                        <span className="sidebar__icon">📅</span>
                        Timeline
                    </Link>
                </div>

                <div className="sidebar__section">
                    <h3 className="sidebar__section-title">Reports</h3>
                    <Link
                        to="/standup"
                        className={`sidebar__link ${isActive('/standup') ? 'sidebar__link--active' : ''}`}
                    >
                        <span className="sidebar__icon">📢</span>
                        Standup
                    </Link>
                    <Link
                        to="/weekly"
                        className={`sidebar__link ${isActive('/weekly') ? 'sidebar__link--active' : ''}`}
                    >
                        <span className="sidebar__icon">📝</span>
                        Weekly
                    </Link>
                    <Link
                        to="/review"
                        className={`sidebar__link ${isActive('/review') ? 'sidebar__link--active' : ''}`}
                    >
                        <span className="sidebar__icon">🎯</span>
                        Review
                    </Link>
                </div>
            </nav>
        </aside>
    );
};

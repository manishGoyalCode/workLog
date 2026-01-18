/**
 * Links Manager Component
 * For adding/removing multiple links
 */

import React, { useState } from 'react';
import type { Link } from '../domain/types';
import { Button } from './Button';
import { Input } from './Input';
import { v4 as uuidv4 } from 'uuid';
import './LinksManager.css';

interface LinksManagerProps {
    links: Link[];
    onChange: (links: Link[]) => void;
}

export const LinksManager: React.FC<LinksManagerProps> = ({ links, onChange }) => {
    const [newUrl, setNewUrl] = useState('');
    const [newLabel, setNewLabel] = useState('');

    const addLink = () => {
        if (!newUrl.trim()) return;

        const newLink: Link = {
            id: uuidv4(),
            url: newUrl.trim(),
            label: newLabel.trim() || undefined,
        };

        onChange([...links, newLink]);
        setNewUrl('');
        setNewLabel('');
    };

    const removeLink = (id: string) => {
        onChange(links.filter(link => link.id !== id));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addLink();
        }
    };

    return (
        <div className="links-manager">
            <label className="links-manager__label">Links (optional)</label>

            {links.length > 0 && (
                <ul className="links-manager__list">
                    {links.map(link => (
                        <li key={link.id} className="links-manager__item">
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="links-manager__link"
                            >
                                🔗 {link.label || link.url}
                            </a>
                            <button
                                type="button"
                                className="links-manager__remove"
                                onClick={() => removeLink(link.id)}
                                aria-label="Remove link"
                            >
                                ×
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <div className="links-manager__add">
                <Input
                    placeholder="URL"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Input
                    placeholder="Label (optional)"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button type="button" variant="secondary" size="small" onClick={addLink}>
                    Add
                </Button>
            </div>
        </div>
    );
};

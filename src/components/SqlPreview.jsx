import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SqlPreview = ({ sql, explanation }) => {
    if (!sql && !explanation) return null;

    return (
        <div style={{ marginBottom: '2rem', textAlign: 'left', animation: 'slideDown 0.3s ease' }}>
            <style>{`@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>

            {sql && (
                <div style={{ background: '#1e1e1e', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--accent-gradient)' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)' }}>
                        <h4 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Generated SQL</h4>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>Read-Only</div>
                    </div>
                    <div style={{ fontSize: '0.95rem' }}>
                        <SyntaxHighlighter
                            language="sql"
                            style={vscDarkPlus}
                            customStyle={{ margin: 0, padding: '1.5rem', background: '#09090b', fontFamily: 'var(--font-mono)' }}
                            wrapLongLines={true}
                        >
                            {sql}
                        </SyntaxHighlighter>
                    </div>
                </div>
            )}

            {explanation && (
                <div style={{ marginTop: '1rem', fontSize: '0.95rem', color: 'var(--text-secondary)', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-primary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Explanation:</strong> {explanation}
                </div>
            )}
        </div>
    );
};

export default SqlPreview;

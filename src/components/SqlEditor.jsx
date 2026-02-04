import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism-dark.css';

const SqlEditor = ({ value, onChange, onRun }) => {
    return (
        <div style={{ marginBottom: '2rem', textAlign: 'left', animation: 'fadeIn 0.3s ease' }}>
            <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
            <div style={{
                background: '#1e1e1e',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderBottom: '1px solid var(--border-color)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SQL Editor</h4>
                    </div>
                    <button
                        onClick={onRun}
                        className="btn btn-primary"
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                    >
                        Run SQL
                    </button>
                </div>
                <div style={{ position: 'relative', background: '#09090b', padding: '1rem', minHeight: '150px' }}>
                    <Editor
                        value={value}
                        onValueChange={onChange}
                        highlight={code => highlight(code, languages.sql, 'sql')}
                        padding={10}
                        style={{
                            fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
                            fontSize: 16,
                            color: '#d4d4d8',
                        }}
                        textareaClassName="focus-visible:outline-none"
                    />
                </div>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem' }}>
                <span>Press <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: '4px' }}>Ctrl + Enter</code> to run</span>
            </div>
        </div>
    );
};

export default SqlEditor;

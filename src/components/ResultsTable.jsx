import React from 'react';

const ResultsTable = ({ data, loading, error }) => {
    if (loading) return (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            {/* Simple CSS Spinner */}
            <div style={{
                display: 'inline-block',
                width: '30px',
                height: '30px',
                border: '3px solid rgba(255,255,255,0.1)',
                borderTop: '3px solid var(--accent-primary)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '1rem'
            }}></div>
            <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
            <p>Running query against sandbox...</p>
        </div>
    );

    if (error) return (
        <div style={{ padding: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5' }}>
            <strong>Query Error:</strong> {error}
        </div>
    );

    if (!data || !Array.isArray(data) || data.length === 0) return null;

    const columns = Object.keys(data[0]);

    return (
        <div className="table-container" style={{ overflowX: 'auto', marginTop: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                        {columns.map(col => (
                            <th key={col} style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                            {columns.map(col => (
                                <td key={col} style={{ padding: '1rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{row[col]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.8rem', textAlign: 'right' }}>
                {data.length} rows returned
            </div>
        </div>
    );
};

export default ResultsTable;

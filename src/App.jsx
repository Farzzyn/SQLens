import React, { useState } from 'react';
import './App.css';
import ResultsTable from './components/ResultsTable';
import SqlPreview from './components/SqlPreview';
import SqlEditor from './components/SqlEditor';

function App() {
  const [mode, setMode] = useState('beginner'); // 'beginner' | 'expert'
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [queryInput, setQueryInput] = useState('');
  const [generatedSql, setGeneratedSql] = useState('');
  const [explanation, setExplanation] = useState(null);

  const mockData = [
    { id: 101, username: 'jdoe', email: 'john@example.com', sign_up_date: '2023-11-01', status: 'active' },
    { id: 102, username: 'sarah_m', email: 'sarah@example.com', sign_up_date: '2023-11-03', status: 'active' },
    { id: 103, username: 'mike_88', email: 'mike@example.com', sign_up_date: '2023-11-05', status: 'inactive' },
    { id: 104, username: 'emma_w', email: 'emma@example.com', sign_up_date: '2023-11-06', status: 'active' },
    { id: 105, username: 'chris_p', email: 'chris@example.com', sign_up_date: '2023-11-07', status: 'pending' },
  ];

  const handleRunQuery = async (sqlOverride) => {
    // If not override, checking input. If override (expert manual run), proceed.
    if (!sqlOverride && !queryInput.trim() && !generatedSql) return;

    setLoading(true);
    setError(null);
    setData(null); // Clear previous results

    if (!sqlOverride) {
      setGeneratedSql('');
      setExplanation(null);
    }

    try {
      // Step 1: Generate SQL (if not provided/overridden)
      let sqlToRun = sqlOverride;

      if (!sqlToRun) {
        const genRes = await fetch('/api/generate-sql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: queryInput
            // Schema will be auto-fetched by the backend from Supabase
          })
        });

        if (!genRes.ok) {
          const errData = await genRes.json();
          throw new Error(errData.error || 'Failed to generate SQL');
        }

        const genData = await genRes.json();
        sqlToRun = genData.sql;
        setGeneratedSql(genData.sql);
        setExplanation(genData.explanation);
      }

      // Step 2: Execute SQL (if we have a valid query)
      if (sqlToRun) {
        // For MVP, we will currently fallback to mock data IF Supabase URL is missing/fails, 
        // but let's try to hit the endpoint.
        const execRes = await fetch('/api/run-query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: sqlToRun })
        });

        if (execRes.status === 503) {
          // Supabase not configured, use Mock Data fallback
          console.warn("Supabase not configured, falling back to mock data.");
          setTimeout(() => {
            setData(mockData); // Fallback
          }, 500);
        } else if (!execRes.ok) {
          const errData = await execRes.json();
          throw new Error(errData.error || 'Query execution failed');
        } else {
          const resultData = await execRes.json();
          const result = resultData.data;

          // Check if the result is actually an error object
          if (result && !Array.isArray(result) && result.error) {
            throw new Error(result.error);
          }

          setData(Array.isArray(result) ? result : (result ? [result] : []));
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExpertRun = () => {
    if (!generatedSql || !generatedSql.trim()) return;
    handleRunQuery(generatedSql);
  };

  return (
    <div className="app-container" style={{ paddingBottom: '2rem' }}>
      <header className="glass-panel" style={{
        margin: '2rem auto',
        padding: '1.25rem 2rem',
        maxWidth: '1000px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '3rem'
      }}>
        <div className="logo">
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #a78bfa 0%, #818cf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>SQLens</h1>
        </div>

        <div className="controls" style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
          <button
            className={`btn`}
            onClick={() => setMode('beginner')}
            style={{
              background: mode === 'beginner' ? 'var(--bg-primary)' : 'transparent',
              color: mode === 'beginner' ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: mode === 'beginner' ? '1px solid var(--border-color)' : 'none',
              boxShadow: mode === 'beginner' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
              padding: '0.5rem 1rem',
              fontSize: '0.9rem'
            }}
          >
            Beginner
          </button>
          <button
            className={`btn`}
            onClick={() => setMode('expert')}
            style={{
              background: mode === 'expert' ? 'var(--bg-primary)' : 'transparent',
              color: mode === 'expert' ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: mode === 'expert' ? '1px solid var(--border-color)' : 'none',
              boxShadow: mode === 'expert' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
              padding: '0.5rem 1rem',
              fontSize: '0.9rem'
            }}
          >
            Expert
          </button>
        </div>
      </header>

      <main className="container" style={{ maxWidth: '1000px' }}>
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', minHeight: '400px' }}>
          <h2 style={{ marginBottom: '1rem', background: 'linear-gradient(to right, #fff, #bbb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Unleash your data.
          </h2>
          <p style={{ marginBottom: '2.5rem', fontSize: '1.1rem' }}>
            Translate plain English into safe, optimized SQL instantly.
          </p>

          <div style={{ maxWidth: '700px', margin: '0 auto 3rem auto', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              inset: -2,
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              borderRadius: '14px',
              filter: 'blur(8px)',
              opacity: 0.3,
              zIndex: 0
            }}></div>
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunQuery()}
              placeholder={mode === 'expert' ? "Describes what you want (we'll generate SQL you can edit)" : "Ask me anything, e.g., 'Show me all active users'"}
              style={{
                position: 'relative',
                zIndex: 1,
                background: 'var(--bg-primary)',
                padding: '1.25rem',
                fontSize: '1.1rem',
                border: '1px solid var(--border-color)'
              }}
            />
            <button
              className="btn btn-primary"
              onClick={() => handleRunQuery()}
              style={{ position: 'absolute', right: '8px', top: '8px', bottom: '8px', zIndex: 2 }}
            >
              Generate
            </button>
          </div>

          {/* Expert Mode SQL Editor */}
          {mode === 'expert' && (generatedSql || !loading) && (
            <div style={{ maxWidth: '800px', margin: '0 auto 2rem auto' }}>
              <SqlEditor
                value={generatedSql || ''}
                onChange={setGeneratedSql}
                onRun={handleExpertRun}
              />
            </div>
          )}

          {/* Beginner Mode SQL Preview (Read Only) */}
          {mode === 'beginner' && (generatedSql || explanation || loading) && !loading && (
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
              <SqlPreview sql={generatedSql} explanation={explanation} />
            </div>
          )}

          {(loading || data || error) && (
            <div style={{ textAlign: 'left', animation: 'fadeIn 0.5s ease', maxWidth: '1000px', margin: '0 auto' }}>
              <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>

              {data && (
                <div style={{ marginBottom: '1rem', color: 'var(--success)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span>
                  {error ? <span style={{ color: 'var(--error)' }}>Query failed</span> : 'Query executed successfully'}
                </div>
              )}
              {error ? (
                <div style={{ padding: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5' }}>
                  <strong>Error:</strong> {error.includes('429') ? 'Rate limit exceeded (Google Gemini Free Tier). Please wait 30 seconds and try again.' : error}
                  {error.includes('429') && (
                    <div style={{ marginTop: '1rem' }}>
                      <button
                        onClick={() => handleRunQuery()}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}
                      >
                        Retry Now
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <ResultsTable data={data} loading={loading} error={error} />
              )}
            </div>
          )}

          {!loading && !data && !error && !generatedSql && (
            <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Recent Queries</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span
                    style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.9rem' }}
                    onClick={() => setQueryInput("Count monthly active users")}
                  >
                    Count monthly active users
                  </span>
                  <span
                    style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.9rem' }}
                    onClick={() => setQueryInput("Find products with low stock")}
                  >
                    Find products with low stock
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

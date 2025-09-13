import { useMemo, useState } from 'react'
import './App.css'
import { MODELS, predictHeadline } from './api/indicClient'

function ConfidenceBar({ score, showLabel = false }) {
  const pct = (score * 100).toFixed(1)
  return (
    <div className="bar">
      <div className="bar-fill" style={{ width: `${pct}%` }} />
      {showLabel && <span className="bar-label">{pct}%</span>}
    </div>
  )
}

const formatPct = (score) => (score * 100).toFixed(1)

// Quick sample Kannada headlines for users to try
const SAMPLES = [
  'ಕೃಷಿ ಸುಧಾರಣೆಗಾಗಿ ಸರ್ಕಾರ ಹೊಸ ಯೋಜನೆ ಘೋಷಣೆ',
  'ಐಪಿಎಲ್ ಪಂದ್ಯದಲ್ಲಿ ಬೆಂಗಳೂರು ತಂಡ ಭರ್ಜರಿ ಗೆಲುವು',
  'ರಾಜ್ಯ ಬಜೆಟ್‌ನಲ್ಲಿ ಆರೋಗ್ಯಕ್ಕೆ ಹೆಚ್ಚಿನ ವಿನಿಯೋಗ',
  'ಟೆಕ್ ಕಂಪನಿ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಆಧಾರಿತ ಹೊಸ ಸಾಧನ ಬಿಡುಗಡೆ',
]

function App() {
  const [text, setText] = useState('')
  const [model, setModel] = useState(MODELS[0].value)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState([])
  const [latencyMs, setLatencyMs] = useState(0)

  const canSubmit = useMemo(() => text.trim().length > 0 && !loading, [text, loading])

  const onSubmit = async (e) => {
    e?.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError('')
    setResults([])
    try {
      const start = (typeof performance !== 'undefined' ? performance.now() : Date.now())
      const items = await predictHeadline(text, model)
      const end = (typeof performance !== 'undefined' ? performance.now() : Date.now())
      setLatencyMs(Math.max(0, end - start))
      setResults(items)
    } catch (err) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copyTop = async () => {
    if (!results[0]) return
    try {
      await navigator.clipboard.writeText(results[0].label)
    } catch { }
  }

  const copyAll = async () => {
    if (!results.length) return
    const lines = results.slice(0, 3).map((r, i) => `${i + 1}. ${r.label} — ${formatPct(r.score)}%`)
    try { await navigator.clipboard.writeText(lines.join('\n')) } catch { }
  }

  return (
    <div className="container">
      <header>
        <h1>Indic-Classify: A Kannada News Classifier</h1>
        <p className="subtitle">Choose a model and enter a Kannada news headline to get the top 3 predicted categories.</p>
      </header>

      <form className="panel" onSubmit={onSubmit}>
        <label className="field">
          <span>Headline</span>
          <textarea
            placeholder="Enter Kannada news headline…"
            value={text}
            rows={3}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') onSubmit(e)
            }}
          />
        </label>

        <div className="samples">
          <span className="muted">Try a sample:</span>
          <div className="samples-list">
            {SAMPLES.map((s, i) => (
              <button
                key={i}
                type="button"
                className="pill"
                onClick={() => setText(s)}
                title="Use this headline"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="row">
          <label className="field">
            <span>Model</span>
            <select value={model} onChange={(e) => setModel(e.target.value)}>
              {MODELS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </label>

          <button className="primary" type="submit" disabled={!canSubmit}>
            {loading ? 'Predicting…' : 'Get Predictions'}
          </button>
        </div>
      </form>

      {error && <div className="error">{error}</div>}

      <section className="results">
        <h2>Results</h2>
        {!loading && results.length > 0 && (
          <div className="meta muted">{results.length} predictions • {Math.round(latencyMs)} ms</div>
        )}
        {loading && <div className="skeleton-list" aria-busy="true" />}
        {!loading && results.length === 0 && <p className="muted">No results yet.</p>}
        {!loading && results.length > 0 && (
          <ul className="list">
            {results.slice(0, 3).map((r, i) => (
              <li key={`${r.label}-${i}`} className="card">
                <div className="row space">
                  <div className="row">
                    <strong>{r.label}</strong>
                    <span className="chip">{formatPct(r.score)}%</span>
                  </div>
                  <ConfidenceBar score={r.score} />
                </div>
              </li>
            ))}
          </ul>
        )}

        {!loading && results.length > 0 && (
          <div className="row">
            <button className="ghost" type="button" onClick={() => setResults([])}>Clear</button>
            <button className="ghost" type="button" onClick={copyTop}>Copy Top Label</button>
            <button className="ghost" type="button" onClick={copyAll}>Copy Results</button>
          </div>
        )}
      </section>

      <footer>
        <a href="https://huggingface.co/spaces/Santhosh737/Indic-Classify" target="_blank" rel="noreferrer">View Space</a>
      </footer>
    </div>
  )
}

export default App

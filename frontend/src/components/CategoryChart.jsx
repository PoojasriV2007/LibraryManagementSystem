import { useMemo } from 'react'
import { CATEGORIES } from '../utils/constants'

const RADIUS = 60
const STROKE = 26
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const GAP = 2

export default function CategoryChart({ books, onSelect }) {
  const total = books.length
  const categories = useMemo(
    () =>
      CATEGORIES.map((c) => {
        const count = books.filter((b) => b.category === c.name).length
        return { ...c, count, percent: total ? Math.round((count / total) * 100) : 0 }
      }),
    [books, total],
  )

  const segments = useMemo(
    () =>
      categories
        .filter((c) => c.count > 0)
        .reduce((acc, c) => {
          const prev = acc[acc.length - 1]
          const offset = prev ? prev.offset + prev.length : 0
          return [...acc, { ...c, length: (c.count / total) * CIRCUMFERENCE, offset }]
        }, []),
    [categories, total],
  )

  return (
    <section className="card donut-card">
      <div className="card-head">
        <h2 className="card-title">Books by Category</h2>
      </div>
      <div className="donut-body">
        <div className="donut">
          <svg viewBox="0 0 160 160" role="img" aria-label="Books by category">
            <circle cx="80" cy="80" r={RADIUS} fill="none" stroke="#eef0f7" strokeWidth={STROKE} />
            {segments.map((s) => (
              <circle
                key={s.name}
                cx="80"
                cy="80"
                r={RADIUS}
                fill="none"
                stroke={s.color}
                strokeWidth={STROKE}
                strokeDasharray={`${Math.max(s.length - (segments.length > 1 ? GAP : 0), 0.5)} ${CIRCUMFERENCE}`}
                strokeDashoffset={-s.offset}
                transform="rotate(-90 80 80)"
              >
                <title>{`${s.name}: ${s.count} book${s.count === 1 ? '' : 's'}`}</title>
              </circle>
            ))}
          </svg>
          <div className="donut-center">
            <strong>{total}</strong>
            <span>Books</span>
          </div>
        </div>
        <ul className="legend">
          {categories.map((c) => (
            <li key={c.name}>
              <button type="button" className="legend-item" onClick={() => onSelect(c.name)} title={`Show ${c.name} books`}>
                <span className="legend-dot" style={{ background: c.color }} />
                <span className="legend-name">{c.name}</span>
                <span className="legend-count">{c.count}</span>
                <span className="legend-value">{c.percent}%</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

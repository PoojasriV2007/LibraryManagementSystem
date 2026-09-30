import { BookCheck, BookCopy, BookUp, Tags } from 'lucide-react'

export default function StatCards({ stats }) {
  const { total, available, issued, categories, topCategory } = stats
  const pct = (n) => (total ? Math.round((n / total) * 100) : 0)

  const cards = [
    { label: 'Total Books', value: total, foot: 'In your library', icon: BookCopy, tone: 'grad-purple' },
    { label: 'Available', value: available, foot: `${pct(available)}% ready to borrow`, icon: BookCheck, tone: 'grad-green', footTone: 'good' },
    { label: 'Issued', value: issued, foot: `${pct(issued)}% currently borrowed`, icon: BookUp, tone: 'grad-orange', footTone: 'warn' },
    { label: 'Categories', value: categories, foot: topCategory ? `Most books: ${topCategory}` : 'No books yet', icon: Tags, tone: 'grad-blue' },
  ]

  return (
    <section className="stats" aria-label="Library summary">
      {cards.map(({ label, value, foot, icon: Icon, tone, footTone }) => (
        <article className="stat-card" key={label}>
          <span className={`stat-icon ${tone}`}><Icon size={28} /></span>
          <div>
            <p className="stat-label">{label}</p>
            <p className="stat-value" data-testid={`stat-${label.toLowerCase().replace(' ', '-')}`}>{value}</p>
            <p className={`stat-foot ${footTone || 'muted'}`}>{foot}</p>
          </div>
        </article>
      ))}
    </section>
  )
}

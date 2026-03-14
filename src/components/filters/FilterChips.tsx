import { quickSearches } from '@/data/sampleData';
import { useNavigate } from 'react-router-dom';

export default function FilterChips({ activeQuery }: { activeQuery?: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {quickSearches.map(term => (
        <button
          key={term}
          onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeQuery?.toLowerCase() === term.toLowerCase()
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-primary/10'
          }`}
        >
          {term}
        </button>
      ))}
    </div>
  );
}

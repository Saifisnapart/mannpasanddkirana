import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { quickSearches } from '@/data/sampleData';

interface TopSearchBarProps {
  initialQuery?: string;
  showChips?: boolean;
  compact?: boolean;
}

export default function TopSearchBar({ initialQuery = '', showChips = false, compact = false }: TopSearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSearch = (q?: string) => {
    const searchQuery = (q ?? query).trim();
    if (searchQuery) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className={compact ? '' : 'space-y-3'}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for groceries, brands..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="pl-10 pr-4 h-11 bg-card border-border rounded-xl text-sm"
          />
        </div>
        <button
          onClick={() => handleSearch()}
          className="h-11 px-4 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors shrink-0"
        >
          Search
        </button>
      </div>

      {showChips && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {quickSearches.map(term => (
            <button
              key={term}
              onClick={() => { setQuery(term); handleSearch(term); }}
              className="shrink-0 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

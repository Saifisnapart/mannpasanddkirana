import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Globe, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const quickSearches = ['Rice', 'Milk', 'Atta', 'Oil', 'Sugar', 'Dal', 'Eggs', 'Bread', 'Chicken', 'Detergent'];

interface TopSearchBarProps {
  initialQuery?: string;
  showChips?: boolean;
  compact?: boolean;
}

export default function TopSearchBar({ initialQuery = '', showChips = false, compact = false }: TopSearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();
  const { currencies, activeCurrency, setActiveCurrency } = useCurrency();
  const { languages, currentLanguage, setLanguage, t } = useLanguage();

  const handleSearch = (q?: string) => {
    const searchQuery = (q ?? query).trim();
    if (searchQuery) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className={compact ? '' : 'space-y-3'}>
      <div className="flex items-center gap-2">
        {/* Currency selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-11 px-2.5 rounded-xl bg-secondary text-foreground text-xs font-medium hover:bg-secondary/80 transition-colors shrink-0 flex items-center gap-1">
              {activeCurrency.currency_code} <ChevronDown className="h-3 w-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {currencies.map(c => (
              <DropdownMenuItem key={c.id} onClick={() => setActiveCurrency(c.id)}
                className={c.id === activeCurrency.id ? 'bg-primary/10 text-primary' : ''}>
                {c.currency_code} – {c.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Language selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-11 px-2.5 rounded-xl bg-secondary text-foreground text-xs font-medium hover:bg-secondary/80 transition-colors shrink-0 flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" /> {currentLanguage.native_name} <ChevronDown className="h-3 w-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {languages.map(l => (
              <DropdownMenuItem key={l.id} onClick={() => setLanguage(l.id)}
                className={l.id === currentLanguage.id ? 'bg-primary/10 text-primary' : ''}>
                {l.native_name} {l.id === currentLanguage.id && '✓'}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder={t('search') + '...'} value={query}
            onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="pl-10 pr-4 h-11 bg-card border-border rounded-xl text-sm" />
        </div>
        <button onClick={() => handleSearch()}
          className="h-11 px-4 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors shrink-0">
          {t('search')}
        </button>
      </div>
      {showChips && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {quickSearches.map(term => (
            <button key={term} onClick={() => { setQuery(term); handleSearch(term); }}
              className="shrink-0 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

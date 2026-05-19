import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import { cn } from '../utils';

interface SmartDrugInputProps {
  drugs: string[];
  onChange: (drugs: string[]) => void;
  disabled?: boolean;
}

export function SmartDrugInput({ drugs, onChange, disabled }: SmartDrugInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = async (term: string) => {
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }
    setIsSearching(true);
    try {
      // Free public RxNorm API for approximate matching
      const res = await fetch(`https://rxnav.nlm.nih.gov/REST/Prescribe/approximateTerm.json?term=${term}&maxEntries=5`);
      const data = await res.json();
      if (data.approximateGroup?.candidate) {
        setSuggestions(data.approximateGroup.candidate.map((c: any) => c.name).slice(0, 5));
      } else {
        setSuggestions([]);
      }
    } catch {
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(inputValue);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue]);

  const addDrug = (drug: string) => {
    if (!drug.trim() || drugs.includes(drug.trim())) return;
    onChange([...drugs, drug.trim()]);
    setInputValue('');
    setSuggestions([]);
  };

  const removeDrug = (index: number) => {
    onChange(drugs.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Active Tags */}
      {drugs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {drugs.map((drug, i) => (
            <span key={i} className="px-3 py-1.5 border border-teal-500/20 text-teal-400 rounded-xl text-sm font-medium flex items-center gap-2"
              style={{ background: 'rgba(13,148,136,0.1)' }}>
              {drug}
              <button onClick={() => removeDrug(i)} className="hover:text-white transition-colors"><X size={14} /></button>
            </span>
          ))}
        </div>
      )}

      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={disabled}
          placeholder="Type a medication (e.g., Aspirin)..."
          className={cn(
            'w-full rounded-2xl p-4 pl-5 pr-12 outline-none text-base text-white/90 transition-all duration-300',
            'border border-white/8 focus:border-teal-500/40',
            disabled && 'opacity-40 cursor-not-allowed'
          )}
          style={{ background: 'rgba(0,0,0,0.35)', boxShadow: '0 2px 12px rgba(0,0,0,0.2) inset' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addDrug(inputValue);
            }
          }}
        />
        <button 
          onClick={() => addDrug(inputValue)}
          disabled={!inputValue.trim() || disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center hover:bg-teal-500/30 disabled:opacity-30 transition-colors"
        >
          <Plus size={18} strokeWidth={3} />
        </button>
        
        {/* Dropdown Suggestions */}
        {inputValue.length > 1 && (suggestions.length > 0 || isSearching) && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-white/10 bg-[#0f172a] shadow-2xl overflow-hidden z-50">
            {isSearching ? (
              <div className="p-3 text-sm text-white/50 flex items-center gap-2 justify-center">
                <Loader2 className="animate-spin" size={14} /> Searching RxNorm...
              </div>
            ) : (
              <ul className="max-h-48 overflow-y-auto py-1">
                {suggestions.map((sug, i) => (
                  <li key={i}>
                    <button 
                      onClick={() => addDrug(sug)}
                      className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      {sug}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

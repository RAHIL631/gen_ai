import React, { useEffect, useState } from 'react';
import { Clock, Search, Filter, ChevronRight, Download } from 'lucide-react';
import { getHistoryApi } from '../services/api';
import { cn } from '../utils';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getHistoryApi().then(d => { setHistory(d); setIsLoading(false); }).catch(() => setIsLoading(false));
  }, []);

  const filtered = history.filter(h => !search || h.drugs?.join(', ').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-1">
            Security & <span className="text-gradient text-gradient-blue">Analysis Log</span>
          </h2>
          <p className="text-white/40 font-medium">Historical payload processing and alert resolution.</p>
        </div>
        <button className="btn-ghost !py-2.5 !px-5 !text-xs !rounded-xl hidden md:flex items-center gap-2">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        {/* Search bar */}
        <div className="p-4 border-b border-white/6 flex gap-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
            <input type="text" placeholder="Search registry indices..." value={search} onChange={e => setSearch(e.target.value)}
              className="input-premium !pl-10 !py-2.5 !text-sm !rounded-xl" />
          </div>
          <button className="btn-ghost !py-2.5 !px-4 !text-xs !rounded-xl flex items-center gap-2">
            <Filter size={14} /> Filter
          </button>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-white/25 text-xs font-mono uppercase tracking-widest">Querying Databanks...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center">
            <div className="w-18 h-18 glass-card !rounded-3xl !p-0 w-16 h-16 flex items-center justify-center mb-5 mx-auto">
              <Clock size={28} className="text-white/20" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{search ? 'No Results Found' : 'Registry Empty'}</h3>
            <p className="text-white/25 font-medium text-sm max-w-xs mx-auto">
              {search ? 'Try a different search term.' : 'No interaction checks logged yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5" style={{ background: 'rgba(0,0,0,0.15)' }}>
                  {['Timestamp / ID', 'Payload Identifiers', 'Threat Class', 'Anomalies', ''].map(h => (
                    <th key={h} className="py-3.5 px-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => {
                  const sev = log.maxSeverity;
                  const styles =
                    sev==='CONTRAINDICATED' ? 'badge-rose' :
                    sev==='MAJOR' ? 'badge-amber' :
                    sev==='MODERATE' ? 'badge-blue' :
                    sev==='LOW' ? '' : 'badge-emerald';
                  const anomalyColor =
                    log.issueCount > 0 && (sev==='CONTRAINDICATED' || sev==='MAJOR') ? 'text-rose-400' :
                    log.issueCount > 0 ? 'text-amber-400' : 'text-emerald-400';
                  return (
                    <tr key={log.id} className="border-b border-white/4 hover:bg-white/3 transition-colors group cursor-pointer">
                      <td className="py-4 px-5">
                        <span className="text-sm text-white/70 font-semibold block mb-0.5">
                          {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                        <span className="text-[10px] font-mono text-white/20 uppercase">IDX-{log.id?.toUpperCase?.() || i}</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="text-sm font-semibold text-white/75 leading-snug">{log.drugs?.length > 0 ? log.drugs.join(', ') : 'Unknown'}</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className={cn('badge', styles, !styles && 'badge-blue')}>{sev === 'NONE' ? 'SAFE' : sev}</span>
                      </td>
                      <td className={cn('py-4 px-5 text-sm font-bold', anomalyColor)}>
                        {log.issueCount > 0 ? `${log.issueCount} DETECTED` : '0 DETECTED'}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="w-8 h-8 ml-auto rounded-xl glass-card !rounded-xl !p-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:!bg-blue-500/20 hover:border-blue-400/30 text-white/30 hover:text-blue-400">
                          <ChevronRight size={16} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

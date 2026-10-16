import React from 'react';
import { useTheme } from '../context/ThemeContext';

export type FilterCategory = 'all' | 'esi-1-2' | 'esi-3-5' | 'ai-alerts';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedFilter: FilterCategory;
  onFilterChange: (f: FilterCategory) => void;
  selectedZone: string;
  onZoneChange: (z: string) => void;
  totalCount: number;
  esiHighCount: number;
  esiLowCount: number;
  aiAlertsCount: number;
  inboundCount: number;
  onOpenBedsideIntake: () => void;
  onOpenEms: () => void;
  onOpenBroadcast: () => void;
  onSimulateCode: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  selectedZone,
  onZoneChange,
  totalCount,
  esiHighCount,
  esiLowCount,
  aiAlertsCount,
  inboundCount,
  onOpenBedsideIntake,
  onOpenEms,
  onOpenBroadcast,
  onSimulateCode,
}) => {
  const { isDark } = useTheme();

  return (
    <section
      className={`w-full px-4 py-2 border-b transition-colors ${
        isDark
          ? 'bg-[#102034] border-[#1b2b3f]/70'
          : 'bg-white border-slate-200 shadow-2xs'
      }`}
    >
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
        {/* Search & Contextual Filtering */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search box */}
          <div className="relative min-w-[260px] flex-1 max-w-md">
            <span
              className={`material-symbols-outlined absolute left-2.5 top-2 text-[18px] ${
                isDark ? 'text-[#89929b]' : 'text-slate-400'
              }`}
            >
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search patient name, MRN, bay #, or symptom..."
              className={`w-full pl-8 pr-2.5 py-1.5 rounded text-[13px] border focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                isDark
                  ? 'bg-[#000f21] text-[#d3e4fe] placeholder:text-[#89929b] border-[#1b2b3f]'
                  : 'bg-slate-50 text-slate-800 placeholder:text-slate-400 border-slate-200'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <button
              onClick={() => onFilterChange('all')}
              className={`px-2.5 py-1 rounded font-mono-numbers text-[11px] font-bold transition-all ${
                selectedFilter === 'all'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : isDark
                  ? 'bg-[#1b2b3f] text-[#d3e4fe] hover:bg-[#26364a]'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              All ({totalCount})
            </button>

            <button
              onClick={() => onFilterChange('esi-1-2')}
              className={`px-2.5 py-1 rounded font-mono-numbers text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                selectedFilter === 'esi-1-2'
                  ? 'bg-red-600 text-white shadow-xs'
                  : isDark
                  ? 'bg-[#1b2b3f] text-[#d3e4fe] hover:bg-[#26364a]'
                  : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              ESI 1-2 ({esiHighCount})
            </button>

            <button
              onClick={() => onFilterChange('esi-3-5')}
              className={`px-2.5 py-1 rounded font-mono-numbers text-[11px] font-bold transition-all ${
                selectedFilter === 'esi-3-5'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : isDark
                  ? 'bg-[#1b2b3f] text-[#bfc7d2] hover:text-[#d3e4fe] hover:bg-[#26364a]'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              ESI 3-5 ({esiLowCount})
            </button>

            <button
              onClick={() => onFilterChange('ai-alerts')}
              className={`px-2.5 py-1 rounded font-mono-numbers text-[11px] font-bold transition-all flex items-center gap-1 ${
                selectedFilter === 'ai-alerts'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : isDark
                  ? 'bg-[#6001d1]/30 text-[#d2bbff] hover:bg-[#6001d1]/50 border border-[#d2bbff]/30'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">psychology</span>
              AI Alerts ({aiAlertsCount})
            </button>
          </div>

          {/* Pod Zone Select */}
          <select
            value={selectedZone}
            onChange={(e) => onZoneChange(e.target.value)}
            className={`text-[13px] py-1.5 px-2.5 rounded border focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium ${
              isDark
                ? 'bg-[#000f21] text-[#d3e4fe] border-[#1b2b3f]'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <option value="all">All Care Pods &amp; Zones</option>
            <option value="Resuscitation / Trauma (5 Bays)">Resuscitation / Trauma (5 Bays)</option>
            <option value="Acute Pod A (10 Beds)">Acute Pod A (10 Beds)</option>
            <option value="Acute Pod B (12 Beds)">Acute Pod B (12 Beds)</option>
            <option value="Fast Track Care (6 Rooms)">Fast Track Care (6 Rooms)</option>
            <option value="General Waiting Triage">General Waiting Triage</option>
          </select>
        </div>

        {/* Action & Trigger Controls */}
        <div className="flex items-center gap-2 self-end lg:self-center">
          <button
            onClick={onOpenBedsideIntake}
            className="px-3 py-1.5 rounded bg-sky-600 text-white text-[13px] font-bold flex items-center gap-1.5 hover:bg-sky-700 active:scale-95 transition-all shadow-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Bedside Intake</span>
          </button>

          <button
            onClick={onOpenEms}
            className="px-3 py-1.5 rounded bg-teal-600 text-white text-[13px] font-bold flex items-center gap-1.5 hover:bg-teal-700 transition-all shadow-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">airport_shuttle</span>
            <span>EMS Inbound ({inboundCount})</span>
          </button>

          <button
            onClick={onOpenBroadcast}
            className={`p-1.5 rounded transition-colors border ${
              isDark
                ? 'bg-[#1b2b3f] hover:bg-[#26364a] text-[#d3e4fe] border-[#26364a]'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="Broadcast Staff Overhead Announcement"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">campaign</span>
          </button>

          <button
            onClick={onSimulateCode}
            className={`px-2 py-1.5 rounded transition-colors border text-[11px] font-mono-numbers flex items-center gap-1 ${
              isDark
                ? 'bg-[#1b2b3f] hover:bg-[#26364a] text-[#acedff] border-[#acedff]/30'
                : 'bg-slate-100 hover:bg-slate-200 text-sky-700 border-sky-200'
            }`}
            title="Simulate Real-time Clinical Vital Shift / Code"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-sky-500 animate-spin">sync</span>
            <span className="hidden sm:inline font-semibold">Telemetry Tick</span>
          </button>
        </div>
      </div>
    </section>
  );
};

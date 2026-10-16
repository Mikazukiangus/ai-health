import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface KpiStripProps {
  activeCensus: number;
  waitingCount: number;
  bayOccupiedCount: number;
  criticalCount: number;
  medianWaitMin: number;
  sepsisCount: number;
  decompCount: number;
  resusOccupancy: number;
  resusTotal: number;
}

export const KpiStrip: React.FC<KpiStripProps> = ({
  activeCensus,
  waitingCount,
  bayOccupiedCount,
  criticalCount,
  medianWaitMin,
  sepsisCount,
  decompCount,
  resusOccupancy,
  resusTotal,
}) => {
  const { isDark } = useTheme();
  const resusPercent = Math.round((resusOccupancy / resusTotal) * 100);

  const cardBase = isDark
    ? 'bg-[#0b1c30] border-[#1b2b3f]/60 hover:border-[#3198dc]/40 text-[#d3e4fe]'
    : 'bg-white border-slate-200/80 hover:border-sky-300 text-slate-800 shadow-xs';

  return (
    <section className={`w-full px-4 py-1.5 transition-colors ${isDark ? 'bg-[#000f21]' : 'bg-[#eef2f6]'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 items-stretch">
        {/* KPI 1: Queue Volume */}
        <div className={`p-2.5 rounded border flex flex-col justify-between transition-colors ${cardBase}`}>
          <div className="flex items-center justify-between">
            <span className={`font-mono-numbers text-[11px] uppercase tracking-wider font-semibold ${isDark ? 'text-[#bfc7d2]' : 'text-slate-500'}`}>
              Active ED Census
            </span>
            <span className={`px-1.5 py-0.5 rounded font-mono-numbers text-[11px] font-bold ${isDark ? 'bg-[#102034] text-[#93ccff]' : 'bg-sky-50 text-sky-700 border border-sky-100'}`}>
              +4 / hr
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className={`text-[32px] font-bold tracking-tight leading-none ${isDark ? 'text-[#d3e4fe]' : 'text-slate-900'}`}>
              {activeCensus}
            </span>
            <span className={`text-[12px] font-medium ${isDark ? 'text-[#bfc7d2]' : 'text-slate-500'}`}>
              Patients Active
            </span>
          </div>
          <div className={`flex items-center justify-between font-mono-numbers text-[11px] pt-1 px-1.5 rounded ${isDark ? 'bg-[#102034]/60 text-[#bfc7d2]' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
            <span>
              Waiting: <strong className={isDark ? 'text-[#d3e4fe]' : 'text-slate-800'}>{waitingCount}</strong>
            </span>
            <span>
              Bays: <strong className={isDark ? 'text-[#4cd7f6]' : 'text-sky-700'}>{bayOccupiedCount}</strong>
            </span>
          </div>
        </div>

        {/* KPI 2: ESI Acuity Distribution */}
        <div className={`p-2.5 rounded border flex flex-col justify-between transition-colors lg:col-span-1 ${cardBase}`}>
          <div className="flex items-center justify-between">
            <span className={`font-mono-numbers text-[11px] uppercase tracking-wider font-semibold ${isDark ? 'text-[#bfc7d2]' : 'text-slate-500'}`}>
              Acuity Tiers
            </span>
            <span className="font-mono-numbers text-[11px] text-red-600 flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
              {criticalCount} Critical
            </span>
          </div>
          <div className="flex items-center gap-1 my-1 py-0.5">
            <div
              className="flex-1 bg-red-600 text-white font-mono-numbers text-[11px] text-center py-0.5 rounded font-bold shadow-xs"
              title="ESI 1: 2 Patients"
            >
              1: 2
            </div>
            <div
              className="flex-1 bg-purple-600 text-white font-mono-numbers text-[11px] text-center py-0.5 rounded font-bold shadow-xs"
              title="ESI 2: 6 Patients"
            >
              2: 6
            </div>
            <div
              className="flex-1 bg-cyan-600 text-white font-mono-numbers text-[11px] text-center py-0.5 rounded font-bold shadow-xs"
              title="ESI 3: 14 Patients"
            >
              3: 14
            </div>
            <div
              className="flex-1 bg-sky-600 text-white font-mono-numbers text-[11px] text-center py-0.5 rounded font-bold shadow-xs"
              title="ESI 4: 9 Patients"
            >
              4: 9
            </div>
            <div
              className={`flex-1 font-mono-numbers text-[11px] text-center py-0.5 rounded font-bold border ${
                isDark ? 'bg-[#1b2b3f] text-[#bfc7d2] border-[#26364a]' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title="ESI 5: 3 Patients"
            >
              5: 3
            </div>
          </div>
          <div className={`w-full h-1.5 rounded overflow-hidden flex ${isDark ? 'bg-[#26364a]' : 'bg-slate-200'}`}>
            <div className="bg-red-600 h-full" style={{ width: '6%' }}></div>
            <div className="bg-purple-600 h-full" style={{ width: '18%' }}></div>
            <div className="bg-cyan-600 h-full" style={{ width: '41%' }}></div>
            <div className="bg-sky-600 h-full" style={{ width: '26%' }}></div>
            <div className="bg-slate-400 h-full" style={{ width: '9%' }}></div>
          </div>
        </div>

        {/* KPI 3: Median Time to PIA */}
        <div className={`p-2.5 rounded border flex flex-col justify-between transition-colors ${cardBase}`}>
          <div className="flex items-center justify-between">
            <span className={`font-mono-numbers text-[11px] uppercase tracking-wider font-semibold ${isDark ? 'text-[#bfc7d2]' : 'text-slate-500'}`}>
              Median Wait (PIA)
            </span>
            <span className={`font-mono-numbers text-[11px] flex items-center gap-0.5 font-bold ${isDark ? 'text-[#4cd7f6]' : 'text-cyan-700'}`}>
              <span className="material-symbols-outlined text-[14px]">trending_down</span>
              -4m vs 24h
            </span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className={`text-[32px] font-bold leading-none ${isDark ? 'text-[#93ccff]' : 'text-sky-700'}`}>
              {medianWaitMin}
            </span>
            <span className={`text-[12px] ${isDark ? 'text-[#bfc7d2]' : 'text-slate-500'}`}>
              minutes elapsed
            </span>
          </div>
          <div className={`flex items-center justify-between font-mono-numbers text-[11px] ${isDark ? 'text-[#bfc7d2]' : 'text-slate-600'}`}>
            <span>Target: &lt; 30m</span>
            <span className={`font-bold ${isDark ? 'text-[#4cd7f6]' : 'text-cyan-700'}`}>
              Compliance 91.2%
            </span>
          </div>
        </div>

        {/* KPI 4: AI Early Deterioration Flags */}
        <div className={`p-2.5 rounded border flex flex-col justify-between transition-colors ${cardBase}`}>
          <div className="flex items-center justify-between">
            <span className={`font-mono-numbers text-[11px] uppercase tracking-wider font-semibold ${isDark ? 'text-[#bfc7d2]' : 'text-slate-500'}`}>
              AI Early Warning
            </span>
            <span className={`px-1.5 py-0.5 rounded font-mono-numbers text-[10px] font-bold ${isDark ? 'bg-[#6001d1]/70 text-[#d2bbff]' : 'bg-purple-100 text-purple-800 border border-purple-200'}`}>
              Inference OK
            </span>
          </div>
          <div className="flex items-center gap-2 my-1">
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded font-mono-numbers text-[11px] font-bold ${
              isDark ? 'bg-[#93000a]/80 text-[#ffdad6]' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <span className="material-symbols-outlined text-[14px] text-red-600">warning</span>
              <span>{sepsisCount} Sepsis</span>
            </div>
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded font-mono-numbers text-[11px] font-bold border ${
              isDark ? 'bg-[#1b2b3f] text-[#4cd7f6] border-[#26364a]' : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              <span className="material-symbols-outlined text-[14px]">vital_signs</span>
              <span>{decompCount} Decomp</span>
            </div>
          </div>
          <div className={`font-mono-numbers text-[10px] truncate ${isDark ? 'text-[#bfc7d2]' : 'text-slate-500'}`}>
            Flagged via qSOFA + Lactate trends
          </div>
        </div>

        {/* KPI 5: Surge Capacity Index */}
        <div className={`p-2.5 rounded border flex flex-col justify-between transition-colors ${cardBase}`}>
          <div className="flex items-center justify-between">
            <span className={`font-mono-numbers text-[11px] uppercase tracking-wider font-semibold ${isDark ? 'text-[#bfc7d2]' : 'text-slate-500'}`}>
              Surge Tier
            </span>
            <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200 font-mono-numbers text-[10px] font-bold uppercase tracking-wider">
              Level Orange
            </span>
          </div>
          <div className="flex items-baseline justify-between my-1">
            <span className={`text-[17px] font-bold ${isDark ? 'text-[#d3e4fe]' : 'text-slate-800'}`}>
              Resus {resusOccupancy}/{resusTotal} Occ
            </span>
            <span className="font-mono-numbers text-[14px] text-orange-700 font-bold">
              {resusPercent}% Resus
            </span>
          </div>
          <div className={`w-full h-1.5 rounded overflow-hidden ${isDark ? 'bg-[#26364a]' : 'bg-slate-200'}`}>
            <div
              className="bg-orange-600 h-full transition-all duration-500"
              style={{ width: `${resusPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface SurgeForecastProps {
  onEscalateBottleneck: () => void;
  onOpenBedMatrix: () => void;
}

export const SurgeForecast: React.FC<SurgeForecastProps> = ({
  onEscalateBottleneck,
  onOpenBedMatrix,
}) => {
  const { isDark } = useTheme();

  return (
    <div
      className={`rounded p-2.5 shadow-xs flex flex-col gap-2 border transition-colors ${
        isDark
          ? 'bg-[#0b1c30] border-[#1b2b3f] text-[#d3e4fe]'
          : 'bg-white border-slate-200 text-slate-800 shadow-xs'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between pb-1.5 border-b ${isDark ? 'border-[#1b2b3f]/70' : 'border-slate-200'}`}>
        <span className={`text-[17px] font-bold tracking-tight ${isDark ? 'text-[#d3e4fe]' : 'text-slate-900'}`}>
          Inflow &amp; Surge Forecast
        </span>
        <span className={`font-mono-numbers text-[11px] font-bold ${isDark ? 'text-[#93ccff]' : 'text-sky-700'}`}>
          Next 120m
        </span>
      </div>

      {/* Predicted Arrivals Info */}
      <div
        className={`p-2 rounded flex flex-col gap-1 border ${
          isDark
            ? 'bg-[#000f21] border-[#1b2b3f]/50'
            : 'bg-slate-50 border-slate-200 shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-[13px] font-bold ${isDark ? 'text-[#d3e4fe]' : 'text-slate-800'}`}>
            Predicted Arrivals
          </span>
          <span className="font-mono-numbers text-[14px] text-cyan-700 font-bold">
            +9 Patients
          </span>
        </div>
        <div className={`font-mono-numbers text-[11px] leading-relaxed ${isDark ? 'text-[#bfc7d2]' : 'text-slate-500'}`}>
          Based on 4-station CAD EMS transit data, inclement weather index, and
          historical Thursday evening surges.
        </div>
      </div>

      {/* Bottleneck Warning */}
      <div
        className={`p-2 rounded border flex items-start gap-2 ${
          isDark
            ? 'bg-[#93000a]/20 border-[#ffb4ab]/30'
            : 'bg-red-50 border-red-200'
        }`}
      >
        <span className="material-symbols-outlined text-[18px] text-red-600 mt-0.5 shrink-0">
          report_problem
        </span>
        <div className="flex flex-col flex-1">
          <span className="text-[12px] text-red-800 font-bold leading-tight">
            Critical Bottleneck: ICU Step-Down
          </span>
          <span className={`font-mono-numbers text-[11px] mt-0.5 leading-relaxed ${
            isDark ? 'text-[#bfc7d2]' : 'text-slate-600'
          }`}>
            0 unoccupied beds available. 2 patient transfers pending discharge
            clearance. Escalate to Nursing Supervisor.
          </span>
          <div className="mt-1.5 flex items-center gap-2">
            <button
              onClick={onEscalateBottleneck}
              className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white font-mono-numbers text-[10px] font-bold shadow-xs transition-all self-start"
            >
              Escalate to Supervisor
            </button>
            <span className={`text-[10px] font-mono-numbers ${isDark ? 'text-[#bfc7d2]' : 'text-slate-500'}`}>
              Auto-pager ready
            </span>
          </div>
        </div>
      </div>

      {/* Quick Hospital Capacity Matrix Mini */}
      <div
        onClick={onOpenBedMatrix}
        className="grid grid-cols-3 gap-1.5 pt-0.5 text-center font-mono-numbers text-[11px] cursor-pointer"
        title="Click to view full Bed Allocation matrix"
      >
        <div
          className={`p-1.5 rounded border transition-colors ${
            isDark
              ? 'bg-[#102034] border-[#1b2b3f]/70 hover:border-[#ffb4ab]'
              : 'bg-slate-50 border-slate-200 hover:border-red-300'
          }`}
        >
          <div className={`text-[10px] font-semibold ${isDark ? 'text-[#bfc7d2]' : 'text-slate-500'}`}>
            Trauma Bays
          </div>
          <div className="text-red-600 font-bold text-sm mt-0.5">4 / 5 Full</div>
        </div>
        <div
          className={`p-1.5 rounded border transition-colors ${
            isDark
              ? 'bg-[#102034] border-[#1b2b3f]/70 hover:border-[#d2bbff]'
              : 'bg-slate-50 border-slate-200 hover:border-purple-300'
          }`}
        >
          <div className={`text-[10px] font-semibold ${isDark ? 'text-[#bfc7d2]' : 'text-slate-500'}`}>
            Acute Beds
          </div>
          <div className="text-purple-700 font-bold text-sm mt-0.5">19 / 22 Full</div>
        </div>
        <div
          className={`p-1.5 rounded border transition-colors ${
            isDark
              ? 'bg-[#102034] border-[#1b2b3f]/70 hover:border-[#4cd7f6]'
              : 'bg-slate-50 border-slate-200 hover:border-cyan-300'
          }`}
        >
          <div className={`text-[10px] font-semibold ${isDark ? 'text-[#bfc7d2]' : 'text-slate-500'}`}>
            Fast Track
          </div>
          <div className="text-cyan-700 font-bold text-sm mt-0.5">5 / 6 Full</div>
        </div>
      </div>
    </div>
  );
};

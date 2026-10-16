import React from 'react';
import { Patient, ClinicalBundleItem } from '../types/clinical';
import { clinicalAudio } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface AiSpotlightProps {
  patient: Patient;
  onToggleBundleItem: (patientId: string, itemId: string) => void;
  onAdministerItem: (patientId: string, item: ClinicalBundleItem) => void;
}

export const AiSpotlight: React.FC<AiSpotlightProps> = ({
  patient,
  onToggleBundleItem,
  onAdministerItem,
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
      {/* Spotlight Header */}
      <div className={`flex items-center justify-between pb-1.5 border-b ${isDark ? 'border-[#1b2b3f]/70' : 'border-slate-200'}`}>
        <div className="flex items-center gap-1.5">
          <span className={`material-symbols-outlined text-[20px] ${isDark ? 'text-[#d2bbff]' : 'text-purple-600'}`}>
            psychology
          </span>
          <span className={`text-[17px] font-bold tracking-tight ${isDark ? 'text-[#d3e4fe]' : 'text-slate-900'}`}>
            AI Clinical Spotlight
          </span>
        </div>
        <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-mono-numbers text-[10px] font-bold border border-purple-200">
          SHAP Analysis Active
        </span>
      </div>

      {/* Selected Patient Highlight Context */}
      <div
        className={`p-2 rounded flex items-center justify-between border ${
          isDark
            ? 'bg-[#102034] border-[#1b2b3f]/60'
            : 'bg-slate-50 border-slate-200 shadow-2xs'
        }`}
      >
        <div>
          <div className={`font-bold text-sm ${isDark ? 'text-[#d3e4fe]' : 'text-slate-900'}`}>
            {patient.name} ({patient.age}{patient.gender})
          </div>
          <div className="font-mono-numbers text-[11px] text-red-600 font-bold mt-0.5">
            {patient.bay} • {patient.esiLabel} Confirmed
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono-numbers text-[22px] text-red-600 font-extrabold leading-none">
            {patient.aiRiskProbability}%
          </div>
          <div className={`font-mono-numbers text-[9px] uppercase tracking-wider mt-0.5 font-semibold ${
            isDark ? 'text-[#bfc7d2]' : 'text-slate-500'
          }`}>
            Shock Probability
          </div>
        </div>
      </div>

      {/* Explainable AI Feature Importances (SHAP Bars) */}
      <div className="flex flex-col gap-1.5 pt-0.5">
        <span className={`font-mono-numbers text-[11px] uppercase tracking-wider font-bold ${
          isDark ? 'text-[#bfc7d2]' : 'text-slate-500'
        }`}>
          Key Deterioration Factors
        </span>

        {patient.shapFactors.map((f, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            <div className="flex justify-between font-mono-numbers text-[11px]">
              <span className={`truncate pr-2 font-medium ${isDark ? 'text-[#d3e4fe]' : 'text-slate-700'}`}>
                {f.factor}
              </span>
              <span
                className={`font-bold shrink-0 ${
                  f.type === 'danger'
                    ? 'text-red-600'
                    : f.type === 'warning'
                    ? 'text-purple-600'
                    : f.type === 'positive'
                    ? 'text-cyan-700'
                    : 'text-slate-500'
                }`}
              >
                {f.impactPercent > 0 ? `+${f.impactPercent}%` : `${f.impactPercent}%`} Impact
              </span>
            </div>
            <div className={`w-full h-1.5 rounded overflow-hidden ${isDark ? 'bg-[#26364a]' : 'bg-slate-200'}`}>
              <div
                className={`h-full transition-all duration-500 ${
                  f.type === 'danger'
                    ? 'bg-red-600'
                    : f.type === 'warning'
                    ? 'bg-purple-600'
                    : f.type === 'positive'
                    ? 'bg-cyan-600'
                    : 'bg-sky-600'
                }`}
                style={{ width: `${Math.min(100, Math.max(10, f.barWidth))}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Clinical Pathway Checklist */}
      <div className={`pt-1 flex flex-col gap-1.5 border-t ${isDark ? 'border-[#1b2b3f]/60' : 'border-slate-200'}`}>
        <span className={`font-mono-numbers text-[11px] uppercase tracking-wider font-bold ${
          isDark ? 'text-[#bfc7d2]' : 'text-slate-500'
        }`}>
          {patient.bundleTitle}
        </span>

        <div className="flex flex-col gap-1">
          {patient.bundleItems.map((item) => {
            if (item.completed) {
              return (
                <div
                  key={item.id}
                  onClick={() => onToggleBundleItem(patient.id, item.id)}
                  className={`flex items-center gap-2 p-1.5 rounded text-[13px] cursor-pointer transition-colors border ${
                    isDark
                      ? 'bg-[#000f21] text-[#4cd7f6] hover:bg-[#102034] border-[#1b2b3f]/40'
                      : 'bg-teal-50/70 text-teal-800 hover:bg-teal-100/60 border-teal-200'
                  }`}
                  title="Click to toggle status"
                >
                  <span className="material-symbols-outlined text-[16px] text-teal-600">
                    check_circle
                  </span>
                  <span className={`line-through text-xs font-medium ${isDark ? 'text-[#bfc7d2]' : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                </div>
              );
            }

            if (item.actionRequired) {
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-1.5 rounded border-l-2 border-l-red-600 border ${
                    isDark
                      ? 'bg-[#93000a]/20 border-[#ffb4ab]/30'
                      : 'bg-red-50/70 border-red-200'
                  }`}
                >
                  <div
                    onClick={() => onToggleBundleItem(patient.id, item.id)}
                    className="flex items-center gap-1.5 text-[13px] cursor-pointer flex-1"
                  >
                    <span className="material-symbols-outlined text-[16px] text-red-600">
                      radio_button_unchecked
                    </span>
                    <span className={`font-bold text-xs ${isDark ? 'text-[#d3e4fe]' : 'text-slate-800'}`}>
                      {item.label}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      clinicalAudio.playTelemetryBeep(1200, 0.08);
                      onAdministerItem(patient.id, item);
                    }}
                    className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white font-mono-numbers text-[10px] font-bold shadow-xs active:scale-95 transition-all shrink-0"
                    type="button"
                  >
                    {item.actionLabel || 'Administer'}
                  </button>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                onClick={() => onToggleBundleItem(patient.id, item.id)}
                className={`flex items-center justify-between p-1.5 rounded text-[13px] cursor-pointer transition-colors border ${
                  isDark
                    ? 'bg-[#102034] text-[#d3e4fe] hover:bg-[#1b2b3f] border-[#1b2b3f]/40'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">
                    radio_button_unchecked
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.meta && (
                  <span className="font-mono-numbers text-[10px] text-slate-400 shrink-0 font-medium">
                    {item.meta}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

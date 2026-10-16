import React from 'react';
import { Patient, EsiLevel } from '../types/clinical';
import { useTheme } from '../context/ThemeContext';

interface TriageTableProps {
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (patient: Patient) => void;
  onOpenDossier: (patient: Patient) => void;
  onTriggerOrder: (patient: Patient, orderName: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalActiveCount: number;
}

export const TriageTable: React.FC<TriageTableProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  onOpenDossier,
  onTriggerOrder,
  currentPage,
  totalPages,
  onPageChange,
  totalActiveCount,
}) => {
  const { isDark } = useTheme();

  // Helpers for ESI badge styles
  const getEsiBadge = (esi: EsiLevel, label: string) => {
    switch (esi) {
      case 1:
        return (
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-600 text-white font-mono-numbers text-[11px] font-black tracking-tight uppercase animate-pulse shadow-xs">
            <span className="material-symbols-outlined text-[12px]">e911_emergency</span>
            <span>{label}</span>
          </div>
        );
      case 2:
        return (
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-600 text-white font-mono-numbers text-[11px] font-bold uppercase shadow-xs">
            <span>{label}</span>
          </div>
        );
      case 3:
        return (
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-600 text-white font-mono-numbers text-[11px] font-bold uppercase shadow-xs">
            <span>{label}</span>
          </div>
        );
      case 4:
        return (
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-600 text-white font-mono-numbers text-[11px] font-bold uppercase shadow-xs">
            <span>{label}</span>
          </div>
        );
      default:
        return (
          <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono-numbers text-[11px] font-bold uppercase border ${
            isDark ? 'bg-[#1b2b3f] text-[#bfc7d2] border-[#26364a]' : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}>
            <span>{label}</span>
          </div>
        );
    }
  };

  const getRowClass = (esi: EsiLevel, isSelected: boolean) => {
    if (isDark) {
      const border =
        esi === 1
          ? 'border-l-4 border-l-[#ffb4ab] bg-[#ffb4ab]/10 hover:bg-[#ffb4ab]/15'
          : esi === 2
          ? 'border-l-4 border-l-[#d2bbff] bg-[#102034]/60 hover:bg-[#102034]'
          : esi === 3
          ? 'border-l-4 border-l-[#4cd7f6] bg-[#0b1c30] hover:bg-[#102034]'
          : esi === 4
          ? 'border-l-4 border-l-[#93ccff] bg-[#102034]/40 hover:bg-[#102034]'
          : 'border-l-4 border-l-[#3f4850] bg-[#0b1c30] hover:bg-[#102034]';
      return `${border} ${isSelected ? 'ring-1 ring-[#93ccff]/60 bg-[#1b2b3f]/80' : ''}`;
    } else {
      const border =
        esi === 1
          ? 'border-l-4 border-l-red-600 bg-red-50/50 hover:bg-red-50'
          : esi === 2
          ? 'border-l-4 border-l-purple-600 bg-white hover:bg-purple-50/40'
          : esi === 3
          ? 'border-l-4 border-l-cyan-600 bg-white hover:bg-cyan-50/40'
          : esi === 4
          ? 'border-l-4 border-l-sky-600 bg-white hover:bg-sky-50/40'
          : 'border-l-4 border-l-slate-400 bg-white hover:bg-slate-50';
      return `${border} ${isSelected ? 'ring-1 ring-sky-500 bg-sky-50/80 shadow-xs' : ''}`;
    }
  };

  return (
    <div
      className={`rounded p-2.5 flex flex-col gap-1.5 shadow-xs border transition-colors ${
        isDark
          ? 'bg-[#0b1c30] border-[#1b2b3f]'
          : 'bg-white border-slate-200 shadow-xs'
      }`}
    >
      {/* Table Header Strip */}
      <div className={`flex items-center justify-between pb-1.5 border-b ${isDark ? 'border-[#1b2b3f]/70' : 'border-slate-200'}`}>
        <div className="flex items-center gap-2">
          <span className={`text-[17px] font-bold tracking-tight ${isDark ? 'text-[#d3e4fe]' : 'text-slate-900'}`}>
            Priority Triage Stream
          </span>
          <span
            className={`font-mono-numbers text-[11px] px-1.5 py-0.5 rounded ${
              isDark
                ? 'bg-[#26364a] text-[#bfc7d2]'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            Auto-sorted by Acuity &amp; AI Risk
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono-numbers text-[11px] text-sky-600 font-semibold">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
          <span>Real-time Telemetry Synced</span>
        </div>
      </div>

      {/* Table Data */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className={`font-mono-numbers text-[11px] border-b ${
                isDark
                  ? 'bg-[#000f21] text-[#bfc7d2] border-[#1b2b3f]'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <th className="py-2 px-2.5 font-semibold">Acuity</th>
              <th className="py-2 px-2.5 font-semibold">Patient &amp; MRN</th>
              <th className="py-2 px-2.5 font-semibold">Chief Complaint &amp; Vitals</th>
              <th className="py-2 px-2.5 font-semibold">Wait / Elapsed</th>
              <th className="py-2 px-2.5 font-semibold">AI Risk Trajectory</th>
              <th className="py-2 px-2.5 font-semibold">Bay / MD-RN</th>
              <th className="py-2 px-2.5 text-right font-semibold">Direct Orders</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-[13px] ${isDark ? 'divide-[#1b2b3f]/40' : 'divide-slate-100'}`}>
            {patients.map((pt) => {
              const isSelected = pt.id === selectedPatientId;
              const { vitals } = pt;

              // Check vitals thresholds for high-contrast pills
              const isBpAbnormal = vitals.bpSystolic < 90 || vitals.bpSystolic > 160;
              const isHrAbnormal = vitals.heartRate < 60 || vitals.heartRate > 100;
              const isSpo2Low = vitals.spo2 < 95;
              const isFever = vitals.tempC >= 38.0;

              return (
                <tr
                  key={pt.id}
                  onClick={() => onSelectPatient(pt)}
                  className={`transition-colors cursor-pointer ${getRowClass(pt.esi, isSelected)}`}
                >
                  {/* Col 1: Acuity */}
                  <td className="py-2.5 px-2.5 align-top">
                    {getEsiBadge(pt.esi, pt.esiLabel)}
                  </td>

                  {/* Col 2: Patient & MRN */}
                  <td className="py-2.5 px-2.5 align-top">
                    <div className="font-bold flex items-center gap-1.5">
                      <span className={isDark ? 'text-[#d3e4fe]' : 'text-slate-900'}>{pt.name}</span>
                      {isSelected && (
                        <span className="text-[10px] px-1 rounded bg-sky-600 text-white font-mono-numbers font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div className={`font-mono-numbers text-[11px] ${isDark ? 'text-[#bfc7d2]' : 'text-slate-500'}`}>
                      {pt.age}{pt.gender} • MRN {pt.mrn}
                    </div>
                    {pt.statusTag && (
                      <div className="font-mono-numbers text-[10px] text-red-600 font-bold mt-0.5 tracking-tight">
                        {pt.statusTag}
                      </div>
                    )}
                  </td>

                  {/* Col 3: Chief Complaint & Vitals */}
                  <td className="py-2.5 px-2.5 align-top max-w-[240px]">
                    <div className={`font-medium line-clamp-1 text-xs ${isDark ? 'text-[#d3e4fe]' : 'text-slate-800'}`}>
                      {pt.chiefComplaint}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1 font-mono-numbers text-[11px]">
                      {/* BP */}
                      <span
                        className={`px-1 py-0.2 rounded font-bold ${
                          isBpAbnormal
                            ? 'bg-red-600 text-white shadow-2xs'
                            : isDark
                            ? 'bg-[#102034] text-[#d3e4fe]'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        BP {vitals.bpSystolic}/{vitals.bpDiastolic}
                      </span>

                      {/* HR */}
                      <span
                        className={`px-1 py-0.2 rounded font-bold ${
                          vitals.heartRate > 120
                            ? 'bg-red-600 text-white shadow-2xs'
                            : vitals.heartRate > 100
                            ? 'bg-purple-600 text-white shadow-2xs'
                            : vitals.heartRate < 60
                            ? 'bg-cyan-600 text-white shadow-2xs'
                            : isDark
                            ? 'bg-[#102034] text-[#d3e4fe]'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        HR {vitals.heartRate}
                      </span>

                      {/* SpO2 */}
                      <span
                        className={`px-1 py-0.2 rounded ${
                          isSpo2Low
                            ? 'bg-red-100 text-red-800 border border-red-200 font-bold'
                            : isDark
                            ? 'bg-[#102034] text-[#d3e4fe]'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        SpO2 {vitals.spo2}%
                      </span>

                      {/* Temp */}
                      <span
                        className={`px-1 py-0.2 rounded ${
                          isFever
                            ? 'bg-orange-100 text-orange-800 border border-orange-200 font-bold'
                            : isDark
                            ? 'bg-[#102034] text-[#d3e4fe]'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {vitals.tempC.toFixed(1)}°C
                      </span>

                      {/* RR if present */}
                      {vitals.respRate && (
                        <span
                          className={`px-1 py-0.2 rounded ${
                            vitals.respRate >= 24
                              ? 'bg-purple-100 text-purple-800 border border-purple-200 font-bold'
                              : isDark
                              ? 'bg-[#102034] text-[#d3e4fe]'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          RR {vitals.respRate}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Col 4: Wait / Elapsed */}
                  <td className="py-2.5 px-2.5 align-top">
                    <div
                      className={`font-mono-numbers text-[14px] font-bold ${
                        pt.esi === 1
                          ? 'text-red-600'
                          : pt.esi === 2
                          ? 'text-purple-600'
                          : isDark
                          ? 'text-[#d3e4fe]'
                          : 'text-slate-800'
                      }`}
                    >
                      {String(pt.waitMinutes).padStart(2, '0')}m
                    </div>
                    {pt.strokeClockMinutes ? (
                      <div className="font-mono-numbers text-[10px] text-cyan-700 font-bold">
                        Stroke Clock: {pt.strokeClockMinutes}m
                      </div>
                    ) : (
                      <div className={`font-mono-numbers text-[10px] ${isDark ? 'text-[#bfc7d2]' : 'text-slate-500'}`}>
                        Arrived: {pt.arrivedAt}
                      </div>
                    )}
                  </td>

                  {/* Col 5: AI Risk Trajectory */}
                  <td className="py-2.5 px-2.5 align-top">
                    {pt.esi === 1 ? (
                      <div>
                        <div className="flex items-center gap-1 text-red-600 font-bold text-xs">
                          <span className="material-symbols-outlined text-[14px]">trending_down</span>
                          <span>{pt.aiRiskTitle}</span>
                        </div>
                        {pt.sparklineData && (
                          <div className="w-28 h-4 mt-1">
                            <svg className="w-full h-full stroke-red-600 fill-none stroke-2" viewBox="0 0 100 20">
                              <polyline points="0,5 20,8 40,6 60,14 80,18 100,19" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ) : pt.aiRiskType === 'sepsis' ? (
                      <div>
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-mono-numbers text-[10px] font-bold border border-purple-200">
                          <span className="material-symbols-outlined text-[12px]">medical_services</span>
                          <span>{pt.aiRiskTitle}</span>
                        </div>
                        {pt.aiRiskSubtitle && (
                          <div className="font-mono-numbers text-[10px] text-cyan-700 font-medium mt-0.5">
                            {pt.aiRiskSubtitle}
                          </div>
                        )}
                      </div>
                    ) : pt.aiRiskType === 'stroke' ? (
                      <div>
                        <div className="text-cyan-700 font-bold text-xs flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">timer</span>
                          <span>{pt.aiRiskTitle}</span>
                        </div>
                        {pt.aiRiskSubtitle && (
                          <div className={`font-mono-numbers text-[10px] ${isDark ? 'text-[#bfc7d2]' : 'text-slate-500'}`}>
                            {pt.aiRiskSubtitle}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className={`font-medium text-xs flex items-center gap-1 ${isDark ? 'text-[#bfc7d2]' : 'text-slate-600'}`}>
                          {pt.aiRiskType === 'resp' && (
                            <span className="material-symbols-outlined text-[14px] text-cyan-600">air</span>
                          )}
                          {pt.aiRiskType === 'renal' && (
                            <span className="material-symbols-outlined text-[14px] text-purple-600">ecg</span>
                          )}
                          <span>{pt.aiRiskTitle}</span>
                        </div>
                        {pt.aiRiskSubtitle && (
                          <div className={`font-mono-numbers text-[10px] ${pt.aiRiskType === 'renal' ? 'text-cyan-700' : isDark ? 'text-[#bfc7d2]' : 'text-slate-500'}`}>
                            {pt.aiRiskSubtitle}
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Col 6: Bay / MD-RN */}
                  <td className="py-2.5 px-2.5 align-top">
                    <div className={`font-bold ${isDark ? 'text-[#93ccff]' : 'text-sky-700'}`}>
                      {pt.bay}
                    </div>
                    <div
                      className={`font-mono-numbers text-[11px] ${
                        !pt.rnAssigned
                          ? 'text-red-600 font-bold'
                          : isDark
                          ? 'text-[#bfc7d2]'
                          : 'text-slate-500'
                      }`}
                    >
                      {pt.rnAssigned ? `${pt.md} / ${pt.rn}` : `${pt.rn} • ${pt.md}`}
                    </div>
                  </td>

                  {/* Col 7: Direct Orders */}
                  <td className="py-2.5 px-2.5 align-top text-right">
                    <div className="flex flex-col gap-1 items-end" onClick={(e) => e.stopPropagation()}>
                      {/* Primary Order Button */}
                      {pt.primaryActionType === 'danger' && (
                        <button
                          onClick={() => onTriggerOrder(pt, pt.primaryActionLabel)}
                          className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white font-mono-numbers text-[11px] font-bold shadow-xs active:scale-95 transition-all"
                          type="button"
                        >
                          {pt.primaryActionLabel}
                        </button>
                      )}
                      {pt.primaryActionType === 'warning' && (
                        <button
                          onClick={() => onTriggerOrder(pt, pt.primaryActionLabel)}
                          className="px-2 py-0.5 rounded bg-purple-600 hover:bg-purple-700 text-white font-mono-numbers text-[11px] font-bold shadow-xs active:scale-95 transition-all"
                          type="button"
                        >
                          {pt.primaryActionLabel}
                        </button>
                      )}
                      {pt.primaryActionType === 'primary' && (
                        <button
                          onClick={() => onTriggerOrder(pt, pt.primaryActionLabel)}
                          className="px-2 py-0.5 rounded bg-sky-600 hover:bg-sky-700 text-white font-mono-numbers text-[11px] font-bold shadow-xs active:scale-95 transition-all"
                          type="button"
                        >
                          {pt.primaryActionLabel}
                        </button>
                      )}
                      {pt.primaryActionType === 'neutral' && (
                        <button
                          onClick={() => onTriggerOrder(pt, pt.primaryActionLabel)}
                          className={`px-2 py-0.5 rounded font-mono-numbers text-[11px] font-semibold transition-all ${
                            isDark
                              ? 'bg-[#2a3a4f] text-[#d3e4fe] hover:bg-[#26364a]'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                          }`}
                          type="button"
                        >
                          {pt.primaryActionLabel}
                        </button>
                      )}
                      {pt.primaryActionType === 'success' && (
                        <span className={`px-1.5 py-0.5 rounded font-mono-numbers text-[10px] font-bold ${
                          isDark ? 'bg-[#26364a] text-[#4cd7f6]' : 'bg-teal-100 text-teal-800 border border-teal-200'
                        }`}>
                          {pt.primaryActionLabel}
                        </span>
                      )}

                      {/* Secondary Order Button / Dossier */}
                      {pt.secondaryActionLabel === 'Dossier' ? (
                        <button
                          onClick={() => onOpenDossier(pt)}
                          className={`px-2 py-0.5 rounded font-mono-numbers text-[10px] transition-colors border ${
                            isDark
                              ? 'bg-[#102034] text-[#d3e4fe] hover:bg-[#2a3a4f] border-[#1b2b3f]'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200 shadow-2xs'
                          }`}
                          type="button"
                        >
                          Dossier
                        </button>
                      ) : pt.secondaryActionLabel === '+ Assign RN' ? (
                        <button
                          onClick={() => onTriggerOrder(pt, '+ Assign RN')}
                          className={`px-2 py-0.5 rounded font-mono-numbers text-[10px] font-semibold transition-colors border ${
                            isDark
                              ? 'bg-[#102034] text-[#93ccff] hover:bg-[#2a3a4f] border-[#1b2b3f]'
                              : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border-sky-200'
                          }`}
                          type="button"
                        >
                          + Assign RN
                        </button>
                      ) : (
                        <button
                          onClick={() => onTriggerOrder(pt, pt.secondaryActionLabel)}
                          className={`px-2 py-0.5 rounded font-mono-numbers text-[10px] transition-colors border ${
                            isDark
                              ? 'bg-[#102034] text-[#bfc7d2] hover:text-[#d3e4fe] hover:bg-[#2a3a4f] border-[#1b2b3f]'
                              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                          }`}
                          type="button"
                        >
                          {pt.secondaryActionLabel}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Bottom Pagination / Density Footer */}
      <div className={`flex items-center justify-between pt-1.5 font-mono-numbers text-[11px] border-t ${
        isDark ? 'text-[#bfc7d2] border-[#1b2b3f]/60' : 'text-slate-600 border-slate-200'
      }`}>
        <span>
          Showing {patients.length} of {totalActiveCount} Active Patients •{' '}
          {Math.max(0, totalActiveCount - patients.length)} Hidden by Filters
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-2 py-1 rounded transition-colors disabled:opacity-40 border ${
              isDark
                ? 'bg-[#102034] hover:bg-[#2a3a4f] text-[#d3e4fe] border-[#1b2b3f]'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs'
            }`}
            type="button"
          >
            Prev
          </button>
          <span className={`px-2 font-bold ${isDark ? 'text-[#93ccff]' : 'text-sky-700'}`}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-2 py-1 rounded transition-colors disabled:opacity-40 border ${
              isDark
                ? 'bg-[#102034] hover:bg-[#2a3a4f] text-[#d3e4fe] border-[#1b2b3f]'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs'
            }`}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

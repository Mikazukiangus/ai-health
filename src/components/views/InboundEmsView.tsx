import React, { useState } from 'react';
import { EmsAmbulance } from '../../types/clinical';
import { clinicalAudio } from '../../utils/audio';
import { useTheme } from '../../context/ThemeContext';

interface InboundEmsViewProps {
  ambulances: EmsAmbulance[];
  onPreAlertTeam: (unitId: string) => void;
  onAssignBay: (unitId: string, bay: string) => void;
}

export const InboundEmsView: React.FC<InboundEmsViewProps> = ({
  ambulances,
  onPreAlertTeam,
  onAssignBay,
}) => {
  const { isDark } = useTheme();
  const [selectedUnit, setSelectedUnit] = useState<string>(ambulances[0]?.id || '');
  const activeAmbulance = ambulances.find((a) => a.id === selectedUnit) || ambulances[0];

  const cardBase = isDark
    ? 'bg-[#0b1c30] border-[#1b2b3f] text-[#d3e4fe]'
    : 'bg-white border-slate-200 text-slate-800 shadow-xs';

  return (
    <div className="w-full px-4 py-3 space-y-4">
      {/* Top Banner */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded border ${cardBase}`}>
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-600">airport_shuttle</span>
            Live Regional EMS &amp; Ambulance Telemetry Stream
          </h2>
          <p className="text-xs text-slate-500 font-mono-numbers mt-0.5 font-medium">
            County CAD Dispatch Integration • 911 Paramedic En Route Bio-telemetry
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-teal-50 text-teal-800 font-mono-numbers text-xs font-bold border border-teal-200 flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping"></span>
            3 Units Inbound to Metro Trauma Bay
          </span>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        {/* Left List of Inbound Rigs */}
        <div className="lg:col-span-5 space-y-2.5">
          {ambulances.map((amb) => {
            const isSelected = amb.id === activeAmbulance?.id;
            return (
              <div
                key={amb.id}
                onClick={() => setSelectedUnit(amb.id)}
                className={`p-3 rounded border transition-all cursor-pointer ${
                  isSelected
                    ? isDark
                      ? 'bg-[#1b2b3f] border-[#93ccff] shadow-lg'
                      : 'bg-sky-50/80 border-sky-500 shadow-xs ring-1 ring-sky-400'
                    : cardBase
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm font-mono-numbers">
                      {amb.unit}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono-numbers font-medium">
                      ({amb.service})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-1.5 py-0.5 rounded font-mono-numbers text-[10px] font-bold uppercase ${
                        amb.priority === 'CRITICAL'
                          ? 'bg-red-600 text-white'
                          : 'bg-purple-600 text-white'
                      }`}
                    >
                      {amb.priority}
                    </span>
                    <div className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-900 font-mono-numbers text-xs font-bold border border-cyan-200">
                      ETA {amb.etaMinutes}m
                    </div>
                  </div>
                </div>

                <div className="text-xs font-semibold line-clamp-1">
                  {amb.chiefComplaint}
                </div>

                <div className={`flex items-center justify-between mt-2 pt-2 border-t text-[11px] font-mono-numbers ${isDark ? 'border-[#1b2b3f]/60 text-[#bfc7d2]' : 'border-slate-200 text-slate-500'}`}>
                  <span>Suspected: <strong className="text-red-600">{amb.suspectedCondition}</strong></span>
                  <span>{amb.assignedBay || 'Bay Pending'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Dossier for selected Inbound Unit */}
        {activeAmbulance && (
          <div className={`lg:col-span-7 rounded p-4 border space-y-4 ${cardBase}`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-[#1b2b3f]' : 'border-slate-200'}`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold font-mono-numbers">
                    {activeAmbulance.unit} Telemetry Feed
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono-numbers text-xs font-bold">
                    {activeAmbulance.priority}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono-numbers mt-0.5 font-medium">
                  {activeAmbulance.service} • Patient: {activeAmbulance.ageGender} • Expected Arrival: In {activeAmbulance.etaMinutes} minutes
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono-numbers text-slate-500 font-medium">Designated Arrival Bay:</div>
                <div className="text-sm font-bold text-sky-700 font-mono-numbers">
                  {activeAmbulance.assignedBay || 'Unassigned'}
                </div>
              </div>
            </div>

            {/* En Route Vitals Stream */}
            <div>
              <h4 className="text-xs font-mono-numbers text-slate-500 uppercase tracking-wider mb-2 font-bold">
                En Route Cellular Bio-Telemetry
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className={`p-2 rounded border ${isDark ? 'bg-[#000f21] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-[10px] text-slate-500 font-mono-numbers font-semibold">BP Transit</div>
                  <div className="text-base font-bold font-mono-numbers text-red-600 mt-0.5">
                    {activeAmbulance.vitals.bpSystolic}/{activeAmbulance.vitals.bpDiastolic}
                  </div>
                </div>

                <div className={`p-2 rounded border ${isDark ? 'bg-[#000f21] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-[10px] text-slate-500 font-mono-numbers font-semibold">Heart Rate</div>
                  <div className="text-base font-bold font-mono-numbers text-purple-600 mt-0.5">
                    {activeAmbulance.vitals.heartRate} bpm
                  </div>
                </div>

                <div className={`p-2 rounded border ${isDark ? 'bg-[#000f21] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-[10px] text-slate-500 font-mono-numbers font-semibold">SpO2</div>
                  <div className="text-base font-bold font-mono-numbers text-cyan-600 mt-0.5">
                    {activeAmbulance.vitals.spo2}%
                  </div>
                </div>

                <div className={`p-2 rounded border ${isDark ? 'bg-[#000f21] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-[10px] text-slate-500 font-mono-numbers font-semibold">Temp / RR</div>
                  <div className="text-base font-bold font-mono-numbers mt-0.5">
                    {activeAmbulance.vitals.tempC}°C / {activeAmbulance.vitals.respRate}
                  </div>
                </div>
              </div>
            </div>

            {/* Paramedic Field Radio Transcript */}
            <div className={`p-3 rounded border space-y-1 ${isDark ? 'bg-[#000f21] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between text-xs font-mono-numbers text-slate-500">
                <span className="flex items-center gap-1.5 text-sky-700 font-bold">
                  <span className="material-symbols-outlined text-[16px]">mic</span>
                  Paramedic Voice-to-Text CAD Transcript
                </span>
                <span>Recorded 2m ago</span>
              </div>
              <p className="text-xs text-slate-800 italic leading-relaxed pt-1">
                "{activeAmbulance.notes}"
              </p>
            </div>

            {/* Action Triggers */}
            <div className={`flex flex-wrap items-center justify-between gap-2 pt-2 border-t ${isDark ? 'border-[#1b2b3f]' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Quick Bay Allocation:</span>
                <select
                  value={activeAmbulance.assignedBay || ''}
                  onChange={(e) => onAssignBay(activeAmbulance.id, e.target.value)}
                  className={`text-xs px-2 py-1 rounded border font-semibold ${
                    isDark ? 'bg-[#000f21] border-[#1b2b3f] text-[#d3e4fe]' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <option value="Bay 01 (Resus)">Bay 01 (Resus)</option>
                  <option value="Bay 02 (Resus)">Bay 02 (Resus)</option>
                  <option value="Bay 03 (Resus)">Bay 03 (Resus)</option>
                  <option value="Bay 04 (Resus)">Bay 04 (Resus)</option>
                  <option value="Acute Pod A - Bed 08">Acute Pod A - Bed 08</option>
                </select>
              </div>

              <button
                onClick={() => {
                  clinicalAudio.playCodeAlert();
                  onPreAlertTeam(activeAmbulance.id);
                }}
                className={`px-3 py-1.5 rounded font-mono-numbers text-xs font-bold transition-all ${
                  activeAmbulance.preAlertSent
                    ? 'bg-teal-100 text-teal-800 border border-teal-300'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                }`}
              >
                {activeAmbulance.preAlertSent
                  ? '✓ Trauma / Resus Team Staged'
                  : '🚨 Pre-Alert Trauma Team STAT'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

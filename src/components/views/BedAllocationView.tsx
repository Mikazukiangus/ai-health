import React, { useState } from 'react';
import { BedItem } from '../../types/clinical';
import { useTheme } from '../../context/ThemeContext';

interface BedAllocationViewProps {
  beds: BedItem[];
  onToggleBedStatus: (bedId: string) => void;
  onAssignNurse: (bedId: string, nurse: string) => void;
}

export const BedAllocationView: React.FC<BedAllocationViewProps> = ({
  beds,
  onToggleBedStatus,
}) => {
  const { isDark } = useTheme();
  const [filterZone, setFilterZone] = useState<string>('all');

  const zones = ['all', 'Resus / Trauma', 'Acute Pod A', 'Acute Pod B', 'Fast Track'];
  const filteredBeds = filterZone === 'all' ? beds : beds.filter((b) => b.zone === filterZone);

  const getStatusColor = (status: BedItem['status']) => {
    if (isDark) {
      switch (status) {
        case 'Occupied':
          return 'border-[#ffb4ab]/50 bg-[#102034] text-[#d3e4fe]';
        case 'Available':
          return 'border-[#4cd7f6]/50 bg-[#000f21] text-[#4cd7f6]';
        case 'Cleaning':
          return 'border-[#d2bbff]/50 bg-[#102034]/70 text-[#d2bbff]';
        case 'Reserved':
          return 'border-[#93ccff]/50 bg-[#0b1c30] text-[#93ccff]';
      }
    } else {
      switch (status) {
        case 'Occupied':
          return 'border-red-200 bg-white text-slate-900 shadow-2xs';
        case 'Available':
          return 'border-teal-300 bg-teal-50/50 text-teal-900 shadow-2xs';
        case 'Cleaning':
          return 'border-purple-200 bg-purple-50/40 text-purple-900 shadow-2xs';
        case 'Reserved':
          return 'border-sky-200 bg-sky-50/40 text-sky-900 shadow-2xs';
      }
    }
  };

  const traumaBeds = beds.filter((b) => b.type === 'Trauma/Resus');
  const acuteBeds = beds.filter((b) => b.type === 'Acute');
  const fastTrackBeds = beds.filter((b) => b.type === 'Fast Track');

  const cardBase = isDark
    ? 'bg-[#0b1c30] border-[#1b2b3f] text-[#d3e4fe]'
    : 'bg-white border-slate-200 text-slate-800 shadow-xs';

  return (
    <div className="w-full px-4 py-3 space-y-4">
      {/* Top Header Strip */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded border ${cardBase}`}>
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-600">grid_view</span>
            Emergency Department Bed &amp; Bay Matrix
          </h2>
          <p className="text-xs text-slate-500 font-mono-numbers mt-0.5 font-medium">
            Level 1 Trauma Spatial Layout • Dynamic Telemetry &amp; Nursing Station Allocations
          </p>
        </div>

        <div className="flex items-center gap-2">
          {zones.map((z) => (
            <button
              key={z}
              onClick={() => setFilterZone(z)}
              className={`px-2.5 py-1 rounded text-xs font-mono-numbers font-medium transition-colors ${
                filterZone === z
                  ? 'bg-sky-600 text-white font-bold shadow-xs'
                  : isDark
                  ? 'bg-[#102034] text-[#bfc7d2] hover:text-[#d3e4fe]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {z === 'all' ? 'All Units (33)' : z}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className={`p-2.5 rounded border flex items-center justify-between ${cardBase}`}>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-mono-numbers font-semibold">Resus / Trauma</div>
            <div className="text-lg font-bold font-mono-numbers text-red-600">
              {traumaBeds.filter((b) => b.occupied).length} / {traumaBeds.length} Occupied
            </div>
          </div>
          <span className="material-symbols-outlined text-red-600 text-[24px]">e911_emergency</span>
        </div>

        <div className={`p-2.5 rounded border flex items-center justify-between ${cardBase}`}>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-mono-numbers font-semibold">Acute Pods A &amp; B</div>
            <div className="text-lg font-bold font-mono-numbers text-purple-600">
              {acuteBeds.filter((b) => b.occupied).length} / {acuteBeds.length} Occupied
            </div>
          </div>
          <span className="material-symbols-outlined text-purple-600 text-[24px]">hotel</span>
        </div>

        <div className={`p-2.5 rounded border flex items-center justify-between ${cardBase}`}>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-mono-numbers font-semibold">Fast Track Care</div>
            <div className="text-lg font-bold font-mono-numbers text-teal-600">
              {fastTrackBeds.filter((b) => b.occupied).length} / {fastTrackBeds.length} Occupied
            </div>
          </div>
          <span className="material-symbols-outlined text-teal-600 text-[24px]">medical_services</span>
        </div>

        <div className={`p-2.5 rounded border flex items-center justify-between ${cardBase}`}>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-mono-numbers font-semibold">Ready for Turnover</div>
            <div className="text-lg font-bold font-mono-numbers text-sky-600">
              {beds.filter((b) => b.status === 'Cleaning').length} Beds Sanitizing
            </div>
          </div>
          <span className="material-symbols-outlined text-sky-600 text-[24px]">cleaning_services</span>
        </div>
      </div>

      {/* Bed Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
        {filteredBeds.map((bed) => (
          <div
            key={bed.id}
            className={`p-3 rounded border flex flex-col justify-between transition-all hover:scale-[1.01] ${getStatusColor(
              bed.status
            )}`}
          >
            <div>
              <div className={`flex items-center justify-between border-b pb-1 mb-2 ${isDark ? 'border-[#1b2b3f]/50' : 'border-slate-200'}`}>
                <span className="font-bold text-xs font-mono-numbers">{bed.number}</span>
                <span
                  className={`px-1.5 py-0.2 rounded font-mono-numbers text-[10px] font-bold uppercase ${
                    bed.status === 'Occupied'
                      ? 'bg-red-600 text-white'
                      : bed.status === 'Available'
                      ? 'bg-teal-600 text-white'
                      : bed.status === 'Cleaning'
                      ? 'bg-purple-600 text-white'
                      : 'bg-sky-600 text-white'
                  }`}
                >
                  {bed.status}
                </span>
              </div>

              {bed.patientName ? (
                <div>
                  <div className="font-bold text-sm truncate">{bed.patientName}</div>
                  <div className="flex items-center gap-1.5 mt-1 font-mono-numbers text-[11px] text-slate-500">
                    {bed.esi && (
                      <span className="px-1 rounded bg-red-100 text-red-800 font-bold text-[10px]">
                        ESI {bed.esi}
                      </span>
                    )}
                    <span>RN: {bed.rn || 'Assigned'}</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 py-2 font-medium">
                  {bed.status === 'Available'
                    ? 'Bed ready for immediate intake'
                    : 'Terminal cleaning in progress'}
                </div>
              )}
            </div>

            <div className={`mt-3 pt-2 border-t flex items-center justify-between ${isDark ? 'border-[#1b2b3f]/50' : 'border-slate-200'}`}>
              <span className="text-[10px] text-slate-500 font-mono-numbers font-medium">{bed.zone}</span>
              <button
                onClick={() => onToggleBedStatus(bed.id)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono-numbers font-semibold transition-colors border ${
                  isDark
                    ? 'bg-[#1b2b3f] text-[#d3e4fe] hover:bg-[#26364a] border-[#26364a]'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200 shadow-2xs'
                }`}
              >
                Change Status
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

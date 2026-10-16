import React, { useState } from 'react';
import { Patient } from '../types/clinical';
import { clinicalAudio } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface CodeActionModalProps {
  patient: Patient | null;
  codeType: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCode: (patientId: string, codeName: string) => void;
}

export const CodeActionModal: React.FC<CodeActionModalProps> = ({
  patient,
  codeType,
  isOpen,
  onClose,
  onConfirmCode,
}) => {
  const { isDark } = useTheme();
  const [cathLabNotified, setCathLabNotified] = useState(true);
  const [pharmacySTAT, setPharmacySTAT] = useState(true);
  const [pageCardiology, setPageCardiology] = useState(true);

  if (!isOpen || !patient) return null;

  const handleExecute = () => {
    clinicalAudio.playCodeAlert();
    onConfirmCode(patient.id, codeType);
    onClose();
  };

  const isStemi = codeType.toLowerCase().includes('stemi');
  const isStroke = codeType.toLowerCase().includes('stroke') || codeType.toLowerCase().includes('ct');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div
        className={`rounded-lg w-full max-w-lg shadow-2xl overflow-hidden flex flex-col border-2 border-red-600 ${
          isDark
            ? 'bg-[#0b1c30] text-[#d3e4fe]'
            : 'bg-white text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-red-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] animate-bounce">
              emergency
            </span>
            <div>
              <h2 className="text-base font-extrabold uppercase tracking-wider font-mono-numbers">
                ACTIVATE {codeType.toUpperCase()}
              </h2>
              <span className="text-xs opacity-90 font-mono-numbers">
                Patient: {patient.name} ({patient.age}{patient.gender}) • {patient.bay}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-white/80 hover:text-white">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div
            className={`p-3 rounded border space-y-1 ${
              isDark ? 'bg-[#000f21] border-[#1b2b3f]' : 'bg-red-50/70 border-red-200'
            }`}
          >
            <div className="font-bold text-red-700">Direct Clinical Triggers:</div>
            <div className="text-[11px] font-mono-numbers text-slate-600">
              • Vitals: BP {patient.vitals.bpSystolic}/{patient.vitals.bpDiastolic} | HR {patient.vitals.heartRate} | SpO2 {patient.vitals.spo2}%
            </div>
            <div className="text-[11px] font-mono-numbers text-slate-600">
              • Risk Trajectory: {patient.aiRiskTitle}
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-mono-numbers text-[11px] text-slate-500 uppercase font-bold tracking-wider">
              Automated Hospital Protocol Checkpoints
            </div>

            <label
              className={`flex items-center gap-2.5 p-2 rounded border cursor-pointer ${
                isDark ? 'bg-[#102034] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <input
                type="checkbox"
                checked={cathLabNotified}
                onChange={(e) => setCathLabNotified(e.target.checked)}
                className="w-4 h-4 rounded text-red-600"
              />
              <span className="text-xs font-medium">
                {isStemi
                  ? 'Page Interventional Cardiology & Prep Cath Lab Suite 2'
                  : isStroke
                  ? 'Clear CT Scanner 1 & Page Neurovascular Attending'
                  : 'Page Rapid Response Sepsis Team & Prime 30mL/kg Bolus'}
              </span>
            </label>

            <label
              className={`flex items-center gap-2.5 p-2 rounded border cursor-pointer ${
                isDark ? 'bg-[#102034] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <input
                type="checkbox"
                checked={pharmacySTAT}
                onChange={(e) => setPharmacySTAT(e.target.checked)}
                className="w-4 h-4 rounded text-red-600"
              />
              <span className="text-xs font-medium">
                {isStemi
                  ? 'Release STAT Aspirin 325mg + Ticagrelor 180mg Pyxis Override'
                  : isStroke
                  ? 'STAT Non-contrast Head CT + Alteplase/TNK Check'
                  : 'STAT Broad-Spectrum IV Antibiotics (Vancomycin + Cefepime)'}
              </span>
            </label>

            <label
              className={`flex items-center gap-2.5 p-2 rounded border cursor-pointer ${
                isDark ? 'bg-[#102034] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <input
                type="checkbox"
                checked={pageCardiology}
                onChange={(e) => setPageCardiology(e.target.checked)}
                className="w-4 h-4 rounded text-red-600"
              />
              <span className="text-xs font-medium">
                Log event into Level 1 National Quality Registry &amp; Alert Charge Nurse
              </span>
            </label>
          </div>

          {/* Action Footer */}
          <div className={`flex items-center justify-between pt-3 border-t ${isDark ? 'border-[#1b2b3f]' : 'border-slate-200'}`}>
            <button
              onClick={onClose}
              className={`px-4 py-1.5 rounded font-bold text-xs border ${
                isDark ? 'bg-[#102034] text-[#d3e4fe] border-[#1b2b3f]' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleExecute}
              className="px-5 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-mono-numbers font-bold text-xs active:scale-95 transition-all shadow-md flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">priority_high</span>
              CONFIRM &amp; TRANSMIT CODE STAT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

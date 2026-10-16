import React, { useEffect, useRef } from 'react';
import { Patient } from '../types/clinical';
import { useTheme } from '../context/ThemeContext';

interface PatientDossierModalProps {
  patient: Patient | null;
  onClose: () => void;
  onRetriage: (patientId: string, newEsi: 1 | 2 | 3 | 4 | 5) => void;
  onAddNote: (patientId: string, noteText: string) => void;
}

export const PatientDossierModal: React.FC<PatientDossierModalProps> = ({
  patient,
  onClose,
  onRetriage,
}) => {
  const { isDark } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live ECG rhythm line animation on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let x = 0;
    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    ctx.fillStyle = '#051322';
    ctx.fillRect(0, 0, width, height);

    const step = () => {
      // Clear a small strip ahead
      ctx.fillStyle = '#051322';
      ctx.fillRect((x + 1) % width, 0, 15, height);

      // Grid background dots
      ctx.fillStyle = '#0e2338';
      for (let py = 0; py < height; py += 15) {
        ctx.fillRect(x % width, py, 1, 1);
      }

      // ECG waveform simulation
      const cyclePos = x % 80;
      let y = midY;

      if (cyclePos === 15) y = midY - 6; // P wave
      else if (cyclePos === 18) y = midY;
      else if (cyclePos === 25) y = midY + 4; // Q wave
      else if (cyclePos === 28) y = midY - 32; // R spike
      else if (cyclePos === 32) y = midY + 12; // S wave
      else if (cyclePos === 45) y = midY - 10; // T wave
      else if (cyclePos === 52) y = midY;

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(x % width, midY);
      ctx.lineTo((x + 1) % width, y);
      ctx.stroke();

      x = (x + 1) % width;
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [patient]);

  if (!patient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div
        className={`rounded-lg w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border ${
          isDark
            ? 'bg-[#0b1c30] border-[#1b2b3f] text-[#d3e4fe]'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-5 py-3.5 border-b flex items-center justify-between ${
            isDark ? 'bg-[#000f21] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-sky-600 text-[24px]">
              folder_shared
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-lg font-bold ${isDark ? 'text-[#d3e4fe]' : 'text-slate-900'}`}>
                  {patient.name}
                </h2>
                <span className={`font-mono-numbers text-xs px-2 py-0.5 rounded font-bold border ${
                  isDark ? 'bg-[#102034] text-[#93ccff] border-[#1b2b3f]' : 'bg-sky-50 text-sky-800 border-sky-200'
                }`}>
                  MRN {patient.mrn}
                </span>
                <span className="px-2 py-0.5 rounded font-mono-numbers text-xs font-bold bg-red-600 text-white shadow-xs">
                  {patient.esiLabel}
                </span>
              </div>
              <p className={`text-xs mt-0.5 font-mono-numbers ${isDark ? 'text-[#bfc7d2]' : 'text-slate-500'}`}>
                {patient.age}y {patient.gender} • Arrived {patient.arrivedAt} ({patient.waitMinutes}m elapsed) • {patient.bay}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm">
          {/* Top Live Vitals & ECG Rhythm */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Vitals Gauges */}
            <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className={`p-2.5 rounded border ${isDark ? 'bg-[#102034] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="text-[10px] text-slate-500 font-mono-numbers uppercase font-semibold">Blood Pressure</div>
                <div className="text-lg font-bold font-mono-numbers text-red-600 mt-1">
                  {patient.vitals.bpSystolic}/{patient.vitals.bpDiastolic}
                </div>
                <div className="text-[10px] text-slate-500">mmHg (MAP {Math.round((patient.vitals.bpSystolic + 2 * patient.vitals.bpDiastolic) / 3)})</div>
              </div>

              <div className={`p-2.5 rounded border ${isDark ? 'bg-[#102034] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="text-[10px] text-slate-500 font-mono-numbers uppercase font-semibold">Heart Rate</div>
                <div className="text-lg font-bold font-mono-numbers text-purple-600 mt-1">
                  {patient.vitals.heartRate} <span className="text-xs font-normal">bpm</span>
                </div>
                <div className="text-[10px] text-slate-500">Sinus Tachycardia</div>
              </div>

              <div className={`p-2.5 rounded border ${isDark ? 'bg-[#102034] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="text-[10px] text-slate-500 font-mono-numbers uppercase font-semibold">SpO2 Oxygen</div>
                <div className="text-lg font-bold font-mono-numbers text-cyan-600 mt-1">
                  {patient.vitals.spo2}%
                </div>
                <div className="text-[10px] text-slate-500">Room Air</div>
              </div>

              <div className={`p-2.5 rounded border ${isDark ? 'bg-[#102034] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="text-[10px] text-slate-500 font-mono-numbers uppercase font-semibold">Temperature</div>
                <div className="text-lg font-bold font-mono-numbers mt-1">
                  {patient.vitals.tempC.toFixed(1)}°C
                </div>
                <div className="text-[10px] text-slate-500">Tympanic</div>
              </div>
            </div>

            {/* Live Telemetry ECG Canvas */}
            <div className="lg:col-span-6 bg-[#051322] rounded p-2.5 border border-slate-800 flex flex-col justify-between shadow-inner">
              <div className="flex items-center justify-between text-[11px] font-mono-numbers text-sky-400 px-1 mb-1">
                <span className="flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                  Lead II Continuous Telemetry
                </span>
                <span className="text-slate-400">25 mm/s • 10 mm/mV</span>
              </div>
              <canvas
                ref={canvasRef}
                width={400}
                height={70}
                className="w-full h-[70px] rounded bg-[#051322]"
              />
            </div>
          </div>

          {/* Chief Complaint & Clinical Overview */}
          <div className={`p-3 rounded border ${isDark ? 'bg-[#102034] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'}`}>
            <h3 className="text-xs font-mono-numbers text-slate-500 uppercase tracking-wider font-bold">
              Chief Complaint &amp; Intake Assessment
            </h3>
            <p className="mt-1 text-sm font-bold text-slate-800">
              {patient.chiefComplaint}
            </p>
            {patient.notes && (
              <p className="mt-2 text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-2">
                <strong className="text-sky-700 font-bold">Physician Note:</strong> {patient.notes}
              </p>
            )}
          </div>

          {/* Lab Panels & Biomarkers */}
          {patient.labs && (
            <div className={`p-3 rounded border ${isDark ? 'bg-[#102034] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-mono-numbers text-slate-500 uppercase tracking-wider font-bold">
                  STAT Lab Results &amp; Biomarkers
                </h3>
                <span className="font-mono-numbers text-[10px] text-teal-700 font-bold">
                  HL7 Real-Time Interface Synced
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {patient.labs.troponin && (
                  <div className={`p-2 rounded border ${patient.labs.troponin.abnormal ? 'bg-red-50 border-red-200 text-red-900' : 'bg-white border-slate-200 text-slate-800'}`}>
                    <div className="text-[10px] uppercase font-mono-numbers font-semibold">High-Sens Troponin I</div>
                    <div className="text-base font-bold font-mono-numbers mt-0.5">
                      {patient.labs.troponin.value} <span className="text-xs">{patient.labs.troponin.unit}</span>
                    </div>
                    {patient.labs.troponin.abnormal && <div className="text-[10px] text-red-600 font-bold">CRITICAL HIGH (&gt;0.04)</div>}
                  </div>
                )}

                {patient.labs.lactate && (
                  <div className={`p-2 rounded border ${patient.labs.lactate.abnormal ? 'bg-red-50 border-red-200 text-red-900' : 'bg-white border-slate-200 text-slate-800'}`}>
                    <div className="text-[10px] uppercase font-mono-numbers font-semibold">Serum Lactate</div>
                    <div className="text-base font-bold font-mono-numbers mt-0.5">
                      {patient.labs.lactate.value} <span className="text-xs">{patient.labs.lactate.unit}</span>
                    </div>
                    {patient.labs.lactate.abnormal && <div className="text-[10px] text-red-600 font-bold">LACTATE HIGH (&gt;2.0)</div>}
                  </div>
                )}

                {patient.labs.potassium && (
                  <div className={`p-2 rounded border ${patient.labs.potassium.abnormal ? 'bg-red-50 border-red-200 text-red-900' : 'bg-white border-slate-200 text-slate-800'}`}>
                    <div className="text-[10px] uppercase font-mono-numbers font-semibold">Serum Potassium</div>
                    <div className="text-base font-bold font-mono-numbers mt-0.5">
                      {patient.labs.potassium.value} <span className="text-xs">{patient.labs.potassium.unit}</span>
                    </div>
                    {patient.labs.potassium.abnormal && <div className="text-[10px] text-red-600 font-bold">HYPERKALEMIA (&gt;5.2)</div>}
                  </div>
                )}

                {patient.labs.glucose && (
                  <div className={`p-2 rounded border ${patient.labs.glucose.abnormal ? 'bg-red-50 border-red-200 text-red-900' : 'bg-white border-slate-200 text-slate-800'}`}>
                    <div className="text-[10px] uppercase font-mono-numbers font-semibold">Point-of-Care Glucose</div>
                    <div className="text-base font-bold font-mono-numbers mt-0.5">
                      {patient.labs.glucose.value} <span className="text-xs">{patient.labs.glucose.unit}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Allergies & Medical History */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className={`p-3 rounded border ${isDark ? 'bg-[#102034] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="text-xs font-mono-numbers text-slate-500 uppercase tracking-wider font-bold">
                Documented Allergies
              </h4>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {patient.allergies?.map((alg, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 text-xs font-bold"
                  >
                    ⚠️ {alg}
                  </span>
                )) || <span className="text-xs text-slate-500">None documented</span>}
              </div>
            </div>

            <div className={`p-3 rounded border ${isDark ? 'bg-[#102034] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="text-xs font-mono-numbers text-slate-500 uppercase tracking-wider font-bold">
                Past Medical History
              </h4>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {patient.medicalHistory?.map((hx, i) => (
                  <span
                    key={i}
                    className={`px-2 py-0.5 rounded border text-xs font-medium ${
                      isDark ? 'bg-[#000f21] border-[#1b2b3f] text-[#d3e4fe]' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    {hx}
                  </span>
                )) || <span className="text-xs text-slate-500">No significant history</span>}
              </div>
            </div>
          </div>

          {/* Quick Retriage Selector */}
          <div className={`p-3 rounded border flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isDark ? 'bg-[#000f21] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <div className="font-bold text-xs text-sky-700">Clinical Override / Re-Triage ESI Level:</div>
              <div className="text-[11px] text-slate-500">Change urgency tier if patient vitals or clinical picture changes</div>
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onRetriage(patient.id, lvl as 1 | 2 | 3 | 4 | 5)}
                  className={`px-3 py-1 rounded font-mono-numbers text-xs font-bold transition-all ${
                    patient.esi === lvl
                      ? 'ring-2 ring-slate-800 scale-105 shadow-sm'
                      : 'opacity-70 hover:opacity-100'
                  } ${
                    lvl === 1
                      ? 'bg-red-600 text-white'
                      : lvl === 2
                      ? 'bg-purple-600 text-white'
                      : lvl === 3
                      ? 'bg-cyan-600 text-white'
                      : lvl === 4
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-400 text-white'
                  }`}
                >
                  ESI {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`px-5 py-3 border-t flex items-center justify-end gap-2 ${
          isDark ? 'bg-[#000f21] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded text-xs font-bold transition-colors border ${
              isDark
                ? 'bg-[#102034] text-[#d3e4fe] hover:bg-[#1b2b3f] border-[#1b2b3f]'
                : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200 shadow-2xs'
            }`}
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};

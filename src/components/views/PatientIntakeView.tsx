import React, { useState } from 'react';
import { Patient, EsiLevel } from '../../types/clinical';
import { clinicalAudio } from '../../utils/audio';
import { useTheme } from '../../context/ThemeContext';

interface PatientIntakeViewProps {
  onAddPatient: (patient: Patient) => void;
  onGoToQueue: () => void;
}

export const PatientIntakeView: React.FC<PatientIntakeViewProps> = ({
  onAddPatient,
  onGoToQueue,
}) => {
  const { isDark } = useTheme();
  const [name, setName] = useState('');
  const [age, setAge] = useState('52');
  const [gender, setGender] = useState<'M' | 'F' | 'Other'>('M');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [bpSys, setBpSys] = useState('130');
  const [bpDia, setBpDia] = useState('85');
  const [hr, setHr] = useState('92');
  const [spo2, setSpo2] = useState('96');
  const [temp, setTemp] = useState('37.4');
  const [rr, setRr] = useState('18');
  const [selectedZone, setSelectedZone] = useState<Patient['zone']>('Acute Pod A (10 Beds)');

  // ESI Algorithm Decision Checkpoints
  const [requiresImmediateResus, setRequiresImmediateResus] = useState(false);
  const [isHighRiskSituation, setIsHighRiskSituation] = useState(false);
  const [resourceCount, setResourceCount] = useState<'none' | 'one' | 'multiple'>('multiple');

  // Compute ESI from decision logic
  let computedEsi: EsiLevel = 3;
  let reason = 'Patient requires multiple resources (labs, imaging, IV meds)';

  if (requiresImmediateResus || parseInt(bpSys) < 85 || parseInt(hr) > 135 || parseInt(spo2) < 88) {
    computedEsi = 1;
    reason = 'Decision Point A: Requires immediate life-saving resuscitation / unstable vitals';
  } else if (isHighRiskSituation || parseInt(bpSys) > 190 || parseInt(hr) > 115 || parseFloat(temp) >= 38.8) {
    computedEsi = 2;
    reason = 'Decision Point B: High risk situation, severe pain/distress, or abnormal danger vitals';
  } else if (resourceCount === 'none') {
    computedEsi = 5;
    reason = 'Decision Point C: No diagnostic or therapeutic resources needed';
  } else if (resourceCount === 'one') {
    computedEsi = 4;
    reason = 'Decision Point C: Exactly one diagnostic or minor resource needed (e.g. isolated X-ray)';
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const mrnRandom = `#${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const arrivedStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newPt: Patient = {
      id: `pt-${Date.now()}`,
      mrn: mrnRandom,
      name: name.trim(),
      age: parseInt(age) || 40,
      gender,
      esi: computedEsi,
      esiLabel:
        computedEsi === 1
          ? 'ESI 1 Resus'
          : computedEsi === 2
          ? 'ESI 2 Emergent'
          : computedEsi === 3
          ? 'ESI 3 Urgent'
          : computedEsi === 4
          ? 'ESI 4 Less Urgent'
          : 'ESI 5 Non-Urgent',
      statusTag: computedEsi <= 2 ? 'TRIAGED HIGH PRIORITY' : undefined,
      chiefComplaint: chiefComplaint || 'Triage intake evaluation',
      vitals: {
        bpSystolic: parseInt(bpSys) || 120,
        bpDiastolic: parseInt(bpDia) || 80,
        heartRate: parseInt(hr) || 80,
        spo2: parseInt(spo2) || 98,
        tempC: parseFloat(temp) || 37.0,
        respRate: parseInt(rr) || 16,
      },
      waitMinutes: 1,
      arrivedAt: arrivedStr,
      aiRiskTitle:
        computedEsi === 1
          ? 'Resuscitation Surge Flag'
          : computedEsi === 2
          ? 'Acuity Deterioration Vector (79%)'
          : 'Stable Triage Trajectory',
      aiRiskProbability: computedEsi === 1 ? 92 : computedEsi === 2 ? 79 : 18,
      aiRiskType: computedEsi <= 2 ? 'sepsis' : 'low',
      sparklineData: [2, 3, 4, 6, 7, 8],
      bay:
        computedEsi === 1
          ? 'Bay 05 (Resus)'
          : selectedZone.includes('Pod A')
          ? 'Acute Pod A - Bed 03'
          : selectedZone.includes('Pod B')
          ? 'Acute Pod B - Bed 06'
          : 'Fast Track - Room 13',
      zone: selectedZone,
      md: 'Dr. Albright',
      rn: 'N. Diaz',
      rnAssigned: true,
      primaryActionLabel: computedEsi === 1 ? 'Code STAT' : 'Verify Triage',
      primaryActionType: computedEsi === 1 ? 'danger' : 'primary',
      secondaryActionLabel: 'Dossier',
      bundleTitle: 'Standardized Triage Protocol',
      shapFactors: [
        { factor: `Systolic BP (${bpSys} mmHg)`, impactPercent: 30, barWidth: 65, type: parseInt(bpSys) < 90 ? 'danger' : 'neutral' },
        { factor: `Pulse Oximetry (${spo2}%)`, impactPercent: 25, barWidth: 50, type: parseInt(spo2) < 95 ? 'danger' : 'positive' },
        { factor: `Heart Rate (${hr} bpm)`, impactPercent: 20, barWidth: 42, type: parseInt(hr) > 100 ? 'warning' : 'positive' },
      ],
      bundleItems: [
        { id: 'ib-1', label: 'Triage Acuity Assessment Logged', completed: true },
        { id: 'ib-2', label: 'Initial Nursing Assessment & Banding', completed: true },
        { id: 'ib-3', label: 'Direct Bed Assignment', completed: false, actionRequired: true, actionLabel: 'Transfer to Bed', actionType: 'administer' },
      ],
      notes: `Intake conducted via clinical triage desk. Patient presents with ${chiefComplaint}.`,
    };

    clinicalAudio.playTelemetryBeep(1100, 0.1);
    onAddPatient(newPt);
    onGoToQueue();
  };

  const cardBase = isDark
    ? 'bg-[#0b1c30] border-[#1b2b3f] text-[#d3e4fe]'
    : 'bg-white border-slate-200 text-slate-800 shadow-xs';

  return (
    <div className="w-full px-4 py-3 space-y-4">
      {/* Banner */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded border ${cardBase}`}>
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-600">assignment_ind</span>
            Patient Intake &amp; Emergency Severity Index (ESI) Assessment
          </h2>
          <p className="text-xs text-slate-500 font-mono-numbers mt-0.5 font-medium">
            Algorithmic 5-Level Triage Standardization • Clinical Decision Support System
          </p>
        </div>
        <button
          onClick={onGoToQueue}
          className={`px-3 py-1.5 rounded text-xs font-mono-numbers font-bold flex items-center gap-1.5 border transition-colors ${
            isDark
              ? 'bg-[#102034] text-[#93ccff] hover:bg-[#1b2b3f] border-[#1b2b3f]'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Return to Live Queue
        </button>
      </div>

      <form onSubmit={handleRegister} className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Form: Demographic & Vitals (7 cols) */}
        <div className={`lg:col-span-7 p-4 rounded border space-y-4 text-xs ${cardBase}`}>
          <div className={`border-b pb-2 ${isDark ? 'border-[#1b2b3f]' : 'border-slate-200'}`}>
            <h3 className="font-bold text-sm">1. Patient Identification &amp; Vitals</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-500 font-mono-numbers uppercase text-[10px] mb-1 font-bold">
                Patient Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Julian Hayes"
                className={`w-full px-3 py-1.5 rounded border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  isDark ? 'bg-[#000f21] border-[#1b2b3f] text-[#d3e4fe]' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-500 font-mono-numbers uppercase text-[10px] mb-1 font-bold">
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded border ${
                    isDark ? 'bg-[#000f21] border-[#1b2b3f] text-[#d3e4fe]' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <div>
                <label className="block text-slate-500 font-mono-numbers uppercase text-[10px] mb-1 font-bold">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'M' | 'F' | 'Other')}
                  className={`w-full px-2 py-1.5 rounded border ${
                    isDark ? 'bg-[#000f21] border-[#1b2b3f] text-[#d3e4fe]' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-mono-numbers uppercase text-[10px] mb-1 font-bold">
              Chief Complaint &amp; Mechanism of Injury *
            </label>
            <textarea
              rows={2}
              required
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="e.g. Acute onset right flank colic radiating to groin, hematuria, nausea"
              className={`w-full px-3 py-1.5 rounded border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                isDark ? 'bg-[#000f21] border-[#1b2b3f] text-[#d3e4fe]' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          {/* Vitals */}
          <div>
            <label className="block text-slate-500 font-mono-numbers uppercase text-[10px] mb-1 font-bold">
              Recorded Objective Vitals
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold">BP Sys</span>
                <input
                  type="number"
                  value={bpSys}
                  onChange={(e) => setBpSys(e.target.value)}
                  className={`w-full px-2 py-1 rounded border font-mono-numbers ${
                    isDark ? 'bg-[#000f21] border-[#1b2b3f] text-[#d3e4fe]' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold">BP Dia</span>
                <input
                  type="number"
                  value={bpDia}
                  onChange={(e) => setBpDia(e.target.value)}
                  className={`w-full px-2 py-1 rounded border font-mono-numbers ${
                    isDark ? 'bg-[#000f21] border-[#1b2b3f] text-[#d3e4fe]' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold">HR</span>
                <input
                  type="number"
                  value={hr}
                  onChange={(e) => setHr(e.target.value)}
                  className={`w-full px-2 py-1 rounded border font-mono-numbers ${
                    isDark ? 'bg-[#000f21] border-[#1b2b3f] text-[#d3e4fe]' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold">SpO2 (%)</span>
                <input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value)}
                  className={`w-full px-2 py-1 rounded border font-mono-numbers ${
                    isDark ? 'bg-[#000f21] border-[#1b2b3f] text-[#d3e4fe]' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold">Temp (°C)</span>
                <input
                  type="text"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  className={`w-full px-2 py-1 rounded border font-mono-numbers ${
                    isDark ? 'bg-[#000f21] border-[#1b2b3f] text-[#d3e4fe]' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold">RR</span>
                <input
                  type="number"
                  value={rr}
                  onChange={(e) => setRr(e.target.value)}
                  className={`w-full px-2 py-1 rounded border font-mono-numbers ${
                    isDark ? 'bg-[#000f21] border-[#1b2b3f] text-[#d3e4fe]' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-mono-numbers uppercase text-[10px] mb-1 font-bold">
              Preferred Care Pod Zone
            </label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value as Patient['zone'])}
              className={`w-full px-3 py-1.5 rounded border ${
                isDark ? 'bg-[#000f21] border-[#1b2b3f] text-[#d3e4fe]' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <option value="Resuscitation / Trauma (5 Bays)">Resuscitation / Trauma (5 Bays)</option>
              <option value="Acute Pod A (10 Beds)">Acute Pod A (10 Beds)</option>
              <option value="Acute Pod B (12 Beds)">Acute Pod B (12 Beds)</option>
              <option value="Fast Track Care (6 Rooms)">Fast Track Care (6 Rooms)</option>
              <option value="General Waiting Triage">General Waiting Triage</option>
            </select>
          </div>
        </div>

        {/* Right Decision Support & Algorithm (5 cols) */}
        <div className={`lg:col-span-5 p-4 rounded border space-y-4 text-xs ${cardBase}`}>
          <div className={`border-b pb-2 ${isDark ? 'border-[#1b2b3f]' : 'border-slate-200'}`}>
            <h3 className="font-bold text-sm">2. ESI Decision Algorithm</h3>
          </div>

          <div className="space-y-3">
            <label
              className={`flex items-start gap-2.5 p-2 rounded border cursor-pointer ${
                isDark ? 'bg-[#000f21] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <input
                type="checkbox"
                checked={requiresImmediateResus}
                onChange={(e) => setRequiresImmediateResus(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-red-600"
              />
              <div>
                <div className="font-bold text-red-600">Decision Point A: Immediate Resuscitation?</div>
                <div className="text-[11px] text-slate-500">
                  Cardiac/respiratory arrest, severe respiratory distress, unresponsiveness, or profound shock.
                </div>
              </div>
            </label>

            <label
              className={`flex items-start gap-2.5 p-2 rounded border cursor-pointer ${
                isDark ? 'bg-[#000f21] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <input
                type="checkbox"
                checked={isHighRiskSituation}
                onChange={(e) => setIsHighRiskSituation(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-purple-600"
              />
              <div>
                <div className="font-bold text-purple-600">Decision Point B: High-Risk / Confusion / Agony?</div>
                <div className="text-[11px] text-slate-500">
                  Acute stroke, acute chest pain, severe distress, suicidal ideation, or immunocompromised fever.
                </div>
              </div>
            </label>

            <div
              className={`p-2.5 rounded border space-y-2 ${
                isDark ? 'bg-[#000f21] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="font-bold text-cyan-700">Decision Point C: Anticipated Resources:</div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setResourceCount('none')}
                  className={`p-1.5 rounded font-mono-numbers text-[11px] font-bold border transition-colors ${
                    resourceCount === 'none'
                      ? 'bg-sky-600 text-white border-sky-600'
                      : isDark
                      ? 'bg-[#102034] text-[#bfc7d2] border-[#1b2b3f]'
                      : 'bg-white text-slate-700 border-slate-200 shadow-2xs'
                  }`}
                >
                  None (ESI 5)
                </button>
                <button
                  type="button"
                  onClick={() => setResourceCount('one')}
                  className={`p-1.5 rounded font-mono-numbers text-[11px] font-bold border transition-colors ${
                    resourceCount === 'one'
                      ? 'bg-sky-600 text-white border-sky-600'
                      : isDark
                      ? 'bg-[#102034] text-[#bfc7d2] border-[#1b2b3f]'
                      : 'bg-white text-slate-700 border-slate-200 shadow-2xs'
                  }`}
                >
                  One (ESI 4)
                </button>
                <button
                  type="button"
                  onClick={() => setResourceCount('multiple')}
                  className={`p-1.5 rounded font-mono-numbers text-[11px] font-bold border transition-colors ${
                    resourceCount === 'multiple'
                      ? 'bg-cyan-600 text-white border-cyan-600'
                      : isDark
                      ? 'bg-[#102034] text-[#bfc7d2] border-[#1b2b3f]'
                      : 'bg-white text-slate-700 border-slate-200 shadow-2xs'
                  }`}
                >
                  Many (ESI 3)
                </button>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div
            className={`p-3.5 rounded border space-y-2 ${
              isDark ? 'bg-[#102034] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs">Synthesized ESI Triage Level:</span>
              <span
                className={`px-3 py-1 rounded font-mono-numbers font-extrabold text-sm uppercase shadow-xs ${
                  computedEsi === 1
                    ? 'bg-red-600 text-white'
                    : computedEsi === 2
                    ? 'bg-purple-600 text-white'
                    : computedEsi === 3
                    ? 'bg-cyan-600 text-white'
                    : 'bg-sky-600 text-white'
                }`}
              >
                ESI {computedEsi}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono-numbers leading-relaxed">
              {reason}
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-xs"
          >
            Admit Patient &amp; Send to Priority Stream
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { Patient, EsiLevel } from '../types/clinical';
import { clinicalAudio } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface BedsideIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (newPatient: Patient) => void;
}

export const BedsideIntakeModal: React.FC<BedsideIntakeModalProps> = ({
  isOpen,
  onClose,
  onAddPatient,
}) => {
  const { isDark } = useTheme();
  const [name, setName] = useState('');
  const [age, setAge] = useState('45');
  const [gender, setGender] = useState<'M' | 'F' | 'Other'>('M');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [bpSys, setBpSys] = useState('120');
  const [bpDia, setBpDia] = useState('80');
  const [hr, setHr] = useState('78');
  const [spo2, setSpo2] = useState('98');
  const [temp, setTemp] = useState('37.0');
  const [rr, setRr] = useState('16');
  const [zone, setZone] = useState<Patient['zone']>('Acute Pod A (10 Beds)');

  if (!isOpen) return null;

  // Compute calculated recommended ESI
  const sysNum = parseInt(bpSys) || 120;
  const hrNum = parseInt(hr) || 80;
  const spo2Num = parseInt(spo2) || 98;
  const tempNum = parseFloat(temp) || 37.0;

  let computedEsi: EsiLevel = 3;
  let reason = 'Moderate acuity requiring multiple resources';

  if (sysNum < 90 || hrNum > 130 || spo2Num < 90) {
    computedEsi = 1;
    reason = 'Unstable vitals threshold detected (Immediate Resuscitation)';
  } else if (sysNum > 180 || hrNum > 105 || spo2Num < 94 || tempNum >= 38.5) {
    computedEsi = 2;
    reason = 'Emergent physiological risk / sepsis or stroke risk criteria met';
  } else if (
    chiefComplaint.toLowerCase().includes('fracture') ||
    chiefComplaint.toLowerCase().includes('laceration') ||
    chiefComplaint.toLowerCase().includes('wrist')
  ) {
    computedEsi = 4;
    reason = 'Isolated low-risk injury requiring single diagnostic/procedure';
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const mrnRandom = `#${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const arrivedStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newPt: Patient = {
      id: `pt-${Date.now()}`,
      mrn: mrnRandom,
      name: name.trim(),
      age: parseInt(age) || 30,
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
      statusTag: computedEsi === 1 ? 'CRITICAL INTAKE' : undefined,
      chiefComplaint: chiefComplaint || 'General triage evaluation',
      vitals: {
        bpSystolic: sysNum,
        bpDiastolic: parseInt(bpDia) || 80,
        heartRate: hrNum,
        spo2: spo2Num,
        tempC: tempNum,
        respRate: parseInt(rr) || 16,
      },
      waitMinutes: 1,
      arrivedAt: arrivedStr,
      aiRiskTitle:
        computedEsi === 1
          ? 'Acute Decompensation Alert (91%)'
          : computedEsi === 2
          ? 'High Acuity Inflow Trigger (74%)'
          : 'Standard Clinical Pathway',
      aiRiskProbability: computedEsi === 1 ? 91 : computedEsi === 2 ? 74 : 22,
      aiRiskType: computedEsi <= 2 ? 'sepsis' : 'low',
      sparklineData: [2, 3, 5, 6, 8, 9],
      bay:
        zone.includes('Trauma')
          ? 'Bay 05 (Resus)'
          : zone.includes('Pod A')
          ? 'Acute Pod A - Bed 03'
          : zone.includes('Pod B')
          ? 'Acute Pod B - Bed 06'
          : zone.includes('Fast Track')
          ? 'Fast Track - Room 13'
          : 'General Waiting Triage',
      zone,
      md: 'Dr. Albright',
      rn: 'N. Jenkins',
      rnAssigned: true,
      primaryActionLabel: computedEsi === 1 ? 'STAT Resus' : 'STAT Basic Panel',
      primaryActionType: computedEsi === 1 ? 'danger' : 'neutral',
      secondaryActionLabel: 'Dossier',
      bundleTitle: 'Rapid Triage Intake Checklist',
      shapFactors: [
        { factor: `Blood Pressure Index (${sysNum}/${bpDia})`, impactPercent: 32, barWidth: 70, type: sysNum < 90 ? 'danger' : 'neutral' },
        { factor: `Pulse Rate (${hrNum} bpm)`, impactPercent: 25, barWidth: 55, type: hrNum > 100 ? 'warning' : 'positive' },
        { factor: `Pulse Oximetry (${spo2Num}%)`, impactPercent: 20, barWidth: 45, type: spo2Num < 95 ? 'danger' : 'positive' },
      ],
      bundleItems: [
        { id: `nb-1`, label: 'Bedside Intake Assessment Completed', completed: true },
        { id: `nb-2`, label: 'Primary Nursing Orders Sent to Pharmacy', completed: false, actionRequired: true, actionLabel: 'Verify Orders', actionType: 'administer' },
      ],
      allergies: ['NKDA'],
    };

    clinicalAudio.playTelemetryBeep(1040, 0.1);
    onAddPatient(newPt);
    onClose();
    setName('');
    setChiefComplaint('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div
        className={`rounded-lg w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col border ${
          isDark
            ? 'bg-[#0b1c30] border-[#1b2b3f] text-[#d3e4fe]'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-3 border-b flex items-center justify-between ${
            isDark ? 'bg-[#000f21] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-600">add_circle</span>
            <h2 className="text-base font-bold">
              Bedside Intake &amp; Rapid Assessment
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Patient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-500 font-mono-numbers uppercase text-[10px] mb-1 font-bold">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jonathan Mercer"
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

          {/* Chief Complaint */}
          <div>
            <label className="block text-slate-500 font-mono-numbers uppercase text-[10px] mb-1 font-bold">
              Chief Complaint &amp; Clinical Symptoms *
            </label>
            <input
              type="text"
              required
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="e.g. Sudden severe epigastric pain radiating to back, diaphoresis"
              className={`w-full px-3 py-1.5 rounded border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                isDark ? 'bg-[#000f21] border-[#1b2b3f] text-[#d3e4fe]' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          {/* Vitals Grid */}
          <div>
            <label className="block text-slate-500 font-mono-numbers uppercase text-[10px] mb-1 font-bold">
              Initial Physiological Vitals
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold">BP Sys</span>
                <input
                  type="number"
                  value={bpSys}
                  onChange={(e) => setBpSys(e.target.value)}
                  className={`w-full px-2 py-1 rounded border font-mono-numbers text-xs ${
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
                  className={`w-full px-2 py-1 rounded border font-mono-numbers text-xs ${
                    isDark ? 'bg-[#000f21] border-[#1b2b3f] text-[#d3e4fe]' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold">HR (bpm)</span>
                <input
                  type="number"
                  value={hr}
                  onChange={(e) => setHr(e.target.value)}
                  className={`w-full px-2 py-1 rounded border font-mono-numbers text-xs ${
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
                  className={`w-full px-2 py-1 rounded border font-mono-numbers text-xs ${
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
                  className={`w-full px-2 py-1 rounded border font-mono-numbers text-xs ${
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
                  className={`w-full px-2 py-1 rounded border font-mono-numbers text-xs ${
                    isDark ? 'bg-[#000f21] border-[#1b2b3f] text-[#d3e4fe]' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Pod Zone */}
          <div>
            <label className="block text-slate-500 font-mono-numbers uppercase text-[10px] mb-1 font-bold">
              Initial Care Pod Assignment
            </label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value as Patient['zone'])}
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

          {/* Auto Calculated ESI Recommendation */}
          <div
            className={`p-3 rounded border flex items-center justify-between ${
              isDark ? 'bg-[#102034] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200 shadow-2xs'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-600">psychology</span>
              <div>
                <div className="font-bold text-slate-900">
                  AI Suggested Triage:{' '}
                  <span
                    className={
                      computedEsi === 1
                        ? 'text-red-600'
                        : computedEsi === 2
                        ? 'text-purple-600'
                        : computedEsi === 3
                        ? 'text-cyan-600'
                        : 'text-sky-600'
                    }
                  >
                    ESI {computedEsi}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono-numbers">{reason}</div>
              </div>
            </div>
            <div
              className={`px-2.5 py-1 rounded font-mono-numbers font-bold text-xs uppercase shadow-xs ${
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
            </div>
          </div>

          {/* Buttons */}
          <div className={`flex items-center justify-end gap-2 pt-2 border-t ${isDark ? 'border-[#1b2b3f]' : 'border-slate-200'}`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-1.5 rounded transition-colors border ${
                isDark ? 'bg-[#102034] text-[#d3e4fe] hover:bg-[#1b2b3f] border-[#1b2b3f]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-700 text-white font-bold active:scale-95 transition-all shadow-xs"
            >
              Admit &amp; Dispatch to Queue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

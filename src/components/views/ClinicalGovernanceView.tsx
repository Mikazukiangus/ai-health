import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const ClinicalGovernanceView: React.FC = () => {
  const { isDark } = useTheme();

  const auditLogs = [
    {
      id: 'aud-1',
      time: '14:26:12',
      patient: 'Marcus Vance (MRN #892014)',
      aiPrediction: 'High STEMI Risk (94%) -> Recommend ESI 1',
      physicianAction: 'Concurred by Dr. Albright. Cath lab triggered in 30s.',
      status: 'Concordant',
    },
    {
      id: 'aud-2',
      time: '14:14:05',
      patient: 'Elena Rostova (MRN #773190)',
      aiPrediction: 'qSOFA Sepsis Alert (82%) -> Recommend Lactate reflex',
      physicianAction: 'Concurred by Dr. Thorne. Order bundle executed.',
      status: 'Concordant',
    },
    {
      id: 'aud-3',
      time: '13:50:22',
      patient: 'Sarah O’Connor (MRN #641882)',
      aiPrediction: 'Resp Failure Risk (68%) -> Recommend ICU consultation',
      physicianAction: 'Overridden by RT Adams: Nebulizer trial initial conservative management.',
      status: 'Clinician Override',
    },
    {
      id: 'aud-4',
      time: '13:12:44',
      patient: 'James Wilson (MRN #551203)',
      aiPrediction: 'Hyperkalemia T-Wave flag (78%) -> Recommend Calcium gluconate order',
      physicianAction: 'Concurred by Dr. Chen. STAT basic panel expedited.',
      status: 'Concordant',
    },
  ];

  const cardBase = isDark
    ? 'bg-[#0b1c30] border-[#1b2b3f] text-[#d3e4fe]'
    : 'bg-white border-slate-200 text-slate-800 shadow-xs';

  return (
    <div className="w-full px-4 py-3 space-y-4">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded border ${cardBase}`}>
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-600">verified_user</span>
            Clinical AI Audit, Explainability &amp; Governance Suite
          </h2>
          <p className="text-xs text-slate-500 font-mono-numbers mt-0.5 font-medium">
            FDA SaMD Class II Oversight • Physician In-The-Loop Audit Trails • Real-time SHAP Drift Analysis
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono-numbers text-xs">
          <span className={`px-2.5 py-1 rounded border font-semibold ${
            isDark ? 'bg-[#000f21] text-[#93ccff] border-[#1b2b3f]' : 'bg-slate-50 text-sky-800 border-slate-200'
          }`}>
            Model Ver: TriageNet-v4.2-ensemble
          </span>
        </div>
      </div>

      {/* Model Benchmark Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className={`p-3 rounded border ${cardBase}`}>
          <div className="text-[10px] text-slate-500 uppercase font-mono-numbers font-semibold">AUC-ROC Discriminative Power</div>
          <div className="text-2xl font-bold font-mono-numbers text-cyan-600 mt-1">
            0.948
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">95% CI (0.941 - 0.954) on 120k validation cohort</div>
        </div>

        <div className={`p-3 rounded border ${cardBase}`}>
          <div className="text-[10px] text-slate-500 uppercase font-mono-numbers font-semibold">Sensitivity / Recall (ESI 1-2)</div>
          <div className="text-2xl font-bold font-mono-numbers text-sky-600 mt-1">
            96.2%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Zero missed critical resuscitation events</div>
        </div>

        <div className={`p-3 rounded border ${cardBase}`}>
          <div className="text-[10px] text-slate-500 uppercase font-mono-numbers font-semibold">Lead Time to Decompensation</div>
          <div className="text-2xl font-bold font-mono-numbers text-purple-600 mt-1">
            +3.4 hrs
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Early warning before ICU escalation</div>
        </div>

        <div className={`p-3 rounded border ${cardBase}`}>
          <div className="text-[10px] text-slate-500 uppercase font-mono-numbers font-semibold">Physician Concordance Rate</div>
          <div className="text-2xl font-bold font-mono-numbers text-red-600 mt-1">
            92.4%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Clinician override tracked &amp; logged</div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className={`rounded p-3 border space-y-2 ${cardBase}`}>
        <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-[#1b2b3f]' : 'border-slate-200'}`}>
          <span className="font-bold text-sm">
            Continuous Clinical Decision Audit Log (Past 24 Hours)
          </span>
          <span className="font-mono-numbers text-xs text-slate-500 font-semibold">
            HL7 / FHIR Audit Trail Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`font-mono-numbers border-b ${isDark ? 'bg-[#000f21] text-[#bfc7d2] border-[#1b2b3f]' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                <th className="p-2">Timestamp</th>
                <th className="p-2">Patient Encounter</th>
                <th className="p-2">AI Triage Inference</th>
                <th className="p-2">Physician Action &amp; Rationale</th>
                <th className="p-2">Governance Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#1b2b3f]/40' : 'divide-slate-100'}`}>
              {auditLogs.map((log) => (
                <tr key={log.id} className={`transition-colors ${isDark ? 'hover:bg-[#102034]' : 'hover:bg-slate-50'}`}>
                  <td className="p-2 font-mono-numbers text-slate-500">{log.time}</td>
                  <td className="p-2 font-bold">{log.patient}</td>
                  <td className="p-2 font-mono-numbers font-semibold text-sky-700">{log.aiPrediction}</td>
                  <td className="p-2 text-slate-700">{log.physicianAction}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-0.5 rounded font-mono-numbers text-[10px] font-bold ${
                        log.status === 'Concordant'
                          ? 'bg-teal-100 text-teal-800 border border-teal-200'
                          : 'bg-purple-100 text-purple-800 border border-purple-200'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

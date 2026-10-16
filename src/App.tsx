import React, { useState, useMemo } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Header, TabKey } from './components/Header';
import { KpiStrip } from './components/KpiStrip';
import { FilterBar, FilterCategory } from './components/FilterBar';
import { TriageTable } from './components/TriageTable';
import { AiSpotlight } from './components/AiSpotlight';
import { SurgeForecast } from './components/SurgeForecast';
import { PatientDossierModal } from './components/PatientDossierModal';
import { BedsideIntakeModal } from './components/BedsideIntakeModal';
import { BroadcastModal } from './components/BroadcastModal';
import { CodeActionModal } from './components/CodeActionModal';
import { NotificationsModal } from './components/NotificationsModal';
import { BedAllocationView } from './components/views/BedAllocationView';
import { InboundEmsView } from './components/views/InboundEmsView';
import { ClinicalGovernanceView } from './components/views/ClinicalGovernanceView';
import { PatientIntakeView } from './components/views/PatientIntakeView';
import { INITIAL_PATIENTS, INITIAL_EMS_AMBULANCES, INITIAL_BEDS } from './data/mockPatients';
import { Patient, ClinicalBundleItem, BedItem, EmsAmbulance } from './types/clinical';
import { clinicalAudio } from './utils/audio';

function AppContent() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey>('live-triage');
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pt-1');
  const [beds, setBeds] = useState<BedItem[]>(INITIAL_BEDS);
  const [ambulances, setAmbulances] = useState<EmsAmbulance[]>(INITIAL_EMS_AMBULANCES);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all');
  const [selectedZone, setSelectedZone] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modals
  const [dossierPatient, setDossierPatient] = useState<Patient | null>(null);
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [codeModal, setCodeModal] = useState<{ isOpen: boolean; patient: Patient | null; codeName: string }>({
    isOpen: false,
    patient: null,
    codeName: '',
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Urgent Notifications List
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      time: '14:26',
      title: 'CRITICAL: Marcus Vance (Bay 01 Resus)',
      description: 'SpO2 acute desaturation to 89% on room air. High STEMI probability (94%).',
      level: 'critical' as const,
      read: false,
    },
    {
      id: 'notif-2',
      time: '14:24',
      title: 'STROKE WINDOW: David Chen (Trauma Bay 02)',
      description: 'LVO suspected. Last Known Well onset 42m. Immediate CT Brain scheduled.',
      level: 'warning' as const,
      read: false,
    },
    {
      id: 'notif-3',
      time: '14:22',
      title: 'INBOUND: Medic 04 ETA 4 min',
      description: 'ROSC post-cardiac arrest. Trauma team pre-alert advised.',
      level: 'critical' as const,
      read: false,
    },
  ]);

  // Selected Patient object for Spotlight
  const selectedPatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

  // Filter patients
  const filteredPatients = useMemo(() => {
    return patients.filter((pt) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = pt.name.toLowerCase().includes(q);
        const matchesMrn = pt.mrn.toLowerCase().includes(q);
        const matchesBay = pt.bay.toLowerCase().includes(q);
        const matchesComplaint = pt.chiefComplaint.toLowerCase().includes(q);
        if (!matchesName && !matchesMrn && !matchesBay && !matchesComplaint) {
          return false;
        }
      }

      // Filter category
      if (selectedFilter === 'esi-1-2' && pt.esi > 2) return false;
      if (selectedFilter === 'esi-3-5' && pt.esi <= 2) return false;
      if (selectedFilter === 'ai-alerts' && pt.aiRiskProbability < 70) return false;

      // Zone filter
      if (selectedZone !== 'all' && pt.zone !== selectedZone) return false;

      return true;
    });
  }, [patients, searchQuery, selectedFilter, selectedZone]);

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / pageSize));
  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredPatients.slice(startIndex, startIndex + pageSize);
  }, [filteredPatients, currentPage, pageSize]);

  // Counts for KPI & filter chips
  const totalCount = 34;
  const esiHighCount = patients.filter((p) => p.esi <= 2).length;
  const esiLowCount = patients.filter((p) => p.esi > 2).length;
  const aiAlertsCount = patients.filter((p) => p.aiRiskProbability >= 70).length;

  // Actions
  const handleToggleBundleItem = (patientId: string, itemId: string) => {
    setPatients((prev) =>
      prev.map((pt) => {
        if (pt.id !== patientId) return pt;
        const updatedItems = pt.bundleItems.map((item) => {
          if (item.id === itemId) {
            return { ...item, completed: !item.completed };
          }
          return item;
        });
        return { ...pt, bundleItems: updatedItems };
      })
    );
  };

  const handleAdministerItem = (patientId: string, item: ClinicalBundleItem) => {
    setPatients((prev) =>
      prev.map((pt) => {
        if (pt.id !== patientId) return pt;
        const updatedItems = pt.bundleItems.map((i) => {
          if (i.id === item.id) {
            return { ...i, completed: true, actionRequired: false };
          }
          return i;
        });
        return { ...pt, bundleItems: updatedItems };
      })
    );
    showToast(`✓ Order "${item.label}" administered successfully.`);
  };

  const handleTriggerOrder = (patient: Patient, orderName: string) => {
    if (orderName === '+ Assign RN') {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === patient.id ? { ...p, rn: 'Sarah Jenkins, RN', rnAssigned: true } : p
        )
      );
      clinicalAudio.playTelemetryBeep(920, 0.08);
      showToast(`Assigned Sarah Jenkins, RN to ${patient.name}`);
      return;
    }

    if (
      orderName.toLowerCase().includes('code') ||
      orderName.toLowerCase().includes('stat') ||
      orderName.toLowerCase().includes('bundle')
    ) {
      setCodeModal({
        isOpen: true,
        patient,
        codeName: orderName,
      });
      return;
    }

    clinicalAudio.playTelemetryBeep(980, 0.08);
    showToast(`Protocol action executed: ${orderName} for ${patient.name}`);
  };

  const handleConfirmCode = (patientId: string, codeName: string) => {
    const pt = patients.find((p) => p.id === patientId);
    showToast(`🚨 ${codeName.toUpperCase()} ACTIVATED for ${pt?.name || 'patient'} (${pt?.bay}). All teams notified.`);
  };

  const handleRetriage = (patientId: string, newEsi: 1 | 2 | 3 | 4 | 5) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? {
              ...p,
              esi: newEsi,
              esiLabel:
                newEsi === 1
                  ? 'ESI 1 Resus'
                  : newEsi === 2
                  ? 'ESI 2 Emergent'
                  : newEsi === 3
                  ? 'ESI 3 Urgent'
                  : newEsi === 4
                  ? 'ESI 4 Less Urgent'
                  : 'ESI 5 Non-Urgent',
            }
          : p
      )
    );
    clinicalAudio.playTelemetryBeep(1000, 0.1);
    showToast(`Patient re-triaged to ESI ${newEsi}`);
  };

  const handleAddPatient = (newPt: Patient) => {
    setPatients((prev) => [newPt, ...prev]);
    setSelectedPatientId(newPt.id);
    showToast(`Patient ${newPt.name} triaged & added to stream.`);
  };

  const handleToggleBedStatus = (bedId: string) => {
    setBeds((prev) =>
      prev.map((b) => {
        if (b.id !== bedId) return b;
        const nextStatus: BedItem['status'] =
          b.status === 'Occupied'
            ? 'Cleaning'
            : b.status === 'Cleaning'
            ? 'Available'
            : b.status === 'Available'
            ? 'Reserved'
            : 'Occupied';
        return { ...b, status: nextStatus, occupied: nextStatus === 'Occupied' };
      })
    );
    clinicalAudio.playTelemetryBeep(850, 0.05);
    showToast('Bed status updated');
  };

  const handlePreAlertTeam = (unitId: string) => {
    setAmbulances((prev) =>
      prev.map((a) => (a.id === unitId ? { ...a, preAlertSent: true } : a))
    );
    showToast('Trauma & Resuscitation Team paged and staged at ambulance bay.');
  };

  const handleAssignBay = (unitId: string, bay: string) => {
    setAmbulances((prev) =>
      prev.map((a) => (a.id === unitId ? { ...a, assignedBay: bay } : a))
    );
    showToast(`Assigned ${bay} to inbound ambulance unit.`);
  };

  const handleSimulateCode = () => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === 'pt-1') {
          const deltaHr = Math.floor(Math.random() * 5) - 2;
          const nextHr = Math.max(120, Math.min(145, p.vitals.heartRate + deltaHr));
          return {
            ...p,
            vitals: {
              ...p.vitals,
              heartRate: nextHr,
            },
          };
        }
        return p;
      })
    );
    clinicalAudio.playTelemetryBeep(880, 0.05);
    showToast('Telemetry stream refreshed: vital signals synchronized.');
  };

  return (
    <div
      className={`min-h-screen font-sans flex flex-col justify-between transition-colors ${
        isDark ? 'bg-[#031427] text-[#d3e4fe]' : 'bg-[#f4f7fb] text-slate-800'
      }`}
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`fixed top-24 right-6 z-50 px-4 py-2.5 rounded shadow-xl flex items-center gap-2 text-xs font-mono-numbers animate-in slide-in-from-top-2 border ${
            isDark
              ? 'bg-[#102034] border-[#4cd7f6] text-[#d3e4fe]'
              : 'bg-white border-sky-500 text-slate-800 shadow-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-sky-600 text-[18px]">info</span>
          <span className="font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-slate-700">
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>
      )}

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        waitingCount={12}
        bedOccupancyRate={88}
        inboundEmsCount={3}
        activeSepsisCount={1}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenEmergencyModal={() =>
          setCodeModal({
            isOpen: true,
            patient: patients[1], // Elena Rostova
            codeName: 'Code Sepsis',
          })
        }
      />

      {/* Main Content Body */}
      <main className="w-full pt-28 flex-1 flex flex-col">
        {/* Render Tab Views */}
        {activeTab === 'live-triage' && (
          <div className="flex flex-col w-full">
            {/* Top KPI Strip */}
            <KpiStrip
              activeCensus={totalCount}
              waitingCount={12}
              bayOccupiedCount={22}
              criticalCount={2}
              medianWaitMin={18}
              sepsisCount={3}
              decompCount={1}
              resusOccupancy={4}
              resusTotal={5}
            />

            {/* Command Control & Rapid Filter Bar */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
              selectedZone={selectedZone}
              onZoneChange={setSelectedZone}
              totalCount={totalCount}
              esiHighCount={esiHighCount}
              esiLowCount={esiLowCount}
              aiAlertsCount={aiAlertsCount}
              inboundCount={3}
              onOpenBedsideIntake={() => setIsIntakeOpen(true)}
              onOpenEms={() => setActiveTab('inbound-ems')}
              onOpenBroadcast={() => setIsBroadcastOpen(true)}
              onSimulateCode={handleSimulateCode}
            />

            {/* Split 70/30 Main Workstation */}
            <section className="w-full px-4 py-2">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-2.5 items-start">
                {/* LEFT 70%: High-Density Clinical Triage Grid (8 cols) */}
                <div className="xl:col-span-8">
                  <TriageTable
                    patients={paginatedPatients}
                    selectedPatientId={selectedPatientId}
                    onSelectPatient={(pt) => setSelectedPatientId(pt.id)}
                    onOpenDossier={(pt) => setDossierPatient(pt)}
                    onTriggerOrder={handleTriggerOrder}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalActiveCount={totalCount}
                  />
                </div>

                {/* RIGHT 30%: AI Triage Intelligence & Decompensation Monitor (4 cols) */}
                <div className="xl:col-span-4 flex flex-col gap-2.5">
                  <AiSpotlight
                    patient={selectedPatient}
                    onToggleBundleItem={handleToggleBundleItem}
                    onAdministerItem={handleAdministerItem}
                  />
                  <SurgeForecast
                    onEscalateBottleneck={() => {
                      clinicalAudio.playCodeAlert();
                      showToast('Nursing Supervisor paged: ICU Step-Down bed discharge escalation.');
                    }}
                    onOpenBedMatrix={() => setActiveTab('bed-allocation')}
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'patient-intake' && (
          <PatientIntakeView
            onAddPatient={handleAddPatient}
            onGoToQueue={() => setActiveTab('live-triage')}
          />
        )}

        {activeTab === 'bed-allocation' && (
          <BedAllocationView
            beds={beds}
            onToggleBedStatus={handleToggleBedStatus}
            onAssignNurse={(bedId, nurse) =>
              setBeds((prev) =>
                prev.map((b) => (b.id === bedId ? { ...b, rn: nurse } : b))
              )
            }
          />
        )}

        {activeTab === 'inbound-ems' && (
          <InboundEmsView
            ambulances={ambulances}
            onPreAlertTeam={handlePreAlertTeam}
            onAssignBay={handleAssignBay}
          />
        )}

        {activeTab === 'clinical-governance' && <ClinicalGovernanceView />}
      </main>

      {/* Global Clinical Command Footer */}
      <footer
        className={`w-full py-3 border-t mt-4 transition-colors ${
          isDark
            ? 'bg-[#000f21] border-[#1b2b3f]/70 text-[#bfc7d2]'
            : 'bg-white border-slate-200 text-slate-500 shadow-2xs'
        }`}
      >
        <div className="w-full px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono-numbers text-[11px]">
            <span className="inline-block w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            <span>System Protocol v4.2 • HL7/FHIR Real-Time Bridge Active</span>
          </div>
          <div className="font-mono-numbers text-[11px] font-medium">
            © Metro Health ED Command • Level 1 Trauma Center Operations
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PatientDossierModal
        patient={dossierPatient}
        onClose={() => setDossierPatient(null)}
        onRetriage={handleRetriage}
        onAddNote={(id, note) => {
          setPatients((prev) =>
            prev.map((p) => (p.id === id ? { ...p, notes: note } : p))
          );
          showToast('Physician note appended to electronic medical record.');
        }}
      />

      <BedsideIntakeModal
        isOpen={isIntakeOpen}
        onClose={() => setIsIntakeOpen(false)}
        onAddPatient={handleAddPatient}
      />

      <BroadcastModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        onBroadcastSent={(msg) => {
          showToast(`📢 Overhead broadcast sent: "${msg}"`);
        }}
      />

      <CodeActionModal
        isOpen={codeModal.isOpen}
        patient={codeModal.patient}
        codeType={codeModal.codeName}
        onClose={() => setCodeModal({ isOpen: false, patient: null, codeName: '' })}
        onConfirmCode={handleConfirmCode}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onClearAll={() => setNotifications([])}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

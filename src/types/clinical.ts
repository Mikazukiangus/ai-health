export type EsiLevel = 1 | 2 | 3 | 4 | 5;

export interface Vitals {
  bpSystolic: number;
  bpDiastolic: number;
  heartRate: number;
  spo2: number;
  tempC: number;
  respRate?: number;
}

export interface ShapFactor {
  factor: string;
  impactPercent: number; // e.g. +38%
  barWidth: number; // percentage for bar 0-100
  type: 'danger' | 'warning' | 'neutral' | 'positive';
}

export interface ClinicalBundleItem {
  id: string;
  label: string;
  completed: boolean;
  actionRequired?: boolean;
  actionLabel?: string;
  actionType?: 'administer' | 'confirm' | 'pending';
  meta?: string;
}

export interface Patient {
  id: string;
  mrn: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  esi: EsiLevel;
  esiLabel: string;
  statusTag?: string;
  chiefComplaint: string;
  vitals: Vitals;
  waitMinutes: number;
  arrivedAt: string;
  strokeClockMinutes?: number;
  aiRiskTitle: string;
  aiRiskSubtitle?: string;
  aiRiskProbability: number; // e.g. 94 for 94%
  aiRiskType: 'stemi' | 'sepsis' | 'stroke' | 'resp' | 'renal' | 'trauma' | 'low';
  sparklineData?: number[];
  bay: string;
  zone: 'Resuscitation / Trauma (5 Bays)' | 'Acute Pod A (10 Beds)' | 'Acute Pod B (12 Beds)' | 'Fast Track Care (6 Rooms)' | 'General Waiting Triage';
  md: string;
  rn: string;
  rnAssigned: boolean;
  primaryActionLabel: string;
  primaryActionType: 'danger' | 'warning' | 'primary' | 'neutral' | 'success';
  secondaryActionLabel: string;
  bundleTitle: string;
  shapFactors: ShapFactor[];
  bundleItems: ClinicalBundleItem[];
  // Extended Clinical Dossier Data
  allergies?: string[];
  medicalHistory?: string[];
  labs?: {
    lactate?: { value: number; unit: string; abnormal: boolean };
    troponin?: { value: number; unit: string; abnormal: boolean };
    potassium?: { value: number; unit: string; abnormal: boolean };
    wbc?: { value: number; unit: string; abnormal: boolean };
    creatinine?: { value: number; unit: string; abnormal: boolean };
    glucose?: { value: number; unit: string; abnormal: boolean };
  };
  notes?: string;
}

export interface EmsAmbulance {
  id: string;
  unit: string;
  service: string;
  etaMinutes: number;
  chiefComplaint: string;
  suspectedCondition: string;
  priority: 'CRITICAL' | 'EMERGENT' | 'URGENT';
  ageGender: string;
  vitals: Vitals;
  assignedBay?: string;
  preAlertSent: boolean;
  notes: string;
}

export interface BedItem {
  id: string;
  number: string;
  zone: string;
  type: 'Trauma/Resus' | 'Acute' | 'Fast Track' | 'Waiting';
  occupied: boolean;
  patientId?: string;
  patientName?: string;
  esi?: EsiLevel;
  rn?: string;
  status: 'Occupied' | 'Available' | 'Cleaning' | 'Reserved';
}

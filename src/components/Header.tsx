import React, { useState, useEffect } from 'react';
import { clinicalAudio } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

export type TabKey =
  | 'live-triage'
  | 'patient-intake'
  | 'bed-allocation'
  | 'inbound-ems'
  | 'clinical-governance';

interface HeaderProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  waitingCount: number;
  bedOccupancyRate: number;
  inboundEmsCount: number;
  activeSepsisCount: number;
  onOpenNotifications: () => void;
  onOpenEmergencyModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  waitingCount,
  bedOccupancyRate,
  inboundEmsCount,
  activeSepsisCount,
  onOpenNotifications,
  onOpenEmergencyModal,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [utcTime, setUtcTime] = useState('14:32:08 UTC');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${hours}:${mins}:${secs} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    clinicalAudio.setMuted(next);
    if (!next) {
      clinicalAudio.playTelemetryBeep(980, 0.05);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors ${
        isDark
          ? 'bg-[#000f21]/95 border-[#1b2b3f]/70 text-[#d3e4fe]'
          : 'bg-white/95 border-slate-200 text-slate-800 shadow-xs'
      }`}
    >
      <div className="h-28 w-full px-4 flex flex-col justify-between pt-1.5 pb-0">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Hospital Title */}
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded flex items-center justify-center shadow-sm border ${
                isDark
                  ? 'bg-gradient-to-br from-[#3198dc] to-[#004b73] border-[#93ccff]/30 text-white'
                  : 'bg-gradient-to-br from-[#0284c7] to-[#0369a1] border-sky-400/40 text-white shadow-sky-100'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">vital_signs</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-sans text-[18px] font-bold tracking-tight ${
                    isDark ? 'text-[#93ccff]' : 'text-sky-700'
                  }`}
                >
                  TriagePulse AI
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded font-mono-numbers text-[10px] font-bold uppercase tracking-wider ${
                    isDark
                      ? 'bg-[#3198dc] text-[#002c47]'
                      : 'bg-sky-100 text-sky-800 border border-sky-200'
                  }`}
                >
                  ED COMMAND
                </span>
              </div>
              <span
                className={`text-[12px] leading-tight ${
                  isDark ? 'text-[#bfc7d2]' : 'text-slate-500 font-medium'
                }`}
              >
                Metro Health ED - Trauma Center Level 1
              </span>
            </div>
          </div>

          {/* Center Live Operational Badges */}
          <div className="hidden xl:flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border ${
                isDark
                  ? 'bg-[#102034] text-[#d3e4fe] border-[#1b2b3f]'
                  : 'bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              <span className={`text-[12px] ${isDark ? 'text-[#bfc7d2]' : 'text-slate-500'}`}>
                Waiting:
              </span>
              <span
                className={`font-mono-numbers text-[14px] font-bold ${
                  isDark ? 'text-[#93ccff]' : 'text-sky-700'
                }`}
              >
                {waitingCount} pts
              </span>
            </div>

            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border ${
                isDark
                  ? 'bg-[#102034] text-[#d3e4fe] border-[#1b2b3f]'
                  : 'bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              <span className={`text-[12px] ${isDark ? 'text-[#bfc7d2]' : 'text-slate-500'}`}>
                Bed Occupancy:
              </span>
              <span
                className={`font-mono-numbers text-[14px] font-bold ${
                  isDark ? 'text-[#4cd7f6]' : 'text-cyan-700'
                }`}
              >
                {bedOccupancyRate}%
              </span>
            </div>

            <button
              onClick={() => onTabChange('inbound-ems')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
                isDark
                  ? 'bg-[#102034] hover:bg-[#1b2b3f] text-[#d3e4fe] border-[#1b2b3f]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
              }`}
              title="View Inbound EMS Rigs"
            >
              <span
                className={`material-symbols-outlined text-[16px] ${
                  isDark ? 'text-[#acedff]' : 'text-sky-600'
                }`}
              >
                airport_shuttle
              </span>
              <span className={`text-[12px] ${isDark ? 'text-[#bfc7d2]' : 'text-slate-500'}`}>
                Inbound:
              </span>
              <span
                className={`font-mono-numbers text-[14px] font-bold ${
                  isDark ? 'text-[#acedff]' : 'text-sky-800'
                }`}
              >
                {inboundEmsCount} (Next 4m)
              </span>
            </button>

            <button
              onClick={onOpenEmergencyModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white border border-red-500/40 hover:brightness-110 active:scale-95 transition-all shadow-sm"
              title="Active Code Alert Protocols"
            >
              <span className="material-symbols-outlined text-[16px] animate-bounce">
                emergency
              </span>
              <span className="font-mono-numbers text-[11px] uppercase tracking-wider font-bold">
                Code Sepsis: {activeSepsisCount} Active
              </span>
            </button>
          </div>

          {/* Right Header Controls: Clock, Theme Toggle, Sound, Alerts, Nurse Identity */}
          <div className="flex items-center gap-2.5">
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded border ${
                isDark
                  ? 'bg-[#1b2b3f] border-[#26364a] text-[#d3e4fe]'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-slate-400">schedule</span>
              <span className="font-mono-numbers text-[11px] tracking-wide font-semibold">
                {utcTime}
              </span>
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-1.5 rounded transition-colors border flex items-center gap-1 ${
                isDark
                  ? 'bg-[#1b2b3f] hover:bg-[#26364a] text-amber-300 border-[#26364a]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-1.5 rounded transition-colors border ${
                isDark
                  ? `bg-[#1b2b3f] hover:bg-[#26364a] border-[#26364a] ${
                      isMuted ? 'text-[#89929b]' : 'text-[#93ccff]'
                    }`
                  : `bg-slate-100 hover:bg-slate-200 border-slate-200 ${
                      isMuted ? 'text-slate-400' : 'text-sky-600'
                    }`
              }`}
              title={isMuted ? 'Unmute Audio Alerts' : 'Mute Audio Alerts'}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className={`relative p-1.5 rounded transition-colors border ${
                isDark
                  ? 'bg-[#1b2b3f] hover:bg-[#26364a] text-[#d3e4fe] border-[#26364a]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="Urgent Notifications"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              <span className="absolute -top-1 -right-1 px-1 rounded-full bg-red-500 text-white font-mono-numbers text-[10px] leading-tight font-bold">
                3
              </span>
            </button>

            {/* Nurse Profile */}
            <div
              className={`flex items-center gap-2 pl-2 border-l ${
                isDark ? 'border-[#1b2b3f]' : 'border-slate-200'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full ring-2 overflow-hidden flex items-center justify-center ${
                  isDark
                    ? 'ring-[#4cd7f6]/40 bg-[#102034] text-[#93ccff]'
                    : 'ring-sky-400 bg-sky-50 text-sky-700'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">face_3</span>
              </div>
              <div className="hidden md:flex flex-col text-right">
                <span
                  className={`text-[12px] font-bold leading-tight ${
                    isDark ? 'text-[#d3e4fe]' : 'text-slate-800'
                  }`}
                >
                  Sarah Jenkins, RN
                </span>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span
                    className={`font-mono-numbers text-[10px] ${
                      isDark ? 'text-[#bfc7d2]' : 'text-slate-500'
                    }`}
                  >
                    ED Charge Nurse
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded font-mono-numbers text-[10px] font-bold ${
                      isDark
                        ? 'bg-[#009eb9] text-[#002f38]'
                        : 'bg-teal-100 text-teal-800 border border-teal-200'
                    }`}
                  >
                    Shift A
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1 overflow-x-auto h-10 scrollbar-none pt-0.5">
          <button
            onClick={() => onTabChange('live-triage')}
            className={`px-3 py-1.5 rounded text-[13px] font-medium whitespace-nowrap transition-all ${
              activeTab === 'live-triage'
                ? isDark
                  ? 'bg-[#1b2b3f] text-[#93ccff] font-semibold shadow-inner border-b-2 border-[#93ccff]'
                  : 'bg-sky-50 text-sky-800 font-bold border-b-2 border-sky-600 shadow-xs'
                : isDark
                ? 'text-[#bfc7d2] hover:text-[#d3e4fe] hover:bg-[#102034]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Live Triage Queue
          </button>

          <button
            onClick={() => onTabChange('patient-intake')}
            className={`px-3 py-1.5 rounded text-[13px] font-medium whitespace-nowrap transition-all ${
              activeTab === 'patient-intake'
                ? isDark
                  ? 'bg-[#1b2b3f] text-[#93ccff] font-semibold shadow-inner border-b-2 border-[#93ccff]'
                  : 'bg-sky-50 text-sky-800 font-bold border-b-2 border-sky-600 shadow-xs'
                : isDark
                ? 'text-[#bfc7d2] hover:text-[#d3e4fe] hover:bg-[#102034]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Patient Intake &amp; Assessment
          </button>

          <button
            onClick={() => onTabChange('bed-allocation')}
            className={`px-3 py-1.5 rounded text-[13px] font-medium whitespace-nowrap transition-all ${
              activeTab === 'bed-allocation'
                ? isDark
                  ? 'bg-[#1b2b3f] text-[#93ccff] font-semibold shadow-inner border-b-2 border-[#93ccff]'
                  : 'bg-sky-50 text-sky-800 font-bold border-b-2 border-sky-600 shadow-xs'
                : isDark
                ? 'text-[#bfc7d2] hover:text-[#d3e4fe] hover:bg-[#102034]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Bed &amp; Bay Allocation
          </button>

          <button
            onClick={() => onTabChange('inbound-ems')}
            className={`px-3 py-1.5 rounded text-[13px] font-medium whitespace-nowrap transition-all ${
              activeTab === 'inbound-ems'
                ? isDark
                  ? 'bg-[#1b2b3f] text-[#93ccff] font-semibold shadow-inner border-b-2 border-[#93ccff]'
                  : 'bg-sky-50 text-sky-800 font-bold border-b-2 border-sky-600 shadow-xs'
                : isDark
                ? 'text-[#bfc7d2] hover:text-[#d3e4fe] hover:bg-[#102034]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Inbound EMS / Ambulances
          </button>

          <button
            onClick={() => onTabChange('clinical-governance')}
            className={`px-3 py-1.5 rounded text-[13px] font-medium whitespace-nowrap transition-all ${
              activeTab === 'clinical-governance'
                ? isDark
                  ? 'bg-[#1b2b3f] text-[#93ccff] font-semibold shadow-inner border-b-2 border-[#93ccff]'
                  : 'bg-sky-50 text-sky-800 font-bold border-b-2 border-sky-600 shadow-xs'
                : isDark
                ? 'text-[#bfc7d2] hover:text-[#d3e4fe] hover:bg-[#102034]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Clinical AI Audit &amp; Governance
          </button>
        </nav>
      </div>
    </header>
  );
};

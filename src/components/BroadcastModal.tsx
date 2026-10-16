import React, { useState } from 'react';
import { clinicalAudio } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcastSent: (message: string) => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  isOpen,
  onClose,
  onBroadcastSent,
}) => {
  const { isDark } = useTheme();
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'emergency'>('normal');

  if (!isOpen) return null;

  const quickBroadcasts = [
    'Attention All Staff: Level 1 Trauma in Bay 01. Surgery and Ortho to Resus immediately.',
    'Mass Casualty Incident Standby: 4 multi-vehicle rigs inbound within 15 minutes.',
    'Code Sepsis Alert: Lactate reflex protocol active for Acute Pod A.',
    'ICU Full Surge Notice: All discharge-ready patients must transfer immediately.',
  ];

  const handleSend = () => {
    if (!message.trim()) return;
    clinicalAudio.playCodeAlert();
    onBroadcastSent(message.trim());
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div
        className={`rounded-lg w-full max-w-lg shadow-2xl overflow-hidden flex flex-col border ${
          isDark
            ? 'bg-[#0b1c30] border-[#1b2b3f] text-[#d3e4fe]'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <div
          className={`px-5 py-3.5 border-b flex items-center justify-between ${
            isDark ? 'bg-[#000f21] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-600">campaign</span>
            <h2 className="text-base font-bold">
              Overhead ED Broadcast Announcement
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-5 space-y-3 text-xs">
          <div>
            <label className="block text-slate-500 font-mono-numbers uppercase text-[10px] mb-1 font-bold">
              Select Quick Macro Broadcast
            </label>
            <div className="space-y-1.5">
              {quickBroadcasts.map((txt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMessage(txt)}
                  className={`w-full text-left p-2 rounded border text-xs transition-colors ${
                    isDark
                      ? 'bg-[#000f21] hover:bg-[#102034] text-[#d3e4fe] border-[#1b2b3f]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  📢 {txt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-mono-numbers uppercase text-[10px] mb-1 font-bold">
              Custom Public Address Message
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message to broadcast across trauma bays, acute pods, and nursing stations..."
              className={`w-full p-2.5 rounded border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                isDark ? 'bg-[#000f21] border-[#1b2b3f] text-[#d3e4fe]' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-medium">
              <input
                type="radio"
                name="priority"
                checked={priority === 'normal'}
                onChange={() => setPriority('normal')}
              />
              <span>Standard Operational Chime</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-red-600">
              <input
                type="radio"
                name="priority"
                checked={priority === 'emergency'}
                onChange={() => setPriority('emergency')}
              />
              <span>High-Acuity Emergency Tone</span>
            </label>
          </div>

          <div className={`flex items-center justify-end gap-2 pt-2 border-t ${isDark ? 'border-[#1b2b3f]' : 'border-slate-200'}`}>
            <button
              onClick={onClose}
              className={`px-4 py-1.5 rounded border ${
                isDark ? 'bg-[#102034] text-[#d3e4fe] hover:bg-[#1b2b3f] border-[#1b2b3f]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-700 text-white font-bold transition-all disabled:opacity-40 shadow-xs"
            >
              Transmit Broadcast
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface NotificationItem {
  id: string;
  time: string;
  title: string;
  description: string;
  level: 'critical' | 'warning' | 'info';
  read: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onClearAll: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearAll,
}) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div
        className={`rounded-lg w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border ${
          isDark
            ? 'bg-[#0b1c30] border-[#1b2b3f] text-[#d3e4fe]'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <div
          className={`px-4 py-3 border-b flex items-center justify-between ${
            isDark ? 'bg-[#000f21] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-600">notifications</span>
            <h2 className="text-sm font-bold">
              Urgent Clinical Notifications ({notifications.length})
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-3 overflow-y-auto space-y-2 text-xs">
          {notifications.length === 0 ? (
            <div className="text-center py-6 text-slate-400 font-medium">No unread alerts at this time.</div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-2.5 rounded border ${
                  item.level === 'critical'
                    ? isDark
                      ? 'bg-[#93000a]/20 border-[#ffb4ab]/40 text-[#ffdad6]'
                      : 'bg-red-50 border-red-200 text-red-900'
                    : item.level === 'warning'
                    ? isDark
                      ? 'bg-[#6001d1]/20 border-[#d2bbff]/40 text-[#d3e4fe]'
                      : 'bg-purple-50 border-purple-200 text-purple-900'
                    : isDark
                    ? 'bg-[#102034] border-[#1b2b3f] text-[#d3e4fe]'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between font-mono-numbers text-[10px] text-slate-500 mb-1">
                  <span className="font-bold flex items-center gap-1">
                    {item.level === 'critical' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                    )}
                    {item.title}
                  </span>
                  <span>{item.time}</span>
                </div>
                <div className="text-xs font-medium">{item.description}</div>
              </div>
            ))
          )}
        </div>

        <div
          className={`px-4 py-2.5 border-t flex items-center justify-between ${
            isDark ? 'bg-[#000f21] border-[#1b2b3f]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <button
            onClick={onClearAll}
            className="text-[11px] text-slate-500 hover:text-slate-800 underline font-medium"
          >
            Mark all as acknowledged
          </button>
          <button
            onClick={onClose}
            className={`px-3 py-1 rounded text-xs font-bold border ${
              isDark ? 'bg-[#102034] text-[#d3e4fe] border-[#1b2b3f]' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 shadow-2xs'
            }`}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="no-print fixed bottom-20 md:bottom-4 left-4 z-50 flex items-center gap-2 bg-stone-900 text-[#FBF9F5] border border-stone-700 px-3.5 py-2 text-xs font-medium shadow-md"
    >
      <WifiOff className="w-3.5 h-3.5 text-amber-300 shrink-0" aria-hidden="true" />
      <span>Mode Offline — Menampilkan data tersimpan</span>
    </div>
  );
}

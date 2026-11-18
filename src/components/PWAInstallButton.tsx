import { Download, MonitorSmartphone, Share2, X } from 'lucide-react';
import { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'sidebar' | 'card';
}

export function PWAInstallButton({ variant = 'compact' }: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, isMobileOrTablet, install } =
    usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // Never show when already running as an installed standalone PWA
  if (isInstalled) {
    return null;
  }

  const handleClick = () => {
    if (isInstallable) {
      void install();
    } else {
      setShowGuide(true);
    }
  };

  // On desktop/Android when native beforeinstallprompt is ready, label directly triggers OS install dialog.
  // On iOS Safari or browsers where prompt isn't fired yet (e.g. Safari macOS / Firefox / Chrome menu), clicking opens clear step-by-step guide.
  const buttonLabel = isInstallable
    ? variant === 'compact'
      ? 'Install App'
      : 'Install Aplikasi ke Perangkat'
    : isIOS
      ? variant === 'compact'
        ? 'Install iOS'
        : 'Pasang di iPhone / iPad'
      : variant === 'compact'
        ? 'Pasang App'
        : 'Cara Install di PC / HP';

  const buttonClasses =
    variant === 'sidebar'
      ? 'w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-[#1E3A8A] bg-[#F4F0E8] border border-stone-300 hover:bg-stone-200/70 transition-colors cursor-pointer min-h-[40px]'
      : variant === 'card'
        ? 'inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172D6B] transition-colors cursor-pointer whitespace-nowrap min-h-[44px]'
        : 'inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#1E3A8A] bg-[#F4F0E8] border border-stone-300 hover:bg-stone-200/70 transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]';

  return (
    <>
      <button type="button" onClick={handleClick} className={buttonClasses}>
        {isInstallable ? (
          <Download className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        ) : (
          <MonitorSmartphone className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        )}
        <span>{buttonLabel}</span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="w-full max-w-md bg-[#FBF9F5] border border-stone-300 p-6 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-stone-200">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-[#1E3A8A] font-semibold">
                  Instalasi Aplikasi (PWA)
                </p>
                <h3 className="font-serif text-xl font-semibold text-stone-900 mt-0.5">
                  {isIOS
                    ? 'Install di iPhone & iPad (Safari)'
                    : isMobileOrTablet
                      ? 'Install di HP / Tablet Android'
                      : 'Install di PC & Laptop'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                aria-label="Tutup panduan instalasi"
                className="p-2 text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isIOS ? (
              <ol className="space-y-3 text-sm text-stone-700 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="font-mono font-semibold text-[#1E3A8A]">01.</span>
                  <span>
                    Buka halaman ini di browser <strong>Safari</strong> (bukan browser dalam
                    aplikasi).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono font-semibold text-[#1E3A8A]">02.</span>
                  <span className="inline-flex flex-wrap items-center gap-1">
                    Ketuk ikon <Share2 className="w-4 h-4 inline text-[#1E3A8A]" />{' '}
                    <strong>Share (Bagikan)</strong> pada bilah menu Safari.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono font-semibold text-[#1E3A8A]">03.</span>
                  <span>
                    Gulir ke bawah lalu ketuk <strong>Add to Home Screen</strong> (Tambah ke
                    Layar Utama), kemudian tekan <strong>Add</strong>.
                  </span>
                </li>
              </ol>
            ) : (
              <div className="space-y-3 text-sm text-stone-700 leading-relaxed">
                <p>
                  Aplikasi ini mendukung instalasi langsung layaknya aplikasi desktop &amp;
                  mobile native tanpa perlu App Store / Play Store:
                </p>
                <ul className="space-y-2 text-xs sm:text-sm list-disc pl-5">
                  <li>
                    <strong>PC / Laptop (Chrome &amp; Edge):</strong> Klik ikon{' '}
                    <strong>Install (Monitor + Panah)</strong> di sisi kanan address bar
                    browser, atau buka menu <strong>⋮ → Cast, save, and share → Install
                    Lalu Mahendra Creator OS</strong>.
                  </li>
                  <li>
                    <strong>HP / Tablet Android (Chrome):</strong> Ketuk menu{' '}
                    <strong>⋮</strong> di kanan atas lalu pilih{' '}
                    <strong>Add to Home screen / Install app</strong>.
                  </li>
                  <li>
                    <strong>Mac Safari:</strong> Klik menu <strong>File → Add to Dock</strong>.
                  </li>
                </ul>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172D6B] cursor-pointer"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
}

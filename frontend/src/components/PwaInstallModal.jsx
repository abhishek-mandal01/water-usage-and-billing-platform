import { useState, useEffect } from 'react';
import { Smartphone, Monitor, Tablet, Download, X, Check, ShieldCheck, Sparkles } from 'lucide-react';

export default function PwaInstallModal() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('mobile'); // 'mobile' | 'tablet' | 'desktop'
  const [_installed, setInstalled] = useState(false);

  useEffect(() => {
    // Listen for standard PWA install event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Auto open modal or show install prompt badge
      const dismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!dismissed) {
        setIsOpen(true);
      }
    };

    const handleAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
      setIsOpen(false);
      console.log('[PWA] Smart Water app was installed successfully.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers or already installed state
      alert('To install Smart Water: tap options/share menu in your browser and select "Add to Home Screen" or "Install App".');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
    if (outcome === 'accepted') {
      setInstalled(true);
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!isOpen && !deferredPrompt) return null;

  return (
    <>
      {/* Floating PWA trigger button if prompt available but modal closed */}
      {!isOpen && deferredPrompt && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-20 z-40 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs rounded-full shadow-lg shadow-cyan-500/25 border border-cyan-400/30 backdrop-blur-md transition-all duration-300 transform hover:scale-105"
        >
          <Download className="w-4 h-4 animate-bounce" />
          <span>Install App</span>
        </button>
      )}

      {/* Main PWA Download Modal with Device Screenshots */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900/90 border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
            {/* Header banner */}
            <div className="relative p-6 bg-gradient-to-r from-cyan-900/40 via-blue-900/40 to-slate-900 border-b border-cyan-500/20">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl">
                  <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    Install Smart Water App
                    <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-400/30">
                      Cross-Platform PWA
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Download and run Smart Water seamlessly on your Smartphone, Tablet, or Desktop PC.
                  </p>
                </div>
              </div>
            </div>

            {/* Device Switcher Tabs */}
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-950/60 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setActiveTab('mobile')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'mobile'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Smartphone</span>
                </button>

                <button
                  onClick={() => setActiveTab('tablet')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'tablet'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Tablet className="w-4 h-4" />
                  <span>Tablet</span>
                </button>

                <button
                  onClick={() => setActiveTab('desktop')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'desktop'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <span>Desktop</span>
                </button>
              </div>

              {/* Device Screenshot Preview Container */}
              <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 bg-slate-950/70 p-3 flex flex-col items-center justify-center min-h-[220px]">
                {activeTab === 'mobile' && (
                  <div className="flex flex-col items-center space-y-2 animate-fadeIn">
                    <img
                      src="/screenshots/mobile.png"
                      alt="Smart Water Smartphone App Preview"
                      className="max-h-[240px] rounded-xl object-contain shadow-lg border border-slate-800"
                    />
                    <span className="text-[11px] text-cyan-400 font-medium flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5" /> Mobile Smartphone View (Narrow Form Factor)
                    </span>
                  </div>
                )}

                {activeTab === 'tablet' && (
                  <div className="flex flex-col items-center space-y-2 animate-fadeIn">
                    <img
                      src="/screenshots/tablet.png"
                      alt="Smart Water Tablet App Preview"
                      className="max-h-[240px] rounded-xl object-contain shadow-lg border border-slate-800"
                    />
                    <span className="text-[11px] text-cyan-400 font-medium flex items-center gap-1">
                      <Tablet className="w-3.5 h-3.5" /> Tablet Dashboard View (Wide Form Factor)
                    </span>
                  </div>
                )}

                {activeTab === 'desktop' && (
                  <div className="flex flex-col items-center space-y-2 animate-fadeIn">
                    <img
                      src="/screenshots/desktop.png"
                      alt="Smart Water Desktop App Preview"
                      className="max-h-[240px] rounded-xl object-contain shadow-lg border border-slate-800"
                    />
                    <span className="text-[11px] text-cyan-400 font-medium flex items-center gap-1">
                      <Monitor className="w-3.5 h-3.5" /> Desktop Workstation View (Wide Form Factor)
                    </span>
                  </div>
                )}
              </div>

              {/* Benefits list */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-700/40">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <span className="text-slate-300 font-medium">Offline Access</span>
                </div>
                <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-700/40">
                  <Sparkles className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <span className="text-slate-300 font-medium">Fast Performance</span>
                </div>
                <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-700/40">
                  <Check className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <span className="text-slate-300 font-medium">Zero Installation Cost</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={handleClose}
                className="px-5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Maybe Later
              </button>

              <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-cyan-500/25 border border-cyan-400/30 transition-all duration-300 transform hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Download & Install Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

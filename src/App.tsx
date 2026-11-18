import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import {
  BarChart3,
  BookOpen,
  Camera,
  Columns3,
  Download,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnalyticsScorecardView } from './components/AnalyticsScorecardView';
import { BatchingBoardView } from './components/BatchingBoardView';
import { BlueprintDocsView } from './components/BlueprintDocsView';
import { CommandCenterView } from './components/CommandCenterView';
import { ContentStudioDrawer } from './components/ContentStudioDrawer';
import { ResearchVaultView } from './components/ResearchVaultView';
import { ShowcaseVaultView } from './components/ShowcaseVaultView';
import { TeamAccessView } from './components/TeamAccessView';
import { auth, googleProvider } from './firebase';
import {
  createContentItem,
  createPortfolioAsset,
  createWeeklySnapshot,
  deleteContentItem,
  deleteWeeklySnapshot,
  ensureOwnWorkspaceAndProfile,
  findAssignedWorkspacesForAssistant,
  inviteAssistantToWorkspace,
  markPortfolioAssetRecycled,
  normalizeActorLabel,
  removeAssistantFromWorkspace,
  subscribeContentItems,
  subscribePortfolioAssets,
  subscribeWeeklySnapshots,
  subscribeWorkspace,
  subscribeWorkspaceMembers,
  updateContentItem,
  updateContentStage,
  updateUserActivePhase,
} from './services/firestoreService';
import type {
  ContentItem,
  ContentStage,
  PortfolioAsset,
  StrategyPhase,
  WeeklySnapshot,
  Workspace,
  WorkspaceMember,
  WorkspaceRole,
} from './types/creator';
import { generateReportPdf } from './utils/generateReportPdf';

type WorkspaceView =
  | 'command'
  | 'research'
  | 'batching'
  | 'showcase'
  | 'analytics'
  | 'team'
  | 'blueprint';

const NAV_ITEMS: { id: WorkspaceView; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'command', label: 'Command Center', icon: LayoutDashboard },
  { id: 'research', label: 'Research & Ide', icon: Sparkles },
  { id: 'batching', label: 'Batching & Jadwal', icon: Columns3 },
  { id: 'showcase', label: 'Showcase Vault', icon: Camera },
  { id: 'analytics', label: 'Analytics & Scorecard', icon: BarChart3 },
  { id: 'team', label: 'Akses Asisten', icon: Users },
  { id: 'blueprint', label: 'Blueprint & PDF', icon: BookOpen },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  const [activeView, setActiveView] = useState<WorkspaceView>('command');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showPublicBlueprint, setShowPublicBlueprint] = useState(false);

  const [ownWorkspace, setOwnWorkspace] = useState<Workspace | null>(null);
  const [assignedWorkspaces, setAssignedWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);

  const [activePhase, setActivePhase] = useState<StrategyPhase>('phase-1');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [snapshots, setSnapshots] = useState<WeeklySnapshot[]>([]);
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [drawerTab, setDrawerTab] = useState<'research' | 'script' | 'metrics'>('research');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Step 1: Bootstrap user profile, own workspace, and check any shared assistant invitations
  useEffect(() => {
    if (!user) {
      setOwnWorkspace(null);
      setAssignedWorkspaces([]);
      setSelectedWorkspaceId(null);
      setActiveWorkspace(null);
      setMembers([]);
      setItems([]);
      setSnapshots([]);
      setAssets([]);
      return;
    }

    let cancelled = false;
    setDataLoading(true);

    void (async () => {
      const assigned = await findAssignedWorkspacesForAssistant(user.email);
      const { workspace } = await ensureOwnWorkspaceAndProfile(user, assigned.length === 0);
      if (cancelled) return;
      setOwnWorkspace(workspace);
      setAssignedWorkspaces(assigned);

      if (assigned.length > 0) {
        setSelectedWorkspaceId(assigned[0].ownerId);
        setActiveWorkspace(assigned[0]);
        setActivePhase(assigned[0].activePhase);
      } else {
        setSelectedWorkspaceId(workspace.ownerId);
        setActiveWorkspace(workspace);
        setActivePhase(workspace.activePhase);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const userRole: WorkspaceRole =
    user && selectedWorkspaceId && selectedWorkspaceId !== user.uid ? 'assistant' : 'owner';

  // Step 2: Subscribe to the active workspace + collections cleanly based on role
  useEffect(() => {
    if (!user || !selectedWorkspaceId) return;

    setDataLoading(true);
    const unsubWs = subscribeWorkspace(selectedWorkspaceId, (ws) => {
      if (ws) {
        setActiveWorkspace(ws);
        setActivePhase(ws.activePhase);
        if (ws.ownerId === user.uid) {
          setOwnWorkspace(ws);
        }
      }
    });

    const unsubMembers =
      userRole === 'owner'
        ? subscribeWorkspaceMembers(selectedWorkspaceId, setMembers)
        : () => {
            setMembers([]);
          };

    const userEmail = user.email || '';
    const unsubItems = subscribeContentItems(selectedWorkspaceId, userRole, userEmail, (data) => {
      setItems(data);
      setDataLoading(false);
    });
    const unsubSnaps = subscribeWeeklySnapshots(selectedWorkspaceId, userRole, userEmail, setSnapshots);
    const unsubAssets = subscribePortfolioAssets(selectedWorkspaceId, userRole, userEmail, setAssets);

    return () => {
      unsubWs();
      unsubMembers();
      unsubItems();
      unsubSnaps();
      unsubAssets();
    };
  }, [user, selectedWorkspaceId, userRole]);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setAuthError(
        err instanceof Error
          ? err.message
          : 'Gagal masuk dengan Google. Pastikan pop-up diizinkan di browser.'
      );
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const openNewContentDrawer = () => {
    setEditingItem(null);
    setDrawerTab('research');
    setDrawerOpen(true);
  };

  const openEditDrawer = (
    item: ContentItem,
    tab: 'research' | 'script' | 'metrics' = 'research'
  ) => {
    setEditingItem(item);
    setDrawerTab(tab);
    setDrawerOpen(true);
  };

  const workspaceOwnerId = selectedWorkspaceId || user?.uid || '';
  const sharedEmails = activeWorkspace?.assistantEmails || [];
  const actorLabel = user ? normalizeActorLabel(user) : 'Creator';

  const handleSaveContent = async (
    payload: Omit<ContentItem, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>,
    existingId?: string
  ) => {
    if (!user || !workspaceOwnerId) return;
    if (existingId) {
      await updateContentItem(
        workspaceOwnerId,
        sharedEmails,
        actorLabel,
        userRole === 'owner',
        existingId,
        payload
      );
    } else {
      await createContentItem(workspaceOwnerId, sharedEmails, actorLabel, payload);
    }
  };

  const handleQuickCreateAndOpen = async (
    seed: Omit<ContentItem, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!user || !workspaceOwnerId) return;
    const newId = await createContentItem(workspaceOwnerId, sharedEmails, actorLabel, seed);
    setEditingItem({
      ...seed,
      id: newId,
      ownerId: workspaceOwnerId,
      sharedEmails,
      lastEditedBy: actorLabel,
    });
    setDrawerTab('script');
    setDrawerOpen(true);
  };

  const handleRecyclePortfolioAsset = async (
    asset: PortfolioAsset,
    seed: Omit<ContentItem, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!user || !workspaceOwnerId) return;
    const newId = await createContentItem(workspaceOwnerId, sharedEmails, actorLabel, seed);
    await markPortfolioAssetRecycled(asset.id, newId, actorLabel);
    setEditingItem({
      ...seed,
      id: newId,
      ownerId: workspaceOwnerId,
      sharedEmails,
      lastEditedBy: actorLabel,
    });
    setDrawerTab('script');
    setDrawerOpen(true);
  };

  const handlePhaseChange = async (nextPhase: StrategyPhase) => {
    if (!user || userRole !== 'owner') return;
    setActivePhase(nextPhase);
    await updateUserActivePhase(user.uid, nextPhase);
  };

  const activeNavLabel =
    NAV_ITEMS.find((n) => n.id === activeView)?.label || 'Command Center';

  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-3">
          <div className="h-5 w-40 bg-stone-200 animate-pulse" />
          <div className="h-24 w-full bg-stone-100 border border-stone-200 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) {
    if (showPublicBlueprint) {
      return (
        <div className="min-h-screen bg-[#FBF9F5] text-[#1C1917]">
          <header className="no-print sticky top-0 z-30 bg-[#FBF9F5]/95 border-b border-stone-200">
            <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between gap-8">
              <span className="font-serif text-lg font-bold text-stone-900 whitespace-nowrap">
                Lalu Mahendra · Creator OS
              </span>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowPublicBlueprint(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 cursor-pointer whitespace-nowrap"
                >
                  Kembali ke Login
                </button>
                <button
                  type="button"
                  onClick={() => void handleGoogleSignIn()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172D6B] cursor-pointer whitespace-nowrap"
                >
                  Masuk ke Workspace
                </button>
              </div>
            </div>
          </header>
          <main className="max-w-[1100px] mx-auto px-6 py-10">
            <BlueprintDocsView />
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#FBF9F5] text-[#1C1917] flex flex-col justify-between">
        <header className="border-b border-stone-200 bg-white">
          <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between gap-8">
            <span className="font-serif text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap">
              Lalu Mahendra
            </span>
            <button
              type="button"
              onClick={() => generateReportPdf()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-stone-800 bg-white border border-stone-300 hover:bg-stone-50 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Unduh Laporan PDF</span>
            </button>
          </div>
        </header>

        <main className="max-w-[1040px] mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#1E3A8A] font-semibold mb-3">
              Creator OS · @lalumahendra × @obeecreatives × @obeephotography
            </p>
            <h1
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-900 leading-[1.15] mb-5"
              style={{ textWrap: 'balance' }}
            >
              Ruang Kerja Khusus Kreator Berbasis Riset &amp; Analisis Metrik
            </h1>
            <p className="text-base text-stone-600 leading-relaxed mb-8">
              Terpisah sepenuhnya dari administrasi klien agensi. Dirancang untuk siklus
              kreator penuh waktu: gerbang riset topik, <strong>Formula 3-30-15</strong>,
              antrean <em>batching</em> 2,5 jam/minggu, daur ulang aset{' '}
              <strong>@obeephotography</strong>, serta kolaborasi aman bersama asisten.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-700 border-t border-stone-200 pt-6">
              <div>
                <p className="font-semibold text-stone-900 mb-1">
                  01. Research-First &amp; Reframer AI
                </p>
                <p>Ubah topik teknis biasa menjadi angle Creative Director berotoritas.</p>
              </div>
              <div>
                <p className="font-semibold text-stone-900 mb-1">
                  02. Post-Publish Analytics Lab
                </p>
                <p>Lacak 3s Hold Rate, DM Shares/1K, Follow Conversion &amp; Scorecard.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-8 space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-2">
                Masuk ke Workspace Cloud
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Owner maupun Asisten terotorisasi masuk menggunakan akun Google masing-masing.
                Seluruh data tersimpan di Firebase Firestore (Spark Free Tier).
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800">
                {authError}
              </div>
            )}

            <button
              type="button"
              disabled={signingIn}
              onClick={() => void handleGoogleSignIn()}
              className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172D6B] disabled:opacity-50 transition-colors cursor-pointer"
            >
              {signingIn ? 'Menghubungkan Akun...' : 'Masuk dengan Akun Google'}
            </button>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs">
              <span className="text-stone-500">Ingin meninjau dokumen strategi?</span>
              <button
                type="button"
                onClick={() => setShowPublicBlueprint(true)}
                className="font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
              >
                Buka Blueprint →
              </button>
            </div>
          </div>
        </main>

        <footer className="border-t border-stone-200 py-6 px-6 text-center text-xs text-stone-500">
          Lalu Mahendra Creator OS · Terpisah dari Sistem Komersil Agensi
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1917] flex">
      {/* Left Sidebar (Desktop 256px) */}
      <aside className="no-print hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-stone-200">
        <div className="px-6 py-5 border-b border-stone-200">
          <div className="font-serif text-lg font-bold tracking-tight text-stone-900">
            Lalu Mahendra
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {userRole === 'assistant'
              ? `Mode Asisten · ${activeWorkspace?.ownerName || 'Owner'}`
              : 'Creator OS · @lalumahendra'}
          </p>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((nav) => {
            const Icon = nav.icon;
            const active = activeView === nav.id;
            return (
              <button
                key={nav.id}
                type="button"
                onClick={() => setActiveView(nav.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer text-left whitespace-nowrap ${
                  active
                    ? 'bg-[#F4F0E8] text-[#1E3A8A] font-semibold'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{nav.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-stone-200 space-y-4">
          {assignedWorkspaces.length > 0 && ownWorkspace && (
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1.5">
                Workspace Aktif
              </label>
              <select
                value={selectedWorkspaceId || ownWorkspace.ownerId}
                onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#FBF9F5] border border-stone-200 text-xs font-medium text-stone-800 focus:outline-none focus:border-[#1E3A8A]"
              >
                {assignedWorkspaces.map((ws) => (
                  <option key={ws.ownerId} value={ws.ownerId}>
                    Asisten: {ws.ownerName}
                  </option>
                ))}
                <option value={ownWorkspace.ownerId}>Workspace Pribadi</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1.5">
              Fase Aktif 90 Hari
            </label>
            <select
              value={activePhase}
              disabled={userRole !== 'owner'}
              onChange={(e) => void handlePhaseChange(e.target.value as StrategyPhase)}
              className="w-full px-2.5 py-1.5 bg-[#FBF9F5] border border-stone-200 text-xs font-medium text-stone-800 disabled:opacity-65 focus:outline-none focus:border-[#1E3A8A]"
            >
              <option value="phase-1">Fase 1 · Kalibrasi (Mg 1–4)</option>
              <option value="phase-2">Fase 2 · Serialisasi (Mg 5–8)</option>
              <option value="phase-3">Fase 3 · Flywheel (Mg 9–12+)</option>
            </select>
            {userRole !== 'owner' && (
              <p className="text-[11px] text-stone-400 mt-1">Fase dikunci oleh Owner</p>
            )}
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-stone-900 truncate">
                {user.displayName || 'Lalu Mahendra'}
              </p>
              <p className="text-[11px] text-stone-500 truncate">
                {userRole === 'owner' ? 'Owner · ' : 'Asisten · '}
                {user.email}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleSignOut()}
              title="Keluar akun"
              aria-label="Keluar akun"
              className="p-2 text-stone-500 hover:text-red-700 hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileNavOpen && (
        <div className="no-print fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-stone-900/40"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-white h-full border-r border-stone-200 flex flex-col z-10">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <div className="font-serif text-base font-bold text-stone-900">
                  Lalu Mahendra
                </div>
                <p className="text-xs text-stone-500">
                  {userRole === 'assistant' ? 'Mode Asisten' : 'Creator OS'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Tutup menu"
                className="p-2 text-stone-500 hover:text-stone-900"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map((nav) => {
                const Icon = nav.icon;
                const active = activeView === nav.id;
                return (
                  <button
                    key={nav.id}
                    type="button"
                    onClick={() => {
                      setActiveView(nav.id);
                      setMobileNavOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium cursor-pointer text-left ${
                      active
                        ? 'bg-[#F4F0E8] text-[#1E3A8A] font-semibold'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{nav.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="w-full py-2 text-xs font-medium text-red-700 border border-red-200 hover:bg-red-50 cursor-pointer"
              >
                Keluar ({user.displayName || 'Akun'})
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Bar Contract: Breadcrumb on Left, 1 Primary CTA on Right */}
        <header className="no-print sticky top-0 z-20 bg-[#FBF9F5]/95 backdrop-blur-sm border-b border-stone-200">
          <div className="px-6 py-3.5 flex items-center justify-between gap-8">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Buka menu navigasi"
                className="lg:hidden p-2 -ml-2 text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <Menu className="w-5 h-5" aria-hidden="true" />
              </button>
              <div className="text-sm text-stone-500 truncate">
                <span className="hidden sm:inline">
                  {userRole === 'assistant'
                    ? `Workspace ${activeWorkspace?.ownerName || 'Lalu Mahendra'} (Asisten)`
                    : 'Creator OS'}
                </span>
                <span className="hidden sm:inline mx-2" aria-hidden="true">
                  /
                </span>
                <span className="font-semibold text-stone-900">{activeNavLabel}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={openNewContentDrawer}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172D6B] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Tambah Konten Riset</span>
            </button>
          </div>
        </header>

        <main className="flex-1 px-6 py-8 max-w-[1240px] w-full mx-auto print-full">
          {dataLoading ? (
            <div className="space-y-4">
              <div className="h-10 w-64 bg-stone-200 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-28 bg-white border border-stone-200 animate-pulse"
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              {activeView === 'command' && (
                <CommandCenterView
                  items={items}
                  assets={assets}
                  activePhase={activePhase}
                  onOpenItem={openEditDrawer}
                  onCreateNew={openNewContentDrawer}
                  onNavigate={(v) => setActiveView(v)}
                />
              )}

              {activeView === 'research' && (
                <ResearchVaultView
                  items={items}
                  onOpenItem={openEditDrawer}
                  onQuickCreateFromAngle={handleQuickCreateAndOpen}
                  onCreateBlank={openNewContentDrawer}
                />
              )}

              {activeView === 'batching' && (
                <BatchingBoardView
                  items={items}
                  onOpenItem={openEditDrawer}
                  onChangeStage={async (id, nextStage: ContentStage) => {
                    await updateContentStage(id, nextStage, actorLabel);
                  }}
                  onCreateNew={openNewContentDrawer}
                />
              )}

              {activeView === 'showcase' && (
                <ShowcaseVaultView
                  assets={assets}
                  onRecycleAsset={handleRecyclePortfolioAsset}
                  onAddAsset={async (asset) => {
                    await createPortfolioAsset(
                      workspaceOwnerId,
                      sharedEmails,
                      actorLabel,
                      asset
                    );
                  }}
                />
              )}

              {activeView === 'analytics' && (
                <AnalyticsScorecardView
                  items={items}
                  snapshots={snapshots}
                  activePhase={activePhase}
                  canDeleteSnapshot={userRole === 'owner'}
                  onOpenItem={openEditDrawer}
                  onSaveSnapshot={async (snap) => {
                    await createWeeklySnapshot(
                      workspaceOwnerId,
                      sharedEmails,
                      actorLabel,
                      snap
                    );
                  }}
                  onDeleteSnapshot={async (id) => {
                    await deleteWeeklySnapshot(id);
                  }}
                />
              )}

              {activeView === 'team' && (
                <TeamAccessView
                  activeWorkspace={activeWorkspace}
                  userRole={userRole}
                  members={members}
                  currentUserEmail={user.email || ''}
                  onInviteAssistant={async (email, displayName) => {
                    await inviteAssistantToWorkspace(
                      user,
                      activeWorkspace?.assistantEmails || [],
                      email,
                      displayName
                    );
                  }}
                  onRemoveAssistant={async (memberId, email) => {
                    await removeAssistantFromWorkspace(
                      user,
                      activeWorkspace?.assistantEmails || [],
                      memberId,
                      email
                    );
                  }}
                />
              )}

              {activeView === 'blueprint' && <BlueprintDocsView />}
            </>
          )}
        </main>
      </div>

      {/* Studio Slide-Over Drawer */}
      <ContentStudioDrawer
        item={editingItem}
        isOpen={drawerOpen}
        initialTab={drawerTab}
        canDelete={userRole === 'owner'}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSaveContent}
        onDelete={async (id) => {
          await deleteContentItem(id);
        }}
        onCreateFollowUp={handleQuickCreateAndOpen}
      />
    </div>
  );
}

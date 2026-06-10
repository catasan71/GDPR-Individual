import React from 'react';
import { ShieldCheck, FileText, LayoutDashboard, Settings, Menu, Bell, User, Scale, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDemo?: boolean;
  isAdmin?: boolean;
  onExitDemo?: () => void;
  onUpgrade?: () => void;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, isDemo, isAdmin, onExitDemo, onUpgrade, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'documents', label: 'Documente GDPR', icon: <FileText size={20} /> },
    { id: 'signatures', label: 'Registru Semnături', icon: <User size={20} /> },
    { id: 'legislative', label: 'Monitor Legislativ', icon: <Scale size={20} /> },
    { id: 'settings', label: 'Setări Firmă', icon: <Settings size={20} /> },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Panou Admin', icon: <ShieldCheck size={20} /> });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 flex flex-col">
      
      {/* Demo Banner */}
      {isDemo && (
        <div className="bg-indigo-600 text-white px-4 py-2 text-sm font-medium flex justify-between items-center z-50 sticky top-0">
          <div className="flex items-center gap-2">
            <span className="bg-white text-indigo-600 px-2 py-0.5 rounded text-xs font-bold uppercase">Demo Mode</span>
            <span className="hidden sm:inline">Vizualizezi un cont demonstrativ. Datele nu vor fi salvate permanent.</span>
            <span className="sm:hidden">Cont Demo. Datele nu se salvează.</span>
          </div>
          <button 
            onClick={onExitDemo}
            className="bg-indigo-800 hover:bg-indigo-700 px-3 py-1 rounded text-xs transition-colors flex items-center gap-1"
          >
            Ieși din Demo
            <LogOut size={12} />
          </button>
        </div>
      )}

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2 text-blue-500">
          <ShieldCheck className="h-8 w-8" />
          <span className="font-bold text-xl text-white">GDPR Rapid</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400">
          <Menu />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isDemo ? 'mt-0 lg:mt-0' : ''} /* Adjust if banner pushes content */
        `}>
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-slate-800 flex items-center gap-3">
              <div className="bg-blue-600/20 p-2 rounded-lg text-blue-400">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight">GDPR Rapid</h1>
                <p className="text-xs text-slate-500">Conformitate IMM</p>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${activeTab === item.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                  {activeTab === item.id && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-xs">
                    {isDemo ? 'DE' : 'RO'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{isDemo ? 'Bistro Demo SRL' : 'SC Exemplu SRL'}</p>
                    <p className="text-xs text-slate-500">{isDemo ? 'Demo User' : 'Plan Free'}</p>
                  </div>
                </div>
                {!isDemo && (
                  <>
                    <button onClick={onUpgrade} className="w-full mt-2 text-xs bg-blue-600 hover:bg-blue-500 text-white py-1.5 rounded-lg transition-colors">
                      Upgrade Plan
                    </button>
                    <button onClick={onLogout} className="w-full mt-2 text-xs bg-slate-800 hover:bg-slate-700 text-red-400 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1">
                      <LogOut size={12} />
                      Deconectare
                    </button>
                  </>
                )}
                {isDemo && (
                  <button onClick={onExitDemo} className="w-full mt-2 text-xs bg-indigo-600 hover:bg-indigo-500 text-white py-1.5 rounded-lg transition-colors">
                    Creează Cont Real
                  </button>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black relative">
          <header className="sticky top-0 z-30 backdrop-blur-md bg-slate-950/70 border-b border-slate-800/50 px-8 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              {navItems.find(n => n.id === activeTab)?.label}
            </h2>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-slate-950"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                <User size={16} />
              </div>
            </div>
          </header>
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

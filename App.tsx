
import React, { useState, useEffect, useRef } from 'react';
import { Onboarding } from './components/Onboarding';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { DocumentEditor } from './components/DocumentEditor';
import { Settings } from './components/Settings';
import { LandingPage } from './components/LandingPage';
import { PackageSelection } from './components/PackageSelection';
import { PaymentModal } from './components/PaymentModal';
import { Auth } from './components/Auth';
import { LegislativeGuide } from './components/LegislativeGuide';
import { AdminDashboard } from './components/AdminDashboard';
import { CompanyProfile, DocumentItem, UserState, DocumentVersion, DocType } from './types';
import { ALL_DOCUMENTS } from './constants';
import { CheckCircle2 } from 'lucide-react';
import { SignaturesRegister } from './components/SignaturesRegister';

import { auth } from './firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { getUserData, saveUserData } from './services/dbService';

type AppView = 'LANDING' | 'PACKAGE_SELECTION' | 'PAYMENT' | 'AUTH' | 'ONBOARDING' | 'DASHBOARD';

export default function App() {
  const [view, setView] = useState<AppView>('LANDING');
  const viewRef = useRef<AppView>(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [userState, setUserState] = useState<UserState>({
    isOnboardingComplete: false,
    isDemo: false,
    subscriptionStatus: 'trial',
    profile: {} as CompanyProfile,
    documents: [],
  });
  const [showSubscriptionSuccess, setShowSubscriptionSuccess] = useState(false);
  const [language, setLanguage] = useState<'RO' | 'EN'>('RO');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  const isAdmin = currentUser?.email === 'office@developly.pro';

  // Check for Revolut payment redirect parameters and local success flags
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const hasSuccessParam = query.get("payment") === "success";
    const hasLocalFlag = localStorage.getItem('payment_success_flag') === 'true';

    if (hasSuccessParam || hasLocalFlag) {
      setShowSubscriptionSuccess(true);
      setUserState(prev => ({ ...prev, subscriptionStatus: 'active' }));
      setTimeout(() => setShowSubscriptionSuccess(false), 4000);
      localStorage.removeItem('payment_success_flag');
      // Clean up URL
      if (hasSuccessParam) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } else if (query.get("payment") === "cancelled") {
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // Prevent the app from hanging on "Se încarcă..." if Firestore is not initialized or offline.
          // We race the getUserData call against a 4-second timeout.
          const dbFetchPromise = getUserData(user.uid);
          const timeoutPromise = new Promise<null>((resolve) => {
            setTimeout(() => {
              console.warn("Firestore getUserData timed out after 4000ms. Falling back to default state.");
              resolve(null);
            }, 4000);
          });

          const data = await Promise.race([dbFetchPromise, timeoutPromise]);
          
          if (data && data.profile && Object.keys(data.profile).length > 0) {
            setUserState({
              isOnboardingComplete: true,
              isDemo: false,
              subscriptionStatus: data.subscriptionStatus || 'trial',
              profile: data.profile,
              documents: data.documents || [],
            });
            setView('DASHBOARD');
            
            // If they paid beforehand and just signed up/logged in, make sure their status is upgraded and saved
            const cachedPayment = localStorage.getItem('payment_success_flag') === 'true';
            if (cachedPayment) {
              localStorage.removeItem('payment_success_flag');
              setUserState(prev => ({ ...prev, subscriptionStatus: 'active' }));
              setShowSubscriptionSuccess(true);
              setTimeout(() => setShowSubscriptionSuccess(false), 4000);
            }
          } else {
            // New user or no profile
            // Only redirect to onboarding if they are NOT reading informational views (LANDING, PACKAGE_SELECTION, PAYMENT)
            if (viewRef.current !== 'LANDING' && viewRef.current !== 'PACKAGE_SELECTION' && viewRef.current !== 'PAYMENT') {
              setView('ONBOARDING');
            }
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
          if (viewRef.current !== 'LANDING' && viewRef.current !== 'PACKAGE_SELECTION' && viewRef.current !== 'PAYMENT') {
            setView('ONBOARDING');
          }
        }
      } else {
        // Logged out
        if (view !== 'LANDING' && view !== 'PACKAGE_SELECTION' && view !== 'PAYMENT' && view !== 'AUTH') {
            setView('LANDING');
        }
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Safety backup timer to prevent infinite "Se încarcă..." if Firebase Auth is slow or blocked (e.g., in iframes, third-party cookie blockers, or missing authorized domains in Vercel)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthReady) {
        console.warn("Firebase Auth initialization timed out (3s). Proceeding with fallback ready state.");
        setIsAuthReady(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isAuthReady]);

  // Save to Firestore whenever userState changes (if logged in and not demo)
  useEffect(() => {
    if (currentUser && !userState.isDemo && userState.isOnboardingComplete) {
      saveUserData(currentUser.uid, userState.profile, userState.documents, userState.subscriptionStatus);
    }
  }, [userState, currentUser]);

  const calculateDocuments = (profile: CompanyProfile) => {
    let requiredDocs = ALL_DOCUMENTS.map(doc => ({ ...doc, history: [] }));

    // Filtrare bazată pe website
    if (!profile.hasWebsite) {
        requiredDocs = requiredDocs.filter(d => d.type !== DocType.POLITICA_COOKIES);
    }
    // Filtrare marketing
    if (!profile.hasNewsletter) {
        requiredDocs = requiredDocs.filter(d => d.type !== DocType.FORMULAR_CONSIMTAMANT);
    }
    // Filtrare CCTV/GPS (Art. 5 Legea 190)
    if (!profile.hasCCTV) {
        requiredDocs = requiredDocs.filter(d => d.type !== DocType.ANALIZA_PROPORTIONALITATE);
    } else {
        // Dacă are CCTV, analiza de proporționalitate e obligatorie
        const idx = requiredDocs.findIndex(d => d.type === DocType.ANALIZA_PROPORTIONALITATE);
        if (idx !== -1) requiredDocs[idx].isMandatory = true;
    }
    // Filtrare DPIA
    if (!profile.processSensitiveData && !profile.hasCCTV) {
        requiredDocs = requiredDocs.filter(d => d.type !== DocType.DPIA);
    }
    // Filtrare DPO (RO Specific - Art. 4 Legea 190)
    const needsDPO = profile.employeeCount >= 250 || profile.processSensitiveData || profile.processCNPLegitimateInterest;
    if (!needsDPO) {
        requiredDocs = requiredDocs.filter(d => d.type !== DocType.DECIZIE_DPO);
    } else {
        const idx = requiredDocs.findIndex(d => d.type === DocType.DECIZIE_DPO);
        if (idx !== -1) requiredDocs[idx].isMandatory = true;
    }

    return requiredDocs;
  }

  const handleStartDemo = () => {
    const demoProfile: CompanyProfile = {
        name: "Bistro La Piazzetta SRL",
        cui: "RO99887766",
        industry: "Horeca - Restaurant / Bar / Cafenea",
        employeeCount: 12,
        hasWebsite: true,
        websiteUrl: "https://www.lapiazzetta-demo.ro",
        hasNewsletter: false,
        hasCCTV: true,
        processSensitiveData: false,
        processCNPLegitimateInterest: false,
        thirdPartyServices: ["Glovo", "Contabilitate Expert SRL"]
    };

    const demoDocs = calculateDocuments(demoProfile).map(d => {
        if (d.id === '5' || d.id === '11') { 
            return { ...d, status: 'generated' as const, lastUpdated: new Date() };
        }
        return d;
    });

    setUserState({
        isOnboardingComplete: true,
        isDemo: true,
        subscriptionStatus: 'trial',
        profile: demoProfile,
        documents: demoDocs
    });
    setView('DASHBOARD');
  };

  const handleOnboardingComplete = (profile: CompanyProfile) => {
    const docs = calculateDocuments(profile);
    const cachedPayment = localStorage.getItem('payment_success_flag') === 'true';
    if (cachedPayment) {
      localStorage.removeItem('payment_success_flag');
    }
    const finalStatus = (cachedPayment || userState.subscriptionStatus === 'active') ? 'active' : 'trial';

    setUserState(prev => ({
      isOnboardingComplete: true,
      isDemo: false,
      subscriptionStatus: finalStatus,
      profile: {
          ...prev.profile,
          ...profile
      },
      documents: docs,
    }));

    if (finalStatus === 'active') {
      setShowSubscriptionSuccess(true);
      setTimeout(() => setShowSubscriptionSuccess(false), 4000);
    }

    setView('DASHBOARD');
  };

  const handleProfileUpdate = (newProfile: CompanyProfile) => {
      const potentialNewDocs = calculateDocuments(newProfile);
      const mergedDocs = potentialNewDocs.map(newDoc => {
          const existing = userState.documents.find(d => d.type === newDoc.type);
          return existing ? existing : newDoc;
      });

      setUserState(prev => ({
          ...prev,
          profile: newProfile,
          documents: mergedDocs
      }));
  };

  const handleDocumentSave = (docId: string, content: string) => {
    setUserState(prev => {
        const docIndex = prev.documents.findIndex(d => d.id === docId);
        if (docIndex === -1) return prev;

        const oldDoc = prev.documents[docIndex];
        let newHistory = [...oldDoc.history];
        if (oldDoc.content && oldDoc.content !== content) {
            const version: DocumentVersion = {
                id: Date.now().toString(),
                date: new Date(),
                content: oldDoc.content,
                reason: oldDoc.status === 'missing' ? 'Generare Inițială' : 'Actualizare Manuală'
            };
            newHistory.unshift(version);
        }

        const newDocs = [...prev.documents];
        newDocs[docIndex] = {
            ...oldDoc,
            content: content,
            status: 'generated',
            lastUpdated: new Date(),
            history: newHistory
        };

        return { ...prev, documents: newDocs };
    });
    
    setActiveDocId(null);
    setActiveTab('dashboard');
  };

  const handleSubscribe = () => {
      setTimeout(() => {
          setUserState(prev => ({ ...prev, subscriptionStatus: 'active' }));
          setShowSubscriptionSuccess(true);
          setTimeout(() => setShowSubscriptionSuccess(false), 4000);
      }, 1500);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUserState({ isOnboardingComplete: false, isDemo: false, subscriptionStatus: 'trial', profile: {} as any, documents: [] });
    setView('LANDING');
  };

  if (!isAuthReady) {
      return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Se încarcă...</div>;
  }

  if (view === 'LANDING') {
      return (
        <LandingPage 
            onGetStarted={() => setView('PACKAGE_SELECTION')} 
            onLogin={() => setView('AUTH')} 
            onDemo={handleStartDemo}
            currentUser={currentUser}
            onContinueOnboarding={() => setView('ONBOARDING')}
            onLogout={handleLogout}
        />
      );
  }

  if (view === 'PACKAGE_SELECTION') {
      return <PackageSelection onSelect={(plan) => { 
          setSelectedPlan(plan); 
          if (plan === 'free') {
              setView('AUTH');
          } else {
              setView('PAYMENT');
          }
      }} onBack={() => setView('LANDING')} />;
  }

  if (view === 'PAYMENT') {
      return <PaymentModal planId={selectedPlan!} onSuccess={() => setView('AUTH')} onBack={() => setView('PACKAGE_SELECTION')} />;
  }

  if (view === 'AUTH') {
      return (
          <Auth 
            onLogin={(acceptedTerms) => {
                if (acceptedTerms) {
                    setUserState(prev => ({
                        ...prev,
                        profile: {
                            ...prev.profile,
                            termsAcceptedAt: new Date(),
                            privacyAcceptedAt: new Date()
                        }
                    }));
                    setView('ONBOARDING');
                }
                // For login (acceptedTerms is undefined/false), onAuthStateChanged will handle the redirect
                // to either DASHBOARD or ONBOARDING based on whether they have a profile.
            }}
            onBack={() => setView(selectedPlan ? 'PACKAGE_SELECTION' : 'LANDING')}
          />
      );
  }

  if (view === 'ONBOARDING') {
      return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (activeDocId) {
    const doc = userState.documents.find(d => d.id === activeDocId);
    if (doc) {
      return (
        <div className="min-h-screen bg-slate-950 p-4">
            <DocumentEditor 
                document={doc} 
                profile={userState.profile} 
                language={language}
                onSave={handleDocumentSave}
                onBack={() => setActiveDocId(null)}
                isDemo={userState.isDemo}
            />
        </div>
      );
    }
  }

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      isDemo={userState.isDemo}
      isAdmin={isAdmin}
      onExitDemo={() => {
        setUserState({ isOnboardingComplete: false, isDemo: false, subscriptionStatus: 'trial', profile: {} as any, documents: [] });
        setView('LANDING');
      }}
      onUpgrade={() => setView('PACKAGE_SELECTION')}
      onLogout={handleLogout}
    >
        {showSubscriptionSuccess && (
            <div className="fixed top-24 right-8 z-50 bg-green-500 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-right">
                <CheckCircle2 size={24} />
                <div>
                    <h4 className="font-bold">Abonament Activat!</h4>
                    <p className="text-sm opacity-90">Monitorizarea legislativă (Legea 190) este activă.</p>
                </div>
            </div>
        )}

      {activeTab === 'dashboard' && (
        <Dashboard 
            documents={userState.documents} 
            profile={userState.profile}
            language={language}
            setLanguage={setLanguage}
            onGenerateDoc={(id) => setActiveDocId(id)}
            onViewLegislative={() => setActiveTab('legislative')}
            onOpenSignatures={() => setActiveTab('signatures')}
        />
      )}
      {activeTab === 'signatures' && (
          <SignaturesRegister 
            documents={userState.documents}
            onClose={() => setActiveTab('dashboard')}
          />
      )}
      {activeTab === 'legislative' && (
          <LegislativeGuide 
            subscriptionStatus={userState.subscriptionStatus}
            onSubscribe={handleSubscribe}
          />
      )}
      {activeTab === 'admin' && isAdmin && (
          <AdminDashboard />
      )}
      {activeTab === 'documents' && (
         <div className="grid gap-4">
             <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h2 className="text-xl font-bold text-white mb-4">Arhivă Documente & Istoric</h2>
                <div className="grid gap-4">
                    {userState.documents.map(doc => (
                        <div key={doc.id} className="flex justify-between items-center p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-all">
                            <div>
                                <p className="font-medium text-white">{doc.title}</p>
                                <div className="flex gap-4 mt-1">
                                    <p className="text-xs text-slate-500">
                                        Status: <span className={doc.status === 'missing' ? 'text-red-400' : 'text-green-400'}>
                                            {doc.status === 'missing' ? 'Lipsă' : 'Generat'}
                                        </span>
                                    </p>
                                    {doc.history && doc.history.length > 0 && (
                                        <p className="text-xs text-blue-400">
                                            {doc.history.length} versiuni anterioare
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button 
                                onClick={() => setActiveDocId(doc.id)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                {doc.status === 'missing' ? 'Generează' : 'Deschide'}
                            </button>
                        </div>
                    ))}
                </div>
             </div>
         </div>
      )}
      {activeTab === 'settings' && (
         <Settings 
            profile={userState.profile}
            onUpdate={handleProfileUpdate}
         />
      )}
    </Layout>
  );
}

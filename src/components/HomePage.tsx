import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FlashCard } from "@/components/ui/flash-card";
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle
  } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Crown, CheckCircle, Star, Target, Clipboard, BookOpen, RotateCcw, Sparkles, Bell, Users, ShieldCheck, Brain, Lightbulb, Eye, Heart, LogOut, User, Flame, Zap } from "lucide-react";
import { ArrowUp } from "lucide-react";
import { SiX as Twitter, SiInstagram as Instagram, SiLinkedin as Linkedin } from "react-icons/si";
import { useAuth } from '@/contexts/AuthContext';
import loadUserProfileAction from '@/actions/loadUserProfile';

interface HomePageProps {
    onGetStarted?: () => void;
    onLogin?: () => void;
    onRegister?: () => void;
}

export function HomePage({ onGetStarted, onLogin, onRegister }: HomePageProps) {
    const navigate = useNavigate();
    const [capValue, setCapValue] = useState([200]);
    const [capBehavior, setCapBehavior] = useState("Chiedi conferma");
    const estimatedCost = (capValue[0] * 0.08).toFixed(2);
    const [activeSection, setActiveSection] = useState("");
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showVideoDialog, setShowVideoDialog] = useState(false);
    const [videoTitle, setVideoTitle] = useState("");
    const [userProfile, setUserProfile] = useState<any>(null);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Close mobile menu on escape key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && showMobileMenu) {
                setShowMobileMenu(false);
            }
        };

        if (showMobileMenu) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevent body scroll when menu is open
            document.body.style.overflow = 'hidden';
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                document.body.style.overflow = 'unset';
            };
        }
    }, [showMobileMenu]);

    const { isAuthenticated, signOut } = useAuth();

    // Load user profile if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            loadUserProfileAction().then(profile => {
                setUserProfile(profile);
            }).catch(error => {
                console.error('Error loading user profile:', error);
            });
        }
    }, [isAuthenticated]);

    // Default handlers if not provided
    const handleGetStarted = onGetStarted || (() => navigate('/auth?mode=register'));
    const handleLogin = onLogin || (() => navigate('/auth?mode=login'));
    const handleRegister = onRegister || (() => navigate('/auth?mode=register'));

    const handleShowVideo = (title: string) => {
        setVideoTitle(title);
        setShowVideoDialog(true);
    };



    const handleSignOut = async () => {
        try {
            await signOut();
            // Remove the force home parameter and reload
            window.location.href = '/';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    type CoachItem = {
        key: "Manager" | "Elia" | "Skippy" | "Lupa" | "Polpo";
        name: string;
        emoji: string;
        icon: IconType;
        chipBg: string;
        chipText: string;
        descShort: string;
        descLong: string;
        traits: string[];
        whenChoose: string;
        extraTitle: string;
        extraPoints: string[];
    };

    const [selectedCoach, setSelectedCoach] = useState<"Manager" | "Elia" | "Skippy" | "Lupa" | "Polpo">("Manager");

    const coaches: CoachItem[] = [
        {
            key: "Manager",
            name: "Zuno Manager",
            emoji: "👑",
            icon: Crown,
            chipBg: "bg-gradient-to-r from-blue-100 to-purple-100",
            chipText: "text-blue-700",
            descShort: "Guida principale: coordina i coach e il percorso.",
            descLong: "Zuno Manager è il tuo assistente principale: ti conosce, definisce gli obiettivi e coordina i quattro coach per offrirti il miglior mix in base a tempo, livello ed energia. Mantiene coerenza tra lezioni, review e sfide, adattando sempre il percorso.",
            traits: ["Visione d'insieme", "Piani adattivi", "Focus su obiettivi", "Bilanciamento carico"],
            whenChoose: "Sempre: imposta il piano e coordina i coach in base ai tuoi obiettivi.",
            extraTitle: "Coordinamento",
            extraPoints: [
                "Analizza tempo, energia e progresso recente",
                "Sceglie il coach giusto per la prossima lezione",
                "Pianifica review e sfide mantenendo equilibrio",
                "Aggiorna gli obiettivi e la roadmap personale"
            ]
        },
        {
            key: "Elia",
            name: "Elia",
            emoji: "🐘",
            icon: Brain,
            chipBg: "bg-amber-100",
            chipText: "text-amber-600",
            descShort: "Approccio profondo: metodo calmo e riflessivo.",
            descLong: "Elia (l'Elefante): pensato per chi predilige un apprendimento profondo e riflessivo. Ti guida in modo metodico e pacato, assicurandosi che ogni concetto sia compreso prima di proseguire, così da costruire basi solide e durature nel tempo.",
            traits: ["Ritmo pacato", "Esempi guidati", "Review approfondite", "Chiarezza concettuale"],
            whenChoose: "Quando vuoi basi solide e comprensione profonda, senza fretta.",
            extraTitle: "Cosa lo differenzia",
            extraPoints: [
                "Approfondisce ogni tema prima di proseguire",
                "Fornisce esempi chiari e spiegazioni complete",
                "Rinforza le basi con review strutturate",
                "Mantiene un ritmo calmo e costante"
            ]
        },
        {
            key: "Skippy",
            name: "Skippy",
            emoji: "🐿️",
            icon: Lightbulb,
            chipBg: "bg-orange-100",
            chipText: "text-orange-600",
            descShort: "Apprendimento rapido: dinamico ed esplorativo.",
            descLong: "Skippy (lo Scoiattolo): ideale per esperienze di apprendimento rapide ed esplorative. Propone sfide brevi e dinamiche, ti permette di saltare tra argomenti diversi e mantiene alto il coinvolgimento con varietà e stimoli continui.",
            traits: ["Challenge veloci", "Varietà alta", "Feedback immediati", "Flessibilità nel percorso"],
            whenChoose: "Quando cerchi sprint brevi e varietà per mantenere alta la curiosità.",
            extraTitle: "Cosa lo differenzia",
            extraPoints: [
                "Propone sfide rapide e stimolanti ogni giorno",
                "Cambia spesso argomento per stimolare",
                "Feedback immediato sulle risposte",
                "Adatta la velocità in base ai tuoi progressi"
            ]
        },
        {
            key: "Lupa",
            name: "Lupa",
            emoji: "🐺",
            icon: Eye,
            chipBg: "bg-indigo-100",
            chipText: "text-indigo-600",
            descShort: "Collaborativo: orientato al gruppo e al confronto.",
            descLong: "Lupa (la Lupa): perfetta per chi ama imparare in compagnia e confrontarsi. Promuove interazioni dirette, sessioni condivise e peer feedback, creando un ambiente di collaborazione costante e favorendo la crescita con il lavoro di gruppo.",
            traits: ["Sessioni di gruppo", "Peer feedback", "Progetti condivisi", "Apprendimento sociale"],
            whenChoose: "Quando desideri imparare in gruppo con interazione e confronto diretto.",
            extraTitle: "Cosa lo differenzia",
            extraPoints: [
                "Organizza sessioni di gruppo e workshop",
                "Incoraggia il confronto tra pari e discussioni",
                "Crea progetti condivisi per imparare insieme",
                "Usa dinamiche sociali per rafforzare memoria"
            ]
        },
        {
            key: "Polpo",
            name: "Polpo",
            emoji: "🐙",
            icon: Heart,
            chipBg: "bg-teal-100",
            chipText: "text-teal-600",
            descShort: "Approccio ibrido: adattivo e combinato tra stili.",
            descLong: "Polpo (il Polpo): coach ibrido e adattivo che mescola strategie diverse per seguirti passo passo. Cambia approccio in base ai tuoi progressi, alterna momenti di teoria e pratica, e combina metodi degli altri coach per un'esperienza sempre su misura.",
            traits: ["Mix dinamico", "Adattività continua", "Copertura completa", "Strategia personalizzata"],
            whenChoose: "Quando vuoi un mix adattivo che cambia metodo seguendo il tuo stile.",
            extraTitle: "Cosa lo differenzia",
            extraPoints: [
                "Combina approcci di tutti i coach disponibili",
                "Adatta strategia in base ai tuoi progressi recenti",
                "Alterna tra teoria, pratica e review dinamica",
                "Aggiorna spesso il metodo di insegnamento"
            ]
        }
    ];

// --- helper decorazione per le feature (no testo) ---
const FeatureDeco = ({
    variant,
    tint = "text-muted-foreground/20",
  }: {
    variant: "adaptive" | "review" | "collab" | "game";
    tint?: string;
  }) => {
    return (
      <svg
        viewBox="0 0 180 120"
        className={`w-[180px] h-[120px] ${tint}`}
        aria-hidden
      >
        {variant === "adaptive" && (
          <g stroke="currentColor" fill="none" strokeWidth="2">
            {/* griglietta */}
            {[20, 60, 100, 140, 180].map((x) => (
              <line key={x} x1={x - 20} y1={20} x2={x - 20} y2={100} opacity="0.2" />
            ))}
            {[20, 60, 100].map((y) => (
              <line key={y} x1={10} y1={y} x2={170} y2={y} opacity="0.2" />
            ))}
            {/* trend con nodi */}
            <path d="M10 90 C 40 70, 70 85, 100 60 S 150 40, 170 30" />
            {[10, 70, 100, 140, 170].map((cx, i) => (
              <circle key={i} cx={cx} cy={[90, 78, 60, 48, 30][i]} r="4" fill="currentColor" />
            ))}
          </g>
        )}
  
        {variant === "review" && (
          <g stroke="currentColor" fill="none">
            {/* calendario mini */}
            {[0, 1, 2, 3, 4].map((r) =>
              [0, 1, 2, 3, 4].map((c) => (
                <rect
                  key={`${r}-${c}`}
                  x={20 + c * 28}
                  y={20 + r * 18}
                  rx="4"
                  ry="4"
                  width="18"
                  height="12"
                  opacity={r === 0 ? 0.35 : 0.55}
                />
              ))
            )}
            {/* “oggi” */}
            <rect x="76" y="38" width="18" height="12" rx="4" ry="4" fill="currentColor" opacity="0.35" />
          </g>
        )}
  
        {variant === "collab" && (
          <g stroke="currentColor" fill="none" strokeWidth="2">
            {/* tre avatar sovrapposti */}
            <circle cx="70" cy="60" r="26" opacity="0.6" />
            <circle cx="100" cy="60" r="26" opacity="0.4" />
            <circle cx="130" cy="60" r="26" opacity="0.25" />
            {/* “chat bubble” */}
            <path d="M50 30 h32 a10 10 0 0 1 10 10 v6 a10 10 0 0 1 -10 10 h-12 l-8 8 v-8 h-12 a10 10 0 0 1 -10 -10 v-6 a10 10 0 0 1 10 -10 z" opacity="0.25" />
          </g>
        )}
  
        {variant === "game" && (
          <g stroke="currentColor" fill="none" strokeWidth="2">
            {/* badge esagonale */}
            <path d="M90 20 l28 16 v32 l-28 16 -28 -16 v-32 z" opacity="0.45" />
            {/* stelline */}
            {[60, 90, 120].map((cx, i) => (
              <g key={i} transform={`translate(${cx}, 86)`} opacity="0.5">
                <path d="M0,-6 L1.8,-1.8 L6,0 L1.8,1.8 L0,6 L-1.8,1.8 L-6,0 L-1.8,-1.8 Z" />
              </g>
            ))}
          </g>
        )}
      </svg>
    );
  };

  
    const sectionIds = [
        "hero",
        "coaches",
        "catalog",
        "how-features",
        "collaborative",
        "testimonials",
        "pricing",
        "footer",
    ];

    useEffect(() => {
        const options = { root: null, rootMargin: "0px", threshold: 0.5 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, options);

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? scrollTop / docHeight : 0;

            setShowScrollTop(scrollTop > 400);
            setScrollProgress(Math.min(Math.max(progress, 0), 1));
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

    const SectionHeader = ({
        icon: Icon,
        title,
        subtitle
    }: {
        icon: IconType;
        title: string;
        subtitle: string;
    }) => <div className="bg-card border border-border rounded-xl p-5 mb-8 relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-l-xl"></div>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-foreground">{title}</h2>
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>
            </div>
        </div>;

    return (
        <div className="min-h-screen bg-background">
            {/* Manager Banner */}
            <div className="bg-surface-tint border-b border-border">
            </div>

            {/* Main Navigation */}
            <nav className="bg-white border-b border-border sticky top-0 z-50" role="navigation" aria-label="Main navigation">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="relative flex items-center justify-between h-16">
                        {/* Logo a sinistra */}
                        <div className="flex items-center gap-2">
                            <Crown className="w-6 h-6 text-blue-600" aria-hidden="true" />
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Zuno://
                            </span>
                        </div>

                        {/* Menu centrale - Desktop */}
                        <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
                            {[
                                { name: "Focus", href: "#hero", id: "hero" },
                                { name: "Coach", href: "#coaches", id: "coaches" },
                                { name: "Corsi", href: "#catalog", id: "catalog" },
                                { name: "Features", href: "#how-features", id: "how-features" },
                                { name: "Community", href: "#collaborative", id: "collaborative" },
                                { name: "Feedback", href: "#testimonials", id: "testimonials" },
                                { name: "Prezzi", href: "#pricing", id: "pricing" },
                                { name: "Contatti", href: "#footer", id: "footer" },
                            ].map((item) => {
                                const isActive = activeSection === item.id;
                                return (
                                    <button
                                        key={item.name}
                                        onClick={() => {
                                            const target = document.querySelector(item.href);
                                            if (target) {
                                                target.scrollIntoView({ behavior: "smooth" });
                                                // Announce navigation for screen readers
                                                const announcement = `Navigating to ${item.name} section`;
                                                const announcer = document.createElement('div');
                                                announcer.setAttribute('aria-live', 'polite');
                                                announcer.className = 'sr-only';
                                                announcer.textContent = announcement;
                                                document.body.appendChild(announcer);
                                                setTimeout(() => document.body.removeChild(announcer), 1000);
                                            }
                                        }}
                                        aria-current={isActive ? "page" : undefined}
                                        aria-label={`Navigate to ${item.name} section`}
                                        className={`relative text-sm font-medium transition-colors ${isActive
                                            ? "text-blue-600"
                                            : "text-muted-foreground hover:text-foreground focus-visible:text-foreground"
                                            }`}
                                    >
                                        {item.name}
                                        {/* underline soft quando attivo */}
                                        <span
                                            className={`absolute -bottom-2 left-1/2 h-[2px] w-0 rounded bg-blue-600 transition-all duration-300 ${isActive ? "w-4 -translate-x-1/2" : ""
                                                }`}
                                            aria-hidden="true"
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            aria-expanded={showMobileMenu}
                            aria-controls="mobile-menu"
                            aria-label="Toggle navigation menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>

                        {/* Pulsanti a destra - Desktop */}
                        <div className="hidden md:flex items-center gap-3">
                            {isAuthenticated ? (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate('/app')}
                                        className="flex items-center gap-2"
                                        aria-label="Go to user profile"
                                    >
                                        <User className="w-4 h-4" aria-hidden="true" />
                                        {userProfile && (
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1">
                                                    <Flame className="w-3 h-3 text-orange-500" aria-hidden="true" />
                                                    <span className="text-xs font-medium" aria-label={`Current streak: ${userProfile.currentStreak || 0} days`}>
                                                        {userProfile.currentStreak || 0}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Zap className="w-3 h-3 text-blue-500" aria-hidden="true" />
                                                    <span className="text-xs font-medium" aria-label={`Total XP: ${userProfile.totalXP || 0} points`}>
                                                        {userProfile.totalXP || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <span className="ml-1">Profilo</span>
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={handleSignOut}
                                        aria-label="Sign out"
                                    >
                                        <LogOut className="w-4 h-4" aria-hidden="true" />
                                        <span className="sr-only">Sign out</span>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="ghost" size="sm" onClick={handleLogin}>
                                        Login
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" 
                                        onClick={handleRegister}
                                    >
                                        Registrati
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {showMobileMenu && (
                        <>
                            {/* Backdrop */}
                            <div 
                                className={`md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
                                    showMobileMenu ? 'opacity-100' : 'opacity-0'
                                }`}
                                onClick={() => setShowMobileMenu(false)}
                                aria-hidden="true"
                            />
                            
                            {/* Menu */}
                            <div 
                                id="mobile-menu"
                                className={`md:hidden fixed inset-0 z-50 bg-white transition-all duration-300 ease-in-out ${
                                    showMobileMenu ? 'opacity-100 visible' : 'opacity-0 invisible'
                                }`}
                                role="menu"
                                aria-label="Mobile navigation menu"
                            >
                            {/* Close button */}
                            <div className="flex justify-between items-center p-4 border-b border-border">
                                <div className="flex items-center gap-2">
                                    <Crown className="w-6 h-6 text-blue-600" aria-hidden="true" />
                                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Zuno://
                                    </span>
                                </div>
                                <button
                                    onClick={() => setShowMobileMenu(false)}
                                    className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
                                    aria-label="Close navigation menu"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="flex flex-col h-full px-6 py-8 space-y-2">
                                {[
                                    { name: "Focus", href: "#hero", id: "hero" },
                                    { name: "Coach", href: "#coaches", id: "coaches" },
                                    { name: "Corsi", href: "#catalog", id: "catalog" },
                                    { name: "Features", href: "#how-features", id: "how-features" },
                                    { name: "Community", href: "#collaborative", id: "collaborative" },
                                    { name: "Feedback", href: "#testimonials", id: "testimonials" },
                                    { name: "Prezzi", href: "#pricing", id: "pricing" },
                                    { name: "Contatti", href: "#footer", id: "footer" },
                                ].map((item) => {
                                    const isActive = activeSection === item.id;
                                    return (
                                        <button
                                            key={item.name}
                                            onClick={() => {
                                                const target = document.querySelector(item.href);
                                                if (target) {
                                                    target.scrollIntoView({ behavior: "smooth" });
                                                    setShowMobileMenu(false);
                                                }
                                            }}
                                            role="menuitem"
                                            aria-current={isActive ? "page" : undefined}
                                            className={`block w-full text-left px-4 py-4 rounded-lg text-lg font-medium transition-all duration-200 ${isActive
                                                ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                                                : "text-foreground hover:text-blue-600 hover:bg-blue-50 hover:translate-x-1"
                                                }`}
                                        >
                                            {item.name}
                                        </button>
                                    );
                                })}
                                
                                {/* Mobile auth buttons */}
                                <div className="mt-auto pt-6 border-t border-border space-y-3">
                                    {isAuthenticated ? (
                                        <>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start"
                                                onClick={() => {
                                                    navigate('/app');
                                                    setShowMobileMenu(false);
                                                }}
                                            >
                                                <User className="w-4 h-4 mr-2" aria-hidden="true" />
                                                Profilo
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                className="w-full justify-start"
                                                onClick={() => {
                                                    handleSignOut();
                                                    setShowMobileMenu(false);
                                                }}
                                            >
                                                <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                                                Sign out
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button 
                                                variant="ghost" 
                                                className="w-full"
                                                onClick={() => {
                                                    handleLogin();
                                                    setShowMobileMenu(false);
                                                }}
                                            >
                                                Login
                                            </Button>
                                            <Button 
                                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                                onClick={() => {
                                                    handleRegister();
                                                    setShowMobileMenu(false);
                                                }}
                                            >
                                                Registrati
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                            </div>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section
                id="hero"
                className="snap-start bg-card min-h-[calc(100vh-4rem)] py-8 sm:py-12 px-4 sm:px-6 border-b border-border flex items-center justify-center scroll-mt-16"
                role="banner"
                aria-labelledby="hero-heading"
            >
                <div className="container mx-auto max-w-6xl text-center w-full flex flex-col items-center justify-center">
                    {/* Coach icons */}
                    <div className="flex justify-center items-center gap-2 sm:gap-3 mb-6" role="img" aria-label="Four AI coaches represented by brain, lightbulb, eye, and heart icons">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-100 flex items-center justify-center" aria-label="Elia - Deep learning coach">
                            <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" aria-hidden="true" />
                        </div>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 flex items-center justify-center" aria-label="Skippy - Fast learning coach">
                            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" aria-hidden="true" />
                        </div>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-100 flex items-center justify-center" aria-label="Lupa - Collaborative learning coach">
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" aria-hidden="true" />
                        </div>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-teal-100 flex items-center justify-center" aria-label="Polpo - Adaptive learning coach">
                            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" aria-hidden="true" />
                        </div>
                    </div>

                    <h1 
                        id="hero-heading"
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-foreground tracking-tight leading-tight"
                    >
                        Impara ciò che non sai — <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">a modo tuo</span>
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl sm:max-w-3xl mx-auto text-muted-foreground leading-relaxed">
                        Lezioni brevi e adattive con coach AI personali
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-md sm:max-w-none mx-auto">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-[0_2px_6px_rgba(59,130,246,0.25)]"
                            onClick={handleGetStarted}
                            aria-describedby="cta-description"
                        >
                            Inizia Gratis
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto bg-card border border-border text-foreground rounded-lg"
                            onClick={() => {
                                const target = document.querySelector('#how-features');
                                if (target) {
                                    target.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            aria-label="Learn more about how Zuno works"
                        >
                            Scopri come funziona
                        </Button>
                    </div>
                    
                    <div id="cta-description" className="sr-only">
                        Start your free learning journey with Zuno's AI-powered coaching system
                    </div>
                </div>
            </section>

            {/* Coaches Section */}
            <section
                id="coaches"
                className="snap-start min-h-[calc(100vh-4rem)] py-8 sm:py-12 px-6 sm:px-4 bg-muted flex items-center scroll-mt-16"
            >
                <div className="container mx-auto max-w-[1200px] w-full">
                    <SectionHeader
                        icon={Target}
                        title="Coach"
                        subtitle="Scegli lo stile che preferisci — Zuno Manager coordina tutto"
                    />

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        {/* SIDEBAR (più stretta) */}
                        <aside className="xl:col-span-4">
                            <div className="sticky top-24">
                                <div className="space-y-3">
                                    {coaches.map((c) => {
                                        const active = selectedCoach === c.key;
                                        return (
                                            <button
                                                key={c.key}
                                                onClick={() => setSelectedCoach(c.key)}
                                                aria-pressed={active}
                                                className={[
                                                    "w-full rounded-xl border border-border bg-card px-4",
                                                    "h-16",                         // altezza fissa per tutte le tile
                                                    "flex items-center gap-3 transition shadow-sm hover:shadow",
                                                    active ? "ring-2 ring-blue-400/40 border-blue-400/30" : ""
                                                ].join(" ")}
                                            >
                                                {/* icona: dimensione fissa uguale per tutti */}
                                                <span className={`shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-lg ${c.chipBg}`}>
                                                    <c.icon className={`${c.chipText} h-5 w-5`} />
                                                </span>

                                                {/* testo */}
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span className="font-semibold text-foreground whitespace-nowrap">{c.name}</span>
                                                        <span className="text-base shrink-0">{c.emoji}</span>
                                                        {c.key === "Manager" && (
                                                            <Badge className="ml-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-0 shrink-0">Default</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground truncate text-left">
                                                        {c.descShort}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </aside>

                        {/* DETTAGLIO (più largo, altezza fissata e robusta) */}
                        <main className="xl:col-span-8">
                            <Card className="bg-card border border-border rounded-2xl shadow-sm">
                                {/* min-height costante per tutti i coach */}
                                <CardContent className="p-7 md:p-10 min-h-[560px]">
                                    {(() => {
                                        const c = coaches.find((x) => x.key === selectedCoach)!;
                                        return (
                                            <div className="space-y-8">
                                                {/* Header */}
                                                <div className="flex items-start gap-4">
                                                    <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${c.chipBg}`}>
                                                        <c.icon className={`${c.chipText} h-6 w-6`} />
                                                    </span>
                                                    <div className="min-w-0">
                                                        {/* no wrap sul titolo */}
                                                        <h3 className="text-3xl font-extrabold tracking-tight text-foreground whitespace-nowrap">
                                                            {c.name} <span className="align-middle">{c.emoji}</span>
                                                        </h3>
                                                        <p className="mt-1 text-base text-muted-foreground">{c.descShort}</p>
                                                    </div>
                                                </div>

                                                {/* Long description */}
                                                <p className="text-lg leading-relaxed text-foreground">{c.descLong}</p>

                                                {/* Tre box con la STESSA altezza */}
                                                <div className="grid md:grid-cols-3 gap-5 items-stretch">
                                                    {/* Punti di forza */}
                                                    <div className="rounded-xl border border-border p-5 flex flex-col min-h-[220px]">
                                                        <h4 className="mb-2 font-semibold">Punti di forza</h4>
                                                        <div className="mt-1 flex flex-wrap gap-2">
                                                            {c.traits.map((t) => (
                                                                <Badge key={t} variant="outline" className="border-border">{t}</Badge>
                                                            ))}
                                                        </div>
                                                        <div className="flex-1" />
                                                    </div>

                                                    {/* Quando sceglierlo */}
                                                    <div className="rounded-xl border border-border p-5 flex flex-col min-h-[220px]">
                                                        <h4 className="mb-2 font-semibold">Quando sceglierlo</h4>
                                                        <p className="text-sm text-muted-foreground">{c.whenChoose}</p>
                                                        <div className="flex-1" />
                                                    </div>

                                                    {/* Extra points */}
                                                    <div className="rounded-xl border border-border p-5 flex flex-col min-h-[220px]">
                                                        <h4 className="mb-2 font-semibold">{c.extraTitle}</h4>
                                                        <ul className="text-sm text-muted-foreground space-y-1">
                                                            {c.extraPoints.map((point, idx) => (
                                                                <li key={idx}>• {point}</li>
                                                            ))}
                                                        </ul>
                                                        <div className="flex-1" />
                                                    </div>
                                                </div>

                                                {/* CTA */}
                                                <div className="flex flex-wrap gap-3 pt-2">
                                                    <Button
                                                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 glow-button-alt"
                                                        onClick={handleGetStarted}
                                                    >
                                                        {c.key === "Manager" ? "Inizia con Zuno Manager" : `Seleziona ${c.name}`}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => handleShowVideo(c.key === "Manager" ? "Come lavora Zuno Manager con i coach" : `Preview di ${c.name}`)}
                                                    >
                                                        {c.key === "Manager" ? "Vedi come lavora con i coach" : `Vedi una Preview di ${c.name}`}
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </CardContent>
                            </Card>
                        </main>
                    </div>
                </div>
            </section>

            {/* Course Catalog */}
            <section
                id="catalog"
                className="snap-start min-h-[calc(100vh-4rem)] py-8 sm:py-12 px-6 sm:px-4 bg-background flex items-center scroll-mt-16"
            >
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-foreground">Catalogo Corsi</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Esplora i nostri corsi curati e trova il percorso perfetto per raggiungere i tuoi obiettivi.
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-8">
                        <div className="max-w-md mx-auto mb-6">
                            <Input placeholder="Cerca corsi, argomenti o competenze..." className="w-full" />
                        </div>
                        <div className="flex justify-center gap-2 flex-wrap">
                            {["Tutti", "Principianti", "Intermedio", "Avanzato", "Popolari"].map(filter => (
                                <Button
                                    key={filter}
                                    variant={filter === "Tutti" ? "default" : "outline"}
                                    size="sm"
                                    className="rounded-full"
                                >
                                    {filter}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Course Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[{
                            title: "Python",
                            subtitle: "Introduzione a Python",
                            desc: "Le basi della programmazione con uno dei linguaggi più richiesti.",
                            difficulty: "PRINCIPIANTI",
                            color: "bg-blue-500",
                            textColor: "text-blue-500",
                            bgColor: "bg-blue-50"
                        }, {
                            title: "Data Science",
                            subtitle: "Data Science con Pandas",
                            desc: "Analizza e manipola dati in modo efficiente.",
                            difficulty: "INTERMEDIO",
                            color: "bg-yellow-500",
                            textColor: "text-yellow-600",
                            bgColor: "bg-yellow-50"
                        }, {
                            title: "AI/ML",
                            subtitle: "Machine Learning Avanzato",
                            desc: "Implementa modelli complessi con TensorFlow e PyTorch.",
                            difficulty: "AVANZATO",
                            color: "bg-orange-500",
                            textColor: "text-orange-600",
                            bgColor: "bg-orange-50"
                        }, {
                            title: "React",
                            subtitle: "Web Development con React",
                            desc: "Costruisci interfacce web interattive e moderne.",
                            difficulty: "INTERMEDIO",
                            color: "bg-cyan-500",
                            textColor: "text-cyan-600",
                            bgColor: "bg-cyan-50"
                        }, {
                            title: "UI/UX",
                            subtitle: "Design di UI/UX",
                            desc: "Progetta esperienze digitali intuitive e piacevoli.",
                            difficulty: "PRINCIPIANTI",
                            color: "bg-purple-500",
                            textColor: "text-purple-600",
                            bgColor: "bg-purple-50"
                        }, {
                            title: "Agile",
                            subtitle: "Project Management Agile",
                            desc: "Gestisci progetti complessi con metodologie flessibili.",
                            difficulty: "AVANZATO",
                            color: "bg-blue-600",
                            textColor: "text-blue-700",
                            bgColor: "bg-blue-50"
                        }].map((course, index) => (
                            <Card
                                key={index}
                                className="bg-card border border-border rounded-xl shadow-[0_4px_12px_rgba(24,39,75,0.06)] hover:shadow-lg transition-all hover:scale-105 overflow-hidden"
                            >
                                <div className={`h-24 ${course.color} flex items-center justify-center`}>
                                    <h3 className="text-white text-2xl font-bold">{course.title}</h3>
                                </div>
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <Badge className={`${course.bgColor} ${course.textColor} border-0 text-xs`}>
                                            {course.difficulty}
                                        </Badge>
                                    </div>
                                    <h4 className="font-bold text-lg mb-2 text-foreground">{course.subtitle}</h4>
                                    <p className="text-muted-foreground text-sm mb-4">{course.desc}</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={`w-full border ${course.textColor} hover:${course.bgColor}`}
                                        onClick={handleGetStarted}
                                    >
                                        Visualizza Corso
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

{/* How It Works + Features */}
<section
  id="how-features"
  className="snap-start min-h-[calc(100vh-4rem)] py-8 sm:py-12 px-6 sm:px-4 bg-muted flex items-center scroll-mt-16"
>
  <div className="container mx-auto max-w-6xl">
    {/* How It Works */}
    <div className="text-center mb-10 md:mb-12">
      <h2 className="text-3xl font-bold mb-4 text-foreground">Come Funziona</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">Tre passi semplici ed efficaci</p>
    </div>

    {/* ROW 1 */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 md:mb-12">
      {[
        {
          title: "Assessment",
          icon: Clipboard,
          bgColor: "bg-orange-50",
          iconColor: "text-orange-600",
          desc: "Individua rapidamente le lacune.",
          bullets: ["Test iniziale su skill chiave", "Report chiaro e sintetico", "Roadmap personalizzata"],
          cta: "Report d’esempio",
        },
        {
          title: "Lezione",
          icon: BookOpen,
          bgColor: "bg-indigo-50",
          iconColor: "text-indigo-600",
          desc: "Lezioni giornaliere personalizzate.",
          bullets: ["Spiegazioni brevi e mirate", "Esercizi con feedback", "Adattamento costante"],
          cta: "Lezione demo",
        },
        {
          title: "Review",
          icon: RotateCcw,
          bgColor: "bg-teal-50",
          iconColor: "text-teal-600",
          desc: "Ripassi spaziati per memorizzare.",
          bullets: ["Promemoria puntuali", "Spaziatura ottimale", "Mini quiz flashcard"],
          cta: "Prova review",
        },
      ].map((step, i) => (
        <FlashCard
          key={i}
          showHint
          heightClassName="h-[220px]"
          className="w-full"
          front={
            <div className="p-5 h-full text-center flex flex-col items-center justify-center">
              <div className={`w-14 h-14 mx-auto mb-4 rounded-xl ${step.bgColor} flex items-center justify-center`}>
                <step.icon className={`w-7 h-7 ${step.iconColor}`} />
              </div>
              <h3 className="font-bold text-xl mb-2 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground">{step.desc}</p>
            </div>
          }
          back={
            <div className="h-full flex flex-col">
              <div className="px-5 pt-4 pb-2 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${step.bgColor} flex items-center justify-center`}>
                  <step.icon className={`w-5 h-5 ${step.iconColor}`} />
                </div>
                <h4 className="text-base font-semibold text-foreground">{step.title}</h4>
              </div>
              <div className="px-5 pb-4 flex-1 min-h-0 flex flex-col">
                <ul className="text-sm text-muted-foreground space-y-1 overflow-y-auto pr-1">
                  {step.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2 items-start">
                      <span className="mt-1 select-none">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="sm" className="mt-3 self-center">
                  {step.cta}
                </Button>
              </div>
            </div>
          }
        />
      ))}
    </div>

    {/* Features */}
    <SectionHeader icon={Sparkles} title="Funzionalità" subtitle="Tutto quello di cui hai bisogno per imparare" />

    {/* ROW 2 */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 md:mb-24 lg:mb-32">
      {[
        {
          title: "Percorsi Adattivi",
          icon: Sparkles,
          bgColor: "bg-indigo-50",
          iconColor: "text-indigo-600",
          desc: "Si adatta al tuo ritmo.",
          bullets: ["Obiettivi dinamici", "Difficoltà regolata", "Focus sui punti deboli"],
          cta: "Vedi adattamento",
          variant: "adaptive" as const,
          tint: "text-indigo-300",
        },
        {
          title: "Promemoria Review",
          icon: Bell,
          bgColor: "bg-orange-50",
          iconColor: "text-orange-600",
          desc: "Ripassa al momento giusto.",
          bullets: ["Notifiche smart", "Calendario automatico", "Salvataggio concetti"],
          cta: "Pianifica",
          variant: "review" as const,
          tint: "text-orange-300",
        },
        {
          title: "Gruppi Collaborativi",
          icon: Users,
          bgColor: "bg-indigo-50",
          iconColor: "text-indigo-600",
          desc: "Impara con gli altri.",
          bullets: ["Sessioni condivise", "Peer feedback", "Sfide in team"],
          cta: "Trova gruppo",
          variant: "collab" as const,
          tint: "text-indigo-300",
        },
        {
          title: "Gamification Professionale",
          icon: ShieldCheck,
          bgColor: "bg-teal-50",
          iconColor: "text-teal-600",
          desc: "Streak, badge e livelli sobri.",
          bullets: ["Ricompense sobrie", "Progressi chiari", "Obiettivi smart"],
          cta: "Scopri badge",
          variant: "game" as const,
          tint: "text-teal-300",
        },
      ].map((f, index) => (
        <FlashCard
          key={index}
          showHint
          heightClassName="h-[200px]"
          className="w-full"
          front={
            <div className="relative p-6 h-full flex flex-col">
              <div className="absolute inset-y-2 right-3 hidden md:flex items-center pointer-events-none">
                <FeatureDeco variant={f.variant} tint={f.tint} />
              </div>
              <div className={`w-12 h-12 mb-4 rounded-xl ${f.bgColor} flex items-center justify-center`}>
                <f.icon className={`w-6 h-6 ${f.iconColor}`} />
              </div>
              <h3 className="font-bold text-xl mb-2 text-foreground">{f.title}</h3>
              <p className="text-muted-foreground">{f.desc}</p>
            </div>
          }
          back={
            <div className="relative h-full flex flex-col">
              <div className="absolute inset-y-2 right-3 hidden md:flex items-center pointer-events-none opacity-80">
                <FeatureDeco variant={f.variant} tint={f.tint} />
              </div>
              <CardHeader className="pb-2 pr-4 md:pr-40">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${f.bgColor} flex items-center justify-center`}>
                    <f.icon className={`w-5 h-5 ${f.iconColor}`} />
                  </div>
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex-1 min-h-0 pr-2 md:pr-40">
                <ul className="text-sm text-muted-foreground space-y-2 mb-4 overflow-y-auto">
                  {f.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <span className="mt-1 select-none">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-center">
                  <Button variant="outline" size="sm">{f.cta}</Button>
                </div>
              </CardContent>
            </div>
          }
        />
      ))}
    </div>
  </div>
</section>

            {/* Collaborative Learning */}
            <section
                id="collaborative"
                className="snap-start min-h-[calc(100vh-4rem)] py-8 sm:py-12 px-6 sm:px-4 bg-background flex items-center scroll-mt-16"
            >
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-foreground">
                            Imparare Insieme è Meglio 🤝
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Rompi l'isolamento dello studio individuale. Con Zuno Collaborativo, la condivisione e il confronto con gli altri diventano il tuo superpotere per crescere.
                        </p>
                    </div>

                    {/* Main Collaborative Card */}
                    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl shadow-lg mb-12 overflow-hidden">
                        <div className="grid md:grid-cols-2 gap-0">
                            <CardContent className="p-8">
                                <h3 className="text-2xl font-bold text-foreground mb-4">
                                    Crea la tua Tribù di Apprendimento
                                </h3>
                                <p className="text-muted-foreground mb-6">
                                    Unisciti a sessioni di gruppo guidate da un coach AI, chatta in tempo reale per scambiare idee e affronta sfide collaborative per mettere in pratica ciò che impari.
                                </p>
                                <Button
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white glow-button-alt"
                                    onClick={handleGetStarted}
                                >
                                    Trova un Gruppo di Studio →
                                </Button>
                            </CardContent>
                            <div className="bg-gradient-to-br from-white to-orange-50 p-6 flex flex-col justify-center">
                                <div className="space-y-4">
                                    <div className="bg-white rounded-lg p-3 shadow-sm border border-orange-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">MR</div>
                                            <span className="font-medium text-sm">Marco Rossi</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Qualcuno ha capito la differenza tra "let" e "const" in JS?</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 shadow-sm border border-green-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">EC</div>
                                            <span className="font-medium text-sm">Elia (Coach AI)</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Certo! "let" è per variabili che possono essere riassegnate, "const" per quelle che non cambiano. Vuoi un esempio pratico?</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">GB</div>
                                            <span className="font-medium text-sm">Giulia Bianchi</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Sì, grazie! Un esempio aiuterebbe molto.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Tools Section */}
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold mb-4 text-foreground">Gli Strumenti per Collaborare</h3>
                        <p className="text-muted-foreground">Funzionalità pensate per un apprendimento di successo.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[{
                            title: "Sessioni di Gruppo Guidate",
                            desc: "Lezioni virtuali condivise guidate da un coach AI che propone attività da svolgere insieme.",
                            icon: "👥",
                            bgColor: "bg-blue-50",
                            borderColor: "border-blue-200"
                        }, {
                            title: "Feedback tra Pari",
                            desc: "Scambia idee, rendi e ricevi consigli dai compagni che dall'AI.",
                            icon: "💬",
                            bgColor: "bg-orange-50",
                            borderColor: "border-orange-200"
                        }, {
                            title: "Sfide Collaborative",
                            desc: "Risolvi problemi in team per sviluppare abilità di problem-solving a lavoro di squadra.",
                            icon: "🏆",
                            bgColor: "bg-green-50",
                            borderColor: "border-green-200"
                        }].map((tool, index) => (
                            <Card key={index} className={`${tool.bgColor} border ${tool.borderColor} rounded-xl shadow-sm p-6 text-center`}>
                                <div className="text-4xl mb-4">{tool.icon}</div>
                                <h4 className="font-bold text-lg mb-3 text-foreground">{tool.title}</h4>
                                <p className="text-muted-foreground text-sm">{tool.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section
                id="testimonials"
                className="snap-start min-h-[calc(100vh-4rem)] py-8 sm:py-12 px-6 sm:px-4 bg-muted flex items-center scroll-mt-16"
            >
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-foreground">Cosa Dicono i Nostri Utenti</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Unisciti a migliaia di professionisti che stanno crescendo con Zuno
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[{
                            quote: "Zuno mi mantiene motivata ogni giorno!",
                            name: "Sarah L.",
                            role: "Software Engineer",
                            country: "USA"
                        }, {
                            quote: "Le sessioni collaborative rendono l'apprendimento divertente.",
                            name: "David C.",
                            role: "Data Scientist",
                            country: "Germania"
                        }, {
                            quote: "Le funzionalità di gamification sono brillanti.",
                            name: "Emily W.",
                            role: "Product Manager",
                            country: "UK"
                        }, {
                            quote: "La modalità 'focus' ha trasformato il mio modo di lavorare. Zero distrazioni, massima produttività.",
                            name: "Marco R.",
                            role: "UX Designer",
                            country: "Italia"
                        }, {
                            quote: "Ho conosciuto professionisti incredibili nella community. La condivisione di conoscenze non ha prezzo.",
                            name: "Aisha K.",
                            role: "Marketing Manager",
                            country: "Canada"
                        }, {
                            quote: "Vedere i miei progressi tracciati con grafici chiari mi spinge a superare i miei limiti ogni settimana.",
                            name: "Kenji T.",
                            role: "Full-stack Developer",
                            country: "Giappone"
                        }].map((testimonial, index) => (
                            <Card
                                key={index}
                                className="bg-card border border-border rounded-xl shadow-[0_4px_12px_rgba(24,39,75,0.06)]"
                            >
                                <CardContent className="p-6">
                                    <div className="flex mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-blue-500 text-blue-500" />
                                        ))}
                                    </div>
                                    <p className="text-foreground mb-4 italic">"{testimonial.quote}"</p>
                                    <div>
                                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                                        <p className="text-muted-foreground text-sm">
                                            {testimonial.role} • {testimonial.country}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section
  id="pricing"
  className="snap-start min-h-[calc(100vh-4rem)] py-8 sm:py-12 px-6 sm:px-4 bg-background flex items-center scroll-mt-16"
>
  <div className="container mx-auto max-w-6xl">
    <SectionHeader
      icon={Target}
      title="Prezzi"
      subtitle="Inizia gratis e aggiorna quando sei pronto"
    />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
      {/* Free Plan */}
      <Card className="bg-card border border-border rounded-xl shadow-[0_4px_12px_rgba(24,39,75,0.06)] flex flex-col">
        <CardHeader className="text-center pb-4 min-h-[132px]">
          <CardTitle className="text-2xl font-bold text-foreground">Free</CardTitle>
          <p className="text-3xl font-bold text-foreground">
            $0<span className="text-lg text-muted-foreground">/mese</span>
          </p>
          <p className="text-sm text-muted-foreground">Scopri e prova senza costi</p>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 space-y-4">
            <ul className="space-y-3 min-h-[190px]">
              {[
                "1 coach AI",
                "Apprendimento adattivo base",
                "Supporto community",
              ].map((feature, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-teal-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm leading-relaxed">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="mt-auto w-full bg-card border border-border rounded-lg"
            onClick={handleGetStarted}
          >
            Inizia Gratis
          </Button>
        </CardContent>
      </Card>

      {/* Premium Plan */}
      <Card className="bg-card border-2 border-primary rounded-xl shadow-lg relative flex flex-col">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-orange-50 text-amber-700 border-amber-200">Più scelto</Badge>
        </div>

        <CardHeader className="text-center pb-4 min-h-[132px]">
          <CardTitle className="text-2xl font-bold text-foreground">Premium</CardTitle>
          <p className="text-3xl font-bold text-foreground">
            $12<span className="text-lg text-muted-foreground">/mese</span>
          </p>
          <p className="text-sm text-muted-foreground">Tutte le funzioni senza limiti</p>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 space-y-4">
            <ul className="space-y-3 min-h-[190px]">
              {[
                "Tutti e 4 i coach AI",
                "Suite adattiva completa",
                "Gamification avanzata",
                "Supporto prioritario",
              ].map((feature, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-teal-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm leading-relaxed">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            size="lg"
            className="mt-auto w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-[0_2px_6px_rgba(59,130,246,0.25)]"
            onClick={handleGetStarted}
          >
            Avvia Prova Gratuita
          </Button>
        </CardContent>
      </Card>

      {/* Flex Plan */}
      <Card className="bg-card border border-border rounded-xl shadow-[0_4px_12px_rgba(24,39,75,0.06)] relative flex flex-col">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200">Nuovo</Badge>
        </div>

        <CardHeader className="text-center pb-4 min-h-[132px]">
          <CardTitle className="text-2xl font-bold text-foreground">Flex</CardTitle>
          <p className="text-3xl font-bold text-foreground">
            ${estimatedCost}
            <span className="text-lg text-muted-foreground">/mese</span>
          </p>
          <p className="text-sm text-muted-foreground">Paghi solo per ciò che usi</p>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 space-y-4">
            <ul className="space-y-3 min-h-[190px]">
              {[
                "Accesso a 2 coach AI",
                "Lezioni on-demand",
                "Review spaziati inclusi",
                "Cap personalizzabile",
              ].map((feature, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-teal-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm leading-relaxed">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* Calcolatore Cap */}
            <div className="flex flex-col space-y-3 p-3 bg-muted rounded-lg mb-6">
              <label className="text-sm font-medium text-foreground">
                Cap mensile: {capValue[0]} lezioni
              </label>

              <Slider
                value={capValue}
                onValueChange={setCapValue}
                min={20}
                max={1000}
                step={10}
                className="w-full"
                aria-label="Imposta il cap mensile di lezioni"
              />

              <div className="flex gap-2">
                <Input
                  type="number"
                  value={capValue[0]}
                  onChange={(e) =>
                    setCapValue([parseInt(e.target.value) || 0])
                  }
                  min={20}
                  max={1000}
                  className="h-10 text-sm px-3 w-24 rounded-md border"
                  aria-label="Numero lezioni mensili"
                />
                <Select value={capBehavior} onValueChange={setCapBehavior}>
                  <SelectTrigger
                    className="h-10 text-sm px-3 w-full rounded-md"
                    aria-label="Comportamento al raggiungimento del cap"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pausa automatica">Pausa automatica</SelectItem>
                    <SelectItem value="Chiedi conferma">Chiedi conferma</SelectItem>
                    <SelectItem value="Sforamento fino a +10%">Sforamento +10%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-center">
                <Badge className="bg-orange-50 text-amber-700 border-amber-200">
                  Costo €0.08/lezione
                </Badge>
              </div>
            </div>
          </div>

          {/* Spacer + CTA */}
          <div className="mt-auto" />
          <Button
            variant="outline"
            size="lg"
            className="mt-6 w-full bg-card border border-border rounded-lg"
            onClick={handleGetStarted}
          >
            Inizia — Imposta Cap
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</section>




            {/* Footer */}
            <footer
                id="footer"
                className="snap-start snap-always min-h-screen flex flex-col justify-center bg-foreground text-background py-12 px-4 scroll-mt-16"
            >
                <div className="container mx-auto max-w-6xl text-center">
                    {/* Logo + Descrizione */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Crown className="w-8 h-8 text-yellow-400" />
                            <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Zuno://</span>
                        </div>
                        <p className="text-background/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                            Zuno è il tuo compagno intelligente per l'apprendimento: corsi, coach AI e community
                            in un'unica piattaforma per far crescere le tue competenze ogni giorno.
                        </p>
                    </div>

                    {/* Newsletter */}
                    <div className="bg-background/10 rounded-lg p-6 mb-12 text-center max-w-xl mx-auto">
                        <h3 className="font-bold text-lg mb-2">Iscriviti alla nostra Newsletter</h3>
                        <p className="text-background/70 text-sm mb-4">Aggiornamenti, risorse e consigli gratuiti ogni mese.</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                            <Input 
                                type="email" 
                                placeholder="La tua email" 
                                className="bg-white text-foreground flex-1" 
                            />
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white sm:px-6">
                                Iscriviti
                            </Button>
                        </div>
                    </div>

                    {/* Link - Layout responsive migliorato */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12 text-sm max-w-4xl mx-auto justify-items-center items-start">
                        <div className="text-center flex flex-col h-full min-h-[120px]">
                            <h3 className="font-bold text-base mb-3 text-background">Zuno</h3>
                            <ul className="space-y-2 flex-1">
                                <li><a href="#" className="text-background/80 hover:text-blue-400 transition-colors">Chi siamo</a></li>
                                <li><a href="#" className="text-background/80 hover:text-blue-400 transition-colors">Carriere</a></li>
                                <li><a href="#" className="text-background/80 hover:text-blue-400 transition-colors">Blog</a></li>
                            </ul>
                        </div>

                        <div className="text-center flex flex-col h-full min-h-[120px]">
                            <h3 className="font-bold text-base mb-3 text-background">Risorse</h3>
                            <ul className="space-y-2 flex-1">
                                <li><a href="#" className="text-background/80 hover:text-blue-400 transition-colors">Supporto</a></li>
                                <li><a href="#" className="text-background/80 hover:text-blue-400 transition-colors">FAQ</a></li>
                                <li><a href="#" className="text-background/80 hover:text-blue-400 transition-colors">Webinar</a></li>
                            </ul>
                        </div>

                        <div className="text-center flex flex-col h-full min-h-[120px]">
                            <h3 className="font-bold text-base mb-3 text-background">Legale</h3>
                            <ul className="space-y-2 flex-1">
                                <li><a href="#" className="text-background/80 hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-background/80 hover:text-blue-400 transition-colors">Termini di Servizio</a></li>
                                <li><a href="#" className="text-background/80 hover:text-blue-400 transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>

                        <div className="text-center flex flex-col h-full min-h-[120px]">
                            <h3 className="font-bold text-base mb-3 text-background">Connetti</h3>
                            <ul className="space-y-2 flex-1">
                            <a href="#" className="inline-flex items-center gap-2 text-background/80 hover:text-blue-400 transition-colors">
    <Twitter className="w-4 h-4" aria-hidden />
    <span>Twitter / X</span>
  </a>
                                <li>
                                <a href="#" className="inline-flex items-center gap-2 text-background/80 hover:text-blue-400 transition-colors">
    <Instagram className="w-4 h-4" aria-hidden />
    <span>Instagram</span>
  </a>
                                </li>
                                <li>
                                <a href="#" className="inline-flex items-center gap-2 text-background/80 hover:text-blue-400 transition-colors">
    <Linkedin className="w-4 h-4" aria-hidden />
    <span>LinkedIn</span>
  </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="w-full max-w-4xl mx-auto">
                        <div className="border-t border-background/20 pt-6 text-center text-background/80 text-sm">
                            <p>&copy; 2024 Zuno. Tutti i diritti riservati.</p>
                            <p className="mt-2 text-xs">Made with ❤️ in Italy</p>
                        </div>
                    </div>
                </div>
            </footer>

            {showScrollTop && (
                <div className="fixed bottom-6 right-6 z-[9999]">
                    <div className="relative w-14 h-14"> {/* 56x56 wrapper */}
                        {/* anello di progresso dentro il wrapper */}
                        {(() => {
                            const size = 56;       // wrapper
                            const stroke = 3;
                            const radius = (size - stroke) / 2;
                            const circumference = 2 * Math.PI * radius;
                            const offset = circumference * (1 - scrollProgress);

                            return (
                                <svg
                                    className="absolute inset-0 pointer-events-none"
                                    width={size}
                                    height={size}
                                    viewBox={`0 0 ${size} ${size}`}
                                >
                                    <circle
                                        cx={size / 2}
                                        cy={size / 2}
                                        r={radius}
                                        stroke="rgba(0,0,0,0.18)"
                                        strokeWidth={stroke}
                                        fill="none"
                                    />
                                    <circle
                                        cx={size / 2}
                                        cy={size / 2}
                                        r={radius}
                                        stroke="white"
                                        strokeWidth={stroke}
                                        fill="none"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={offset}
                                        strokeLinecap="round"
                                        style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                                    />
                                </svg>
                            );
                        })()}

                        {/* bottone 48x48 centrato */}
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="absolute inset-1 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700"
                            aria-label="Torna su"
                        >
                            <ArrowUp className="mx-auto my-auto" size={20} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            )}

            {/* Video Dialog */}
            <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>{videoTitle}</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video">
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/oznr-1-poSU"
                            title={videoTitle}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-lg"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
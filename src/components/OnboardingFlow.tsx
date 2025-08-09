// Complete onboarding flow with coach selection
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CoachSelection } from '@/components/CoachSelection';
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles, Crown, Users } from 'lucide-react';
import { useZunoManager } from '@/contexts/ZunoManagerContext';
import type { CoachType } from '@/types';

interface OnboardingFlowProps {
  onComplete: (coachType: CoachType) => void;
  isSubmitting?: boolean;
}

type OnboardingStep = 'welcome' | 'coach-selection' | 'preferences' | 'completion';

export function OnboardingFlow({ onComplete, isSubmitting }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [selectedCoach, setSelectedCoach] = useState<CoachType | undefined>();
  const { getWelcomeMessage, getTransitionMessage, managerPersonality } = useZunoManager();

  const steps: Record<OnboardingStep, { title: string; progress: number }> = {
    welcome: { title: 'Benvenuto', progress: 25 },
    'coach-selection': { title: 'Scegli il tuo Coach', progress: 50 },
    preferences: { title: 'Preferenze', progress: 75 },
    completion: { title: 'Completamento', progress: 100 }
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'welcome':
        setCurrentStep('coach-selection');
        break;
      case 'coach-selection':
        if (selectedCoach) {
          setCurrentStep('preferences');
        }
        break;
      case 'preferences':
        setCurrentStep('completion');
        break;
      case 'completion':
        if (selectedCoach) {
          onComplete(selectedCoach);
        }
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'coach-selection':
        setCurrentStep('welcome');
        break;
      case 'preferences':
        setCurrentStep('coach-selection');
        break;
      case 'completion':
        setCurrentStep('preferences');
        break;
    }
  };

  const canProceed = currentStep !== 'coach-selection' || selectedCoach;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Configurazione Iniziale</h1>
            <div className="text-sm text-muted-foreground">
              Passo {Object.keys(steps).indexOf(currentStep) + 1} di {Object.keys(steps).length}
            </div>
          </div>
          <Progress value={steps[currentStep].progress} className="h-2" />
          <div className="mt-2 text-sm font-medium text-muted-foreground">
            {steps[currentStep].title}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 'welcome' && (
          <Card className="text-center py-12">
            <CardHeader>
              {/* Zuno Manager Introduction */}
              <div className="mx-auto mb-6 relative">
                <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-2xl shadow-lg w-fit mx-auto">
                  <Crown className="h-10 w-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <div className="mt-3 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold rounded-full shadow-md w-fit mx-auto">
                  Zuno Manager
                </div>
              </div>
              <CardTitle className="text-3xl mb-2">Benvenuto in Zuno</CardTitle>
              <p className="text-lg text-blue-600 font-medium">{managerPersonality.role}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <p className="text-lg text-muted-foreground italic">
                  "{getWelcomeMessage()}"
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  - {managerPersonality.name}
                </p>
              </div>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {managerPersonality.description}. Ti guiderò nella scelta del coach perfetto per il tuo stile di apprendimento.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="mb-3 p-3 bg-green-100 rounded-full w-fit mx-auto">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Coordinamento Intelligente</h3>
                  <p className="text-sm text-muted-foreground">
                    Supervisiono tutti i coach per la tua esperienza ottimale
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-3 p-3 bg-orange-100 rounded-full w-fit mx-auto">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Quattro Coach Specializzati</h3>
                  <p className="text-sm text-muted-foreground">
                    Ogni coach ha competenze uniche per diversi stili di apprendimento
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-3 p-3 bg-purple-100 rounded-full w-fit mx-auto">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Esperienza Personalizzata</h3>
                  <p className="text-sm text-muted-foreground">
                    Adatto ogni aspetto alle tue esigenze specifiche
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'coach-selection' && (
          <div className="space-y-6">
            {/* Zuno Manager Introduction to Coaches */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-2">Zuno Manager ti presenta i tuoi Coach</h3>
                    <p className="text-sm text-blue-700">
                      Ho selezionato quattro coach specializzati, ognuno con un approccio unico all'apprendimento. 
                      Scegli quello che risuona di più con il tuo stile, potrai sempre cambiare in seguito.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <CoachSelection 
              onCoachSelect={setSelectedCoach}
              selectedCoach={selectedCoach}
            />
          </div>
        )}

        {currentStep === 'preferences' && selectedCoach && (
          <Card className="p-8">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl">→</div>
                <div className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl">Perfetta scelta!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                <p className="text-lg text-green-700 italic mb-2">
                  "{getTransitionMessage(null, selectedCoach)}"
                </p>
                <p className="text-sm text-muted-foreground">
                  - Zuno Manager
                </p>
              </div>
              
              <p className="text-lg text-muted-foreground">
                Ora coordinerò la tua esperienza con Coach {selectedCoach.charAt(0).toUpperCase() + selectedCoach.slice(1)}. 
                Insieme creeremo il percorso di apprendimento perfetto per te.
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Come coordinerò la tua esperienza:</h3>
                <ul className="text-left space-y-3 max-w-md mx-auto">
                  <li className="flex items-start gap-3">
                    <Crown className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Supervisionerò ogni sessione per garantire qualità ottimale</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Crown className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Coordinerò il tuo coach per adattarsi alle tue esigenze</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Crown className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Monitorerò i progressi e suggerirò ottimizzazioni</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Crown className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Sarò sempre disponibile per supporto e guidance</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'completion' && selectedCoach && (
          <Card className="p-8 text-center">
            <CardHeader>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-blue-500 rounded-full">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl">Sistema Coordinato Attivo!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Crown className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Messaggio da Zuno Manager</span>
                </div>
                <p className="text-lg text-blue-700 italic">
                  "Perfetto! Ho configurato il sistema di coordinamento con Coach {selectedCoach.charAt(0).toUpperCase() + selectedCoach.slice(1)}. 
                  Sono qui per assicurarmi che tu abbia sempre la migliore esperienza di apprendimento possibile."
                </p>
              </div>
              
              <p className="text-lg text-muted-foreground">
                Il tuo ambiente di apprendimento coordinato è ora attivo. Zuno Manager supervisiona ogni aspetto 
                mentre Coach {selectedCoach.charAt(0).toUpperCase() + selectedCoach.slice(1)} ti guida nel percorso.
              </p>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Il tuo team di apprendimento è pronto:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <Crown className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-blue-900">Zuno Manager</h4>
                    <p className="text-xs text-muted-foreground">Coordinamento e supervisione</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-green-900">Coach {selectedCoach.charAt(0).toUpperCase() + selectedCoach.slice(1)}</h4>
                    <p className="text-xs text-muted-foreground">Guida personalizzata</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 'welcome'}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Indietro
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed || isSubmitting}
            className="flex items-center gap-2"
          >
            {currentStep === 'completion' ? (
              isSubmitting ? 'Finalizzazione...' : 'Inizia l\'apprendimento'
            ) : (
              <>
                Avanti
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
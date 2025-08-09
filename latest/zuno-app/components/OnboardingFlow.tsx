// Complete onboarding flow with coach selection
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CoachSelection } from '@/components/CoachSelection';
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import type { CoachType } from '@/types';

interface OnboardingFlowProps {
  onComplete: (coachType: CoachType) => void;
  isSubmitting?: boolean;
}

type OnboardingStep = 'welcome' | 'coach-selection' | 'preferences' | 'completion';

export function OnboardingFlow({ onComplete, isSubmitting }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [selectedCoach, setSelectedCoach] = useState<CoachType | undefined>();

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
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-3xl">Benvenuto in LearnDaily Pro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Un'esperienza di apprendimento personalizzata progettata per professionisti come te. 
                Ti guideremo nella configurazione del tuo ambiente di apprendimento ideale.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="mb-3 p-3 bg-green-100 rounded-full w-fit mx-auto">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Personalizzato</h3>
                  <p className="text-sm text-muted-foreground">
                    Adattato al tuo stile di apprendimento
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-3 p-3 bg-orange-100 rounded-full w-fit mx-auto">
                    <CheckCircle className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Professionale</h3>
                  <p className="text-sm text-muted-foreground">
                    Contenuti di qualità per il tuo sviluppo
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-3 p-3 bg-purple-100 rounded-full w-fit mx-auto">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Efficace</h3>
                  <p className="text-sm text-muted-foreground">
                    Risultati misurabili in tempi ottimali
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'coach-selection' && (
          <CoachSelection 
            onCoachSelect={setSelectedCoach}
            selectedCoach={selectedCoach}
          />
        )}

        {currentStep === 'preferences' && selectedCoach && (
          <Card className="p-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Ottimo! Hai scelto Coach {selectedCoach.charAt(0).toUpperCase() + selectedCoach.slice(1)}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-lg text-muted-foreground">
                Il tuo coach personalizzerà l'esperienza in base alle tue esigenze. 
                Potrai sempre modificare queste impostazioni in seguito.
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Cosa succederà ora:</h3>
                <ul className="text-left space-y-3 max-w-md mx-auto">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">L'interfaccia si adatterà al tuo stile di apprendimento</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Riceverai contenuti personalizzati e consigli mirati</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Il tuo coach ti accompagnerà in ogni sessione di studio</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'completion' && selectedCoach && (
          <Card className="p-8 text-center">
            <CardHeader>
              <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-3xl">Tutto pronto!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground">
                La tua esperienza di apprendimento personalizzata è stata configurata con successo.
              </p>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">Il tuo Coach {selectedCoach.charAt(0).toUpperCase() + selectedCoach.slice(1)} ti aspetta!</h3>
                <p className="text-sm text-muted-foreground">
                  Inizia subito il tuo percorso di apprendimento con lezioni personalizzate.
                </p>
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

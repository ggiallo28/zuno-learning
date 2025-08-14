import { Suspense, lazy } from "react";
import { CoursePageData } from "./types";
import { Button } from "@/components/ui/button";
import { CourseHero } from "./parts/CourseHero";
import { InfoBar } from "./parts/InfoBar";
import { CourseOverviewCard } from "./parts/CourseOverviewCard";
import { VideoCard } from "./parts/VideoCard";
import { LearningOutcomesCard } from "./parts/LearningOutcomesCard";
import { AudienceCard } from "./parts/AudienceCard";
import { PrerequisitesCard } from "./parts/PrerequisitesCard";
import { CourseFactsCard } from "./parts/CourseFactsCard";
import { LanguagesCard } from "./parts/LanguagesCard";
import { FAQAccordion } from "./parts/FAQAccordion";
import { RelatedCoursesRow } from "./parts/RelatedCoursesRow";
import { StickyEnrollBar } from "./parts/StickyEnrollBar";

// Lazy load heavy components
const SyllabusAccordion = lazy(() => import("./parts/SyllabusAccordion").then(module => ({ default: module.SyllabusAccordion })));

interface CoursePageProps {
  data: CoursePageData;
}

export default function CoursePage({ data }: CoursePageProps) {
  const handlePrimaryAction = () => {
    console.log("Trova un corso clicked");
    // Handle primary CTA
  };

  const handleSecondaryAction = () => {
    console.log("Richiedi corso team clicked");
    // Handle secondary CTA
  };

  const handleTertiaryAction = () => {
    console.log("Contatta esperto clicked");
    // Handle tertiary CTA
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 1. HERO SECTION */}
      <CourseHero
        title={data.title}
        tagline={data.tagline}
        level={data.level}
        deliveryMode={data.deliveryMode}
        formatLabel={data.formatLabel}
        duration={data.duration}
        onPrimary={handlePrimaryAction}
        onSecondary={handleSecondaryAction}
        onTertiary={handleTertiaryAction}
      />

      {/* INFO BAR (Optional) */}
      {data.infoBanner && (
        <div className="container max-w-6xl mx-auto px-6">
          <InfoBar message={data.infoBanner} />
        </div>
      )}

      <main className="container max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* 2. OVERVIEW STRIP */}
        <section className="grid md:grid-cols-[2fr,1fr] gap-8 items-start">
          <CourseOverviewCard overview={data.overview} />
          <VideoCard 
            video={data.video} 
            caption="Testa le tue abilità per operare nel cloud"
          />
        </section>

        {/* 3. FOUR KEY CARDS */}
        <section className="grid md:grid-cols-[2fr,1fr] gap-8 items-start">
          <div className="space-y-6">
            <LearningOutcomesCard items={data.learningOutcomes} />
            <AudienceCard items={data.audience} />
            <PrerequisitesCard items={data.prerequisites} />
          </div>
          <div className="space-y-6">
            <CourseFactsCard
              level={data.level}
              deliveryMode={data.deliveryMode}
              duration={data.duration}
              examAlignment={data.examAlignment}
            />
            <LanguagesCard languages={data.languages} />
          </div>
        </section>

        {/* 4. EXTRA SECTIONS */}
        {data.syllabus && data.syllabus.length > 0 && (
          <section>
            <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-2xl" />}>
              <SyllabusAccordion modules={data.syllabus} />
            </Suspense>
          </section>
        )}

        {data.faqs && data.faqs.length > 0 && (
          <section>
            <FAQAccordion faqs={data.faqs} />
          </section>
        )}

        {data.relatedCourses && data.relatedCourses.length > 0 && (
          <section>
            <RelatedCoursesRow items={data.relatedCourses} />
          </section>
        )}

        {/* Date/Location Selector Placeholder */}
        <section id="selettore-date-sedi" className="scroll-mt-24">
          <div className="bg-muted/50 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Seleziona date e sedi</h2>
            <p className="text-muted-foreground mb-6">
              Qui apparirà il selettore per date e location del corso
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handlePrimaryAction}>
                Trova un corso
              </Button>
              <Button variant="outline" size="lg" onClick={handleSecondaryAction}>
                Richiedi un corso per il tuo team
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* 5. STICKY ENROLL BAR */}
      <StickyEnrollBar
        title={data.title}
        level={data.level}
        deliveryMode={data.deliveryMode}
        formatLabel={data.formatLabel}
        duration={data.duration}
        onPrimary={handlePrimaryAction}
        onSecondary={handleSecondaryAction}
      />
    </div>
  );
}

// Mock data for testing
export const mockCourse: CoursePageData = {
  title: "Progettare su AWS",
  tagline: "Impara a progettare soluzioni scalabili e sicure nel cloud AWS con questo corso intensivo guidato da esperti.",
  overview: "Questo corso ti fornirà le competenze essenziali per progettare architetture cloud robuste su Amazon Web Services. Attraverso scenari pratici e case study reali, imparerai a bilanciare costi, performance e sicurezza nelle tue soluzioni cloud.",
  level: "Intermedio",
  deliveryMode: "Instructor-led",
  formatLabel: "3 giorni",
  duration: "24 ore",
  infoBanner: "🎯 Corso disponibile anche in modalità virtuale - Prossime sessioni: 15-17 Febbraio e 8-10 Marzo",
  video: {
    title: "Anteprima del corso Progettare su AWS",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  learningOutcomes: [
    "Progettare architetture cloud scalabili e fault-tolerant su AWS",
    "Implementare strategie di sicurezza e compliance per ambienti cloud",
    "Ottimizzare costi e performance delle risorse AWS",
    "Configurare soluzioni di backup, disaster recovery e alta disponibilità",
    "Integrare servizi AWS per soluzioni enterprise complesse",
    "Applicare best practice per il monitoraggio e troubleshooting",
    "Valutare e selezionare i servizi AWS più adatti per specifici use case",
    "Implementare strategie di migrazione dal on-premise al cloud"
  ],
  audience: [
    "Architetti di soluzioni e system architect",
    "Cloud engineer e DevOps engineer con esperienza base",
    "Sviluppatori che lavorano su applicazioni cloud-native",
    "IT manager e team lead responsabili di progetti cloud",
    "Professionisti che vogliono ottenere la certificazione AWS Solutions Architect",
    "Consulenti tecnici che supportano clienti nelle migrazioni cloud"
  ],
  prerequisites: [
    "Conoscenza di base dei servizi cloud AWS (EC2, S3, VPC)",
    "Esperienza con sistemi Linux/Windows e networking fondamentale",
    "Familiarità con concetti di virtualizzazione e containerization",
    "Nozioni di programmazione/scripting (Python, Bash, PowerShell)",
    "Comprensione di architetture web e database relazionali",
    "Esperienza nella gestione di infrastrutture IT (consigliata)",
    "Certificazione AWS Cloud Practitioner (opzionale ma raccomandata)",
    "Almeno 1 anno di esperienza lavorativa con tecnologie cloud"
  ],
  languages: ["Italiano", "English"],
  examAlignment: "AWS Certified Solutions Architect - Associate",
  syllabus: [
    {
      title: "Giorno 1: Fondamenti di architettura AWS",
      bullets: [
        "Principi di progettazione cloud-native e well-architected framework",
        "Servizi core AWS: Compute, Storage, Database, Networking",
        "Progettazione di VPC, subnetting e strategie di connettività",
        "Implementazione di soluzioni di identity and access management (IAM)"
      ]
    },
    {
      title: "Giorno 2: Scalabilità, performance e sicurezza",
      bullets: [
        "Auto Scaling Groups, Load Balancers e strategie di distribuzione",
        "Ottimizzazione delle performance con CloudFront e caching",
        "Implementazione di sicurezza a più livelli e encryption",
        "Monitoraggio e logging con CloudWatch, CloudTrail e X-Ray"
      ]
    },
    {
      title: "Giorno 3: Casi d'uso avanzati e best practice",
      bullets: [
        "Architetture serverless con Lambda, API Gateway e DynamoDB",
        "Strategie di backup, disaster recovery e business continuity",
        "Ottimizzazione costi e governance con AWS Organizations",
        "Workshop pratico: progettazione di un'architettura enterprise completa"
      ]
    }
  ],
  faqs: [
    {
      q: "È necessaria esperienza precedente con AWS?",
      a: "Sì, consigliamo una conoscenza di base dei servizi AWS principali. Se sei completamente nuovo ad AWS, ti suggeriamo di frequentare prima il corso 'AWS Cloud Practitioner Essentials'."
    },
    {
      q: "Il corso include materiali di studio e lab practice?",
      a: "Assolutamente! Riceverai accesso a materiali digitali, lab guidati su ambiente AWS sandbox e 30 giorni di accesso post-corso alla piattaforma di practice."
    },
    {
      q: "Quanto è valida la preparazione per l'esame di certificazione?",
      a: "Il corso copre circa l'80% degli argomenti dell'esame AWS Solutions Architect Associate. Ti forniremo anche una simulazione d'esame e suggerimenti per lo studio aggiuntivo."
    },
    {
      q: "Posso frequentare il corso in modalità virtuale?",
      a: "Sì, offriamo il corso sia in presenza che in modalità virtual classroom con lo stesso curriculum e livello di interazione con l'istruttore."
    }
  ],
  relatedCourses: [
    { title: "AWS Cloud Practitioner Essentials", url: "/corsi/aws-cloud-practitioner" },
    { title: "DevOps Engineering su AWS", url: "/corsi/devops-aws" },
    { title: "Security Engineering su AWS", url: "/corsi/security-aws" }
  ]
};

// React Router integration example (commented)
// import { lazy } from "react";
// const CoursePage = lazy(() => import("@/components/course/CoursePage"));
// <Route path="/corsi/progettare-su-aws" element={<CoursePage data={mockCourse}
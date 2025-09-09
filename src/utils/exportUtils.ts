import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import type { ProgressData, ExportOptions, ManualLearningEntry } from '@/components/progress/ProgressDashboard';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export class ProgressExporter {
  private data: ProgressData;
  private options: ExportOptions;

  constructor(data: ProgressData, options: ExportOptions) {
    this.data = data;
    this.options = options;
  }

  async exportToPDF(): Promise<void> {
    const doc = new jsPDF();
    let yPosition = 20;

    // Header
    doc.setFontSize(24);
    doc.setTextColor(59, 130, 246); // Blue color
    doc.text('Portfolio di Apprendimento', 20, yPosition);
    
    yPosition += 10;
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128); // Gray color
    doc.text(`Generato il ${format(new Date(), 'PPP', { locale: it })}`, 20, yPosition);
    
    yPosition += 20;

    // User Info Section
    if (this.options.privacy !== 'professional') {
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Informazioni Profilo', 20, yPosition);
      yPosition += 15;

      const userInfo = [
        ['Nome Utente', this.data.user.fullName || this.data.user.username || 'N/A'],
        ['Livello Attuale', this.data.xpData.level.toString()],
        ['XP Totali', this.data.xpData.total.toString()],
        ['Streak Corrente', `${this.data.streakData.current} giorni`],
        ['Streak Massimo', `${this.data.streakData.longest} giorni`]
      ];

      doc.autoTable({
        startY: yPosition,
        head: [['Campo', 'Valore']],
        body: userInfo,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: 20, right: 20 }
      });

      yPosition = (doc as any).lastAutoTable.finalY + 20;
    }

    // Skills Section
    if (this.options.includeSkillMap && this.data.skillStats.length > 0) {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Competenze Acquisite', 20, yPosition);
      yPosition += 15;

      const skillsData = this.data.skillStats
        .sort((a, b) => b.pct - a.pct)
        .map(skill => [
          skill.tag.charAt(0).toUpperCase() + skill.tag.slice(1),
          `${Math.round(skill.pct)}%`,
          this.getMasteryLevel(skill.pct),
          skill.attempts?.toString() || 'N/A'
        ]);

      doc.autoTable({
        startY: yPosition,
        head: [['Competenza', 'Padronanza', 'Livello', 'Tentativi']],
        body: skillsData,
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] },
        margin: { left: 20, right: 20 },
        columnStyles: {
          1: { halign: 'center' },
          2: { halign: 'center' },
          3: { halign: 'center' }
        }
      });

      yPosition = (doc as any).lastAutoTable.finalY + 20;
    }

    // Courses Section
    if (this.data.learningProgress.length > 0) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.text('Progressi nei Corsi', 20, yPosition);
      yPosition += 15;

      const coursesData = this.data.learningProgress
        .filter(progress => progress.completionPercentage > 0)
        .sort((a, b) => b.completionPercentage - a.completionPercentage)
        .map(progress => [
          progress.courseName || `Corso ${progress.courseId}`,
          `${progress.completionPercentage}%`,
          progress.xpEarned?.toString() || '0',
          Math.round((progress.timeSpent || 0) / 60).toString() + 'h'
        ]);

      if (coursesData.length > 0) {
        doc.autoTable({
          startY: yPosition,
          head: [['Corso', 'Completamento', 'XP', 'Tempo']],
          body: coursesData,
          theme: 'grid',
          headStyles: { fillColor: [139, 92, 246] },
          margin: { left: 20, right: 20 },
          columnStyles: {
            1: { halign: 'center' },
            2: { halign: 'center' },
            3: { halign: 'center' }
          }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 20;
      }
    }

    // Manual Entries Section
    if (this.options.includeManualEntries && this.data.manualEntries.length > 0) {
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.text('Apprendimenti Esterni', 20, yPosition);
      yPosition += 15;

      const filteredEntries = this.filterEntriesByDate(this.data.manualEntries);
      const entriesData = filteredEntries
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
        .map(entry => [
          entry.title,
          entry.source,
          entry.category,
          format(new Date(entry.completedAt), 'dd/MM/yyyy'),
          entry.duration ? `${entry.duration} min` : 'N/A'
        ]);

      if (entriesData.length > 0) {
        doc.autoTable({
          startY: yPosition,
          head: [['Titolo', 'Fonte', 'Categoria', 'Data', 'Durata']],
          body: entriesData,
          theme: 'grid',
          headStyles: { fillColor: [245, 158, 11] },
          margin: { left: 20, right: 20 },
          columnStyles: {
            3: { halign: 'center' },
            4: { halign: 'center' }
          }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 20;
      }
    }

    // Certificates Section
    if (this.options.includeCertificates) {
      const certificatesEntries = this.data.manualEntries.filter(entry => entry.certificateUrl);
      
      if (certificatesEntries.length > 0) {
        if (yPosition > 200) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(16);
        doc.text('Certificazioni', 20, yPosition);
        yPosition += 15;

        const certificatesData = certificatesEntries.map(entry => [
          entry.title,
          entry.source,
          format(new Date(entry.completedAt), 'dd/MM/yyyy'),
          entry.certificateUrl || ''
        ]);

        doc.autoTable({
          startY: yPosition,
          head: [['Certificazione', 'Ente', 'Data', 'URL']],
          body: certificatesData,
          theme: 'grid',
          headStyles: { fillColor: [239, 68, 68] },
          margin: { left: 20, right: 20 },
          columnStyles: {
            2: { halign: 'center' }
          }
        });
      }
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text(
        `Pagina ${i} di ${pageCount} - Generato da Zuno Learning Platform`,
        20,
        doc.internal.pageSize.height - 10
      );
    }

    // Save the PDF
    const fileName = `portfolio-apprendimento-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    doc.save(fileName);
  }

  async exportToJSON(): Promise<void> {
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        exportOptions: this.options,
        version: '1.0'
      },
      user: this.options.privacy === 'professional' ? {
        fullName: this.data.user.fullName,
        username: this.data.user.username
      } : this.data.user,
      courses: this.data.courses,
      learningProgress: this.data.learningProgress,
      skillStats: this.data.skillStats,
      manualEntries: this.options.includeManualEntries 
        ? this.filterEntriesByDate(this.data.manualEntries)
        : [],
      streakData: this.options.privacy === 'professional' ? null : this.data.streakData,
      xpData: this.options.privacy === 'professional' ? null : this.data.xpData
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `dati-apprendimento-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async exportToCSV(): Promise<void> {
    let csvContent = '';

    // Skills CSV
    if (this.options.includeSkillMap && this.data.skillStats.length > 0) {
      csvContent += 'COMPETENZE\n';
      csvContent += 'Competenza,Padronanza (%),Livello,Tentativi,Ultima Attività\n';
      
      this.data.skillStats
        .sort((a, b) => b.pct - a.pct)
        .forEach(skill => {
          csvContent += `"${skill.tag}",${skill.pct},"${this.getMasteryLevel(skill.pct)}",${skill.attempts || 0},"${skill.lastAttempted ? format(skill.lastAttempted, 'dd/MM/yyyy') : 'N/A'}"\n`;
        });
      
      csvContent += '\n';
    }

    // Courses CSV
    if (this.data.learningProgress.length > 0) {
      csvContent += 'CORSI\n';
      csvContent += 'Nome Corso,Completamento (%),XP Guadagnati,Tempo Speso (ore),Ultimo Accesso\n';
      
      this.data.learningProgress
        .filter(progress => progress.completionPercentage > 0)
        .forEach(progress => {
          csvContent += `"${progress.courseName || progress.courseId}",${progress.completionPercentage},${progress.xpEarned || 0},${Math.round((progress.timeSpent || 0) / 60)},"${progress.lastAccessedAt ? format(new Date(progress.lastAccessedAt), 'dd/MM/yyyy') : 'N/A'}"\n`;
        });
      
      csvContent += '\n';
    }

    // Manual Entries CSV
    if (this.options.includeManualEntries && this.data.manualEntries.length > 0) {
      csvContent += 'APPRENDIMENTI ESTERNI\n';
      csvContent += 'Titolo,Fonte,Categoria,Data Completamento,Durata (min),Competenze,Note\n';
      
      const filteredEntries = this.filterEntriesByDate(this.data.manualEntries);
      filteredEntries.forEach(entry => {
        const skills = entry.skills ? entry.skills.join('; ') : '';
        const notes = this.options.privacy === 'professional' ? '' : (entry.notes || '');
        csvContent += `"${entry.title}","${entry.source}","${entry.category}","${format(new Date(entry.completedAt), 'dd/MM/yyyy')}",${entry.duration || 0},"${skills}","${notes}"\n`;
      });
    }

    // Create and download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `dati-apprendimento-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private getMasteryLevel(percentage: number): string {
    if (percentage >= 80) return 'Esperto';
    if (percentage >= 60) return 'Competente';
    if (percentage >= 40) return 'In Sviluppo';
    return 'Principiante';
  }

  private filterEntriesByDate(entries: ManualLearningEntry[]): ManualLearningEntry[] {
    if (!this.options.dateRange) return entries;

    const { start, end } = this.options.dateRange;
    return entries.filter(entry => {
      const entryDate = new Date(entry.completedAt);
      if (start && entryDate < start) return false;
      if (end && entryDate > end) return false;
      return true;
    });
  }
}

// Utility function to export progress data
export async function exportProgressData(
  data: ProgressData, 
  format: 'pdf' | 'json' | 'csv', 
  options: ExportOptions
): Promise<void> {
  const exporter = new ProgressExporter(data, options);
  
  switch (format) {
    case 'pdf':
      await exporter.exportToPDF();
      break;
    case 'json':
      await exporter.exportToJSON();
      break;
    case 'csv':
      await exporter.exportToCSV();
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

// Utility function to generate a professional portfolio summary
export function generatePortfolioSummary(data: ProgressData): string {
  const completedCourses = data.learningProgress.filter(p => p.completionPercentage === 100).length;
  const masteredSkills = data.skillStats.filter(s => s.pct >= 80).length;
  const certificates = data.manualEntries.filter(e => e.certificateUrl).length;
  const totalLearningHours = Math.round(
    (data.learningProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0) +
     data.manualEntries.reduce((sum, e) => sum + (e.duration || 0), 0)) / 60
  );

  return `Professionista dell'apprendimento continuo con ${completedCourses} corsi completati, ${masteredSkills} competenze padroneggiati, ${certificates} certificazioni conseguite e oltre ${totalLearningHours} ore di formazione documentata. Impegnato nello sviluppo professionale attraverso una combinazione di formazione formale e apprendimento autodiretto.`;
}
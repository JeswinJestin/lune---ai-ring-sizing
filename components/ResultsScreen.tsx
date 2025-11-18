

import React from 'react';
import type { MeasurementResult } from '../types';
import { Button } from './Button';
import { DownloadIcon } from './icons/UtilIcons';

// A trick to make jspdf available on the window object for TypeScript
declare global {
  interface Window {
    jspdf: any;
  }
}

interface ResultsScreenProps {
  result: MeasurementResult;
  onMeasureAgain: () => void;
  onTryOn: () => void;
  onViewRecommendations: () => void;
}

export const ResultsScreen = ({ result, onMeasureAgain, onTryOn, onViewRecommendations }: ResultsScreenProps) => {
  const { ringSize, confidence, fingerCircumference_mm, fingerDiameter_mm } = result;

  const getConfidenceDetails = () => {
    if (confidence >= 90) {
      return {
        level: 'Excellent',
        color: 'bg-success',
        textColor: 'text-success',
      };
    } else if (confidence >= 75) {
      return {
        level: 'Good',
        color: 'bg-warning',
        textColor: 'text-warning',
      };
    } else {
      return {
        level: 'Fair',
        color: 'bg-error',
        textColor: 'text-error',
      };
    }
  };

  const { level: confidenceLevel, color: confidenceColor } = getConfidenceDetails();

  const handleDownloadReport = () => {
    if (!window.jspdf) {
      alert("PDF generation library is not available. Please try again later.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('LUNE Ring Size Report', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${today}`, doc.internal.pageSize.getWidth() - 15, 20, { align: 'right' });
    doc.setFontSize(12);
    doc.text('Your AI-Powered Result', 15, 40);
    doc.setFontSize(48);
    doc.setFont('helvetica', 'bold');
    doc.text(`US ${ringSize.us}`, 15, 60);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Confidence Score: ${confidence}% (${confidenceLevel})`, 15, 75);
    doc.setLineWidth(0.5);
    doc.line(15, 85, doc.internal.pageSize.getWidth() - 15, 85);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('International Size Conversions', 15, 100);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const sizeData = [
      ['UK Size:', `${ringSize.uk}`],
      ['EU Size:', `${ringSize.eu}`],
      ['Diameter:', `${fingerDiameter_mm.toFixed(1)} mm`],
      ['Circumference:', `${fingerCircumference_mm.toFixed(1)} mm`],
    ];
    let startY = 110;
    sizeData.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, startY);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 60, startY);
      startY += 10;
    });
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Thank you for using LUNE.', doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 15, { align: 'center' });
    doc.save('LUNE_Ring_Size_Report.pdf');
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 text-center animate-[fadeInUp_0.5s_ease-out]">
        <div className="bg-midnight-500/50 backdrop-blur-lg border border-platinum-300/10 rounded-3xl shadow-2xl p-8 sm:p-12">
            <h2 className="font-display text-2xl text-silver-300 mb-2">Your AI-Powered Result</h2>
            <p className="font-display text-display-xl sm:text-display-2xl text-silver-50 font-light tracking-tighter">
              {`US ${ringSize.us}`}
            </p>
            
            <div className="mt-8 px-4 sm:px-8">
              <div className="flex justify-between items-center mb-2 text-sm font-medium">
                <span className="text-silver-300">{confidenceLevel} Confidence</span>
                <span className="font-mono text-silver-300">{confidence}%</span>
              </div>
              <div className="w-full bg-midnight-400/70 rounded-full h-1.5">
                <div 
                  className={`${confidenceColor} h-1.5 rounded-full`} 
                  style={{ width: `${confidence}%` }}
                  role="progressbar"
                ></div>
              </div>
            </div>
            
            <div className="my-12 h-px bg-gradient-to-r from-transparent via-platinum-300/20 to-transparent"></div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-silver-300 font-mono">
                <div>
                    <div className="text-xs text-silver-400 uppercase tracking-wider">UK Size</div>
                    <div className="text-3xl font-medium text-silver-100">{ringSize.uk}</div>
                </div>
                <div>
                    <div className="text-xs text-silver-400 uppercase tracking-wider">EU Size</div>
                    <div className="text-3xl font-medium text-silver-100">{ringSize.eu}</div>
                </div>
                <div>
                    <div className="text-xs text-silver-400 uppercase tracking-wider">Diameter</div>
                    <div className="text-3xl font-medium text-silver-100">{fingerDiameter_mm.toFixed(1)}<span className="text-lg ml-1">mm</span></div>
                </div>
                <div>
                    <div className="text-xs text-silver-400 uppercase tracking-wider">Circumference</div>
                    <div className="text-3xl font-medium text-silver-100">{fingerCircumference_mm.toFixed(1)}<span className="text-lg ml-1">mm</span></div>
                </div>
            </div>

             <div className="mt-12 flex flex-wrap justify-center items-center gap-4">
                <Button onClick={onViewRecommendations} variant="secondary">
                    View Ring Styles
                </Button>
                <Button onClick={onTryOn} variant="secondary" className="border-platinum-300/60 bg-platinum-300/10">
                    Try On Rings (AR)
                </Button>
                <Button onClick={handleDownloadReport} variant="ghost">
                    <DownloadIcon className="inline-block mr-2 -ml-1 h-5 w-5" />
                    Download Report
                </Button>
                <Button onClick={onMeasureAgain} variant="ghost">
                    Measure Again
                </Button>
            </div>
        </div>
    </div>
  );
};

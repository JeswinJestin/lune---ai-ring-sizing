
import React from 'react';
import { Button } from './Button';
import { DownloadIcon } from './icons/UtilIcons';
import { RING_SIZE_TABLE } from '../lib/sizeConversion';

interface PrintableSizerProps {
  onBack: () => void;
}

declare global {
  interface Window {
    jspdf: any;
  }
}

export const PrintableSizer = ({ onBack }: PrintableSizerProps) => {

    const handleDownload = () => {
        if (!window.jspdf) {
            alert("PDF generation library is not available. Please try again later.");
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;

        // --- Brand Header ---
        const addHeader = (pageNumber: number) => {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(24);
            doc.text('LUNE', margin, margin + 5);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text('Printable Ring Sizer', margin, margin + 12);
            doc.text(`Page ${pageNumber}`, pageWidth - margin, margin + 5, { align: 'right' });
            doc.setDrawColor(200, 200, 200);
            doc.line(margin, margin + 18, pageWidth - margin, margin + 18);
        };
        
        // --- Page 1: Instructions & Scale Check ---
        addHeader(1);
        let yPos = margin + 30;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Step 1: Print & Verify Scale', margin, yPos);
        yPos += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text("To ensure an accurate measurement, it is crucial to print this guide correctly.", margin, yPos);
        yPos += 6;
        doc.text("1. In your printer settings, make sure 'Page Scaling' is set to '100%' or 'Actual Size'.", margin + 5, yPos);
        yPos += 6;
        doc.text("2. Do not use 'Fit to Page' or any other scaling option.", margin + 5, yPos);
        yPos += 10;
        doc.text("3. After printing, verify the scale by placing a standard credit card in the box below.", margin + 5, yPos);
        yPos += 6;
        doc.text("   The outline should perfectly match the edges of your card.", margin + 5, yPos);
        yPos += 15;

        // Credit Card Scale Box
        doc.setDrawColor(50, 50, 70);
        doc.setLineWidth(0.5);
        doc.rect(margin, yPos, 85.6, 53.98); // Standard credit card size in mm
        doc.setTextColor(150, 150, 150);
        doc.text('Place Credit Card Here to Verify Scale', margin + 85.6 / 2, yPos + 53.98 / 2, { align: 'center' });
        doc.setTextColor(0, 0, 0);
        yPos += 70;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Step 2: Use the Cutout Sizer', margin, yPos);
        yPos += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text("1. Carefully cut out the sizer on the next page, including the small slit marked 'A'.", margin + 5, yPos);
        yPos += 6;
        doc.text("2. Wrap the sizer around the base of your ring finger, with the numbers facing out.", margin + 5, yPos);
        yPos += 6;
        doc.text("3. Push the pointed end through the slit 'A'.", margin + 5, yPos);
        yPos += 6;
        doc.text("4. Pull it until it is snug but can still slide over your knuckle. The number that the", margin + 5, yPos);
        yPos += 6;
        doc.text("   arrow points to is your US ring size.", margin + 5, yPos);

        // --- Page 2: Sizer & Chart ---
        doc.addPage();
        addHeader(2);
        yPos = margin + 30;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Cutout Ring Sizer', margin, yPos);
        yPos += 10;
        
        // Draw the sizer strip
        doc.setDrawColor(0,0,0);
        doc.setLineWidth(0.2);
        doc.rect(margin, yPos, 120, 15);
        doc.text('A', margin + 2, yPos + 9);
        doc.line(margin + 5, yPos, margin + 5, yPos + 15); // Slit line

        doc.setFontSize(8);
        for (let i = 0; i <= 13; i++) {
            const x = margin + 20 + (i * 7);
            doc.line(x, yPos, x, yPos + 10);
            doc.text(String(i + 3), x - 1, yPos + 14);
        }
        yPos += 30;
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('International Ring Size Chart', margin, yPos);
        yPos += 10;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        const headers = ['US Size', 'UK Size', 'EU Size', 'Diameter (mm)', 'Circumference (mm)'];
        const colWidths = [25, 25, 25, 35, 45];
        let currentX = margin;
        headers.forEach((header, i) => {
            doc.text(header, currentX, yPos);
            currentX += colWidths[i];
        });
        yPos += 5;
        doc.setLineWidth(0.5);
        doc.line(margin, yPos-2, pageWidth - margin, yPos-2);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        RING_SIZE_TABLE.forEach(size => {
           currentX = margin;
           const row = [size.us, size.uk, size.eu, size.diameter_mm.toFixed(1), size.circumference_mm.toFixed(1)];
           row.forEach((cell, i) => {
             doc.text(String(cell), currentX, yPos);
             currentX += colWidths[i];
           });
           yPos += 6;
           if (yPos > pageHeight - 20) {
             doc.addPage();
             addHeader(doc.internal.getNumberOfPages());
             yPos = margin + 30;
           }
        });

        doc.save('LUNE_Printable_Ring_Sizer.pdf');
    }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 text-center animate-[fadeInUp_0.5s_ease-out]">
      <h2 className="font-display text-display-md md:text-display-lg text-silver-100 mb-4">Printable Ring Sizer</h2>
      <p className="text-lg text-silver-400 mb-8">For a traditional measurement, use our printable guide. Follow the steps below for an accurate result.</p>
      
      <div className="bg-midnight-500/50 border border-platinum-300/10 rounded-2xl p-8 text-left space-y-6">
        <div>
            <h3 className="font-semibold text-xl text-silver-100 mb-2 flex items-center"><span className="font-display text-3xl text-bronze-400 mr-4">1</span>Download & Print</h3>
            <p className="text-silver-400 pl-10">Click the button below to download the PDF. When printing, ensure that the page scaling is set to "100%" or "Actual Size" to maintain accuracy.</p>
        </div>
        <div>
            <h3 className="font-semibold text-xl text-silver-100 mb-2 flex items-center"><span className="font-display text-3xl text-bronze-400 mr-4">2</span>Verify Scale</h3>
            <p className="text-silver-400 pl-10">After printing, use a standard credit card to verify the scale on the first page. Its edges should match the printed outline perfectly.</p>
        </div>
        <div>
            <h3 className="font-semibold text-xl text-silver-100 mb-2 flex items-center"><span className="font-display text-3xl text-bronze-400 mr-4">3</span>Cut & Measure</h3>
            <p className="text-silver-400 pl-10">Carefully cut out the sizer from the second page. Wrap it around your finger to find your size. It should be snug but still able to slide over your knuckle.</p>
        </div>
      </div>

       <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button onClick={onBack} variant="secondary">Back to Methods</Button>
            <Button onClick={handleDownload}>
                <DownloadIcon className="inline-block mr-2 -ml-1 h-5 w-5" />
                Download PDF Guide
            </Button>
       </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/validation';
import './Quote.css';

const Quote = ({ quote, setQuote, polishingPercentage, vatEnabled }) => {
  const [tasks, setTasks] = useState([]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    if (quote) {
      setTasks(quote.tasks);
    }
  }, [quote]);

  if (!quote) return null;

  const handleHoursChange = (index, newHours) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].hours = newHours;
    setTasks(updatedTasks);
  };

  const recalculateQuote = () => {
    if (quote.pricingModel === 'hourly') {
      let totalHours = 0;
      tasks.forEach(task => {
        let taskHours = parseFloat(task.hours) || 0;
        if (quote.partialGroundwork && task.completed) {
          taskHours *= (polishingPercentage / 100);
        }
        if (task.perDocument) {
          taskHours *= quote.numDocuments;
        }
        totalHours += taskHours;
      });

      const finalHours = totalHours * (parseFloat(quote.complexity) || 0);
      let finalCost = finalHours * (parseFloat(quote.hourlyRate) || 0);
      let vatAmount = 0;

      if (quote.vatEnabled) {
        vatAmount = finalCost * 0.15; // 15% VAT
        finalCost += vatAmount;
      }

      setQuote({
        ...quote,
        tasks: tasks,
        finalHours,
        finalCost,
        vatAmount,
      });
    } else {
      // For percentage-based, recalculation is not based on task hours
      // The quote object already contains the calculated values
      // We might just need to update the state to trigger a re-render if needed
      setQuote({ ...quote, tasks: tasks }); // Update tasks if they were somehow modified (though they shouldn't be editable)
    }
  };

  const generatePDF = async () => {
    setIsGeneratingPdf(true);
    try {
      // Dynamically import html2pdf to reduce bundle size
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = document.getElementById('quote-output');
      const opt = {
        margin: [0.8, 0.8, 0.8, 0.8],
        filename: `Quote-${quote.projectName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Project'}-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          removeContainer: true
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      // Add PDF-specific styling
      element.classList.add('pdf-mode');
      
      // Temporarily hide the action buttons
      const actionButtons = element.querySelector('.quote-actions');
      if (actionButtons) actionButtons.style.display = 'none';

      await html2pdf().set(opt).from(element).save();

      // Restore the action buttons and remove PDF styling
      if (actionButtons) actionButtons.style.display = 'flex';
      element.classList.remove('pdf-mode');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    const element = document.getElementById('quote-output');
    const actionButtons = element.querySelector('.quote-actions');
    
    // Temporarily hide the action buttons
    if (actionButtons) actionButtons.style.display = 'none';

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Professional Quote - ${quote.projectName || 'Project'}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body { 
              font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', Arial, sans-serif; 
              line-height: 1.5; 
              color: #1a1a1a; 
              background: #ffffff;
              font-size: 12pt;
            }
            
            .container { 
              max-width: 210mm; 
              margin: 0 auto; 
              padding: 20mm;
              background: #ffffff;
            }
            
            /* Header Styling */
            .quote-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 30pt;
              padding-bottom: 20pt;
              border-bottom: 2pt solid #e5e7eb;
            }
            
            .company-logo {
              flex: 1;
            }
            
            .quote-title {
              text-align: right;
              flex: 1;
            }
            
            .quote-title h1 {
              font-size: 24pt;
              font-weight: 700;
              color: #1f2937;
              margin-bottom: 8pt;
            }
            
            .quote-number {
              font-size: 11pt;
              color: #6b7280;
              font-weight: 500;
            }
            
            /* Grid Layout */
            .info-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 25pt; 
              margin-bottom: 30pt;
            }
            
            .info-card { 
              background: #f8fafc; 
              padding: 18pt; 
              border-radius: 6pt; 
              border: 1pt solid #e2e8f0;
              page-break-inside: avoid;
            }
            
            .info-card h4 {
              font-size: 13pt;
              font-weight: 600;
              color: #1e40af;
              margin-bottom: 12pt;
              display: flex;
              align-items: center;
            }
            
            .info-card p {
              margin-bottom: 4pt;
              font-size: 11pt;
            }
            
            .company-name {
              font-size: 14pt !important;
              font-weight: 700 !important;
              color: #1f2937 !important;
            }
            
            /* Service Header */
            .service-header { 
              background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); 
              padding: 20pt; 
              border-radius: 6pt; 
              margin-bottom: 25pt;
              border: 1pt solid #cbd5e1;
              page-break-inside: avoid;
            }
            
            .service-header h2 {
              font-size: 18pt;
              font-weight: 700;
              color: #1e293b;
              margin-bottom: 8pt;
            }
            
            .service-badges {
              display: flex;
              gap: 10pt;
              align-items: center;
              font-size: 10pt;
            }
            
            /* Table Styling */
            .data-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20pt 0;
              border: 1pt solid #e5e7eb;
              page-break-inside: avoid;
            }
            
            .data-table th, .data-table td { 
              padding: 12pt; 
              text-align: left; 
              border-bottom: 1pt solid #e5e7eb;
              font-size: 11pt;
            }
            
            .data-table th { 
              background: #f8fafc; 
              font-weight: 600;
              color: #374151;
              border-bottom: 2pt solid #d1d5db;
            }
            
            .data-table tr:nth-child(even) {
              background: #fafbfc;
            }
            
            /* Financial Summary */
            .financial-summary {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 25pt;
              margin-top: 25pt;
              page-break-inside: avoid;
            }
            
            .financial-details {
              padding: 15pt;
            }
            
            .financial-details p {
              margin-bottom: 8pt;
              font-size: 11pt;
              display: flex;
              justify-content: space-between;
            }
            
            .financial-details strong {
              font-weight: 600;
            }
            
            .total-section { 
              background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); 
              border-left: 4pt solid #10b981; 
              padding: 20pt; 
              border-radius: 0 6pt 6pt 0;
              text-align: right;
            }
            
            .total-section h3 {
              font-size: 16pt;
              font-weight: 700;
              color: #065f46;
              margin-bottom: 8pt;
            }
            
            .total-amount {
              font-size: 28pt;
              font-weight: 900;
              color: #047857;
              line-height: 1.2;
            }
            
            .vat-notice {
              font-size: 10pt;
              color: #059669;
              margin-top: 6pt;
            }
            
            /* Badge Styling */
            .badge { 
              display: inline-block; 
              padding: 4pt 8pt; 
              border-radius: 4pt; 
              font-size: 9pt; 
              font-weight: 500;
              white-space: nowrap;
            }
            
            .badge-green { background: #d1fae5; color: #065f46; }
            .badge-blue { background: #dbeafe; color: #1e40af; }
            .badge-purple { background: #ede9fe; color: #7c3aed; }
            .badge-orange { background: #fed7aa; color: #9a3412; }
            
            /* Percentage Pricing Card */
            .percentage-card {
              background: #faf5ff;
              border: 1pt solid #e9d5ff;
              border-radius: 6pt;
              padding: 20pt;
              margin-bottom: 25pt;
              page-break-inside: avoid;
            }
            
            .percentage-card h3 {
              color: #7c3aed;
              font-size: 14pt;
              margin-bottom: 15pt;
              font-weight: 600;
            }
            
            .percentage-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20pt;
            }
            
            .percentage-item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8pt;
              font-size: 11pt;
            }
            
            .percentage-item span:first-child {
              color: #7c3aed;
              font-weight: 500;
            }
            
            .percentage-item span:last-child {
              font-weight: 600;
            }
            
            /* Footer */
            .quote-footer {
              margin-top: 40pt;
              padding-top: 20pt;
              border-top: 1pt solid #e5e7eb;
              text-align: center;
              font-size: 10pt;
              color: #6b7280;
            }
            
            /* Print-specific styles */
            @media print {
              @page {
                size: A4;
                margin: 15mm;
              }
              
              body { 
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              
              .container { 
                max-width: none; 
                margin: 0; 
                padding: 0;
              }
              
              .page-break { 
                page-break-before: always; 
              }
              
              .no-break { 
                page-break-inside: avoid; 
              }
              
              .data-table {
                font-size: 10pt;
              }
              
              .data-table th, .data-table td {
                padding: 8pt;
              }
            }
            
            /* Responsive adjustments */
            @media screen and (max-width: 800px) {
              .info-grid,
              .financial-summary,
              .percentage-grid {
                grid-template-columns: 1fr;
              }
              
              .quote-header {
                flex-direction: column;
                text-align: left;
              }
              
              .quote-title {
                text-align: left;
                margin-top: 15pt;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${element.innerHTML}
          </div>
          <div class="quote-footer">
            <p>This quotation is valid for 30 days from the date of issue. Terms and conditions apply.</p>
            <p>Generated on ${new Date().toLocaleDateString('en-ZA', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      // Restore the action buttons
      if (actionButtons) actionButtons.style.display = 'flex';
    }, 500);
  };


  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg mt-8 border border-gray-100 pdf-quote" id="quote-output">
      {/* Professional Header */}
      <div className="quote-header flex items-start justify-between mb-8 pb-6 border-b-2 border-gray-200">
        <div className="company-logo">
          {quote.consultantProfile.logo ? (
            <img src={quote.consultantProfile.logo} alt="Company Logo" className="h-16 w-auto mb-4" />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">
                {quote.businessName?.charAt(0).toUpperCase() || 'B'}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quote.businessName}</h1>
            <p className="text-gray-600">{quote.consultantProfile.name}</p>
          </div>
        </div>
        <div className="quote-title text-right">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">QUOTATION</h1>
          <div className="quote-number">
            <p className="text-sm text-gray-600">Quote #: QT-{new Date().getFullYear()}-{String(new Date().getMonth() + 1).padStart(2, '0')}-{String(new Date().getDate()).padStart(2, '0')}</p>
            <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString('en-ZA')}</p>
            <p className="text-sm text-gray-600">Valid until: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-ZA')}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div></div>
        <div className="flex space-x-2 quote-actions">
          <button 
            onClick={generatePDF}
            disabled={isGeneratingPdf}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPdf ? (
              <>
                <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </>
            )}
          </button>
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
        </div>
      </div>

      {/* Client and Service Provider Information */}
      <div className="info-grid grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="info-card bg-slate-50 p-6 rounded-xl border border-slate-200 no-break">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Service Provider
          </h4>
          <div className="space-y-2">
            <p className="company-name font-bold text-lg text-gray-800">{quote.businessName}</p>
            <p className="text-gray-700">{quote.consultantProfile.name}</p>
            {quote.consultantProfile.title && <p className="text-gray-600">{quote.consultantProfile.title}</p>}
            <p className="text-gray-600">{quote.consultantProfile.email}</p>
            {quote.consultantProfile.phone && <p className="text-gray-600">Tel: {quote.consultantProfile.phone}</p>}
            {quote.consultantProfile.vatNumber && (
              <p className="text-gray-600 font-medium">VAT No: {quote.consultantProfile.vatNumber}</p>
            )}
            {quote.consultantProfile.cipcNumber && (
              <p className="text-gray-600 font-medium">CIPC: {quote.consultantProfile.cipcNumber}</p>
            )}
            {quote.consultantProfile.sarsTaxRef && (
              <p className="text-gray-600 font-medium">SARS: {quote.consultantProfile.sarsTaxRef}</p>
            )}
            {quote.consultantProfile.bbbeeStatus && (
              <div className="flex items-center mt-3">
                <span className="badge badge-green">
                  B-BBEE: {quote.consultantProfile.bbbeeStatus}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="info-card bg-blue-50 p-6 rounded-xl border border-blue-200 no-break">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Client Information
          </h4>
          <div className="space-y-2">
            <p className="company-name font-bold text-lg text-gray-800">{quote.client.name || quote.clientName}</p>
            {quote.client.company && <p className="text-gray-700">{quote.client.company}</p>}
            {quote.client.email && <p className="text-gray-600">{quote.client.email}</p>}
            {quote.client.phone && <p className="text-gray-600">Tel: {quote.client.phone}</p>}
            {quote.client.industry && <p className="text-gray-600">Industry: {quote.client.industry}</p>}
            {quote.client.physicalAddress && <p className="text-gray-600">{quote.client.physicalAddress}</p>}
            {quote.client.taxNumber && <p className="text-gray-600">Tax No: {quote.client.taxNumber}</p>}
          </div>
          
          <div className="mt-6 pt-4 border-t border-blue-200">
            <h5 className="font-bold text-gray-800 mb-2">Project Details</h5>
            <p className="font-semibold text-gray-800">{quote.projectName}</p>
            <p className="text-sm text-gray-600 mt-1">Service: {quote.service}</p>
          </div>
        </div>
      </div>

      {/* Service Information */}
      <div className="service-header bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-xl mb-8 border border-slate-200 no-break">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">{quote.service}</h2>
            <div className="service-badges flex items-center space-x-4 text-sm">
              <span className={`badge ${
                quote.pricingModel === 'hourly' 
                  ? 'badge-blue' 
                  : 'badge-purple'
              }`}>
                {quote.pricingModel === 'hourly' ? 'Hourly Rate Model' : 'Percentage-Based Model'}
              </span>
              {quote.pricingModel === 'hourly' && quote.complexity && (
                <span className="badge badge-orange">
                  Complexity: {quote.complexity}x
                </span>
              )}
              {quote.numDocuments && (
                <span className="badge badge-green">
                  {quote.numDocuments} Document{quote.numDocuments > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>Quote Generated</p>
            <p className="font-medium">{new Date().toLocaleDateString('en-ZA')}</p>
          </div>
        </div>
      </div>

      {quote.pricingModel === 'hourly' && (
        <div className="overflow-x-auto no-break mb-8">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Project Tasks Breakdown</h3>
            <p className="text-sm text-gray-600">Detailed breakdown of tasks, estimated hours, and current status</p>
          </div>
          <table className="data-table min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr>
                <th className="py-4 px-4 bg-slate-50 border-b-2 border-slate-200 text-left text-sm font-semibold text-gray-700">Task</th>
                <th className="py-4 px-4 bg-slate-50 border-b-2 border-slate-200 text-left text-sm font-semibold text-gray-700">Description</th>
                <th className="py-4 px-4 bg-slate-50 border-b-2 border-slate-200 text-left text-sm font-semibold text-gray-700">Hours</th>
                <th className="py-4 px-4 bg-slate-50 border-b-2 border-slate-200 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks && tasks.map((task, index) => (
                <tr key={task.name} className={`${task.completed ? 'bg-green-50' : 'hover:bg-gray-50'} transition-colors`}>
                  <td className="py-4 px-4 border-b border-gray-200">
                    <div className="font-medium text-gray-900">{task.name}</div>
                  </td>
                  <td className="py-4 px-4 border-b border-gray-200 text-gray-700">
                    {task.description || 'No description provided'}
                  </td>
                  <td className="py-4 px-4 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={task.hours}
                        onChange={(e) => handleHoursChange(index, e.target.value)}
                        disabled={task.completed}
                        min="0"
                        step="0.5"
                      />
                      <span className="text-sm text-gray-500">hrs</span>
                      {task.perDocument && (
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">per doc</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 border-b border-gray-200">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      task.completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-6">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
              onClick={recalculateQuote}
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Recalculate Quote
            </button>
          </div>
        </div>
      )}

      {quote.pricingModel === 'percentage' && (
        <div className="percentage-card bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8 no-break">
          <h3 className="text-lg font-bold text-purple-800 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Funding-Based Pricing Details
          </h3>
          <div className="percentage-grid grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="percentage-item flex justify-between py-2 border-b border-purple-100">
                <span className="text-purple-700 font-medium">Funding Value:</span>
                <span className="font-bold text-gray-900">{formatCurrency(quote.fundingValue, 'ZAR')}</span>
              </div>
              <div className="percentage-item flex justify-between py-2 border-b border-purple-100">
                <span className="text-purple-700 font-medium">Support Type:</span>
                <span className={`badge ${
                  quote.supportType === 'full' 
                    ? 'badge-green' 
                    : 'badge-orange'
                }`}>
                  {quote.supportType === 'full' ? 'Full Support (3%)' : 'Administration-Only (1.5%)'}
                </span>
              </div>
              <div className="percentage-item flex justify-between py-2 border-b border-purple-100">
                <span className="text-purple-700 font-medium">Support Fee:</span>
                <span className="font-bold text-gray-900">{formatCurrency(quote.supportFee, 'ZAR')}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="percentage-item flex justify-between py-2 border-b border-purple-100">
                <span className="text-purple-700 font-medium">Security Fee:</span>
                <span className="font-bold text-gray-900">{formatCurrency(quote.securityFee, 'ZAR')}</span>
              </div>
              <div className="percentage-item flex justify-between py-2 border-b border-purple-100">
                <span className="text-purple-700 font-medium">Support Duration:</span>
                <span className="font-medium text-gray-700">{quote.supportDuration}</span>
              </div>
              <div className="percentage-item flex justify-between py-2">
                <span className="text-purple-700 font-medium">VAT Included:</span>
                <span className="font-medium text-gray-700">Yes (15%)</span>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-white rounded-lg border border-purple-100">
            <h4 className="font-semibold text-gray-800 mb-2">Included Services</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Complete project management and coordination</li>
              <li>• Expert industry consultation (agriculture, technology, finance)</li>
              <li>• Post-funding administrative support and compliance</li>
              <li>• 12 months of as-needed consultancy services</li>
              <li>• Document preparation and submission assistance</li>
            </ul>
          </div>
        </div>
      )}

      {/* Financial Summary */}
      <div className="financial-summary grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="financial-details">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Cost Breakdown</h3>
          <div className="space-y-3">
            {quote.pricingModel === 'hourly' && (
              <>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">Hourly Rate:</span>
                  <span className="font-semibold">{formatCurrency(quote.hourlyRate, quote.currency)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">Total Hours:</span>
                  <span className="font-semibold">{quote.finalHours?.toFixed(2)} hrs</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">Complexity Factor:</span>
                  <span className="font-semibold">{quote.complexity}x</span>
                </div>
                {quote.numDocuments && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-700 font-medium">Documents:</span>
                    <span className="font-semibold">{quote.numDocuments}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">Subtotal:</span>
                  <span className="font-semibold">{formatCurrency((quote.finalCost - (quote.vatAmount || 0)), quote.currency)}</span>
                </div>
                {quote.vatEnabled && quote.vatAmount > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-700 font-medium">VAT (15%):</span>
                    <span className="font-semibold">{formatCurrency(quote.vatAmount, quote.currency)}</span>
                  </div>
                )}
              </>
            )}
            {quote.pricingModel === 'percentage' && (
              <>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">Support Fee:</span>
                  <span className="font-semibold">{formatCurrency(quote.supportFee, quote.currency)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">Security Fee (incl. VAT):</span>
                  <span className="font-semibold">{formatCurrency(quote.securityFee, quote.currency)}</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="total-section bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-r-xl">
          <div className="text-right">
            <h3 className="text-xl font-bold text-green-800 mb-2">Total Investment</h3>
            <div className="total-amount text-5xl font-black text-green-900 mb-3">
              {formatCurrency(quote.finalCost, quote.currency || 'ZAR')}
            </div>
            {quote.vatEnabled && quote.pricingModel === 'hourly' && (
              <p className="vat-notice text-sm text-green-700">Includes 15% VAT</p>
            )}
            {quote.pricingModel === 'percentage' && (
              <p className="vat-notice text-sm text-green-700">Security fee includes 15% VAT</p>
            )}
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-sm text-green-700">Valid for 30 days</p>
              <p className="text-xs text-green-600 mt-1">Payment terms: 50% upfront, 50% on completion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quote;

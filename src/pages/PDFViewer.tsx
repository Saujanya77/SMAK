import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  FileText,
  Eye,
  Heart
} from 'lucide-react';

interface Journal {
  title: string;
  category: string;
  authors: string;
  citationCount: number;
  downloadCount: number;
  pdfUrl?: string;
  externalUrl?: string;
  journal?: string;
  publishedDate?: string;
  abstract?: string;
}

interface PDFViewerProps {
  journal: Journal;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ journal, onClose }) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 15; // Mock total pages

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    console.log('Downloading PDF:', journal.title);
    if (journal.pdfUrl) {
      const link = document.createElement('a');
      link.href = journal.pdfUrl;
      link.download = `${journal.title}.pdf`;
      link.click();
    }
  };

  const handleExternalLink = () => {
    window.open(journal.externalUrl, '_blank', 'noopener,noreferrer');
  };

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="h-[90vh] flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
              {journal.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {journal.category}
              </Badge>
              <span className="text-xs text-gray-500">
                By {journal.authors}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleExternalLink}>
            <ExternalLink className="h-4 w-4 mr-2" />
            External Link
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[100px] text-center">
            Page {currentPage} of {totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px] text-center">
            {zoom}%
          </span>
          <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 200}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleRotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            {journal.citationCount} citations
          </span>
          <span className="flex items-center">
            <Download className="h-4 w-4 mr-1" />
            {journal.downloadCount} downloads
          </span>
        </div>
      </div>

      {/* PDF Content Area */}
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          {journal.pdfUrl ? (
            /* Actual PDF Viewer */
            <div 
              className="bg-white shadow-lg mx-auto transition-all duration-300 border"
              style={{ 
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                width: '210mm',
                minHeight: '297mm'
              }}
            >
              <iframe
                src={journal.pdfUrl}
                width="100%"
                height="800px"
                className="border-0"
                title="PDF Preview"
              />
            </div>
          ) : (
            /* Mock PDF Pages for journals without uploaded PDFs */
            <div 
              className="bg-white shadow-lg mx-auto transition-all duration-300"
              style={{ 
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                width: '210mm',
                minHeight: '297mm'
              }}
            >
              {/* Mock PDF Page Content */}
              <div className="p-8 space-y-6">
                <div className="text-center border-b border-gray-200 pb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {journal.title}
                  </h1>
                  <p className="text-lg text-gray-600 mb-2">
                    {journal.authors}
                  </p>
                  <p className="text-sm text-gray-500">
                    {journal.journal} • {journal.publishedDate}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Abstract</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {journal.abstract}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Introduction</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      The field of medicine continues to evolve rapidly with new discoveries and innovations 
                      emerging at an unprecedented pace. This research paper examines the latest developments 
                      in {journal.category.toLowerCase()} and their potential impact on clinical practice.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Recent studies have highlighted the importance of evidence-based approaches to medical 
                      treatment, particularly in the context of patient safety and treatment efficacy. Our 
                      research builds upon these foundational principles to explore new therapeutic modalities.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Methodology</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      This study employed a comprehensive systematic review approach, analyzing data from 
                      multiple clinical trials and observational studies conducted between 2020 and 2024. 
                      The research methodology was designed to ensure statistical rigor and clinical relevance.
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Systematic literature review of peer-reviewed publications</li>
                      <li>Meta-analysis of clinical trial data</li>
                      <li>Statistical analysis using advanced computational methods</li>
                      <li>Peer review and validation by expert clinicians</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Results</h2>
                    <p className="text-gray-700 leading-relaxed">
                      Our findings demonstrate significant improvements in patient outcomes when utilizing 
                      the proposed treatment protocols. The data suggests a marked reduction in adverse 
                      events and improved quality of life metrics across all patient cohorts studied.
                    </p>
                  </div>

                  {currentPage > 1 && (
                    <div className="mt-8">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        {currentPage === 2 ? '4. Discussion' : 
                         currentPage === 3 ? '5. Clinical Implications' :
                         currentPage === 4 ? '6. Limitations' :
                         '7. Conclusion'}
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {currentPage === 2 ? 
                          'The results of this study have important implications for clinical practice. The evidence suggests that implementing these new protocols could significantly improve patient outcomes while reducing healthcare costs.' :
                          currentPage === 3 ?
                          'Healthcare providers should consider integrating these findings into their clinical decision-making processes. The protocols outlined in this study provide a framework for evidence-based treatment approaches.' :
                          currentPage === 4 ?
                          'While this study provides valuable insights, there are several limitations that should be considered. The sample size was limited to specific geographic regions, and long-term follow-up data is still being collected.' :
                          'In conclusion, this research contributes significant new knowledge to the field of ' + journal.category.toLowerCase() + '. The findings support the adoption of new treatment protocols and provide a foundation for future research in this area.'
                        }
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
import React, { useState, useEffect } from 'react';
import { FaSpinner, FaFilePdf, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const PDFPreview = ({ file, isLoading }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [pageRendering, setPageRendering] = useState(false);
  const [canvas, setCanvas] = useState(null);
  
  useEffect(() => {
    if (!file || isLoading) return;
    
    let canvasRef = null;
    let mounted = true;
    
    const loadPDF = async () => {
      try {
        // Dynamically import PDF.js to avoid worker setup issues
        const pdfjs = await import('pdfjs-dist/build/pdf');
        const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
        pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
        
        // Load the PDF
        const loadingTask = pdfjs.getDocument(file);
        const pdf = await loadingTask.promise;
        
        if (mounted) {
          setPdfDocument(pdf);
          setNumPages(pdf.numPages);
          // Render the first page
          renderPage(1, pdf, canvasRef);
        }
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };
    
    const renderPage = async (pageNum, pdf, canvasRef) => {
      if (!canvasRef || !pdf) return;
      
      setPageRendering(true);
      
      try {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        
        // Set canvas dimensions to match the viewport
        canvasRef.height = viewport.height;
        canvasRef.width = viewport.width;
        
        // Render PDF page into canvas context
        const renderContext = {
          canvasContext: canvasRef.getContext('2d'),
          viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        if (mounted) {
          setPageRendering(false);
          setPageNumber(pageNum);
        }
      } catch (error) {
        console.error('Error rendering page:', error);
        if (mounted) {
          setPageRendering(false);
        }
      }
    };
    
    // Setup canvas ref
    if (canvas) {
      canvasRef = canvas;
      loadPDF();
    }
    
    return () => {
      mounted = false;
    };
  }, [file, isLoading, canvas]);
  
  const changePage = (offset) => {
    if (!pdfDocument || pageRendering) return;
    
    const newPageNum = pageNumber + offset;
    if (newPageNum < 1 || newPageNum > numPages) return;
    
    renderPage(newPageNum, pdfDocument, canvas);
  };
  
  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full"></div>
        <FaSpinner className="animate-spin text-3xl text-violet-400" />
      </div>
    );
  }

  if (!file) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <FaFilePdf className="mr-2" /> No PDF file to display
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative overflow-auto max-w-full">
        <canvas 
          ref={node => setCanvas(node)} 
          className="border border-violet-200 shadow-lg"
        />
        
        {pageRendering && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <FaSpinner className="animate-spin text-3xl text-violet-400" />
          </div>
        )}
      </div>
      
      {numPages > 1 && (
        <div className="flex items-center justify-center mt-4 space-x-4">
          <button
            onClick={previousPage}
            disabled={pageNumber <= 1 || pageRendering}
            className="p-2 text-violet-600 hover:text-violet-800 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            <FaArrowLeft />
          </button>
          <p className="text-slate-600">
            Page {pageNumber} of {numPages}
          </p>
          <button
            onClick={nextPage}
            disabled={pageNumber >= numPages || pageRendering}
            className="p-2 text-violet-600 hover:text-violet-800 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFPreview;

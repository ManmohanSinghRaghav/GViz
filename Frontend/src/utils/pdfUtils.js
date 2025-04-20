/**
 * Browser-compatible utilities for PDF processing
 * Uses dynamic imports of PDF.js to avoid worker configuration issues
 */

/**
 * Extract text from a PDF file
 * @param {File|Blob|string} file - PDF file, blob, or URL
 * @returns {Promise<string>} - Extracted text
 */
export const extractPDFText = async (file) => {
  try {
    // Dynamically import PDF.js
    const pdfjs = await import('pdfjs-dist/build/pdf');
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    
    // Handle different input types
    let loadingTask;
    if (typeof file === 'string') {
      // URL
      loadingTask = pdfjs.getDocument(file);
    } else if (file instanceof File || file instanceof Blob) {
      // File or Blob
      const arrayBuffer = await readFileAsArrayBuffer(file);
      loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    } else {
      throw new Error('Invalid input: must be a File, Blob, or URL string');
    }
    
    const pdf = await loadingTask.promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('PDF text extraction error:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

/**
 * Read a file as ArrayBuffer
 * @param {File|Blob} file 
 * @returns {Promise<ArrayBuffer>}
 */
const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Get PDF document metadata
 * @param {File|Blob|string} file 
 * @returns {Promise<Object>}
 */
export const getPDFMetadata = async (file) => {
  try {
    const pdfjs = await import('pdfjs-dist/build/pdf');
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    
    let loadingTask;
    if (typeof file === 'string') {
      loadingTask = pdfjs.getDocument(file);
    } else if (file instanceof File || file instanceof Blob) {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    } else {
      throw new Error('Invalid input: must be a File, Blob, or URL string');
    }
    
    const pdf = await loadingTask.promise;
    const metadata = await pdf.getMetadata();
    
    return {
      numPages: pdf.numPages,
      info: metadata.info,
      metadata: metadata.metadata
    };
  } catch (error) {
    console.error('PDF metadata extraction error:', error);
    throw new Error(`Failed to extract PDF metadata: ${error.message}`);
  }
};

export default {
  extractPDFText,
  getPDFMetadata
};

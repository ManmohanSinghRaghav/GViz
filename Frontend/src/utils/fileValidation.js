/**
 * Validates if a file is a valid resume file (PDF, DOCX, etc.)
 * @param {File} file - The file to validate
 * @returns {Object} - Validation result with success status and optional error message
 */
export const validateResumeFile = (file) => {
  if (!file) {
    return {
      valid: false,
      error: 'No file selected'
    };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum limit of 5MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
    };
  }

  // Check file type
  const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const validExtensions = ['.pdf', '.docx'];

  // Check MIME type
  if (!validTypes.includes(file.type)) {
    // If MIME type check fails, check file extension as fallback
    const fileName = file.name.toLowerCase();
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
      return {
        valid: false,
        error: 'Invalid file type. Please upload a PDF or DOCX file.'
      };
    }
  }

  return {
    valid: true
  };
};

/**
 * Gets readable file size with appropriate units
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size with units
 */
export const getReadableFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

export default {
  validateResumeFile,
  getReadableFileSize
};

// Utility functions
export const createPageUrl = (pageName: string) => {
  const pages: Record<string, string> = {
    'Home': '/',
    'Upload': '/upload',
    'Materials': '/materials',
    'Terms': '/terms',
    'Privacy': '/privacy',
    'Admin': '/admin',
  };
  return pages[pageName] || '/';
};

// Format date
export const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Get file extension
export const getFileExtension = (filename: string) => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

// Check if file is image
export const isImageFile = (filename: string) => {
  const ext = getFileExtension(filename);
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
};

// Check if file is PDF
export const isPdfFile = (filename: string) => {
  return getFileExtension(filename) === 'pdf';
};

// Truncate text
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
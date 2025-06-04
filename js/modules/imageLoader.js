/**
 * Image Loader Module
 * Handles lazy loading and image caching using direct paths from project data
 */

const ImageLoader = (function() {
  // Cache for loaded images
  const loadedImages = new Set();
  
  /**
   * Fix image path based on current page location
   * @param {string} imagePath - Original image path from project data
   * @returns {string} - Corrected path based on current location
   */
  function fixImagePath(imagePath) {
    // Check if we're in the templates directory
    const isInTemplates = window.location.pathname.includes('templates/');
    
    // If we're in templates and the path doesn't already start with ../
    if (isInTemplates && !imagePath.startsWith('../') && !imagePath.startsWith('http')) {
      return '../' + imagePath;
    }
    
    return imagePath;
  }
  
  /**
   * Initialize IntersectionObserver for lazy loading images
   * @param {string} selector - CSS selector for images to lazy load
   */
  function lazyLoadImages(selector) {
    // Check if Intersection Observer API is supported
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          // Load image when it enters viewport
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // If using data-src instead of src for lazy loading
            if (img.dataset.src) {
              // Use requestAnimationFrame for non-blocking image loading
              requestAnimationFrame(() => {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              });
            }
            
            // Add loaded class for fade-in effects
            img.classList.add('loaded');
            
            // Add to loaded images cache
            loadedImages.add(img.src || img.dataset.src);
            
            // Stop observing this image
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px 100px 0px', // Reduced margin for better performance
        threshold: 0.01
      });
      
      // Start observing all images with the given selector
      const images = document.querySelectorAll(selector);
      images.forEach(img => {
        // Only observe images that have data-src or are not already loaded
        if (img.dataset.src || (!img.complete && img.src)) {
          imageObserver.observe(img);
        }
      });
    } else {
      // Fallback for browsers without IntersectionObserver support
      loadImagesImmediately(selector);
    }
  }
  
  /**
   * Fallback function to load images immediately
   * @param {string} selector - CSS selector for images to load
   */
  function loadImagesImmediately(selector) {
    const images = document.querySelectorAll(selector);
    
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
      img.classList.add('loaded');
      loadedImages.add(img.src);
    });
  }
  
  /**
   * Preload images for smoother experience
   * @param {Array} imagePaths - Array of image paths to preload
   * @param {Function} callback - Callback function to run when all images are loaded
   */
  function preloadImages(imagePaths, callback) {
    let loadedCount = 0;
    
    // Skip already loaded images
    const imagesToLoad = imagePaths.filter(path => !loadedImages.has(path));
    
    // If all images are already loaded, call callback immediately
    if (imagesToLoad.length === 0 && typeof callback === 'function') {
      callback();
      return;
    }
    
    function imageLoaded() {
      loadedCount++;
      
      if (loadedCount === imagesToLoad.length && typeof callback === 'function') {
        callback();
      }
    }
    
    imagesToLoad.forEach(path => {
      const img = new Image();
      img.onload = imageLoaded;
      img.onerror = imageLoaded; // Count errors as loaded to avoid blocking
      img.src = path;
      loadedImages.add(path);
    });
  }
  
  /**
   * Get cover image path for a project
   * @param {Object} project - Project data object
   * @returns {string} - Path to the cover image
   */
  function getCoverImagePath(project) {
    return fixImagePath(project.coverImage);
  }
  
  /**
   * Get slideshow image paths for a project
   * @param {Object} project - Project data object
   * @returns {Array} - Array of image paths for slideshow
   */
  function getSlideshowImagePaths(project) {
    // Extract all images from slideTemplates
    if (project.slideTemplates && project.slideTemplates.length > 0) {
      const allImages = [];
      project.slideTemplates.forEach(template => {
        if (template.images && Array.isArray(template.images)) {
          allImages.push(...template.images);
        }
      });
      return allImages.map(imagePath => fixImagePath(imagePath));
    }
    
    // Fallback to slideshowImages for backwards compatibility (if still exists)
    const images = project.slideshowImages || [];
    return images.map(imagePath => fixImagePath(imagePath));
  }
  
  /**
   * Generate all gallery image paths for a project using totalImages and naming pattern
   * This automatically generates paths based on totalImages count and project-specific naming
   * @param {Object} project - Project data object
   * @returns {Array} - Array of all image paths for gallery
   */
  function getGalleryImagePaths(project) {
    // If project has a galleryImages array, use that (manual override)
    if (project.galleryImages && project.galleryImages.length > 0) {
      const fixedPaths = project.galleryImages.map(imagePath => fixImagePath(imagePath));
      
      // If totalImages is specified, limit the results
      if (project.totalImages && project.totalImages > 0) {
        return fixedPaths.slice(0, project.totalImages);
      }
      
      return fixedPaths;
    }
    
    // Auto-generate based on totalImages and naming pattern
    if (project.totalImages && project.totalImages > 0) {
      const galleryPaths = [];
      
      for (let i = 1; i <= project.totalImages; i++) {
        let imagePath;
        
        // Check if project has a custom naming pattern
        if (project.namingPattern) {
          // Replace placeholders in the pattern
          imagePath = project.namingPattern
            .replace('{id}', project.id)
            .replace('{i}', i)
            .replace('{i2}', i.toString().padStart(2, '0'))
            .replace('{folder}', project.folder || project.id);
        } else {
          // Generate naming pattern based on project title and ID
          const nameSlug = generateProjectNameSlug(project);
          imagePath = `images/${project.folder || project.id}/${nameSlug}${i}.webp`;
        }
        
        if (imagePath) {
          galleryPaths.push(fixImagePath(imagePath));
        }
      }
      
      if (galleryPaths.length > 0) {
        return galleryPaths;
      }
    }
    
    // Final fallback: use slideTemplates if no other option works
    if (project.slideTemplates && project.slideTemplates.length > 0) {
      const allImages = [];
      project.slideTemplates.forEach(template => {
        if (template.images && Array.isArray(template.images)) {
          allImages.push(...template.images);
        }
      });
      return allImages.map(imagePath => fixImagePath(imagePath));
    }
    
    // Legacy fallback: use slideshowImages if slideTemplates not available
    if (project.slideshowImages && project.slideshowImages.length > 0) {
      return project.slideshowImages.map(imagePath => fixImagePath(imagePath));
    }
    
    // If no images specified, return empty array
    return [];
  }
  
  /**
   * Generate a filename slug based on project title for automatic image naming
   * @param {Object} project - Project data object
   * @returns {string} - Generated name slug for image files
   */
  function generateProjectNameSlug(project) {
    // Known mappings for specific projects based on actual file naming
    const projectNameMappings = {
      'P-01': 'Ladakhi-Bakers',     // "Ladakhi Bakers" -> "Ladakhi-Bakers"
      'P-02': 'Miralls',            // "366 Miralls" -> "Miralls" 
      'P-03': 'Morocco',            // "Moro[cc]o" -> "Morocco"
      'P-04': 'Thinking-Mu',        // "Factory x Thinking Mu" -> "Thinking-Mu"
      'P-05': 'Varanasi',           // "Two days in Varanasi" -> "Varanasi"
      'P-06': 'Kirguistan',         // "Kirguistan" -> "Kirguistan"
      'P-07': 'Georgia',            // "Georgia" -> "Georgia"
      'P-08': 'TheJumpingAge',      // "The Jumping Age" -> "TheJumpingAge"
      'P-09': 'Comercial'           // "Commercial" -> "Comercial"
    };
    
    // Return the specific mapping if it exists
    if (projectNameMappings[project.id]) {
      return projectNameMappings[project.id];
    }
    
    // Fallback: generate from title (remove special characters, replace spaces with hyphens)
    return project.title
      .replace(/\[|\]|\(|\)/g, '')  // Remove brackets and parentheses
      .replace(/\s+/g, '-')         // Replace spaces with hyphens
      .replace(/[^a-zA-Z0-9-]/g, '') // Remove special characters except hyphens
      .replace(/-+/g, '-')          // Replace multiple hyphens with single
      .replace(/^-|-$/g, '');       // Remove leading/trailing hyphens
  }
  
  /**
   * Get all available images from a project folder
   * This is a fallback method that tries common naming patterns
   * @param {Object} project - Project data object
   * @returns {Array} - Array of image paths found
   */
  function getAllProjectImages(project) {
    // For now, this will use the automatic generation
    // In a real scenario, you might want to scan the actual folder
    return getGalleryImagePaths(project);
  }
  
  /**
   * Get slide templates with fixed image paths
   * @param {Object} project - Project data object
   * @returns {Array} - Array of slide templates with corrected paths
   */
  function getSlideTemplates(project) {
    if (!project.slideTemplates || project.slideTemplates.length === 0) {
      return null;
    }
    
    return project.slideTemplates.map(template => ({
      type: template.type,
      images: template.images.map(imagePath => fixImagePath(imagePath))
    }));
  }
  
  /**
   * Check if an image is already loaded
   * @param {string} imagePath - Path to the image
   * @returns {boolean} - True if image is loaded
   */
  function isImageLoaded(imagePath) {
    return loadedImages.has(imagePath);
  }
  
  /**
   * Clear loaded images cache
   */
  function clearCache() {
    loadedImages.clear();
  }
  
  // Public API
  return {
    lazyLoadImages,
    preloadImages,
    getCoverImagePath,
    getSlideshowImagePaths,
    getGalleryImagePaths,
    getSlideTemplates,
    getAllProjectImages,
    isImageLoaded,
    clearCache,
    fixImagePath // Export for debugging
  };
})(); 
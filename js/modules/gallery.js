/**
 * Gallery Module
 * Handles the full gallery/index view functionality
 */

const Gallery = (function() {
  // Private variables
  let galleryContainer;
  let lightbox;
  let lightboxImage;
  let lightboxCounter;
  let currentImageIndex = 0;
  let galleryImages = [];
  
  /**
   * Initialize gallery with images
   * @param {string} containerSelector - CSS selector for gallery container
   * @param {Array} imagePaths - Array of direct image paths
   * @param {string} folder - Project folder name (kept for compatibility but not used)
   */
  function init(containerSelector, imagePaths, folder = null) {
    // Get gallery container
    galleryContainer = document.querySelector(containerSelector);
    if (!galleryContainer) return;
    
    // Store gallery images for later use
    galleryImages = imagePaths;
    
    // Create gallery items from images
    createGalleryItems(imagePaths);
    
    // Create lightbox if it doesn't exist
    if (!document.querySelector('.lightbox')) {
      createLightbox();
    } else {
      lightbox = document.querySelector('.lightbox');
      lightboxImage = lightbox.querySelector('.lightbox-image');
      lightboxCounter = lightbox.querySelector('.lightbox-counter');
    }
  }
  
  /**
   * Create gallery items from image paths
   * @param {Array} imagePaths - Array of direct image paths
   */
  function createGalleryItems(imagePaths) {
    // Clear any existing items
    galleryContainer.innerHTML = '';
    
    // Add loading state to gallery
    galleryContainer.classList.add('loading');
    
    let loadedCount = 0;
    const totalImages = imagePaths.length;
    
    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    // Pre-calculate gallery item dimensions to prevent layout shifts
    const itemHeight = 200; // Fixed height from CSS
    
    // Create a gallery item for each image
    imagePaths.forEach((imagePath, index) => {
      const galleryItem = document.createElement('div');
      galleryItem.classList.add('gallery-item');
      galleryItem.dataset.index = index;
      
      // Set explicit dimensions to prevent layout shifts
      galleryItem.style.height = `${itemHeight}px`;
      galleryItem.style.minWidth = '150px';
      
      const img = document.createElement('img');
      img.classList.add('gallery-image', 'loading');
      // Use data-src for lazy loading instead of src
      img.dataset.src = imagePath;
      img.alt = `Gallery image ${index + 1}`;
      img.loading = 'lazy'; // Keep native lazy loading as fallback
      img.decoding = 'async'; // Better performance
      
      // Pre-set image dimensions to prevent layout shifts
      img.style.height = `${itemHeight}px`;
      img.style.width = 'auto';
      img.style.objectFit = 'contain';
      
      // Add load event listener for fade-in effect
      img.addEventListener('load', function() {
        // Use requestAnimationFrame to batch DOM updates
        requestAnimationFrame(() => {
          this.classList.remove('loading');
          this.classList.add('loaded');
          
          loadedCount++;
          // Remove gallery loading state when some images have loaded (for better UX)
          if (loadedCount >= Math.min(5, totalImages * 0.2)) { // More aggressive - remove after 20% or 5 images
            requestAnimationFrame(() => {
              galleryContainer.classList.remove('loading');
            });
          }
        });
      }, { once: true, passive: true }); // Optimize event listener
      
      // Add error handling - keep image hidden on error
      img.addEventListener('error', function() {
        requestAnimationFrame(() => {
          this.classList.remove('loading');
          this.classList.add('error');
          console.warn(`Failed to load image: ${imagePath}`);
          // Hide the gallery item completely if image fails to load
          galleryItem.style.display = 'none';
          
          loadedCount++;
          // Still count errors towards removing loading state
          if (loadedCount >= Math.min(5, totalImages * 0.2)) {
            requestAnimationFrame(() => {
              galleryContainer.classList.remove('loading');
            });
          }
        });
      }, { once: true, passive: true });
      
      galleryItem.appendChild(img);
      fragment.appendChild(galleryItem);
      
      // Add click event to open lightbox - only if image is loaded
      galleryItem.addEventListener('click', () => {
        if (img.classList.contains('loaded')) {
          openLightbox(index);
        }
      }, { passive: true });
    });
    
    // Append all items at once for better performance and to prevent layout shifts
    galleryContainer.appendChild(fragment);
    
    // Initialize lazy loading for gallery images after creating all items
    // Use longer timeout to allow browser to settle layouts
    requestAnimationFrame(() => {
      // Batch the lazy loading initialization
      setTimeout(() => {
        ImageLoader.lazyLoadImages('.gallery-image');
        
        // More aggressive fallback: remove loading state faster for better perceived performance
        setTimeout(() => {
          galleryContainer.classList.remove('loading');
        }, 1500); // Reduced from 2 seconds
      }, 100); // Small delay to let initial layout settle
    });
  }
  
  /**
   * Create lightbox element
   */
  function createLightbox() {
    // Create lightbox container
    lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');
    
    // Create lightbox content
    const lightboxContent = document.createElement('div');
    lightboxContent.classList.add('lightbox-content');
    
    // Create lightbox image
    lightboxImage = document.createElement('img');
    lightboxImage.classList.add('lightbox-image');
    lightboxContent.appendChild(lightboxImage);
    
    // Create navigation click areas (invisible overlays like slideshow)
    const prevArea = document.createElement('div');
    prevArea.classList.add('lightbox-nav-area', 'prev');
    prevArea.setAttribute('aria-label', 'Previous image');
    prevArea.addEventListener('click', prevImage);
    
    const nextArea = document.createElement('div');
    nextArea.classList.add('lightbox-nav-area', 'next');
    nextArea.setAttribute('aria-label', 'Next image');
    nextArea.addEventListener('click', nextImage);
    
    // Add all elements to lightbox
    lightbox.appendChild(lightboxContent);
    lightbox.appendChild(prevArea);
    lightbox.appendChild(nextArea);
    
    // Add lightbox to document
    document.body.appendChild(lightbox);
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
  }
  
  /**
   * Open lightbox with image at specified index
   * @param {number} index - Index of image to show
   */
  function openLightbox(index) {
    if (index < 0 || index >= galleryImages.length) return;
    
    currentImageIndex = index;
    
    // Set image source using direct path
    lightboxImage.src = galleryImages[index];
    
    // Update project cell counter
    updateProjectCellCounter();
    
    // Show lightbox
    lightbox.classList.add('active');
    
    // Disable page scrolling
    document.body.style.overflow = 'hidden';
    
    // Preload adjacent images
    preloadAdjacentImages();
  }
  
  /**
   * Close lightbox
   */
  function closeLightbox() {
    lightbox.classList.remove('active');
    
    // Re-enable page scrolling
    document.body.style.overflow = '';
    
    // Reset project cell counter to total
    resetProjectCellCounter();
  }
  
  /**
   * Show previous image in lightbox
   */
  function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
  }
  
  /**
   * Show next image in lightbox
   */
  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxImage();
  }
  
  /**
   * Update lightbox image based on current index
   */
  function updateLightboxImage() {
    // Update image source using direct path
    lightboxImage.src = galleryImages[currentImageIndex];
    
    // Update project cell counter
    updateProjectCellCounter();
    
    // Preload adjacent images
    preloadAdjacentImages();
  }
  
  /**
   * Update project cell counter with current position
   */
  function updateProjectCellCounter() {
    const projectCounter = document.querySelector('.project-slideshow-counter');
    if (projectCounter) {
      projectCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    }
  }
  
  /**
   * Reset project cell counter to total format
   */
  function resetProjectCellCounter() {
    const projectCounter = document.querySelector('.project-slideshow-counter');
    if (projectCounter) {
      projectCounter.textContent = `${galleryImages.length} / ${galleryImages.length}`;
    }
  }
  
  /**
   * Handle keyboard navigation in lightbox
   * @param {KeyboardEvent} event - Keyboard event
   */
  function handleKeyPress(event) {
    // Only handle keyboard events if lightbox is visible
    if (!lightbox || !lightbox.classList.contains('active')) return;
    
    switch (event.key) {
      case 'Escape':
        closeLightbox();
        event.preventDefault();
        break;
      case 'ArrowLeft':
        prevImage();
        event.preventDefault();
        break;
      case 'ArrowRight':
        nextImage();
        event.preventDefault();
        break;
    }
  }
  
  /**
   * Preload adjacent images for smoother navigation
   */
  function preloadAdjacentImages() {
    const imagesToPreload = [];
    
    // Get previous image
    const prevIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    if (galleryImages[prevIndex]) {
      imagesToPreload.push(galleryImages[prevIndex]);
    }
    
    // Get next image
    const nextIndex = (currentImageIndex + 1) % galleryImages.length;
    if (galleryImages[nextIndex]) {
      imagesToPreload.push(galleryImages[nextIndex]);
    }
    
    // Preload the images
    if (imagesToPreload.length > 0) {
      ImageLoader.preloadImages(imagesToPreload);
    }
  }
  
  // Public API
  return {
    init,
    openLightbox,
    closeLightbox,
    prevImage,
    nextImage
  };
})(); 
/**
 * Slideshow Module
 * Handles the project page slideshow functionality
 */

const Slideshow = (function() {
  // Private variables
  let slides = [];
  let currentIndex = 0;
  let slideshowContainer;
  let currentSlideElement;
  let totalSlidesElement;
  let projectCounter; // Counter in project cell
  let autoplayTimer;
  let isTransitioning = false;
  
  /**
   * Initialize slideshow with images or slide templates
   * @param {string} containerSelector - CSS selector for slideshow container
   * @param {Array} imagePaths - Array of direct image paths (fallback)
   * @param {string} projectFolder - Project folder name (kept for compatibility but not used)
   * @param {Array} slideTemplates - Array of slide template objects (optional)
   */
  function init(containerSelector, imagePaths, projectFolder = null, slideTemplates = null) {
    // Get slideshow container
    slideshowContainer = document.querySelector(containerSelector);
    if (!slideshowContainer) {
      console.error('Slideshow container not found with selector:', containerSelector);
      return;
    }
    
    // Store references to counter elements if they exist
    currentSlideElement = document.querySelector('.current-slide');
    projectCounter = document.querySelector('.project-slideshow-counter');
    
    // Create slides based on slide templates or image paths
    if (slideTemplates && slideTemplates.length > 0) {
      createSlidesFromTemplates(slideTemplates);
    } else {
      createSlides(imagePaths);
    }
    
    // Set initial project counter
    if (projectCounter) {
      projectCounter.textContent = `1 / ${slides.length}`;
    }
    
    // Show first slide
    if (slides.length > 0) {
      showSlide(0);
    } else {
      console.error('No slides created!');
    }
    
    // Setup navigation areas for desktop slideshow
    setupDesktopNavigation();
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
    
    // Add swipe navigation for touch devices
    initSwipeNavigation();
  }
  
  /**
   * Setup desktop navigation areas
   */
  function setupDesktopNavigation() {
    // Get the wrapper element (or use container as fallback)
    const slideshowWrapper = slideshowContainer.querySelector('.slideshow-wrapper') || slideshowContainer;
    
    // Create navigation areas if they don't exist (for desktop)
    let prevArea = slideshowWrapper.querySelector('.slideshow-nav-area.prev');
    let nextArea = slideshowWrapper.querySelector('.slideshow-nav-area.next');
    
    if (!prevArea) {
      prevArea = document.createElement('div');
      prevArea.classList.add('slideshow-nav-area', 'prev');
      prevArea.setAttribute('aria-label', 'Previous image');
      slideshowWrapper.appendChild(prevArea);
    }
    
    if (!nextArea) {
      nextArea = document.createElement('div');
      nextArea.classList.add('slideshow-nav-area', 'next');
      nextArea.setAttribute('aria-label', 'Next image');
      slideshowWrapper.appendChild(nextArea);
    }
    
    // Attach event listeners to navigation areas
    prevArea.addEventListener('click', prev);
    nextArea.addEventListener('click', next);
  }
  
  /**
   * Create slide elements from slide templates
   * @param {Array} slideTemplates - Array of slide template objects
   */
  function createSlidesFromTemplates(slideTemplates) {
    // Get the wrapper element (or use container as fallback)
    const slideContainer = slideshowContainer.querySelector('.slideshow-wrapper') || slideshowContainer;
    
    // Clear any existing slides but preserve navigation areas
    const existingSlides = slideContainer.querySelectorAll('.slide');
    existingSlides.forEach(slide => slide.remove());
    
    // Reset slides array
    slides = [];
    
    // Create a new slide for each template
    slideTemplates.forEach((template, index) => {
      const slide = document.createElement('div');
      slide.classList.add('slide', `slide-${template.type}`);
      
      // Handle different template types
      template.images.forEach((imagePath, imgIndex) => {
        const img = document.createElement('img');
        img.src = ImageLoader.fixImagePath(imagePath); // Use ImageLoader to fix path
        img.alt = `Slide ${index + 1}, Image ${imgIndex + 1}`;
        img.loading = index < 2 ? 'eager' : 'lazy'; // Load first two slides eagerly
        
        slide.appendChild(img);
      });
      
      slideContainer.appendChild(slide);
      
      // Add to slides array
      slides.push(slide);
    });
    
    // Preload next and previous images for smoother transitions
    preloadAdjacentImages();
  }

  /**
   * Create slide elements from image paths (fallback method)
   * @param {Array} imagePaths - Array of direct image paths
   */
  function createSlides(imagePaths) {
    // Get the wrapper element (or use container as fallback)
    const slideContainer = slideshowContainer.querySelector('.slideshow-wrapper') || slideshowContainer;
    
    // Clear any existing slides but preserve navigation areas
    const existingSlides = slideContainer.querySelectorAll('.slide');
    existingSlides.forEach(slide => slide.remove());
    
    // Reset slides array
    slides = [];
    
    // Create a new slide for each image
    imagePaths.forEach((imagePath, index) => {
      const slide = document.createElement('div');
      slide.classList.add('slide', 'slide-main'); // Default to main template
      
      const img = document.createElement('img');
      img.src = imagePath;
      img.alt = `Slide ${index + 1}`;
      img.loading = index < 2 ? 'eager' : 'lazy'; // Load first two slides eagerly
      
      slide.appendChild(img);
      slideContainer.appendChild(slide);
      
      // Add to slides array
      slides.push(slide);
    });
    
    // Preload next and previous images for smoother transitions
    preloadAdjacentImages();
  }
  
  /**
   * Show slide at the specified index
   * @param {number} index - Index of slide to show
   */
  function showSlide(index) {
    // Prevent rapid transitions
    if (isTransitioning) return;
    isTransitioning = true;
    
    // Ensure index is within bounds
    if (index < 0) {
      index = slides.length - 1;
    } else if (index >= slides.length) {
      index = 0;
    }
    
    // Update current index
    currentIndex = index;
    
    // Remove active class from all slides
    slides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    // Add active class to current slide
    slides[currentIndex].classList.add('active');
    
    // Update counter
    if (currentSlideElement) {
      currentSlideElement.textContent = currentIndex + 1;
    }
    
    // Update project counter
    if (projectCounter) {
      projectCounter.textContent = `${currentIndex + 1} / ${slides.length}`;
    }
    
    // Preload adjacent images
    preloadAdjacentImages();
    
    // Reset transition lock after animation completes
    setTimeout(() => {
      isTransitioning = false;
    }, 300); // Match this to your CSS transition time
  }
  
  /**
   * Show previous slide
   */
  function prev() {
    showSlide(currentIndex - 1);
  }
  
  /**
   * Show next slide
   */
  function next() {
    showSlide(currentIndex + 1);
  }
  
  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} event - Keyboard event
   */
  function handleKeyPress(event) {
    // Only handle keyboard events if slideshow is visible
    if (!isVisible()) return;
    
    switch (event.key) {
      case 'ArrowLeft':
        prev();
        event.preventDefault();
        break;
      case 'ArrowRight':
        next();
        event.preventDefault();
        break;
    }
  }
  
  /**
   * Initialize swipe navigation for touch devices
   */
  function initSwipeNavigation() {
    if (!slideshowContainer) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    slideshowContainer.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slideshowContainer.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      const swipeThreshold = 50; // Minimum distance for a swipe
      
      if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left: show next slide
        next();
      } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right: show previous slide
        prev();
      }
    }
  }
  
  /**
   * Preload adjacent images for smoother transitions
   */
  function preloadAdjacentImages() {
    const imagesToPreload = [];
    
    // Get previous slide images
    const prevIndex = currentIndex - 1 < 0 ? slides.length - 1 : currentIndex - 1;
    if (slides[prevIndex]) {
      const prevImgs = slides[prevIndex].querySelectorAll('img');
      prevImgs.forEach(img => {
        if (img.src) {
          imagesToPreload.push(img.src);
      }
      });
    }
    
    // Get next slide images
    const nextIndex = currentIndex + 1 >= slides.length ? 0 : currentIndex + 1;
    if (slides[nextIndex]) {
      const nextImgs = slides[nextIndex].querySelectorAll('img');
      nextImgs.forEach(img => {
        if (img.src) {
          imagesToPreload.push(img.src);
      }
      });
    }
    
    // Preload the images
    if (imagesToPreload.length > 0 && ImageLoader.preloadImages) {
      ImageLoader.preloadImages(imagesToPreload);
    }
  }
  
  /**
   * Check if slideshow is visible on the page
   * @returns {boolean} - True if slideshow is visible
   */
  function isVisible() {
    return slideshowContainer && 
           slideshowContainer.offsetParent !== null &&
           window.getComputedStyle(slideshowContainer).display !== 'none';
  }
  
  /**
   * Start autoplay
   * @param {number} interval - Interval in milliseconds (default: 5000)
   */
  function startAutoplay(interval = 5000) {
    stopAutoplay(); // Clear any existing timer
    
    autoplayTimer = setInterval(() => {
      next();
    }, interval);
  }
  
  /**
   * Stop autoplay
   */
  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }
  
  /**
   * Get current slide index
   * @returns {number} - Current slide index
   */
  function getCurrentIndex() {
    return currentIndex;
  }
  
  /**
   * Get total number of slides
   * @returns {number} - Total slides count
   */
  function getTotalSlides() {
    return slides.length;
  }
  
  // Public API
  return {
    init,
    prev,
    next,
    showSlide,
    startAutoplay,
    stopAutoplay,
    getCurrentIndex,
    getTotalSlides
  };
})(); 
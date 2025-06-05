/**
 * Mobile Project Module
 * Handles mobile project page layout and slideshow functionality
 */

const MobileProject = (function() {
  // Private variables
  let currentProject;
  let slides = [];
  let currentSlideIndex = 0;
  let isTransitioning = false;
  let slideshow;
  let isProjectInfoVisible = false;
  
  // UI elements
  let mobileProjectContainer;
  let projectIdElement;
  let closeButtonElement;
  let galleryButtonElement;
  let projectTitleElement;
  let projectInfoToggle;
  let contactElement;
  let projectInfoElement;
  let slideshowContainer;
  let slideshowWrapper;
  let slideshowCounter;
  
  /**
   * Initialize mobile project page
   * @param {Object} project - Project data
   */
  function init(project) {
    // Only initialize on mobile
    if (window.innerWidth > 768) return;
    
    currentProject = project;
    
    // Create mobile layout container
    createMobileLayout();
    
    // Create fixed UI elements
    createFixedUIElements();
    
    // Create mobile slideshow
    createMobileSlideshow();
    
    // Initialize slideshow with project images
    initializeSlideshow();
    
    // Setup resize handler
    window.addEventListener('resize', handleResize);
  }
  
  /**
   * Create the mobile layout container
   */
  function createMobileLayout() {
    mobileProjectContainer = document.createElement('div');
    mobileProjectContainer.classList.add('mobile-project-layout');
    document.body.appendChild(mobileProjectContainer);
  }
  
  /**
   * Create fixed UI elements
   */
  function createFixedUIElements() {
    // Project ID - top left
    projectIdElement = document.createElement('div');
    projectIdElement.classList.add('mobile-project-id');
    projectIdElement.textContent = currentProject.id;
    document.body.appendChild(projectIdElement);
    
    // Close button - top right
    closeButtonElement = document.createElement('a');
    closeButtonElement.classList.add('mobile-close-button');
    closeButtonElement.textContent = 'Close';
    closeButtonElement.href = '../index.html';
    document.body.appendChild(closeButtonElement);
    
    // Gallery button - top center
    galleryButtonElement = document.createElement('a');
    galleryButtonElement.classList.add('mobile-gallery-button');
    galleryButtonElement.textContent = 'Gallery';
    galleryButtonElement.href = `gallery.html?project=${currentProject.id}`;
    document.body.appendChild(galleryButtonElement);
    
    // Project title with toggle - bottom right
    projectTitleElement = document.createElement('div');
    projectTitleElement.classList.add('mobile-project-title');
    projectTitleElement.innerHTML = `${currentProject.title}<span class="mobile-info-toggle">[+]</span>`;
    projectTitleElement.style.cursor = 'pointer';
    projectTitleElement.addEventListener('click', toggleProjectInfo);
    document.body.appendChild(projectTitleElement);
    
    // Contact info - bottom left (initially visible)
    contactElement = document.createElement('div');
    contactElement.classList.add('mobile-contact');
    contactElement.innerHTML = `
      <h1 class="photographer-name">Pep Pérez Guarro</h1>
      <div class="contact-links">
        <div class="contact-link-wrapper">
          <h1>MAIL</h1>
          <a href="mailto:info@pepperezguarro.com">info@pepperezguarro.com</a>
        </div>
        <div class="contact-link-wrapper">
          <h1>TEL</h1>
          <a href="tel:+34681378820">+34 681 378 820</a>
        </div>
        <div class="contact-link-wrapper">
          <h1>SOCIAL</h1>
          <a href="https://instagram.com/pepperezguarro" target="_blank">@pepperezguarro</a>
        </div>
      </div>
    `;
    document.body.appendChild(contactElement);
    
    // Project info - bottom left (initially hidden)
    projectInfoElement = document.createElement('div');
    projectInfoElement.classList.add('mobile-project-info');
    projectInfoElement.style.display = 'none';
    projectInfoElement.innerHTML = `
      <div class="info-top-row">
        <div class="project-metadata">
          <div class="metadata-item">
            <span class="label">LOCATION</span> <span class="value">${currentProject.location}</span>
          </div>
          <div class="metadata-item">
            <span class="label">YEAR</span> <span class="value">${currentProject.date}</span>
          </div>
          <div class="metadata-item">
            <span class="label">CLIENT</span> <span class="value">${currentProject.client}</span>
          </div>
        </div>
        <div class="project-title-in-info">${currentProject.title}<span class="mobile-info-toggle">[-]</span></div>
      </div>
      <p class="project-description">${currentProject.description}</p>
    `;
    document.body.appendChild(projectInfoElement);
    
    // Add click event to the title in the info container
    const titleInInfo = projectInfoElement.querySelector('.project-title-in-info');
    titleInInfo.addEventListener('click', toggleProjectInfo);
  }
  
  /**
   * Create mobile slideshow container
   */
  function createMobileSlideshow() {
    // Main slideshow container
    slideshowContainer = document.createElement('div');
    slideshowContainer.classList.add('mobile-slideshow-container');
    
    // Slideshow wrapper
    slideshowWrapper = document.createElement('div');
    slideshowWrapper.classList.add('mobile-slideshow-wrapper');
    
    // NOTE: Navigation areas are now created by the unified navigation system
    
    slideshowContainer.appendChild(slideshowWrapper);
    mobileProjectContainer.appendChild(slideshowContainer);
    
    // Create slideshow counter - positioned in center
    slideshowCounter = document.createElement('div');
    slideshowCounter.classList.add('mobile-slideshow-counter');
    slideshowCounter.textContent = '1 / 1'; // Will be updated when slides are created
    document.body.appendChild(slideshowCounter);
    
    // Add touch/swipe navigation
    setupTouchNavigation();
  }
  
  /**
   * Setup touch/swipe navigation for mobile slideshow
   */
  function setupTouchNavigation() {
    if (!slideshowWrapper) return;
    
    // Setup unified navigation with vertical swipe
    UnifiedNavigation.setupNavigation(slideshowWrapper, {
      onPrev: prevSlide,
      onNext: nextSlide
    }, {
      enableSwipe: true,
      enableClick: false, // We already have click areas
      enableKeyboard: false, // We handle keyboard separately
      swipeDirection: 'vertical', // Changed from horizontal to vertical
      swipeThreshold: 50
    });
  }
  
  /**
   * Initialize slideshow with project images
   */
  function initializeSlideshow() {
    // Get slideshow images
    const slideshowImages = ImageLoader.getSlideshowImagePaths(currentProject);
    
    if (slideshowImages.length === 0) {
      console.error('No slideshow images found for project:', currentProject.id);
      return;
    }
    
    // Clear existing slides
    slides = [];
    const existingSlides = slideshowWrapper.querySelectorAll('.mobile-slide');
    existingSlides.forEach(slide => {
      if (!slide.classList.contains('mobile-slideshow-nav-area')) {
        slide.remove();
      }
    });
    
    // Create slides
    slideshowImages.forEach((imagePath, index) => {
      const slide = document.createElement('div');
      slide.classList.add('mobile-slide');
      
      const img = document.createElement('img');
      img.src = imagePath;
      img.alt = `${currentProject.title} - Image ${index + 1}`;
      img.loading = index < 2 ? 'eager' : 'lazy';
      
      slide.appendChild(img);
      slideshowWrapper.appendChild(slide);
      slides.push(slide);
    });
    
    // Show first slide
    if (slides.length > 0) {
      showSlide(0);
    }
    
    // Setup keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
  }
  
  /**
   * Show slide at specific index
   * @param {number} index - Slide index
   */
  function showSlide(index) {
    if (isTransitioning || !slides.length) return;
    
    isTransitioning = true;
    
    // Ensure index is within bounds
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    currentSlideIndex = index;
    
    // Update slide visibility
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlideIndex);
    });
    
    // Update slideshow counter
    if (slideshowCounter) {
      slideshowCounter.textContent = `${currentSlideIndex + 1} / ${slides.length}`;
    }
    
    // Reset transition flag
    setTimeout(() => {
      isTransitioning = false;
    }, 300);
  }
  
  /**
   * Show previous slide
   */
  function prevSlide() {
    showSlide(currentSlideIndex - 1);
  }
  
  /**
   * Show next slide
   */
  function nextSlide() {
    showSlide(currentSlideIndex + 1);
  }
  
  /**
   * Toggle project info visibility
   */
  function toggleProjectInfo() {
    isProjectInfoVisible = !isProjectInfoVisible;
    
    if (isProjectInfoVisible) {
      // Show project info, hide contact and bottom title
      contactElement.style.display = 'none';
      projectTitleElement.style.display = 'none';
      projectInfoElement.style.display = 'block';
      // Add class to reduce slideshow opacity
      document.body.classList.add('project-info-visible');
      // Add click outside to close
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100); // Small delay to prevent immediate closure
    } else {
      // Hide project info, show contact and bottom title
      contactElement.style.display = 'block';
      projectTitleElement.style.display = 'block';
      projectInfoElement.style.display = 'none';
      // Remove class to restore slideshow opacity
      document.body.classList.remove('project-info-visible');
      // Remove click outside listener
      document.removeEventListener('click', handleClickOutside);
    }
  }
  
  /**
   * Handle clicks outside project info to close it
   */
  function handleClickOutside(event) {
    // Don't close if clicking on the project info element itself
    if (projectInfoElement && projectInfoElement.contains(event.target)) {
      return;
    }
    
    // Don't close if clicking on the title toggle (it has its own handler)
    if (projectTitleElement && projectTitleElement.contains(event.target)) {
      return;
    }
    
    // Close project info
    if (isProjectInfoVisible) {
      toggleProjectInfo();
    }
  }
  
  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} event - Keyboard event
   */
  function handleKeyPress(event) {
    // Only handle if on mobile and elements are visible
    if (window.innerWidth > 768 || !mobileProjectContainer) return;
    
    switch (event.key) {
      case 'ArrowLeft':
        prevSlide();
        event.preventDefault();
        break;
      case 'ArrowRight':
        nextSlide();
        event.preventDefault();
        break;
      case 'Escape':
        window.location.href = '../index.html';
        event.preventDefault();
        break;
    }
  }
  
  /**
   * Handle window resize
   */
  function handleResize() {
    if (window.innerWidth > 768) {
      // Hide mobile elements on desktop
      if (mobileProjectContainer) mobileProjectContainer.style.display = 'none';
      if (projectIdElement) projectIdElement.style.display = 'none';
      if (closeButtonElement) closeButtonElement.style.display = 'none';
      if (galleryButtonElement) galleryButtonElement.style.display = 'none';
      if (projectTitleElement) projectTitleElement.style.display = 'none';
      if (contactElement) contactElement.style.display = 'none';
      if (projectInfoElement) projectInfoElement.style.display = 'none';
      if (slideshowCounter) slideshowCounter.style.display = 'none';
      // Clean up project info class and listeners
      document.body.classList.remove('project-info-visible');
      document.removeEventListener('click', handleClickOutside);
    } else {
      // Show mobile elements on mobile
      if (mobileProjectContainer) mobileProjectContainer.style.display = 'block';
      if (projectIdElement) projectIdElement.style.display = 'block';
      if (closeButtonElement) closeButtonElement.style.display = 'block';
      if (galleryButtonElement) galleryButtonElement.style.display = 'block';
      if (projectTitleElement) projectTitleElement.style.display = 'block';
      if (contactElement) contactElement.style.display = 'block';
      if (slideshowCounter) slideshowCounter.style.display = 'block';
      // Don't show project info by default on resize
      if (projectInfoElement) projectInfoElement.style.display = 'none';
      isProjectInfoVisible = false;
      // Clean up project info class and listeners
      document.body.classList.remove('project-info-visible');
      document.removeEventListener('click', handleClickOutside);
    }
  }
  
  /**
   * Cleanup function
   */
  function destroy() {
    // Remove event listeners
    document.removeEventListener('keydown', handleKeyPress);
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('click', handleClickOutside);
    
    // Clean up project info class
    document.body.classList.remove('project-info-visible');
    
    // Remove DOM elements
    if (mobileProjectContainer) mobileProjectContainer.remove();
    if (projectIdElement) projectIdElement.remove();
    if (closeButtonElement) closeButtonElement.remove();
    if (galleryButtonElement) galleryButtonElement.remove();
    if (projectTitleElement) projectTitleElement.remove();
    if (contactElement) contactElement.remove();
    if (projectInfoElement) projectInfoElement.remove();
    if (slideshowCounter) slideshowCounter.remove();
  }
  
  // Public API
  return {
    init,
    destroy,
    prevSlide,
    nextSlide,
    getCurrentSlideIndex: () => currentSlideIndex,
    getTotalSlides: () => slides.length
  };
})(); 
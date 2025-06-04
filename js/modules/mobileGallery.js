/**
 * Mobile Gallery Module
 * Handles mobile gallery page layout with project info functionality
 */

const MobileGallery = (function() {
  // Private variables
  let currentProject;
  let isProjectInfoVisible = false;
  
  // UI elements
  let projectIdElement;
  let closeButtonElement;
  let selectionButtonElement;
  let projectTitleElement;
  let contactElement;
  let projectInfoElement;
  let galleryCounterElement;
  
  /**
   * Initialize mobile gallery page
   * @param {Object} project - Project data
   */
  function init(project) {
    // Only initialize on mobile
    if (window.innerWidth > 768) return;
    
    currentProject = project;
    
    // Create fixed UI elements
    createFixedUIElements();
    
    // Create mobile gallery counter
    createGalleryCounter();
    
    // Setup lightbox counter updates
    setupLightboxCounterUpdates();
    
    // Setup resize handler
    window.addEventListener('resize', handleResize);
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
    
    // Selection button - top center (links back to project slideshow)
    selectionButtonElement = document.createElement('a');
    selectionButtonElement.classList.add('mobile-gallery-button');
    selectionButtonElement.textContent = 'Selection';
    selectionButtonElement.href = `project.html?project=${currentProject.id}`;
    document.body.appendChild(selectionButtonElement);
    
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
   * Toggle project info visibility
   */
  function toggleProjectInfo() {
    isProjectInfoVisible = !isProjectInfoVisible;
    
    if (isProjectInfoVisible) {
      // Show project info, hide contact and bottom title
      contactElement.style.display = 'none';
      projectTitleElement.style.display = 'none';
      projectInfoElement.style.display = 'block';
      // Add class to reduce gallery grid opacity
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
      // Remove class to restore gallery grid opacity
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
   * Handle window resize
   */
  function handleResize() {
    if (window.innerWidth > 768) {
      // Hide mobile elements on desktop
      if (projectIdElement) projectIdElement.style.display = 'none';
      if (closeButtonElement) closeButtonElement.style.display = 'none';
      if (selectionButtonElement) selectionButtonElement.style.display = 'none';
      if (projectTitleElement) projectTitleElement.style.display = 'none';
      if (contactElement) contactElement.style.display = 'none';
      if (projectInfoElement) projectInfoElement.style.display = 'none';
      if (galleryCounterElement) galleryCounterElement.style.display = 'none';
      // Clean up project info class and listeners
      document.body.classList.remove('project-info-visible');
      document.removeEventListener('click', handleClickOutside);
    } else {
      // Show mobile elements on mobile
      if (projectIdElement) projectIdElement.style.display = 'block';
      if (closeButtonElement) closeButtonElement.style.display = 'block';
      if (selectionButtonElement) selectionButtonElement.style.display = 'block';
      if (projectTitleElement) projectTitleElement.style.display = 'block';
      if (contactElement) contactElement.style.display = 'block';
      if (galleryCounterElement) galleryCounterElement.style.display = 'block';
      // Don't show project info by default on resize
      if (projectInfoElement) projectInfoElement.style.display = 'none';
      isProjectInfoVisible = false;
      // Clean up project info class and listeners
      document.body.classList.remove('project-info-visible');
      document.removeEventListener('click', handleClickOutside);
    }
  }
  
  /**
   * Create mobile gallery counter
   */
  function createGalleryCounter() {
    galleryCounterElement = document.createElement('div');
    galleryCounterElement.classList.add('mobile-gallery-counter');
    
    // Get total number of gallery images
    const galleryImages = ImageLoader.getGalleryImagePaths(currentProject);
    galleryCounterElement.textContent = `${galleryImages.length} / ${galleryImages.length}`;
    
    document.body.appendChild(galleryCounterElement);
  }
  
  /**
   * Setup lightbox counter updates
   */
  function setupLightboxCounterUpdates() {
    // Observer to watch for lightbox state changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const lightbox = mutation.target;
          const isLightboxActive = lightbox.classList.contains('active');
          
          if (isLightboxActive) {
            // Lightbox opened - start monitoring counter updates
            startLightboxCounterMonitoring();
            // Add navigation event listeners
            addLightboxNavigationListeners();
          } else {
            // Lightbox closed - reset to grid mode counter
            resetToGridCounter();
            // Remove navigation event listeners
            removeLightboxNavigationListeners();
          }
        }
      });
    });
    
    // Start observing lightbox when it's created
    const checkForLightbox = () => {
      const lightbox = document.querySelector('.lightbox');
      if (lightbox) {
        observer.observe(lightbox, { attributes: true });
      } else {
        // Lightbox not created yet, check again
        setTimeout(checkForLightbox, 100);
      }
    };
    
    checkForLightbox();
  }
  
  /**
   * Start monitoring lightbox counter updates
   */
  function startLightboxCounterMonitoring() {
    // Monitor the desktop project counter for changes and mirror them
    const projectCounter = document.querySelector('.project-slideshow-counter');
    if (projectCounter && galleryCounterElement) {
      // Force initial update with current lightbox position
      updateCounterFromLightbox();
      
      // Watch for changes to the project counter
      const counterObserver = new MutationObserver(() => {
        if (galleryCounterElement) {
          updateCounterFromLightbox();
        }
      });
      
      counterObserver.observe(projectCounter, { 
        childList: true, 
        characterData: true, 
        subtree: true 
      });
      
      // Store observer to disconnect later
      galleryCounterElement._counterObserver = counterObserver;
    }
  }
  
  /**
   * Update counter from lightbox current position
   */
  function updateCounterFromLightbox() {
    if (!galleryCounterElement) return;
    
    // Try to get current position from desktop counter first
    const projectCounter = document.querySelector('.project-slideshow-counter');
    if (projectCounter) {
      const counterText = projectCounter.textContent.trim();
      // Check if it's in lightbox format (not total/total)
      const galleryImages = ImageLoader.getGalleryImagePaths(currentProject);
      const totalImages = galleryImages.length;
      
      // If counter shows current/total format (not total/total), use it
      if (counterText !== `${totalImages} / ${totalImages}`) {
        galleryCounterElement.textContent = counterText;
        return;
      }
    }
    
    // Fallback: try to determine current image from lightbox directly
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = lightbox ? lightbox.querySelector('.lightbox-image') : null;
    
    if (lightboxImage && lightboxImage.src) {
      // Find current image index by matching the src
      const galleryImages = ImageLoader.getGalleryImagePaths(currentProject);
      const currentIndex = galleryImages.findIndex(imagePath => {
        // Extract filename from both paths for comparison
        const lightboxFilename = lightboxImage.src.split('/').pop();
        const galleryFilename = imagePath.split('/').pop();
        return lightboxFilename === galleryFilename;
      });
      
      if (currentIndex !== -1) {
        galleryCounterElement.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
      }
    }
  }
  
  /**
   * Reset counter to grid mode (total/total)
   */
  function resetToGridCounter() {
    if (galleryCounterElement) {
      // Disconnect any existing observer
      if (galleryCounterElement._counterObserver) {
        galleryCounterElement._counterObserver.disconnect();
        delete galleryCounterElement._counterObserver;
      }
      
      // Reset to grid mode counter
      const galleryImages = ImageLoader.getGalleryImagePaths(currentProject);
      galleryCounterElement.textContent = `${galleryImages.length} / ${galleryImages.length}`;
    }
  }
  
  /**
   * Add event listeners for lightbox navigation
   */
  function addLightboxNavigationListeners() {
    // Listen for keyboard navigation
    document.addEventListener('keydown', handleLightboxKeyNavigation);
    
    // Listen for click navigation
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
      const navAreas = lightbox.querySelectorAll('.lightbox-nav-area');
      navAreas.forEach(area => {
        area.addEventListener('click', handleLightboxClickNavigation);
      });
    }
  }
  
  /**
   * Remove event listeners for lightbox navigation
   */
  function removeLightboxNavigationListeners() {
    document.removeEventListener('keydown', handleLightboxKeyNavigation);
    
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
      const navAreas = lightbox.querySelectorAll('.lightbox-nav-area');
      navAreas.forEach(area => {
        area.removeEventListener('click', handleLightboxClickNavigation);
      });
    }
  }
  
  /**
   * Handle lightbox keyboard navigation
   */
  function handleLightboxKeyNavigation(event) {
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox || !lightbox.classList.contains('active')) return;
    
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      // Small delay to allow desktop counter to update first
      setTimeout(() => {
        updateCounterFromLightbox();
      }, 50);
    }
  }
  
  /**
   * Handle lightbox click navigation
   */
  function handleLightboxClickNavigation() {
    // Small delay to allow desktop counter to update first
    setTimeout(() => {
      updateCounterFromLightbox();
    }, 50);
  }
  
  /**
   * Cleanup function
   */
  function destroy() {
    // Remove event listeners
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('click', handleClickOutside);
    
    // Clean up lightbox navigation listeners
    removeLightboxNavigationListeners();
    
    // Clean up counter observer
    if (galleryCounterElement && galleryCounterElement._counterObserver) {
      galleryCounterElement._counterObserver.disconnect();
    }
    
    // Clean up project info class
    document.body.classList.remove('project-info-visible');
    
    // Remove DOM elements
    if (projectIdElement) projectIdElement.remove();
    if (closeButtonElement) closeButtonElement.remove();
    if (selectionButtonElement) selectionButtonElement.remove();
    if (projectTitleElement) projectTitleElement.remove();
    if (contactElement) contactElement.remove();
    if (projectInfoElement) projectInfoElement.remove();
    if (galleryCounterElement) galleryCounterElement.remove();
  }
  
  // Public API
  return {
    init,
    destroy,
    toggleProjectInfo
  };
})(); 
/**
 * Main application entry point
 * Handles initialization and page-specific functionality
 */

// Prevent WebSocket connections from blocking back/forward cache in production
(function() {
  // Detect if we're in a production environment (not local development)
  const isLocalDevelopment = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.hostname === '0.0.0.0' ||
                           window.location.hostname.includes('.local') ||
                           window.location.port !== '';
  
  // Also check for common development indicators
  const isDevelopment = isLocalDevelopment || 
                       document.documentElement.hasAttribute('data-development') ||
                       localStorage.getItem('development-mode') === 'true';
  
  if (!isDevelopment) {
    // Override WebSocket constructor to prevent unwanted connections in production
    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
      // Allow WebSocket connections from the same origin for legitimate use
      const urlObj = new URL(url, window.location.href);
      const isSameOrigin = urlObj.origin === window.location.origin;
      
      // Block common development tool patterns
      const isDevelopmentWS = url.includes('livereload') || 
                             url.includes('browser-sync') || 
                             url.includes('hot-reload') ||
                             url.includes(':3000') ||
                             url.includes(':8080') ||
                             url.includes(':5500') ||
                             url.includes('_webpack_hmr');
      
      if (isDevelopmentWS) {
        console.warn('Development WebSocket blocked to enable back/forward cache:', url);
        // Return a mock WebSocket that doesn't actually connect
        return {
          close: () => {},
          send: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => {},
          readyState: 3, // CLOSED
          url: url,
          protocol: '',
          extensions: '',
          bufferedAmount: 0,
          CONNECTING: 0,
          OPEN: 1,
          CLOSING: 2,
          CLOSED: 3,
          onopen: null,
          onclose: null,
          onmessage: null,
          onerror: null
        };
      }
      
      // Allow legitimate WebSocket connections
      return new OriginalWebSocket(url, protocols);
    };
    
    // Copy static properties and prototype
    Object.setPrototypeOf(window.WebSocket, OriginalWebSocket);
    Object.defineProperty(window.WebSocket, 'prototype', {
      value: OriginalWebSocket.prototype,
      writable: false
    });
  }
})();

// Initialize critical layout immediately when scripts load (before DOMContentLoaded)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // DOM already loaded, initialize immediately
  initApp();
}

function initApp() {
  // Prevent layout shifts during initialization
  document.documentElement.style.setProperty('--prevent-shifts', '1');
  
  // Update copyright year
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Pre-optimize critical rendering path
  requestAnimationFrame(() => {
  // Determine current page and initialize appropriate modules
  const currentPath = window.location.pathname;
  
  if (currentPath.endsWith('index.html') || currentPath.endsWith('/')) {
    // Homepage
    initHomepage();
  } else if (currentPath.includes('project.html')) {
    // Project page
    initProjectPage();
  } else if (currentPath.includes('gallery.html')) {
    // Gallery page
    initGalleryPage();
  }
    
    // Remove shift prevention after initialization
    setTimeout(() => {
      document.documentElement.style.removeProperty('--prevent-shifts');
    }, 100);
});
}

/**
 * Initialize homepage functionality
 */
function initHomepage() {
  // Get the projects container
  const projectsGrid = document.querySelector('.projects-grid');
  if (!projectsGrid) return;
  
  // Initialize grid layout manager immediately
  GridLayout.init('.projects-grid');
  
  // Create and add image overlay element
  createImageOverlay();
  
  // Render projects grid (contact cell is already in HTML)
  projects.forEach(project => {
    const projectElement = createProjectElement(project);
    projectsGrid.appendChild(projectElement);
  });
  
  // Apply the fullscreen grid layout immediately
  GridLayout.applyLayout(projects);
  
  // Initialize mobile slider for mobile devices
  MobileSlider.init(projects);
  
  // Dispatch projects loaded event for grid layout optimization
  document.dispatchEvent(new CustomEvent('projectsLoaded', {
    detail: { projects: projects }
  }));
  
  // Initialize image loader for thumbnails with slight delay to prevent blocking
  requestAnimationFrame(() => {
  ImageLoader.lazyLoadImages('.project-thumbnail');
  });
}

/**
 * Create project element for homepage grid
 */
function createProjectElement(project) {
  const projectElement = document.createElement('article');
  projectElement.classList.add('project-item');
  
  // Use data attributes to store project information
  projectElement.dataset.projectId = project.id;
  
  // No thumbnail image needed - will show on hover overlay
  
  // Create project ID overlay (for debugging)
  const projectIdOverlay = document.createElement('div');
  projectIdOverlay.classList.add('project-id');
  projectIdOverlay.textContent = project.id;
  
  // Create project info
  const infoElement = document.createElement('div');
  infoElement.classList.add('project-info');
  
  const titleElement = document.createElement('h1');
  titleElement.classList.add('project-title');
  titleElement.textContent = project.title;
  
  infoElement.appendChild(titleElement);
  
  // Add elements to project item
  projectElement.appendChild(projectIdOverlay);
  projectElement.appendChild(infoElement);
  
  // Add click event to navigate to project page
  projectElement.addEventListener('click', () => {
    Navigation.goToProject(project.id);
  });
  
  // Add hover events for image overlay
  projectElement.addEventListener('mouseenter', () => {
    showImageOverlay(project);
  });
  
  projectElement.addEventListener('mouseleave', () => {
    hideImageOverlay();
  });
  
  return projectElement;
}

/**
 * Initialize project page functionality
 */
function initProjectPage() {
  // Get project ID from URL
  const projectId = Navigation.getProjectIdFromUrl();
  
  if (!projectId) {
    // Handle missing project ID
    console.error('No project ID found in URL');
    return;
  }
  
  // Find project data
  const project = projects.find(p => p.id === projectId);
  
  if (!project) {
    // Handle project not found
    console.error('Project not found:', projectId);
    return;
  }
  
  // Initialize mobile project layout for mobile devices
  if (window.innerWidth <= 768) {
    MobileProject.init(project);
    return; // Skip desktop initialization on mobile
  }
  
  // Desktop initialization
  // Initialize static grid layout manager for project page
  const projectsGrid = document.querySelector('.projects-grid');
  if (projectsGrid) {
    GridLayout.init('.projects-grid');
    
    // Render static projects grid (contact cell is already in HTML)
    projects.forEach(proj => {
      const projectElement = createStaticProjectElement(proj, proj.id === projectId);
      projectsGrid.appendChild(projectElement);
    });
    
    // Apply the fullscreen grid layout
    GridLayout.applyLayout(projects);
  }
  
  // Update page title and metadata
  document.title = `${project.title} | Photographer Portfolio`;
  
  // Check if elements exist before updating them
  const projectTitleElement = document.querySelector('.project-title');
  const projectDescriptionElement = document.querySelector('.project-description');
  
  if (projectTitleElement) {
    projectTitleElement.textContent = project.title;
  }
  if (projectDescriptionElement) {
    projectDescriptionElement.textContent = project.description;
  }
  
  // Update metadata
  const metadataItems = document.querySelectorAll('.metadata-item .value');
  if (metadataItems.length >= 2) {
    metadataItems[0].textContent = project.date;
    metadataItems[1].textContent = project.location;
  }
  
  // Get slideshow images and initialize slideshow
  const slideshowImages = ImageLoader.getSlideshowImagePaths(project);
  
  // Check if slideshow container exists
  const slideshowContainer = document.querySelector('.slideshow-wrapper');
  
  if (slideshowContainer && slideshowImages.length > 0) {
    // Get slide templates with fixed paths
    const slideTemplates = ImageLoader.getSlideTemplates(project);
    
    // Use slide templates if available, otherwise fallback to regular images
    if (slideTemplates && slideTemplates.length > 0) {
      Slideshow.init('.slideshow-wrapper', slideshowImages, project.folder, slideTemplates);
    } else {
    Slideshow.init('.slideshow-wrapper', slideshowImages, project.folder);
    }
  } else {
    console.error('Cannot initialize slideshow. Container:', slideshowContainer, 'Images:', slideshowImages.length);
  }
  
  // Update gallery link to include project ID
  const galleryLink = document.querySelector('.view-all-link');
  if (galleryLink) {
    galleryLink.href = `gallery.html?project=${projectId}`;
  }
  
  // Initialize project info toggle functionality
  initProjectInfoToggle();
}

/**
 * Initialize gallery page functionality
 */
function initGalleryPage() {
  // Get project ID from URL
  const projectId = Navigation.getProjectIdFromUrl();
  
  if (!projectId) {
    // Handle missing project ID
    console.error('No project ID found in URL');
    return;
  }
  
  // Find project data
  const project = projects.find(p => p.id === projectId);
  
  if (!project) {
    // Handle project not found
    console.error('Project not found:', projectId);
    return;
  }
  
  // Initialize mobile gallery layout for mobile devices
  if (window.innerWidth <= 768) {
    MobileGallery.init(project);
    // Continue with gallery initialization for mobile (keep the grid)
  }
  
  // Desktop and mobile gallery initialization
  // Pre-optimize gallery container to prevent layout shifts
  const galleryContainer = document.querySelector('.gallery-grid');
  if (galleryContainer) {
    // Pre-set container properties to prevent shifts
    galleryContainer.style.contain = 'layout style';
    galleryContainer.style.willChange = 'scroll-position';
  }
  
  // Batch DOM updates for better performance
  requestAnimationFrame(() => {
    // Initialize static grid layout manager for gallery page (desktop only)
    if (window.innerWidth > 768) {
      const projectsGrid = document.querySelector('.projects-grid');
      if (projectsGrid) {
        GridLayout.init('.projects-grid');
        
        // Render static projects grid (contact cell is already in HTML)
        const fragment = document.createDocumentFragment();
        projects.forEach(proj => {
          const projectElement = createStaticProjectElement(proj, proj.id === projectId);
          fragment.appendChild(projectElement);
        });
        projectsGrid.appendChild(fragment);
        
        // Apply the fullscreen grid layout
        GridLayout.applyLayout(projects);
      }
  }
  
  // Update page title
  document.title = `All Images - ${project.title} | Photographer Portfolio`;
  
    // Batch metadata updates (desktop only)
    if (window.innerWidth > 768) {
      updateGalleryMetadata(project, projectId);
    }
    
    // Get all gallery images
    const galleryImages = ImageLoader.getGalleryImagePaths(project);
    
    // Update the slideshow counter in the active project cell to show total gallery images (desktop only)
    if (window.innerWidth > 768) {
      const projectCounter = document.querySelector('.project-slideshow-counter');
      if (projectCounter && galleryImages.length > 0) {
        projectCounter.textContent = `${galleryImages.length} / ${galleryImages.length}`;
      }
    }
    
    // Initialize gallery with all project images using optimized loading
    if (galleryContainer && galleryImages.length > 0) {
      // Pre-optimize before gallery initialization
      galleryContainer.style.visibility = 'hidden';
      
      Gallery.init('.gallery-grid', galleryImages, project.folder);
      
      // Show gallery after brief delay to allow layout to settle
      setTimeout(() => {
        galleryContainer.style.visibility = 'visible';
      }, 50);
    } else {
      console.error('Cannot initialize gallery. Container:', galleryContainer, 'Images:', galleryImages.length);
    }
    
    // Initialize project info toggle functionality (desktop only)
    if (window.innerWidth > 768) {
      initProjectInfoToggle();
    }
    
    // Handle window resize for gallery page
    window.addEventListener('resize', handleGalleryResize);
    
    function handleGalleryResize() {
      // Clean up mobile gallery if switching to desktop
      if (window.innerWidth > 768 && typeof MobileGallery !== 'undefined') {
        MobileGallery.destroy();
      }
      // Reinitialize mobile gallery if switching to mobile
      else if (window.innerWidth <= 768 && typeof MobileGallery !== 'undefined') {
        MobileGallery.init(project);
      }
    }
  });
}

/**
 * Update gallery page metadata efficiently
 * @param {Object} project - Project data
 * @param {string} projectId - Project ID
 */
function updateGalleryMetadata(project, projectId) {
  // Update project metadata in contact cell
  const projectTitleElement = document.querySelector('.project-title');
  const projectDescriptionElement = document.querySelector('.project-description');
  
  if (projectTitleElement) {
    projectTitleElement.textContent = project.title;
  }
  if (projectDescriptionElement) {
    projectDescriptionElement.textContent = project.description;
  }
  
  // Update metadata
  const metadataItems = document.querySelectorAll('.metadata-item .value');
  if (metadataItems.length >= 2) {
    metadataItems[0].textContent = project.date;
    metadataItems[1].textContent = project.location;
  }
  
  // Update project page link
  const projectLink = document.querySelector('.back-link');
  if (projectLink) {
    projectLink.href = `project.html?project=${projectId}`;
  }
}

/**
 * Create static project element for project page grid (no interactions)
 * @param {Object} project - Project data
 * @param {boolean} isActive - Whether this is the active/current project
 */
function createStaticProjectElement(project, isActive = false) {
  const projectElement = document.createElement('article');
  projectElement.classList.add('project-item');
  
  // Add class to make inactive projects invisible
  if (!isActive) {
    projectElement.classList.add('project-item-hidden');
  }
  
  // Use data attributes to store project information
  projectElement.dataset.projectId = project.id;
  
  // Create project ID overlay (for debugging)
  const projectIdOverlay = document.createElement('div');
  projectIdOverlay.classList.add('project-id');
  projectIdOverlay.textContent = project.id;
  
  // Create project info (only visible if active)
  if (isActive) {
    const infoElement = document.createElement('div');
    infoElement.classList.add('project-info');
    
    const titleElement = document.createElement('h2');
    titleElement.classList.add('project-title');
    titleElement.textContent = project.title;
    
    infoElement.appendChild(titleElement);
    projectElement.appendChild(infoElement);
    
    // Add slideshow counter for active project
    const counterElement = document.createElement('div');
    counterElement.classList.add('project-slideshow-counter');
    counterElement.textContent = '1 / 0'; // Will be updated by slideshow
    projectElement.appendChild(counterElement);
  
    // Add click handler to open gallery for active project
    projectElement.addEventListener('click', () => {
      Navigation.goToGallery(project.id);
    });
    projectElement.style.cursor = 'pointer';
  }
  
  // Add elements to project item
  projectElement.appendChild(projectIdOverlay);
  
  return projectElement;
}

/**
 * Create the image overlay element
 */
function createImageOverlay() {
  const overlay = document.createElement('div');
  overlay.classList.add('image-overlay');
  overlay.id = 'image-overlay';
  
  const img = document.createElement('img');
  img.alt = 'Project Image';
  overlay.appendChild(img);
  
  document.body.appendChild(overlay);
}

/**
 * Show image overlay with project's cover image
 * @param {Object} project - Project data
 */
function showImageOverlay(project) {
  const overlay = document.getElementById('image-overlay');
  const img = overlay.querySelector('img');
  
  if (overlay && img) {
    img.src = ImageLoader.getCoverImagePath(project);
    img.alt = project.title;
    overlay.classList.add('visible');
  }
}

/**
 * Hide image overlay
 */
function hideImageOverlay() {
  const overlay = document.getElementById('image-overlay');
  
  if (overlay) {
    overlay.classList.remove('visible');
  }
}

/**
 * Initialize project info toggle functionality for project page
 */
function initProjectInfoToggle() {
  const projectInfoBtn = document.querySelector('.project-info-btn');
  const contactContent = document.querySelector('.contact-content');
  const projectInfo = document.querySelector('.contact-cell .project-info');
  
  if (!projectInfoBtn || !contactContent || !projectInfo) {
    return; // Elements not found, probably not on project page
  }
  
  let isProjectInfoVisible = false;
  
  projectInfoBtn.addEventListener('click', () => {
    if (isProjectInfoVisible) {
      // Show contact content, hide project info
      contactContent.classList.remove('hidden');
      projectInfo.classList.remove('visible');
      projectInfoBtn.textContent = '+ Project Info';
      isProjectInfoVisible = false;
    } else {
      // Hide contact content, show project info
      contactContent.classList.add('hidden');
      projectInfo.classList.add('visible');
      projectInfoBtn.textContent = '- Project Info';
      isProjectInfoVisible = true;
    }
  });
} 
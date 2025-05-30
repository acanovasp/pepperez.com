/**
 * Main application entry point
 * Handles initialization and page-specific functionality
 */

// Initialize critical layout immediately when scripts load (before DOMContentLoaded)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // DOM already loaded, initialize immediately
  initApp();
}

function initApp() {
  // Update copyright year
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
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
  
  // Initialize static grid layout manager for gallery page
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
  
  // Update page title
  document.title = `All Images - ${project.title} | Photographer Portfolio`;
  
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
  
  // Get all gallery images
  const galleryImages = ImageLoader.getGalleryImagePaths(project);
  
  // Update the slideshow counter in the active project cell to show total gallery images
  const projectCounter = document.querySelector('.project-slideshow-counter');
  if (projectCounter && galleryImages.length > 0) {
    projectCounter.textContent = `${galleryImages.length} / ${galleryImages.length}`;
  }
  
  // Check if gallery container exists
  const galleryContainer = document.querySelector('.gallery-grid');
  
  // Initialize gallery with all project images
  if (galleryContainer && galleryImages.length > 0) {
    Gallery.init('.gallery-grid', galleryImages, project.folder);
  } else {
    console.error('Cannot initialize gallery. Container:', galleryContainer, 'Images:', galleryImages.length);
  }
  
  // Initialize project info toggle functionality
  initProjectInfoToggle();
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
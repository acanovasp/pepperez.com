/**
 * Mobile Slider Module
 * Handles vertical slider functionality for mobile devices
 */

const MobileSlider = (function() {
  // Private variables
  let sliderContainer;
  let slides = [];
  let currentSlideIndex = 0;
  let isTransitioning = false;
  let projects = [];
  let navigation;
  
  // Fixed UI elements
  let projectIdElement;
  let viewProjectElement;
  let projectTitleElement;
  let contactElement;
  
  /**
   * Initialize mobile slider with projects
   * @param {Array} projectsData - Array of project data
   */
  function init(projectsData) {
    // Only initialize on mobile
    if (window.innerWidth > 768) return;
    
    // Store projects data
    projects = projectsData;
    
    // Create slider container
    createSliderContainer();
    
    // Create fixed UI elements
    createFixedUIElements();
    
    // Create slides for projects only (images)
    createSlides(projects);
    
    // Setup unified navigation
    setupUnifiedNavigation();
    
    // Initialize first slide
    updateSlidePositions();
    updateUIContent();
  }
  
  /**
   * Create the main slider container
   */
  function createSliderContainer() {
    sliderContainer = document.createElement('div');
    sliderContainer.classList.add('mobile-slider');
    document.body.appendChild(sliderContainer);
  }
  
  /**
   * Create fixed UI elements that will update dynamically
   */
  function createFixedUIElements() {
    // Project ID - top left
    projectIdElement = document.createElement('div');
    projectIdElement.classList.add('mobile-project-id');
    document.body.appendChild(projectIdElement);
    
    // View Project button - top right
    viewProjectElement = document.createElement('a');
    viewProjectElement.classList.add('mobile-view-project');
    viewProjectElement.textContent = 'View Project';
    document.body.appendChild(viewProjectElement);
    
    // Project title - bottom right
    projectTitleElement = document.createElement('div');
    projectTitleElement.classList.add('mobile-project-title');
    document.body.appendChild(projectTitleElement);
    
    // Contact info - bottom left (always visible)
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
    console.log('Contact element created and is always visible'); // Debug
  }
  
  /**
   * Create slides for all projects (just images)
   * @param {Array} projects - Array of project data
   */
  function createSlides(projects) {
    // Clear existing slides
    slides = [];
    sliderContainer.innerHTML = '';
    
    // Create slides for each project (only images)
    projects.forEach((project, index) => {
      const slide = createProjectSlide(project, index);
      slides.push(slide);
      sliderContainer.appendChild(slide);
    });
  }
  
  /**
   * Create a project slide (only contains the image)
   * @param {Object} project - Project data
   * @param {number} index - Project index
   */
  function createProjectSlide(project, index) {
    const slide = document.createElement('div');
    slide.classList.add('mobile-slide');
    slide.dataset.index = index;
    slide.dataset.projectId = project.id;
    
    // Project image - center (only thing in the slide)
    const image = document.createElement('img');
    image.classList.add('mobile-slide-image');
    image.src = ImageLoader.getCoverImagePath(project);
    image.alt = project.title;
    image.loading = 'lazy';
    
    slide.appendChild(image);
    
    return slide;
  }
  
  /**
   * Setup unified navigation system
   */
  function setupUnifiedNavigation() {
    if (!sliderContainer) return;
    
    navigation = UnifiedNavigation.setupNavigation(sliderContainer, {
      onPrev: goToPrevSlide,
      onNext: goToNextSlide
    }, {
      enableSwipe: true,
      enableClick: true,
      enableKeyboard: true,
      swipeDirection: 'vertical',
      swipeThreshold: 50
    });
  }
  
  /**
   * Update UI content based on current slide
   */
  function updateUIContent() {
    // Always show contact info, just update project info
    const currentProject = projects[currentSlideIndex];
    if (currentProject) {
      projectIdElement.textContent = currentProject.id;
      projectTitleElement.textContent = currentProject.title;
      viewProjectElement.href = `templates/project.html?project=${currentProject.id}`;
    }
  }
  
  /**
   * Go to next slide
   */
  function goToNextSlide() {
    if (currentSlideIndex < slides.length - 1) {
      currentSlideIndex++;
      updateSlidePositions();
      updateUIContent();
    }
  }
  
  /**
   * Go to previous slide
   */
  function goToPrevSlide() {
    if (currentSlideIndex > 0) {
      currentSlideIndex--;
      updateSlidePositions();
      updateUIContent();
    }
  }
  
  /**
   * Update slide positions based on current index
   */
  function updateSlidePositions() {
    if (isTransitioning) return;
    
    isTransitioning = true;
    
    slides.forEach((slide, index) => {
      slide.classList.remove('current', 'next', 'prev');
      
      if (index === currentSlideIndex) {
        slide.classList.add('current');
      } else if (index > currentSlideIndex) {
        slide.classList.add('next');
      } else {
        slide.classList.add('prev');
      }
    });
    
    // Reset transition flag after animation
    setTimeout(() => {
      isTransitioning = false;
    }, 300);
  }
  
  /**
   * Handle window resize
   */
  function handleResize() {
    // Hide slider on desktop
    if (window.innerWidth > 768) {
      if (sliderContainer) {
        sliderContainer.style.display = 'none';
      }
      // Hide fixed UI elements
      if (projectIdElement) projectIdElement.style.display = 'none';
      if (viewProjectElement) viewProjectElement.style.display = 'none';
      if (projectTitleElement) projectTitleElement.style.display = 'none';
      if (contactElement) contactElement.style.display = 'none';
    } else {
      if (sliderContainer) {
        sliderContainer.style.display = 'block';
      }
      // Show all fixed UI elements on mobile
      if (projectIdElement) projectIdElement.style.display = 'block';
      if (viewProjectElement) viewProjectElement.style.display = 'block';
      if (projectTitleElement) projectTitleElement.style.display = 'block';
      if (contactElement) contactElement.style.display = 'block';
      updateUIContent();
    }
  }
  
  /**
   * Cleanup function
   */
  function destroy() {
    // Destroy unified navigation
    if (navigation) {
      navigation.destroy();
    }
    
    // Remove resize listener
    window.removeEventListener('resize', handleResize);
    
    // Remove DOM elements
    if (sliderContainer) sliderContainer.remove();
    if (projectIdElement) projectIdElement.remove();
    if (viewProjectElement) viewProjectElement.remove();
    if (projectTitleElement) projectTitleElement.remove();
    if (contactElement) contactElement.remove();
  }
  
  // Setup resize listener
  window.addEventListener('resize', handleResize);
  
  // Public API
  return {
    init,
    destroy,
    goToNextSlide,
    goToPrevSlide,
    getCurrentSlideIndex: () => currentSlideIndex
  };
})(); 
/**
 * Navigation Module
 * Handles URL routing and page navigation
 */

const Navigation = (function() {
  /**
   * Navigate to project page with specific project ID
   * @param {string} projectId - ID of the project to navigate to
   */
  function goToProject(projectId) {
    // Check if we're in the templates directory or root
    const prefix = window.location.pathname.includes('templates/') ? '' : 'templates/';
    window.location.href = `${prefix}project.html?project=${projectId}`;
  }
  
  /**
   * Navigate to gallery page with specific project ID
   * @param {string} projectId - ID of the project to navigate to
   */
  function goToGallery(projectId) {
    // Check if we're in the templates directory or root
    const prefix = window.location.pathname.includes('templates/') ? '' : 'templates/';
    window.location.href = `${prefix}gallery.html?project=${projectId}`;
  }
  
  /**
   * Extract project ID from URL query parameters
   * @returns {string|null} - Project ID or null if not found
   */
  function getProjectIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('project');
  }
  
  /**
   * Get URL for project page
   * @param {string} projectId - ID of the project
   * @returns {string} - URL for project page
   */
  function getProjectUrl(projectId) {
    // Check if we're in the templates directory or root
    const prefix = window.location.pathname.includes('templates/') ? '' : 'templates/';
    return `${prefix}project.html?project=${projectId}`;
  }
  
  /**
   * Get URL for gallery page
   * @param {string} projectId - ID of the project
   * @returns {string} - URL for gallery page
   */
  function getGalleryUrl(projectId) {
    // Check if we're in the templates directory or root
    const prefix = window.location.pathname.includes('templates/') ? '' : 'templates/';
    return `${prefix}gallery.html?project=${projectId}`;
  }
  
  /**
   * Navigate back to homepage
   */
  function goToHome() {
    // Check if we're in the templates directory or root
    const homeUrl = window.location.pathname.includes('templates/') ? '../index.html' : 'index.html';
    window.location.href = homeUrl;
  }
  
  /**
   * Handle browser back/forward button navigation
   */
  function initHistoryNavigation() {
    window.addEventListener('popstate', function(event) {
      // Handle browser navigation based on current URL
      const currentPath = window.location.pathname;
      
      if (currentPath.endsWith('index.html') || currentPath.endsWith('/')) {
        // Homepage - no action needed as page will reload
      } else if (currentPath.includes('project.html')) {
        // Project page - reload page to show correct project
        window.location.reload();
      } else if (currentPath.includes('gallery.html')) {
        // Gallery page - reload page to show correct gallery
        window.location.reload();
      }
    });
  }
  
  /**
   * Update page URL without reloading (for client-side navigation)
   * @param {string} url - URL to navigate to
   * @param {string} title - Page title
   */
  function updatePageUrl(url, title) {
    if (window.history && window.history.pushState) {
      window.history.pushState({}, title, url);
      document.title = title;
    }
  }
  
  // Initialize history navigation
  initHistoryNavigation();
  
  // Public API
  return {
    goToProject,
    goToGallery,
    goToHome,
    getProjectIdFromUrl,
    getProjectUrl,
    getGalleryUrl,
    updatePageUrl
  };
})(); 
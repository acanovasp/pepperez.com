/**
 * Unified Navigation Module
 * Provides consistent navigation patterns for all sliders:
 * - Vertical swipe (up/down) for all sliders
 * - Left/right click areas for all sliders
 * - Optimized performance with shared event handling
 */

const UnifiedNavigation = (function() {
  
  /**
   * Setup unified navigation for a container
   * @param {HTMLElement} container - Container element to add navigation to
   * @param {Object} callbacks - Navigation callbacks
   * @param {Function} callbacks.onPrev - Previous slide callback
   * @param {Function} callbacks.onNext - Next slide callback
   * @param {Object} options - Navigation options
   * @param {boolean} options.enableSwipe - Enable swipe navigation (default: true)
   * @param {boolean} options.enableClick - Enable click navigation (default: true)
   * @param {boolean} options.enableKeyboard - Enable keyboard navigation (default: true)
   * @param {number} options.swipeThreshold - Minimum swipe distance (default: 50)
   * @param {string} options.swipeDirection - Swipe direction: 'vertical' or 'horizontal' (default: 'vertical')
   */
  function setupNavigation(container, callbacks, options = {}) {
    // Default options
    const settings = {
      enableSwipe: true,
      enableClick: true,
      enableKeyboard: true,
      swipeThreshold: 50,
      swipeDirection: 'vertical',
      ...options
    };
    
    // Validate callbacks
    if (!callbacks.onPrev || !callbacks.onNext) {
      console.error('UnifiedNavigation: onPrev and onNext callbacks are required');
      return;
    }
    
    // Store navigation data on the container
    const navData = {
      callbacks,
      settings,
      touchData: {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        isDragging: false
      },
      clickAreas: null,
      keyboardHandler: null,
      boundHandlers: {}
    };
    
    // Store on container for cleanup
    container._unifiedNavigation = navData;
    
    // Setup navigation methods
    if (settings.enableClick) {
      setupClickNavigation(container, navData);
    }
    
    if (settings.enableSwipe) {
      setupSwipeNavigation(container, navData);
    }
    
    if (settings.enableKeyboard) {
      setupKeyboardNavigation(container, navData);
    }
    
    return {
      destroy: () => destroyNavigation(container)
    };
  }
  
  /**
   * Setup click navigation areas
   */
  function setupClickNavigation(container, navData) {
    // Create invisible click areas if they don't exist
    let prevArea = container.querySelector('.nav-area.prev');
    let nextArea = container.querySelector('.nav-area.next');
    
    if (!prevArea || !nextArea) {
      // Create areas
      prevArea = document.createElement('div');
      prevArea.classList.add('nav-area', 'prev');
      prevArea.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 50%;
        height: 100%;
        cursor: pointer;
        z-index: 100;
        background: transparent;
        pointer-events: auto;
      `;
      
      nextArea = document.createElement('div');
      nextArea.classList.add('nav-area', 'next');
      nextArea.style.cssText = `
        position: absolute;
        top: 0;
        right: 0;
        width: 50%;
        height: 100%;
        cursor: pointer;
        z-index: 100;
        background: transparent;
        pointer-events: auto;
      `;
      
      container.appendChild(prevArea);
      container.appendChild(nextArea);
    }
    
    // Add event listeners
    const prevHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      navData.callbacks.onPrev();
    };
    
    const nextHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      navData.callbacks.onNext();
    };
    
    prevArea.addEventListener('click', prevHandler);
    nextArea.addEventListener('click', nextHandler);
    
    // Store for cleanup
    navData.clickAreas = { prevArea, nextArea };
    navData.boundHandlers.prevHandler = prevHandler;
    navData.boundHandlers.nextHandler = nextHandler;
  }
  
  /**
   * Setup swipe navigation
   */
  function setupSwipeNavigation(container, navData) {
    const { settings, touchData } = navData;
    
    // Touch start handler
    const touchStartHandler = (e) => {
      if (e.touches && e.touches.length > 0) {
        touchData.startX = e.touches[0].clientX;
        touchData.startY = e.touches[0].clientY;
        touchData.currentX = touchData.startX;
        touchData.currentY = touchData.startY;
        touchData.isDragging = true;
      }
    };
    
    // Touch move handler
    const touchMoveHandler = (e) => {
      if (!touchData.isDragging || !e.touches || e.touches.length === 0) return;
      
      touchData.currentX = e.touches[0].clientX;
      touchData.currentY = e.touches[0].clientY;
      
      // Prevent default scrolling for vertical swipes
      if (settings.swipeDirection === 'vertical') {
        e.preventDefault();
      }
    };
    
    // Touch end handler
    const touchEndHandler = (e) => {
      if (!touchData.isDragging) return;
      
      const deltaX = touchData.currentX - touchData.startX;
      const deltaY = touchData.currentY - touchData.startY;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);
      
      touchData.isDragging = false;
      
      // Determine swipe direction and trigger appropriate callback
      if (settings.swipeDirection === 'vertical') {
        // Vertical swipe: up = next, down = prev
        if (absDeltaY > settings.swipeThreshold && absDeltaY > absDeltaX) {
          if (deltaY > 0) {
            // Swipe down - previous
            navData.callbacks.onPrev();
          } else {
            // Swipe up - next
            navData.callbacks.onNext();
          }
        }
      } else {
        // Horizontal swipe: left = next, right = prev
        if (absDeltaX > settings.swipeThreshold && absDeltaX > absDeltaY) {
          if (deltaX > 0) {
            // Swipe right - previous
            navData.callbacks.onPrev();
          } else {
            // Swipe left - next
            navData.callbacks.onNext();
          }
        }
      }
    };
    
    // Mouse handlers for desktop testing
    const mouseDownHandler = (e) => {
      touchData.startX = e.clientX;
      touchData.startY = e.clientY;
      touchData.currentX = touchData.startX;
      touchData.currentY = touchData.startY;
      touchData.isDragging = true;
      e.preventDefault();
    };
    
    const mouseMoveHandler = (e) => {
      if (!touchData.isDragging) return;
      touchData.currentX = e.clientX;
      touchData.currentY = e.clientY;
    };
    
    const mouseUpHandler = (e) => {
      if (!touchData.isDragging) return;
      
      const deltaX = touchData.currentX - touchData.startX;
      const deltaY = touchData.currentY - touchData.startY;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);
      
      touchData.isDragging = false;
      
      if (settings.swipeDirection === 'vertical') {
        if (absDeltaY > settings.swipeThreshold && absDeltaY > absDeltaX) {
          if (deltaY > 0) {
            navData.callbacks.onPrev();
          } else {
            navData.callbacks.onNext();
          }
        }
      } else {
        if (absDeltaX > settings.swipeThreshold && absDeltaX > absDeltaY) {
          if (deltaX > 0) {
            navData.callbacks.onPrev();
          } else {
            navData.callbacks.onNext();
          }
        }
      }
    };
    
    // Add event listeners
    container.addEventListener('touchstart', touchStartHandler, { passive: false });
    container.addEventListener('touchmove', touchMoveHandler, { passive: false });
    container.addEventListener('touchend', touchEndHandler, { passive: false });
    container.addEventListener('mousedown', mouseDownHandler);
    container.addEventListener('mousemove', mouseMoveHandler);
    container.addEventListener('mouseup', mouseUpHandler);
    
    // Store handlers for cleanup
    navData.boundHandlers.touchStartHandler = touchStartHandler;
    navData.boundHandlers.touchMoveHandler = touchMoveHandler;
    navData.boundHandlers.touchEndHandler = touchEndHandler;
    navData.boundHandlers.mouseDownHandler = mouseDownHandler;
    navData.boundHandlers.mouseMoveHandler = mouseMoveHandler;
    navData.boundHandlers.mouseUpHandler = mouseUpHandler;
  }
  
  /**
   * Setup keyboard navigation
   */
  function setupKeyboardNavigation(container, navData) {
    const keyboardHandler = (e) => {
      // Only handle if container is visible and focused
      if (!isContainerActive(container)) return;
      
      switch (e.key) {
        case 'ArrowUp':
          navData.callbacks.onPrev();
          e.preventDefault();
          break;
        case 'ArrowDown':
          navData.callbacks.onNext();
          e.preventDefault();
          break;
        case 'ArrowLeft':
          navData.callbacks.onPrev();
          e.preventDefault();
          break;
        case 'ArrowRight':
          navData.callbacks.onNext();
          e.preventDefault();
          break;
      }
    };
    
    document.addEventListener('keydown', keyboardHandler);
    navData.keyboardHandler = keyboardHandler;
  }
  
  /**
   * Check if container is active/visible
   */
  function isContainerActive(container) {
    return container && 
           container.offsetParent !== null &&
           window.getComputedStyle(container).display !== 'none' &&
           window.getComputedStyle(container).visibility !== 'hidden';
  }
  
  /**
   * Destroy navigation for a container
   */
  function destroyNavigation(container) {
    const navData = container._unifiedNavigation;
    if (!navData) return;
    
    // Remove click areas and listeners
    if (navData.clickAreas) {
      const { prevArea, nextArea } = navData.clickAreas;
      if (prevArea) {
        prevArea.removeEventListener('click', navData.boundHandlers.prevHandler);
        prevArea.remove();
      }
      if (nextArea) {
        nextArea.removeEventListener('click', navData.boundHandlers.nextHandler);
        nextArea.remove();
      }
    }
    
    // Remove swipe listeners
    if (navData.boundHandlers.touchStartHandler) {
      container.removeEventListener('touchstart', navData.boundHandlers.touchStartHandler);
      container.removeEventListener('touchmove', navData.boundHandlers.touchMoveHandler);
      container.removeEventListener('touchend', navData.boundHandlers.touchEndHandler);
      container.removeEventListener('mousedown', navData.boundHandlers.mouseDownHandler);
      container.removeEventListener('mousemove', navData.boundHandlers.mouseMoveHandler);
      container.removeEventListener('mouseup', navData.boundHandlers.mouseUpHandler);
    }
    
    // Remove keyboard listener
    if (navData.keyboardHandler) {
      document.removeEventListener('keydown', navData.keyboardHandler);
    }
    
    // Clear data
    delete container._unifiedNavigation;
  }
  
  /**
   * Add vertical swipe navigation to lightbox
   */
  function addLightboxVerticalSwipe(lightbox, callbacks) {
    return setupNavigation(lightbox, callbacks, {
      enableSwipe: true,
      enableClick: false, // Lightbox already has click areas
      enableKeyboard: false, // Lightbox already has keyboard navigation
      swipeDirection: 'vertical',
      swipeThreshold: 50
    });
  }
  
  // Public API
  return {
    setupNavigation,
    destroyNavigation,
    addLightboxVerticalSwipe
  };
})(); 
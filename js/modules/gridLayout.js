/**
 * Grid Layout Manager
 * Handles dynamic fullscreen grid calculations and layout
 */

const GridLayout = (function() {
  let gridContainer;
  let currentLayout = null;
  let projectsData = [];
  
  /**
   * Initialize the grid layout system
   * @param {string} containerSelector - CSS selector for grid container
   */
  function init(containerSelector) {
    gridContainer = document.querySelector(containerSelector);
    if (!gridContainer) return;
    
    // Apply initial layout immediately if projects are already available
    if (window.projects && window.projects.length > 0) {
      applyLayout(window.projects);
    }
    
    // Listen for window resize with optimized debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (projectsData.length > 0) {
          applyLayout(projectsData);
        }
      }, 100); // Faster response than 250ms
    }, { passive: true });
    
    // Listen for projects loaded event for immediate layout application
    document.addEventListener('projectsLoaded', (event) => {
      if (event.detail && event.detail.projects) {
        applyLayout(event.detail.projects);
      }
    });
  }
  
  /**
   * Calculate optimal grid dimensions for given number of items
   * @param {number} totalItems - Total number of items including contact cell
   * @returns {Object} Grid layout configuration
   */
  function calculateGridDimensions(totalItems) {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    // Check if we're on mobile (where contact cell will span 2 columns)
    const isMobile = viewport.width <= 768;
    
    // Responsive minimum cell dimensions
    let minCellWidth, minCellHeight, minCols;
    
    if (viewport.width <= 480) {
      // Mobile: smaller minimums, ensure at least 3 columns (contact spans 2 + 1 project)
      minCellWidth = 120;
      minCellHeight = 80;
      minCols = 3;
    } else if (viewport.width <= 768) {
      // Tablet: medium minimums, ensure at least 3 columns  
      minCellWidth = 150;
      minCellHeight = 100;
      minCols = 3;
    } else {
      // Desktop: original minimums and behavior (contact cell single column)
      minCellWidth = 200;
      minCellHeight = 150;
      minCols = 1;
    }
    
    // Calculate ideal aspect ratio for cells (slightly rectangular)
    const idealRatio = 1.3;
    
    // Try different grid configurations to find the best fit
    let bestConfig = null;
    let bestScore = 0;
    
    // Calculate maximum possible columns and rows based on minimum sizes
    const maxCols = Math.floor(viewport.width / minCellWidth);
    const maxRows = Math.floor(viewport.height / minCellHeight);
    
    // Test grid configurations - adjust for contact cell spanning on mobile
    const maxTestCols = isMobile ? 
      Math.min(totalItems + 1, Math.max(maxCols, 8)) : // +1 for contact cell span on mobile
      Math.min(totalItems, Math.max(maxCols, 8)); // Original logic for desktop
    const startCols = Math.max(minCols, isMobile ? 2 : 1); // At least 2 for mobile contact span
    
    for (let cols = startCols; cols <= maxTestCols; cols++) {
      // Calculate effective items - only add extra slot for contact on mobile
      const effectiveItems = isMobile ? totalItems + 1 : totalItems;
      const rows = Math.ceil(effectiveItems / cols);
      
      // Skip if this would exceed our maximum rows
      if (rows > maxRows && maxRows > 0) continue;
      
      // Calculate cell dimensions
      const cellWidth = viewport.width / cols;
      const cellHeight = viewport.height / rows;
      const cellRatio = cellWidth / cellHeight;
      
      // More lenient size checking for mobile
      const isAcceptableSize = viewport.width <= 480 ? 
        (cellWidth >= minCellWidth * 0.8 && cellHeight >= minCellHeight * 0.8) :
        (cellWidth >= minCellWidth && cellHeight >= minCellHeight);
      
      if (!isAcceptableSize) continue;
      
      // Score this configuration
      const ratioScore = 1 - Math.abs(cellRatio - idealRatio) / idealRatio;
      const sizeScore = Math.min(cellWidth, cellHeight) / 300; // Prefer larger cells
      const aspectPenalty = cellRatio > 3 || cellRatio < 0.3 ? 0.5 : 1; // Penalize extreme ratios
      
      // Bonus for meeting minimum column requirements
      const colBonus = cols >= minCols ? 1.2 : 1.0;
      
      const totalScore = (ratioScore * 0.4 + sizeScore * 0.4) * aspectPenalty * colBonus + 0.2;
      
      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestConfig = {
          cols,
          rows,
          cellWidth,
          cellHeight,
          cellRatio,
          totalItems: effectiveItems,
          score: totalScore
        };
      }
    }
    
    // Enhanced fallback to ensure minimum columns
    if (!bestConfig) {
      const cols = Math.max(minCols, Math.floor(viewport.width / (minCellWidth * 0.7)));
      const effectiveItems = isMobile ? totalItems + 1 : totalItems;
      const rows = Math.ceil(effectiveItems / cols);
      bestConfig = {
        cols,
        rows,
        cellWidth: viewport.width / cols,
        cellHeight: viewport.height / rows,
        cellRatio: (viewport.width / cols) / (viewport.height / rows),
        totalItems: effectiveItems,
        score: 0
      };
    }
    
    return bestConfig;
  }
  
  /**
   * Apply grid layout to the container
   * @param {Array} projects - Array of project data
   */
  function applyLayout(projects) {
    if (!gridContainer) return;
    
    // Store projects data for resize handling
    projectsData = projects;
    
    // Check if we're on mobile (where contact cell will span 2 columns)
    const isMobile = window.innerWidth <= 768;
    
    // Total items = projects + 1 contact cell (mobile: spans 2 columns, desktop: 1 column)
    const totalItems = projects.length + 1;
    const layout = calculateGridDimensions(totalItems);
    
    if (!layout) return;
    
    // Store current layout
    currentLayout = layout;
    
    // Apply CSS Grid styles
    gridContainer.style.gridTemplateColumns = `repeat(${layout.cols}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${layout.rows}, 1fr)`;
    
    // Reset all grid positions first
    const allItems = Array.from(gridContainer.children);
    allItems.forEach(item => {
      item.style.gridRow = '';
      item.style.gridColumn = '';
    });
    
    // Calculate contact cell position and spanning
    const contactRow = layout.rows;
    const contactCol = 1;
    // Only span 2 columns on mobile, single column on desktop
    const contactColSpan = isMobile ? Math.min(2, layout.cols) : 1;
    
    // Position contact cell first
    const contactCell = gridContainer.querySelector('.contact-cell');
    if (contactCell) {
      contactCell.style.gridRow = contactRow;
      if (isMobile && contactColSpan > 1) {
        contactCell.style.gridColumn = `${contactCol} / ${contactCol + contactColSpan}`;
      } else {
      contactCell.style.gridColumn = contactCol;
      }
    }
    
    // Get project items (exclude contact cell)
    const projectItems = allItems.filter(item => !item.classList.contains('contact-cell'));
    
    // Position project items, skipping the contact cell position
    let itemIndex = 0;
    for (let row = 1; row <= layout.rows; row++) {
      for (let col = 1; col <= layout.cols; col++) {
        // Skip contact cell position (spanning logic depends on screen size)
        const isContactPosition = isMobile ? 
          (row === contactRow && col >= contactCol && col < contactCol + contactColSpan) :
          (row === contactRow && col === contactCol);
          
        if (isContactPosition) {
          continue;
        }
        
        // Position project item if we have one
        if (itemIndex < projectItems.length) {
          const item = projectItems[itemIndex];
          item.style.gridRow = row;
          item.style.gridColumn = col;
          itemIndex++;
        }
      }
    }
    
    // Handle incomplete last row - expand items to fill space
    expandLastRowItems(layout, projects.length, contactColSpan, isMobile);
  }
  
  /**
   * Expand items in the last row to fill available space
   * @param {Object} layout - Grid layout configuration  
   * @param {number} projectCount - Number of projects
   * @param {number} contactColSpan - Number of columns the contact cell spans
   * @param {boolean} isMobile - Whether we're on mobile (affects contact cell spanning)
   */
  function expandLastRowItems(layout, projectCount, contactColSpan, isMobile) {
    const { cols, rows } = layout;
    
    // Find items in the last row (excluding contact cell)
    const projectItems = Array.from(gridContainer.children).filter(item => 
      !item.classList.contains('contact-cell')
    );
    
    let lastRowItems = [];
    
    projectItems.forEach((item) => {
      const row = parseInt(item.style.gridRow);
      if (row === rows) {
        lastRowItems.push(item);
      }
    });
    
    // If last row has items and they don't fill the row completely
    if (lastRowItems.length > 0) {
      // Check if contact cell is in the last row
      const contactInLastRow = rows === layout.rows;
      // Account for contact cell spanning multiple columns (only on mobile)
      const availableColsInLastRow = contactInLastRow ? cols - contactColSpan : cols;
      
      if (lastRowItems.length < availableColsInLastRow) {
        // Calculate how much space each item should take
        const colsPerItem = availableColsInLastRow / lastRowItems.length;
        
        lastRowItems.forEach((item, index) => {
          let startCol, endCol;
          
          if (contactInLastRow) {
            // Contact cell takes first contactColSpan columns, so start from column (contactColSpan + 1)
            startCol = Math.floor(index * colsPerItem) + contactColSpan + 1;
            endCol = Math.floor((index + 1) * colsPerItem) + contactColSpan + 1;
          } else {
            // No contact cell in this row
            startCol = Math.floor(index * colsPerItem) + 1;
            endCol = Math.floor((index + 1) * colsPerItem) + 1;
          }
          
          // Ensure we don't exceed the grid
          endCol = Math.min(endCol, cols + 1);
          
          item.style.gridColumn = `${startCol} / ${endCol}`;
        });
      }
    }
  }
  
  /**
   * Get current layout information
   * @returns {Object} Current layout configuration
   */
  function getCurrentLayout() {
    return currentLayout;
  }
  
  /**
   * Debounce function to limit how often resize handler runs
   * @param {Function} func - Function to debounce
   * @param {number} wait - Milliseconds to wait
   * @returns {Function} Debounced function
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Public API
  return {
    init,
    calculateGridDimensions,
    applyLayout,
    getCurrentLayout
  };
})(); 
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
    
    // STRONGLY PREFER 3 ROWS - this is the key requirement
    const preferredRows = 3;
    const maxRows = 4; // Allow 4th row only if cells become too narrow
    
    // Dynamic responsive minimum cell dimensions based on viewport
    let minCellWidth, minCellHeight;
    
    if (viewport.width <= 480) {
      // Mobile: smallest minimums
      minCellWidth = Math.max(100, viewport.width * 0.25); // 25% of viewport but min 100px
      minCellHeight = 70;
    } else if (viewport.width <= 768) {
      // Small tablet: adaptive minimums
      minCellWidth = Math.max(120, viewport.width * 0.2); // 20% of viewport but min 120px
      minCellHeight = 90;
    } else if (viewport.width <= 1024) {
      // Large tablet/small desktop: more adaptive
      minCellWidth = Math.max(140, viewport.width * 0.18); // 18% of viewport but min 140px
      minCellHeight = 110;
    } else if (viewport.width <= 1400) {
      // Medium desktop: balanced approach
      minCellWidth = Math.max(160, viewport.width * 0.16); // 16% of viewport but min 160px
      minCellHeight = 130;
    } else {
      // Large desktop: generous minimums
      minCellWidth = Math.max(200, viewport.width * 0.15); // 15% of viewport but min 200px
      minCellHeight = 150;
    }
    
    // Calculate ideal aspect ratio for cells (slightly rectangular)
    const idealRatio = 1.3;
    
    // Try different grid configurations with strong preference for 3 rows
    let bestConfig = null;
    let bestScore = 0;
    
    // Calculate effective items for grid calculation
    const effectiveItems = isMobile ? totalItems + 1 : totalItems; // +1 for contact span on mobile
    
    // First priority: Try to fit everything in preferred number of rows (3)
    for (let rows = preferredRows; rows <= maxRows; rows++) {
      // Calculate columns needed for this row count
      const cols = Math.ceil(effectiveItems / rows);
      
      // Calculate cell dimensions
      const cellWidth = viewport.width / cols;
      const cellHeight = viewport.height / rows;
      const cellRatio = cellWidth / cellHeight;
      
      // More flexible size checking - allow smaller cells if viewport demands it
      const isAcceptableSize = cellWidth >= minCellWidth && cellHeight >= minCellHeight;
      const isViableSize = cellWidth >= minCellWidth * 0.8 && cellHeight >= minCellHeight * 0.8; // 80% tolerance
      
      // If not acceptable but viable, and we haven't reached max rows, try next row count
      if (!isAcceptableSize && !isViableSize && rows < maxRows) {
        continue;
      }
      
      // Score this configuration with strong preference for 3 rows
      const ratioScore = 1 - Math.abs(cellRatio - idealRatio) / idealRatio;
      const sizeScore = Math.min(cellWidth, cellHeight) / 300; // Prefer larger cells
      const aspectPenalty = cellRatio > 3 || cellRatio < 0.3 ? 0.5 : 1; // Penalize extreme ratios
      
      // HUGE bonus for using preferred row count (3)
      const rowPreferenceBonus = rows === preferredRows ? 2.0 : 
                                rows === preferredRows + 1 ? 1.0 : 0.5;
      
      // Size requirement bonus - reward acceptable sizes, tolerate viable ones
      const sizeBonus = isAcceptableSize ? 1.5 : isViableSize ? 1.2 : 1.0;
      
      // Viewport fit bonus - heavily reward configurations that don't overflow
      const fitsViewport = (cellWidth * cols) <= viewport.width && (cellHeight * rows) <= viewport.height;
      const viewportBonus = fitsViewport ? 1.3 : 0.8;
      
      const totalScore = (ratioScore * 0.25 + sizeScore * 0.25) * aspectPenalty * rowPreferenceBonus * sizeBonus * viewportBonus;
      
      if (totalScore > bestScore || !bestConfig) {
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
      
      // If we found a good 3-row solution that fits viewport, prefer it strongly
      if (rows === preferredRows && (isAcceptableSize || isViableSize) && fitsViewport) {
        bestConfig.score += 1.0; // Extra bonus
        break; // Don't even consider more rows if 3 works well
      }
    }
    
    // Fallback: if no good solution found, force fit to viewport
    if (!bestConfig || bestConfig.cellWidth * bestConfig.cols > viewport.width) {
      const rows = preferredRows;
      const cols = Math.ceil(effectiveItems / rows);
      bestConfig = {
        cols,
        rows,
        cellWidth: viewport.width / cols, // Force fit to viewport
        cellHeight: viewport.height / rows,
        cellRatio: (viewport.width / cols) / (viewport.height / rows),
        totalItems: effectiveItems,
        score: 0.5 // Lower score indicates forced fit
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
    
    // Get current CSS grid layout
    const currentColsStyle = getComputedStyle(gridContainer).gridTemplateColumns;
    const currentRowsStyle = getComputedStyle(gridContainer).gridTemplateRows;
    const currentCols = currentColsStyle.split(' ').length;
    const currentRows = currentRowsStyle.split(' ').length;
    
    // Check if we need to update the grid
    const needsGridUpdate = currentCols !== layout.cols || currentRows !== layout.rows;
    const isLayoutSignificantlyDifferent = Math.abs(currentCols - layout.cols) > 1 || 
                                          Math.abs(currentRows - layout.rows) > 1;
    
    // Only update if necessary and it would be a significant improvement
    if (!needsGridUpdate && !window.forceGridUpdate) {
      // Grid is already correctly sized, no need to update
      console.log('Grid layout is already optimal, preventing unnecessary update');
      currentLayout = layout;
      return;
    }
    
    // For minor adjustments (within 1 row/col), only update if it's a clear improvement
    if (!isLayoutSignificantlyDifferent && layout.score < 1.5 && !window.forceGridUpdate) {
      console.log('Layout change is minor and not significantly better, maintaining current layout');
      currentLayout = {
        cols: currentCols,
        rows: currentRows,
        cellWidth: window.innerWidth / currentCols,
        cellHeight: window.innerHeight / currentRows,
        cellRatio: (window.innerWidth / currentCols) / (window.innerHeight / currentRows),
        totalItems: totalItems,
        score: 1
      };
      return;
    }
    
    // Store current layout
    currentLayout = layout;
    
    console.log(`Applying grid layout: ${layout.cols} cols × ${layout.rows} rows for ${projects.length} projects`);
    
    // Apply CSS Grid styles
    gridContainer.style.gridTemplateColumns = `repeat(${layout.cols}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${layout.rows}, 1fr)`;
    
    // Reset all grid positions first (except contact cell which is positioned by CSS)
    const allItems = Array.from(gridContainer.children);
    allItems.forEach(item => {
      if (!item.classList.contains('contact-cell')) {
        item.style.gridRow = '';
        item.style.gridColumn = '';
      }
    });
    
    // Calculate contact cell position and spanning
    const contactRow = layout.rows;
    const contactCol = 1;
    // Only span 2 columns on mobile, single column on desktop
    const contactColSpan = isMobile ? Math.min(2, layout.cols) : 1;
    
    // Update contact cell positioning if needed
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
    
    // Handle incomplete last row - expand contact cell to fill space and push projects right
    expandLastRowItems(layout, projects.length, contactColSpan, isMobile);
  }
  
  /**
   * Expand contact cell in the last row to fill available space, pushing projects to the right
   * @param {Object} layout - Grid layout configuration  
   * @param {number} projectCount - Number of projects
   * @param {number} contactColSpan - Number of columns the contact cell spans
   * @param {boolean} isMobile - Whether we're on mobile (affects contact cell spanning)
   */
  function expandLastRowItems(layout, projectCount, contactColSpan, isMobile) {
    const { cols, rows } = layout;
    
    // Find project items in the last row (excluding contact cell)
    const projectItems = Array.from(gridContainer.children).filter(item => 
      !item.classList.contains('contact-cell')
    );
    
    let lastRowProjectItems = [];
    
    projectItems.forEach((item) => {
      const row = parseInt(item.style.gridRow);
      if (row === rows) {
        lastRowProjectItems.push(item);
      }
    });
    
    // If last row has project items and there's leftover space
    if (lastRowProjectItems.length > 0) {
      const contactCell = gridContainer.querySelector('.contact-cell');
      const contactInLastRow = rows === layout.rows;
      
      if (contactInLastRow && contactCell) {
        // Calculate how many columns are actually used by projects in last row
        const projectsInLastRow = lastRowProjectItems.length;
        const totalUsedCols = projectsInLastRow + 1; // +1 for contact cell minimum
        
        if (totalUsedCols < cols) {
          // There's leftover space - expand contact cell to fill it
          const leftoverCols = cols - projectsInLastRow;
          
          // Expand contact cell to take up leftover space
          contactCell.style.gridColumn = `1 / ${leftoverCols + 1}`;
          
          // Position project items to the right, starting after the expanded contact cell
          lastRowProjectItems.forEach((item, index) => {
            const projectCol = leftoverCols + 1 + index;
            item.style.gridColumn = projectCol;
          });
          
          console.log(`Expanded contact cell to span ${leftoverCols} columns, pushing ${projectsInLastRow} projects to the right`);
        }
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
# Photographer Portfolio

A lightweight, responsive portfolio website built with vanilla HTML, CSS, and JavaScript. Designed for photographers to showcase their work with a fullscreen adaptive grid system and optimized image loading.

## Features

- **Fullscreen Adaptive Grid**: Projects automatically fit within the viewport without scrolling
- **Dynamic Layout Calculation**: Grid adapts to the number of projects for optimal display
- **Smart Cell Expansion**: Last row items expand to fill available space
- **Fixed Contact Section**: Contact information always positioned in bottom-left corner
- **Smooth Image Slideshow**: Selected project highlights in an elegant slideshow
- **Complete Gallery View**: Lightbox for viewing all project images
- **Lazy Loading & Caching**: Optimized performance with smart image loading
- **Automatic Path Generation**: No need to manually list every image
- **Mobile-Friendly**: Touch gestures and responsive design

## Grid Layout System

The portfolio uses an intelligent grid system that:

1. **Calculates Optimal Dimensions**: Automatically determines the best grid configuration based on the number of projects and viewport size
2. **Maintains Aspect Ratios**: Ensures visually pleasing cell proportions
3. **Adapts to Content**: Fewer projects = larger cells, more projects = smaller cells
4. **Fills Last Row**: Projects in incomplete rows expand to fill available horizontal space
5. **Fixed Contact Position**: Contact cell always stays in bottom-left corner, other cells adapt around it

## Structure

```
photographer-portfolio/
├── index.html                          # Homepage with fullscreen grid
├── css/
│   ├── reset.css                      # Lightweight custom reset
│   ├── main.css                       # Main stylesheet with fullscreen support
│   ├── components/
│   │   ├── grid.css                   # Fullscreen adaptive grid styles
│   │   ├── slideshow.css              # Project slideshow styles
│   │   └── gallery.css                # Gallery index styles
├── js/
│   ├── main.js                        # Main application logic
│   ├── modules/
│   │   ├── imageLoader.js             # Lazy loading & image optimization
│   │   ├── gridLayout.js              # Dynamic grid layout calculations
│   │   ├── slideshow.js               # Slideshow functionality
│   │   ├── navigation.js              # Routing and navigation
│   │   └── gallery.js                 # Gallery grid functionality
│   └── data/
│       └── projects.js                # Project data structure
├── images/
│   ├── P-01/                     # Project folder named after project ID
│   │   ├── Kirguistan1 copy.webp # Project P-01 uses existing naming
│   │   ├── Kirguistan2 copy.webp
│   │   └── ...
│   ├── P-02/                     # Standard naming for other projects
│   │   ├── image-01.webp
│   │   ├── image-02.webp
│   │   └── ...
│   └── P-03/
│       ├── image-01.webp
│       ├── image-02.webp
│       └── ...
├── templates/
│   ├── project.html                   # Project page template
│   └── gallery.html                   # Gallery index template
└── assets/
    └── fonts/
```

## How the Grid Works

### Layout Algorithm

The grid system automatically:

1. **Analyzes Viewport**: Gets current window dimensions
2. **Calculates Options**: Tests different column/row combinations
3. **Scores Layouts**: Evaluates each option based on:
   - Cell aspect ratio (preferring slightly rectangular)
   - Cell size (preferring larger cells)
   - Overall aesthetic balance
4. **Applies Best Fit**: Uses the highest-scoring layout
5. **Positions Elements**: Places projects and contact cell optimally
6. **Handles Expansion**: Expands last row items to fill space

### Contact Cell Behavior

- Always positioned in bottom-left corner
- Other cells flow around it naturally
- Contains photographer name, contact info, and copyright
- Maintains consistent styling across all layouts

### Responsive Behavior

- **Desktop**: Optimal balance of cell size and aspect ratio
- **Tablet**: Adapts grid dimensions for touch interaction
- **Mobile**: Simplified layout with larger touch targets
- **Resize**: Real-time layout recalculation on window resize

## Image Organization and Naming Conventions

The portfolio uses a flexible image system that supports any filename you want:

### Folder Structure
```
images/
├── P-01/                           # Project folders named after project ID
│   ├── Kirguistan1 copy.webp      # Any filename you want
│   ├── Kirguistan2 copy.webp
│   └── ...
├── P-02/                           # Different naming in each project
│   ├── Aline_w_AndreaRamil4.webp   # Completely different naming
│   ├── Anton_w_IsaacPerez5.webp
│   └── ...
└── P-03/
    ├── whatever_name.webp          # Total flexibility
    ├── any-name-you-want.webp
    └── ...
```

### How It Works

1. **Cover Image**: Manually specify the path for the homepage thumbnail
2. **Slideshow Images**: Curated selection (3-6 images) with exact paths
3. **Gallery Images**: Complete list of all images with exact paths

### Project Data Structure

You have two approaches for gallery images:

#### **Option 1: Naming Pattern (Recommended for consistent naming)**
```javascript
{
    id: 'P-03',
    title: 'Project Title',
    // ... other fields
    
    coverImage: 'images/P-03/mountain-001.webp',
    
    slideshowImages: [                   // Curated selection for slideshow
        'images/P-03/mountain-001.webp',
        'images/P-03/mountain-005.webp',
        'images/P-03/mountain-012.webp'
    ],
    
    namingPattern: 'images/{id}/mountain-{i2}.webp',  // Auto-generates all gallery images
    totalImages: 20                      // Shows 20 images: mountain-01.webp to mountain-20.webp
}
```

#### **Option 2: Manual List (For mixed/custom naming)**
```javascript
{
    id: 'P-02',
    title: 'Project Title',
    // ... other fields
    
    coverImage: 'images/P-02/Anton_w_IsaacPerez5.webp',
    
    slideshowImages: [                   // Curated selection for slideshow
        'images/P-02/Aline_w_AndreaRamil4.webp',
        'images/P-02/Anton_w_IsaacPerez5.webp'
    ],
    
    galleryImages: [                     // Manual list of ALL gallery images
        'images/P-02/Aline_w_AndreaRamil4.webp',
        'images/P-02/Aline_w_AndreaRamil5.webp',
        'images/P-02/Anton_w_IsaacPerez4.webp',
        'images/P-02/Anton_w_IsaacPerez5.webp',
        'images/P-02/Bella_w_AntiaBellas1.webp',
        // ... list all your actual filenames
    ],
    totalImages: 16                      // Optional: limits display to first 16
}
```

### Naming Pattern Placeholders

When using `namingPattern`, you can use these placeholders:
- `{id}` - Project ID (e.g., "P-03")
- `{folder}` - Project folder name
- `{i}` - Image number (1, 2, 3, ...)
- `{i2}` - Zero-padded image number (01, 02, 03, ...)

**Examples:**
- `'images/{id}/photo-{i2}.webp'` → `images/P-03/photo-01.webp`, `photo-02.webp`, etc.
- `'images/{id}/{id}-shot-{i}.webp'` → `images/P-03/P-03-shot-1.webp`, etc.
- `'images/{folder}/img_{i2}.webp'` → `images/P-03/img_01.webp`, etc.

### Benefits

- ✅ **Complete Filename Freedom**: Use any naming convention you want
- ✅ **Per-Project Flexibility**: Each project can have different naming
- ✅ **Easy Organization**: Just list your actual filenames
- ✅ **Curated Slideshows**: Show only your best images in slideshow
- ✅ **Complete Galleries**: Show all images in gallery with full control
- ✅ **WebP Support**: Full support for modern image format

## Setting Up Projects

Edit the `js/data/projects.js` file to define your projects:

```javascript
{
    id: 'project-01',                    // Unique identifier
    title: 'Project Title',              // Project title
    description: 'Project description.', // Description text
    date: 'January 2023',                // Date or timeframe
    location: 'Location',                // Where the project was shot
    client: 'Client Name',               // Optional client name
    folder: 'project-01',                // Folder name in images directory
    coverImage: 'cover',                 // Filename for cover image (without extension)
    slideshowImages: [                   // Array of selected image filenames for slideshow
        'slide-01', 
        'slide-02', 
        'slide-03',
        // ...
    ],
    totalImages: 30                      // Total number of images in the full gallery
}
```

## Performance Features

1. **Smart Caching**: Images are cached to avoid redundant requests
2. **Lazy Loading**: Images load only when entering viewport
3. **Progressive Enhancement**: Basic functionality works without JavaScript
4. **Optimized Calculations**: Grid layout calculations are debounced
5. **Efficient DOM Updates**: Minimal DOM manipulation for smooth performance

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Progressive enhancement for older browsers
- Touch-friendly on mobile devices
- Keyboard navigation support

## Getting Started

1. Clone or download the portfolio files
2. Add your project images to the appropriate directories
3. Update `js/data/projects.js` with your project information
4. Customize styles in `css/main.css` as needed
5. Open `index.html` in a web browser

The grid will automatically adapt to your project count and viewport size! 
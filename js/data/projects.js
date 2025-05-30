/**
 * Projects Data
 * Contains data for all photography projects
 */

const projects = [
  {
    id: 'P-01',
    title: 'Ladakhi Bakers',
    description: 'A series exploring the intersection of architecture and nature in urban environments. This project captures the contrast between rigid structures and organic forms in cities around the world.',
    date: 'October 2024',
    location: 'Ladakh, India',
    client: 'Personal Project',
    folder: 'P-01',
    coverImage: 'images/P-01/Ladakhi-Bakers1.webp', // Main thumbnail image for grid
    // Slide templates for different layouts
    slideTemplates: [
      { type: 'main', images: ['images/P-01/Ladakhi-Bakers1.webp'] },
      { type: 'fullheight', images: ['images/P-01/Ladakhi-Bakers2.webp'] },
      { type: 'diptych', images: ['images/P-01/Ladakhi-Bakers3.webp', 'images/P-01/Ladakhi-Bakers4.webp'] },
      { type: 'main', images: ['images/P-01/Ladakhi-Bakers5.webp'] },
      { type: 'fullscreen', images: ['images/P-01/Ladakhi-Bakers6.webp'] }
    ],
    totalImages: 56 // Total images in the project folder (gallery will automatically show all 15)
  },
  {
    id: 'P-02',
    title: '366 Miralls',
    description: 'A contemplative study of coastlines and the relationship between land and sea. This series captures the ephemeral nature of coastal landscapes, documenting the ever-changing dialogue between solid ground and flowing water.',
    date: 'February 2023',
    location: 'Barcelona, Spain',
    client: 'Personal Project',
    folder: 'P-02',
    coverImage: 'images/P-02/Miralls1.webp',
    // Slide templates for different layouts
    slideTemplates: [
      { type: 'fullheight', images: ['images/P-02/Miralls1.webp'] },
      { type: 'diptych', images: ['images/P-02/Miralls2.webp', 'images/P-02/Miralls3.webp'] },
      { type: 'fullscreen', images: ['images/P-02/Miralls4.webp'] }
    ],
    totalImages: 15
  },
  {
    id: 'P-03',
    title: 'Moro[cc]o',
    description: 'A contemplative study of coastlines and the relationship between land and sea. This series captures the ephemeral nature of coastal landscapes, documenting the ever-changing dialogue between solid ground and flowing water.',
    date: 'February 2023',
    location: 'Morocco',
    client: 'Personal Project',
    folder: 'P-03',
    coverImage: 'images/P-03/Morocco1.webp',
    // Slide templates for different layouts
    slideTemplates: [
      { type: 'fullheight', images: ['images/P-03/Morocco1.webp'] },
      { type: 'diptych', images: ['images/P-03/Morocco2.webp', 'images/P-03/Morocco3.webp'] },
      { type: 'fullscreen', images: ['images/P-03/Morocco4.webp'] }
    ],
    totalImages: 110
  },
  {
    id: 'P-04',
    title: 'Factory x Thinking Mu',
    description: 'A contemplative study of coastlines and the relationship between land and sea. This series captures the ephemeral nature of coastal landscapes, documenting the ever-changing dialogue between solid ground and flowing water.',
    date: 'February 2023',
    location: 'India',
    client: 'Personal Project',
    folder: 'P-04',
    coverImage: 'images/P-04/Thinking-Mu1.webp',
    // Slide templates for different layouts
    slideTemplates: [
      { type: 'fullheight', images: ['images/P-04/Thinking-Mu1.webp'] },
      { type: 'diptych', images: ['images/P-04/Thinking-Mu2.webp', 'images/P-04/Thinking-Mu3.webp'] },
      { type: 'fullscreen', images: ['images/P-04/Thinking-Mu4.webp'] }
    ],
    totalImages: 137
  },
  {
    id: 'P-05',
    title: 'Two days in Varanasi',
    description: 'A contemplative study of coastlines and the relationship between land and sea. This series captures the ephemeral nature of coastal landscapes, documenting the ever-changing dialogue between solid ground and flowing water.',
    date: 'February 2023',
    location: 'Varanasi, India',
    client: 'Personal Project',
    folder: 'P-05',
    coverImage: 'images/P-05/Varanasi1.webp',
    // Slide templates for different layouts
    slideTemplates: [
      { type: 'fullheight', images: ['images/P-05/Varanasi1.webp'] },
      { type: 'diptych', images: ['images/P-05/Varanasi2.webp', 'images/P-05/Varanasi3.webp'] },
      { type: 'fullscreen', images: ['images/P-05/Varanasi4.webp'] }
    ],
    totalImages: 50
  },
  {
    id: 'P-06',
    title: 'Kirguistan',
    description: 'A contemplative study of coastlines and the relationship between land and sea. This series captures the ephemeral nature of coastal landscapes, documenting the ever-changing dialogue between solid ground and flowing water.',
    date: 'February 2023',
    location: 'Kirguistan',
    client: 'Personal Project',
    folder: 'P-06',
    coverImage: 'images/P-06/Kirguistan1.webp',
    // Slide templates for different layouts
    slideTemplates: [
      { type: 'fullheight', images: ['images/P-06/Kirguistan1.webp'] },
      { type: 'diptych', images: ['images/P-06/Kirguistan2.webp', 'images/P-06/Kirguistan3.webp'] },
      { type: 'fullscreen', images: ['images/P-06/Kirguistan4.webp'] }
    ],
    totalImages: 35
  },
  {
    id: 'P-07',
    title: 'Georgia',
    description: 'A contemplative study of coastlines and the relationship between land and sea. This series captures the ephemeral nature of coastal landscapes, documenting the ever-changing dialogue between solid ground and flowing water.',
    date: 'February 2023',
    location: 'Georgia',
    client: 'Personal Project',
    folder: 'P-07',
    coverImage: 'images/P-07/Georgia1.webp',
    // Slide templates for different layouts
    slideTemplates: [
      { type: 'fullheight', images: ['images/P-07/Georgia1.webp'] },
      { type: 'diptych', images: ['images/P-07/Georgia2.webp', 'images/P-07/Georgia3.webp'] },
      { type: 'fullscreen', images: ['images/P-07/Georgia4.webp'] }
    ],
    totalImages: 83
  },
  {
    id: 'P-08',
    title: 'The Jumping Age',
    description: 'A contemplative study of coastlines and the relationship between land and sea. This series captures the ephemeral nature of coastal landscapes, documenting the ever-changing dialogue between solid ground and flowing water.',
    date: 'February 2023',
    location: 'Barcelona, Spain',
    client: 'Personal Project',
    folder: 'P-08',
    coverImage: 'images/P-08/TheJumpingAge5.webp',
    // Slide templates for different layouts
    slideTemplates: [
      { type: 'fullheight', images: ['images/P-08/TheJumpingAge5.webp'] },
      { type: 'diptych', images: ['images/P-08/TheJumpingAge1.webp', 'images/P-08/TheJumpingAge2.webp'] },
      { type: 'fullscreen', images: ['images/P-08/TheJumpingAge3.webp'] }
    ],
    totalImages: 32
  },
  {
    id: 'P-09',
    title: 'Commercial',
    description: 'A contemplative study of coastlines and the relationship between land and sea. This series captures the ephemeral nature of coastal landscapes, documenting the ever-changing dialogue between solid ground and flowing water.',
    date: 'February 2023',
    location: 'Barcelona, Spain',
    client: 'Personal Project',
    folder: 'P-09',
    coverImage: 'images/P-09/Comercial2.webp',
    // Slide templates for different layouts
    slideTemplates: [
      { type: 'fullheight', images: ['images/P-09/Comercial2.webp'] },
      { type: 'diptych', images: ['images/P-09/Comercial1.webp', 'images/P-09/Comercial3.webp'] },
      { type: 'fullscreen', images: ['images/P-09/Comercial4.webp'] }
    ],
    totalImages: 93
  }
]; 
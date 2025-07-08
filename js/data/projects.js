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
    coverImage: 'images/P-01/Ladakhi-Bakers16.webp', // Main thumbnail image for grid
    // Slide templates for different layouts
    slideTemplates: [
      { type: 'main', images: ['images/P-01/Ladakhi-Bakers1.webp'] },
      { type: 'fullheight', images: ['images/P-01/Ladakhi-Bakers2.webp'] },
      { type: 'diptych', images: ['images/P-01/Ladakhi-Bakers3.webp', 'images/P-01/Ladakhi-Bakers4.webp'] },
      { type: 'main', images: ['images/P-01/Ladakhi-Bakers5.webp'] },
      { type: 'fullscreen', images: ['images/P-01/Ladakhi-Bakers6.webp'] },
      { type: 'split-left', images: ['images/P-01/Ladakhi-Bakers7.webp', 'images/P-01/Ladakhi-Bakers8.webp'] },
      { type: 'split-right', images: ['images/P-01/Ladakhi-Bakers9.webp', 'images/P-01/Ladakhi-Bakers10.webp'] }
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
    coverImage: 'images/P-02/Miralls13.webp',
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
    coverImage: 'images/P-03/Morocco107.webp',
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
    coverImage: 'images/P-04/Thinking-Mu39.webp',
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
    coverImage: 'images/P-05/Varanasi12.webp',
    // Slide templates for different layouts
    slideTemplates: [
      { type: 'split-left', images: ['images/P-05/Varanasi21.webp', 'images/P-05/Varanasi22.webp'] },
      { type: 'main', images: ['images/P-05/Varanasi5.webp'] },
      { type: 'main', images: ['images/P-05/Varanasi9.webp'] },
      { type: 'main', images: ['images/P-05/Varanasi11.webp'] },
      { type: 'split-right', images: ['images/P-05/Varanasi37.webp', 'images/P-05/Varanasi38.webp'] },
      { type: 'main', images: ['images/P-05/Varanasi28.webp'] },
      { type: 'main', images: ['images/P-05/Varanasi32.webp'] },
      { type: 'split-left', images: ['images/P-05/Varanasi1.webp', 'images/P-05/Varanasi2.webp'] },
      { type: 'main', images: ['images/P-05/Varanasi10.webp'] },
      { type: 'main', images: ['images/P-05/Varanasi12.webp'] },
      { type: 'main', images: ['images/P-05/Varanasi49.webp'] },
      { type: 'split-right', images: ['images/P-05/Varanasi33.webp', 'images/P-05/Varanasi15.webp'] },
      { type: 'main', images: ['images/P-05/Varanasi30.webp'] },
      { type: 'main', images: ['images/P-05/Varanasi45.webp'] },
      { type: 'main', images: ['images/P-05/Varanasi24.webp'] },
      { type: 'main', images: ['images/P-05/Varanasi17.webp'] },
      { type: 'main', images: ['images/P-05/Varanasi13.webp'] },
      { type: 'split-left', images: ['images/P-05/Varanasi8.webp', 'images/P-05/Varanasi26.webp'] },
      { type: 'main', images: ['images/P-05/Varanasi34.webp'] },
      { type: 'main', images: ['images/P-05/Varanasi14.webp'] },
      { type: 'main', images: ['images/P-05/Varanasi18.webp'] },
      { type: 'main', images: ['images/P-05/Varanasi19.webp'] },
      { type: 'split-right', images: ['images/P-05/Varanasi43.webp', 'images/P-05/Varanasi20.webp'] }
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
    coverImage: 'images/P-06/Kirguistan29.webp',
    // Slide templates for different layouts
    slideTemplates: [
      { type: 'main', images: ['images/P-06/Kirguistan9.webp'] },
      { type: 'main', images: ['images/P-06/Kirguistan5.webp'] },
      { type: 'main', images: ['images/P-06/Kirguistan13.webp'] },
      { type: 'main', images: ['images/P-06/Kirguistan29.webp'] },
      { type: 'main', images: ['images/P-06/Kirguistan17.webp'] },
      { type: 'diptych', images: ['images/P-06/Kirguistan28.webp', 'images/P-06/Kirguistan27.webp'] },
      { type: 'main', images: ['images/P-06/Kirguistan22.webp'] },
      { type: 'main', images: ['images/P-06/Kirguistan8.webp'] },
      { type: 'main', images: ['images/P-06/Kirguistan34.webp'] },
      { type: 'main', images: ['images/P-06/Kirguistan35.webp'] },
      { type: 'main', images: ['images/P-06/Kirguistan23.webp'] },
      { type: 'main', images: ['images/P-06/Kirguistan31.webp'] },
      { type: 'main', images: ['images/P-06/Kirguistan1.webp'] },
      { type: 'main', images: ['images/P-06/Kirguistan33.webp'] },
      { type: 'main', images: ['images/P-06/Kirguistan10.webp'] },
      { type: 'main', images: ['images/P-06/Kirguistan4.webp'] },
      { type: 'diptych', images: ['images/P-06/Kirguistan25.webp', 'images/P-06/Kirguistan26.webp'] },
      { type: 'main', images: ['images/P-06/Kirguistan30.webp'] },
      { type: 'main', images: ['images/P-06/Kirguistan2.webp'] },
      { type: 'main', images: ['images/P-06/Kirguistan3.webp'] },
      { type: 'main', images: ['images/P-06/Kirguistan19.webp'] }
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
    coverImage: 'images/P-07/Georgia16.webp',
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
    coverImage: 'images/P-08/TheJumpingAge29.webp',
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
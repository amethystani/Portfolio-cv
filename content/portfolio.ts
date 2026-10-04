/** Who this portfolio is about. The home page's main image and headline come from here. */
export const portfolio = {
  name: 'Animesh Mishra',
  role: 'ML/NLP Researcher',
  /** Where "contact" links (footer, apply buttons, search results) send mail. */
  email: 'animeshmishra0567@gmail.com',
  /** Profiles and projects the nav, footer and menus link to. */
  links: {
    github: 'https://github.com/amethystani',
    linkedin: 'https://www.linkedin.com/in/animesh-mishra-in/',
    orcid: 'https://orcid.org/0009-0009-1770-6329',
    site: 'https://www.animeshmishra.us/',
    evirag: 'https://github.com/amethystani/evirag-bench',
    notation: 'https://github.com/amethystani/notation-matters',
    palimpsest: 'https://github.com/amethystani/palimpsest',
    deferseg: 'https://github.com/amethystani/deferseg',
  },
  /** The poster shown as the main photo on the home page. */
  poster: {
    src: '/assets/portfolio/animesh-mishra-poster.webp',
    width: 1254,
    height: 1254,
    alt: 'Black-and-white portrait of Animesh Mishra, smiling, with dark curly hair and glasses, on a handwritten and annotated paper collage. The label under the photo reads "Animesh Mishra, ML/NLP Researcher".',
  },
} as const;

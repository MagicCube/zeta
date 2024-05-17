export interface DoubanSearchResult {
  count: number;
  start: number;
  total: number;
  subjects: DoubanSubject[];
}

export interface DoubanSubject {
  id: string;
  alt: string;
  title: string;
  year: string;
  images: DoubanImages;
  rating: {
    max: number;
    average: number;
    stars: string;
  };
  subtype: 'tv' | 'movie';
  genres: string[];
  casts: DoubanPeople[];
  directors: DoubanPeople[];
}

export interface DoubanPeople {
  id: string;
  name: string;
  alt: string;
  avatars: DoubanImages;
}

export interface DoubanImages {
  small: string;
  large: string;
  medium: string;
}

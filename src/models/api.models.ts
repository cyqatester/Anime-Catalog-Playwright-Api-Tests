export type ReleaseCategory = 'TV_SERIES' | 'OVA' | 'MOVIE';
export type UserRole = 'STANDARD' | 'ADMIN';

export interface Genre {
  id: number;
  name: string;
}

export interface Anime {
  id: number;
  title: string;
  alternateTitle: string;
  genres: Genre[];
  yearAired: number;
  releaseCategory: ReleaseCategory;
  episodes: number | null;
  season: string | null;
}

export interface AnimeInput {
  title: string;
  alternateTitle: string;
  genreIds: number[];
  yearAired: number;
  releaseCategory: ReleaseCategory;
  episodes?: number;
  season?: string;
}

export interface UserInput {
  name: string;
  username: string;
  password: string;
  role: UserRole;
}

export interface UserView {
  id: number;
  name: string;
  username: string;
  role: UserRole;
  superAdmin: boolean;
}

export interface Profile {
  name: string;
  username: string;
  role: UserRole;
}

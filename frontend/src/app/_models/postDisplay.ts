import { Photo } from './photo';

export interface PostDisplay {
  id: number;
  mainPhotoUrl: string;
  userName: string;
  knownAs: string;
  pronouns: string;
  content: string;
  created: string;
  photos: Photo[];
}

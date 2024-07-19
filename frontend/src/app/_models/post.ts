import { Photo } from './photo';

export interface Post {
  id: number;
  content: string;
  created: Date;
  photos: Photo[];
}

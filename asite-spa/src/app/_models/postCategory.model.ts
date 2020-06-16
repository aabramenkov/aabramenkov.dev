import { Post } from './post.model';

export interface PostCategory {
  id: number;
  name: string;
  Posts: Post[];
}

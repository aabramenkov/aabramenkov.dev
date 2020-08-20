import { User } from './user.model';
import {Comment} from './comment.model';
import { PostCategory } from './postCategory.model';
import { Title } from '@angular/platform-browser';

export interface Post {
  id: number;
  title: string;
  description: string;
  text: string;
  created: Date;
  updated: Date;
  published: boolean;
  deleted: boolean;
  user: User;
  userId: number;
  postCategory?: PostCategory;
  url: string;
  comments: Comment[];
}

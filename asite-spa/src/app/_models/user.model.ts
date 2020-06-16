import { Post } from './post.model';
import {Comment} from './comment.model';

export interface User {
    id: number;
    userName: string;
    email: string;
    photoUrl: string;
    lastActive: Date;
    created: Date;
    registeredVia: string;
    roles?: string[];
    posts?: Post[];
    comments?: Comment[];
}

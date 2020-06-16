import { User } from './user.model';
import {Comment} from './comment.model';

export interface ChildComment {
    id: number;
    created: Date;
    text: string;
    commentId: number;
    user: User;

}

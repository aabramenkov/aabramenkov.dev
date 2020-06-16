import { Post } from './post.model';
import { User } from './user.model';
import { ChildComment } from './childComment.model';

export interface Comment {
    id: number;
    created: Date;
    text: string;
    post: Post;
    user: User;
    childComments: ChildComment[];
}

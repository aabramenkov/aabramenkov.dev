import { Article } from './article.model';

export interface Category {
    id?: number;
    name: string;
    atricles?: Article[];
}

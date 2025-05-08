export interface IBookmark {
    _id: string;
    url: string;
    title: string;
    description?: string;
    tags?: string[];
    createdAt?: string;
}
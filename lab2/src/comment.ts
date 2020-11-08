import pool from './pool';
import User from './user';

export default class Comments {
    static TABLE_NAME = "public.comments";

    private id : number;
    private authorId : number;
    private postId : number;
    private text : string;

    constructor(id : number, text : string, authorId : number, postId : number) {
        this.id = id;
        this.text = text;
        this.authorId = authorId;
        this.postId = postId;
    }

    public getId() {
        return this.id;
    }

    public getText() {
        return this.text;
    }

    public getAuthorId() {
        return this.authorId;
    }

    public getPostId() {
        return this.postId;
    }

    public setText(text : string) {
        this.text = text;
    }

    public setAuthorId(id : number) {
        this.authorId = id;
    }

    public setPostId(id : number) {
        this.postId = id;
    }
}
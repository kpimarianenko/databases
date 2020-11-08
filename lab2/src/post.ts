import pool from './pool';

export default class Post {
    private static TABLE_NAME = "public.posts";

    private id : number;
    private text : string;
    private photoUrl : string;
    private authorId : string;

    constructor(id : number, text : string, photoUrl : string, authorId : string) {
        this.id = id;
        this.text = text;
        this.photoUrl = photoUrl;
        this.authorId = authorId;
    }

    public getId() {
        return this.id;
    }

    public getText() {
        return this.text;
    }

    public getPhotoUrl() {
        return this.photoUrl;
    }

    public getAuthorId() {
        return this.authorId;
    }

    public setText(text : string) {
        this.text = text;
    }

    public setPhotoUrl(photoUrl : string) {
        this.photoUrl = photoUrl;
    }

    public setAuthorId(authorId : string) {
        this.authorId = authorId;
    }

    public static getAll(cb : any) {
        pool.query({text: `SELECT * FROM ${this.TABLE_NAME}`}, cb);
    }

    public static updateById(post : Post, cb : any) {
        pool.query({text: `UPDATE ${this.TABLE_NAME} SET text = $1, photo_url = $2 WHERE id = $3`,
        values: [post.getText(), post.getPhotoUrl(), post.getId()]}, cb)
    }

    public static deleteById(id : number, cb : any) {
        pool.query({text: `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`, values: [id]}, cb)
    }

    public static getUsersPosts(id : number, cb : any) {
        pool.query({text: `SELECT * FROM ${this.TABLE_NAME} WHERE author_id = $1`, values: [id]}, cb);
    }
}
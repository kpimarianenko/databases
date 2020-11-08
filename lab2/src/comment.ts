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

    public static getAll(cb : any) {
        pool.query({text: `SELECT * FROM ${this.TABLE_NAME}`}, cb);
    }

    public static updateById(comment : Comments, cb : any) {
        pool.query({text: `UPDATE ${this.TABLE_NAME} SET text = $1 WHERE id = $2`,
        values: [comment.getText(), comment.getId()]}, cb)
    }

    public static deleteById(id : number, cb : any) {
        pool.query({text: `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`, values: [id]}, cb)
    }

    public static getPostsCommentsPopulate(id : number, cb : any) {
        pool.query({text: `SELECT ${this.TABLE_NAME}.text, ${User.TABLE_NAME}.name as author FROM ${this.TABLE_NAME}, ${User.TABLE_NAME} WHERE ${this.TABLE_NAME}.post_id = $1 AND ${User.TABLE_NAME}.id = ${this.TABLE_NAME}.author_id`, values: [id]}, cb)
    }
}
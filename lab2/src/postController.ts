import Controller from './controller';
import pool from './pool'
import Post from './post'

export default class PostController extends Controller {
    public TABLE_NAME = "public.posts";

    public updateById(post : Post, cb : any) {
        pool.query({text: `UPDATE ${this.TABLE_NAME} SET text = $1, photo_url = $2 WHERE id = $3`,
        values: [post.getText(), post.getPhotoUrl(), post.getId()]}, cb)
    }

    public getUsersPosts(id : number, cb : any) {
        pool.query({text: `SELECT * FROM ${this.TABLE_NAME} WHERE author_id = $1`, values: [id]}, cb);
    }

    public add(post : Post, cb : any) {
        pool.query({text: `INSERT INTO ${this.TABLE_NAME} (text, photo_url, author_id) VALUES ($1, $2, $3)`, values: [post.getText(), post.getPhotoUrl(), post.getAuthorId()]}, cb)
    }
}
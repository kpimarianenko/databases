import Controller from './controller';
import pool from './pool'
import Comment from './comment'
import UserController from './userController'
const userController : UserController = new UserController();

export default class CommentController extends Controller {
    public TABLE_NAME = "public.comments";

    public updateById(comment : Comment, cb : any) {
        pool.query({text: `UPDATE ${this.TABLE_NAME} SET text = $1 WHERE id = $2`,
        values: [comment.getText(), comment.getId()]}, cb)
    }

    public getPostsCommentsPopulate(id : number, cb : any) {
        pool.query({text: `SELECT ${this.TABLE_NAME}.*, ${userController.TABLE_NAME}.name as author FROM
        ${this.TABLE_NAME} INNER JOIN ${userController.TABLE_NAME} ON ${this.TABLE_NAME}.author_id = ${userController.TABLE_NAME}.id
        WHERE ${this.TABLE_NAME}.post_id = $1`, values: [id]}, cb)
    }

    public add(comment : Comment, cb : any) {
        pool.query({text: `INSERT INTO ${this.TABLE_NAME} (text, post_id, author_id) VALUES ($1, $2, $3)`, values: [comment.getText(), comment.getPostId(), comment.getAuthorId()]}, cb)
    }
}
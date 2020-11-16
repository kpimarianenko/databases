import Controller from './controller';
import pool from './pool'
import Comment from './comment'
import UserController from './userController'
const userController : UserController = new UserController();

export default class MessageController extends Controller {
    public TABLE_NAME = "public.messages";

    public updateById(message : Comment, cb : any) {
        pool.query({text: `UPDATE ${this.TABLE_NAME} SET text = $1 WHERE id = $2`,
        values: [message.getText(), message.getId()]}, cb)
    }

    public getChatMessagesPopulate(id : number, cb : any) {
        pool.query({text: `SELECT ${this.TABLE_NAME}.*, ${userController.TABLE_NAME}.name as author FROM 
        ${this.TABLE_NAME} INNER JOIN ${userController.TABLE_NAME} ON ${this.TABLE_NAME}.author_id = ${userController.TABLE_NAME}.id
        WHERE ${this.TABLE_NAME}.chat_id = $1`, values: [id]}, cb)
    }

    public add(message : Comment, cb : any) {
        pool.query({text: `INSERT INTO ${this.TABLE_NAME} (text, post_id, author_id) VALUES ($1, $2, $3)`, values: [message.getText(), message.getPostId(), message.getAuthorId()]}, cb)
    }
}
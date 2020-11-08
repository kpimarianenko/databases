import Controller from './controller';
import Chat from './chat';
import pool from './pool';

export default class ChatController extends Controller {
    public TABLE_NAME = "public.chats";
    public MTM_TABLE_NAME = "public.users_chats"

    public updateById(chat : Chat, cb : any) {
        pool.query({text: `UPDATE ${this.TABLE_NAME} SET name = $1, photo_url = $2, created_at = $3 WHERE id = $4`,
        values: [chat.getName(), chat.getPhotoUrl(), chat.getCreatedAt(), chat.getId()]}, cb)
    }

    public getUsersChat(user_id : number, cb : any) {
        pool.query({text: `SELECT ${this.TABLE_NAME}.id, ${this.TABLE_NAME}.name, ${this.TABLE_NAME}.photo_url, ${this.TABLE_NAME}.created_at FROM ${this.TABLE_NAME}, ${this.MTM_TABLE_NAME} WHERE ${this.MTM_TABLE_NAME}.user_id = $1 AND ${this.MTM_TABLE_NAME}.chat_id = ${this.TABLE_NAME}.id`, values: [user_id]}, cb)
    }

    public add(chat : Chat, cb : any) {
        pool.query({text: `INSERT INTO ${this.TABLE_NAME} (name, photo_url, created_at) VALUES ($1, $2, $3)`, values: [chat.getName(), chat.getPhotoUrl(), chat.getCreatedAt()]}, cb)
    }
}
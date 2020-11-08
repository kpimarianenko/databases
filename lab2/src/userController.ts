import Controller from './controller';
import pool from './pool'
import User from './user'

export default class UserController extends Controller {
    public TABLE_NAME = "public.users";

    public getByEmailAndPassword(email : string, password : string, cb : any) {
        pool.query({text: `SELECT * FROM ${this.TABLE_NAME} WHERE email = $1 AND password = $2`, values: [email, password]}, cb)
    }

    public getAll(cb : any) {
        pool.query({text: `SELECT id, name, email FROM ${this.TABLE_NAME}`}, cb);
    }

    public updateById(user : User, cb : any) {
        pool.query({text: `UPDATE ${this.TABLE_NAME} SET name = $1, email = $2, password = $3 WHERE id = $4`,
        values: [user.getName(), user.getEmail(), user.getPassword(), user.getId()]}, cb)
    }

    public add(user : User, cb : any) {
        pool.query({text: `INSERT INTO ${this.TABLE_NAME} (email, password, name) VALUES ($1, $2, $3)`, values: [user.getEmail(), user.getPassword(), user.getName()]}, cb)
    }
}
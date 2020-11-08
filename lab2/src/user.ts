import pool from './pool';

export default class User {
    static TABLE_NAME = "public.users";

    private id : number;
    private name : string;
    private email : string;
    private password : string;

    constructor(id : number, name : string, email : string, password : string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public getId() {
        return this.id;
    }

    public getName() {
        return this.name;
    }

    public getEmail() {
        return this.email;
    }

    public getPassword() {
        return this.password;
    }

    public setName(name : string) {
        this.name = name;
    }

    public setEmail(email : string) {
        this.email = email;
    }

    public setPassword(password : string) {
        this.password = password;
    }
    
    public static getByEmailAndPassword(email : string, password : string, cb : any) {
        pool.query({text: `SELECT * FROM ${this.TABLE_NAME} WHERE email = $1 AND password = $2`, values: [email, password]}, cb)
    }

    public static getAll(cb : any) {
        pool.query({text: `SELECT id, name, email FROM ${this.TABLE_NAME}`}, cb);
    }

    public static updateById(user : User, cb : any) {
        pool.query({text: `UPDATE ${this.TABLE_NAME} SET name = $1, email = $2, password = $3 WHERE id = $4`,
        values: [user.getName(), user.getEmail(), user.getPassword(), user.getId()]}, cb)
    }

    public static deleteById(id : number, cb : any) {
        pool.query({text: `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`, values: [id]}, cb)
    }
}
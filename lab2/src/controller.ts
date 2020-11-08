import pool from './pool';

export default abstract class Controller {
    abstract TABLE_NAME : string;
    abstract updateById(entity : any, cb : any) : void;
    abstract add(entity : any, cb : any) : void;

    public getAll(cb : any) {
        pool.query({text: `SELECT * FROM ${this.TABLE_NAME}`}, cb);
    }
    
    public getById(id : number, cb : any) {
        pool.query({text: `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`, values: [id]}, cb)
    }
    
    public deleteById(id : number, cb : any) {
        pool.query({text: `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`, values: [id]}, cb)
    }
}
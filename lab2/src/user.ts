export default class User {
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
}
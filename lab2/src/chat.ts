export default class Chat {
    public id : number;
    public name : string;
    public photoUrl : string;
    public createdAt : Date;

    constructor(id : number, name : string, photoUrl : string, createdAt : Date) {
        this.id = id;
        this.name = name;
        this.photoUrl = photoUrl;
        this.createdAt = createdAt;
    }

    public getId() {
        return this.id;
    }

    public getName() {
        return this.name;
    }

    public getPhotoUrl() {
        return this.photoUrl;
    }

    public getCreatedAt() {
        return this.createdAt;
    }

    public setName(name : string) {
        this.name = name;
    }

    public setPhotoUrl(photoUrl : string) {
        this.photoUrl = photoUrl;
    }

    public setCreatedAt(createdAt : Date) {
        this.createdAt = createdAt;
    }
}
export default class Post {private id : number;
    private text : string;
    private photoUrl : string;
    private authorId : number;

    constructor(id : number, text : string, photoUrl : string, authorId : number) {
        this.id = id;
        this.text = text;
        this.photoUrl = photoUrl;
        this.authorId = authorId;
    }

    public getId() {
        return this.id;
    }

    public getText() {
        return this.text;
    }

    public getPhotoUrl() {
        return this.photoUrl;
    }

    public getAuthorId() {
        return this.authorId;
    }

    public setText(text : string) {
        this.text = text;
    }

    public setPhotoUrl(photoUrl : string) {
        this.photoUrl = photoUrl;
    }

    public setAuthorId(authorId : number) {
        this.authorId = authorId;
    }
}
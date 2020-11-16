export default class Message {
    private id : number;
    private text : string;
    private chatId : number;
    private authorId : number;

    constructor(id : number, text : string, chatId : number, authorId : number) {
        this.id = id;
        this.text = text;
        this.chatId = chatId;
        this.authorId = authorId;
    }

    public getId() {
        return this.id;
    }

    public getText() {
        return this.text;
    }

    public getChatId() {
        return this.chatId;
    }

    public getAuthorId() {
        return this.authorId;
    }

    public setText(text : string) {
        this.text = text;
    }

    public setChatId(chatId : number) {
        this.chatId = chatId;
    }

    public setAuthorId(authorId : number) {
        this.authorId = authorId;
    }
}
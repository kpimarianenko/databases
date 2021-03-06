import pool from './pool';
import User from './user';
import Post from './post';
import Chat from './chat';
import Comment from './comment';
import readlineSync from 'readline-sync';
import UserController from './userController';
import PostController from './postController';
import ChatController from './chatController';
import CommentController from './commentController';
import MessageController from './messageController';

const userController: UserController = new UserController();
const postController: PostController = new PostController();
const chatController: ChatController = new ChatController();
const commentController: CommentController = new CommentController();
const messageController: MessageController = new MessageController();

export class ConsoleInterface {
    private user: User;

    private setUser(user: User): void {
        this.user = user;
    }

    public init(): void {
        this.clear();
        pool.connect();
    }

    public show(): void {
        this.showMainMenu();
    }

    public close(): void {
        pool.end();
    }

    private clear(): void {
        console.clear();
    }

    private emptyLine(): void {
        console.log();
    }

    private printMenuName(name: string): void {
        console.log(`<<<${name.toLocaleUpperCase()}>>>`)
        this.emptyLine();
    }

    private printMenu(menu: Array<string>): void {
        menu.forEach((item, index) => this.printMenuElement(index == menu.length - 1 ? 0 : index + 1, item));
    }

    private printLongUser(user: User, title?: string): void {
        if (!user) return;
        console.log(title || 'User');
        console.log(`ID: ${user.getId()}`);
        console.log(`Name: ${user.getName()}`);
        console.log(`Email: ${user.getEmail()}`);
        if (this.user && user.getId() === this.user.getId()) console.log(`Password: ${this.user.getPassword()}`);
        this.emptyLine();
    }

    private printShortUser(): void {
        if (!this.user) return;
        console.log('User')
        console.log(this.user.getName());
        this.emptyLine();
    }

    private printMenuPage(menu: Array<string>, name: string, long?: boolean, cb?: Function): void {
        this.clear();
        this.printMenuName(name);
        long ? this.printLongUser(this.user) : this.printShortUser();
        if (cb) cb();
        this.printMenu(menu)
        this.emptyLine();
    }

    private printMenuElement(index: Number, name: string): void {
        console.log(`[${index}] - ${name}`);
    }

    private printError(e: string): void {
        if (e) {
            console.log(`***${e}***`)
            this.emptyLine();
        }
    }

    private showMainMenu(err?: string): void {
        const menu: Array<string> = ['Users', 'Posts', 'Chats', 'Edit profile', this.user ? 'Log out' : 'Log in', 'Register', 'Generate random users', 'Exit']
        this.printMenuPage(menu, 'main menu');
        this.printError(err);

        let action: string = readlineSync.keyIn('Choose your next action: ', { limit: `$<0-${menu.length - 1}>` });

        switch (parseInt(action)) {
            case 1: {
                this.showUsersMenu();
                break;
            } case 2: {
                this.showPostsMenu();
                break;
            } case 3: {
                if (!this.user) this.showMainMenu('You must be logged in');
                else this.showChatMenu();
                break;
            } case 4: {
                if (!this.user) this.showMainMenu('You must be logged in');
                else this.showEditProfileMenu();
                break;
            } case 5: {
                this.toggleUserState();
                break;
            } case 6: {
                const email: string = readlineSync.question('Enter email: ');
                const name: string = readlineSync.question('Enter name: ');
                const password: string = readlineSync.question('Enter password: ', { hideEchoBack: true });
                userController.add(new User(null, name, email, password), (err) => {
                    if (err) {
                        this.showMainMenu(err.message);
                        return;
                    }
                    this.showMainMenu();
                })
                break;
            } case 7: {
                this.generateUsers();
                break;
            } case 0: {
                this.close();
                process.exit(0)
            } default: {
                this.showMainMenu();
                break;
            }
        }
    }

    private generateUsers() {
        userController.generateRandomUsers(100000, (err, res) => {
            if (err) this.showMainMenu(err.message);
            else this.showUsersMenu();
        })
    }

    private showChatMenu(error?: string): void {
        chatController.getUsersChat(this.user.getId(), (err, res) => {
            if (err) {
                this.showMainMenu(err.message);
                return;
            }

            const chatNames: Array<string> = res.rows.map(item => item.name)
            this.printMenuPage([...chatNames, 'Back'], 'chats');
            this.printError(error);
            let action: string = readlineSync.question('Choose which page do you want to see: ');
            const chat: any = res.rows[parseInt(action) - 1];

            switch (parseInt(action)) {
                case 0: {
                    this.showMainMenu();
                    break;
                } default: {
                    chat ? this.showChatPage(chat) : this.showChatMenu(`Chat with index ${parseInt(action)} was not found`);
                    break;
                }
            }
        })
    }

    private showChatPage(chat: any): void {
        messageController.getChatMessagesPopulate(chat.id, (err, res) => {
            if (err) {
                this.showChatMenu(err.message);
                return;
            }
            const menu: Array<string> = res.rows.map(item => `${item.author}\n${item.text}`)
            this.printMenuPage([...menu, 'Back'], `chat ${chat.id}`, false, () => this.printChat(new Chat(chat.id, chat.name, chat.photo_url, new Date(chat.created_at)), 'Viewed chat'));
            let action: string = readlineSync.keyIn('Choose your next action: ', { limit: `$<0-${menu.length}>` });

            switch (parseInt(action)) {
                case 0: {
                    this.showChatMenu();
                    break;
                }
            }
        })
    }

    private toggleUserState(): void {
        if (this.user) {
            if (readlineSync.keyInYN('Are you sure you want to log out?'))
                this.setUser(null);
            this.showMainMenu();
            return;
        }

        this.emptyLine();
        const email = readlineSync.question('Enter email: ');
        const password = readlineSync.question('Enter password: ', { hideEchoBack: true });
        userController.getByEmailAndPassword(email, password, (err, res) => {
            let e: string;
            if (err) {
                e = err.message;
            }
            if (res.rows[0]) {
                this.setUser(new User(res.rows[0].id, res.rows[0].name, res.rows[0].email, res.rows[0].password));
            } else e = 'User was not found'
            this.showMainMenu(e);
        })
    }

    private showEditProfileMenu(err?: string): void {
        const menu: Array<string> = ['Edit name', 'Edit email', 'Edit password', 'Delete account', 'Back and save']
        this.printMenuPage(menu, 'edit profile', true);
        this.printError(err);

        let action: string = readlineSync.keyIn('Choose what do you like to edit: ', { limit: `$<0-${menu.length - 1}>` });

        switch (parseInt(action)) {
            case 1: {
                const name: string = readlineSync.question('Enter name: ').trim();
                if (name.length <= 0) {
                    this.showEditProfileMenu('Name cannot be empty');
                    break;
                }
                if (readlineSync.keyInYN('Are you sure you want to edit name?'))
                    this.user.setName(name);
                this.showEditProfileMenu();
                break;
            } case 2: {
                const email: string = readlineSync.question('Enter email: ');
                if (readlineSync.keyInYN('Are you sure you want to edit name?'))
                    this.user.setEmail(email);
                this.showEditProfileMenu();
                break;
            } case 3: {
                const password: string = readlineSync.question('Enter password: ');
                if (readlineSync.keyInYN('Are you sure you want to edit name?'))
                    this.user.setPassword(password);
                this.showEditProfileMenu();
                break;
            } case 4: {
                if (readlineSync.keyInYN('Are you sure you want to delete account?'))
                    userController.deleteById(this.user.getId(), (err) => {
                        this.setUser(null);
                        this.showMainMenu(err ? err : '');
                    })
            } case 0: {
                userController.updateById(this.user, (err) => {
                    if (err) console.log(err.message)
                    this.showMainMenu();
                });
                break;
            } default: {
                this.showEditProfileMenu();
                break;
            }
        }
    }

    private showUsersMenu(error?: string): void {
        userController.getAll((err, res) => {
            if (err) {
                this.showMainMenu(err.message);
                return;
            }

            const userNames: Array<string> = res.rows.map(item => item.name)
            this.printMenuPage([...userNames, 'Back'], 'users');
            this.printError(error);
            let action: string = readlineSync.question('Choose which page do you want to see: ');
            const user: any = res.rows[parseInt(action) - 1];

            switch (parseInt(action)) {
                case 0: {
                    this.showMainMenu();
                    break;
                } default: {
                    user ? this.showUserPage(user) : this.showUsersMenu(`User with index ${parseInt(action)} was not found`);
                    break;
                }
            }
        })
    }

    private showUserPage(user: any): void {
        this.printMenuPage(['Back'], user.name, false, () => this.printLongUser(new User(user.id, user.name, user.email, user.password), 'Viewed user'));
        let action: string = readlineSync.keyIn('Press \'0\' if you want go back: ', { limit: `$<0-0>` });

        switch (parseInt(action)) {
            case 0: {
                this.showUsersMenu();
                break;
            }
        }
    }

    private showPostsMenu(err?: string): void {
        const menu: Array<string> = ['All posts', 'My posts', 'Create posts', 'Back'];
        this.printMenuPage(menu, 'posts menu');
        this.printError(err);
        let action: string = readlineSync.keyIn('Choose your next action: ', { limit: `$<0-${menu.length - 1}>` });

        switch (parseInt(action)) {
            case 1: {
                this.showAllPostsPage();
                break;
            } case 2: {
                this.showMyPostsPage();
                break;
            } case 3: {
                if (!this.user) {
                    this.showPostsMenu('You must be logged in');
                    return;
                }
                const text: string = readlineSync.question('Enter text: ');
                const photoUrl: string = readlineSync.question('Enter photo URL: ');
                const authorId: number = this.user.getId();
                postController.add(new Post(null, text, photoUrl, authorId), (err) => {
                    if (err) this.showPostsMenu(err.message);
                    else this.showMyPostsPage();
                });
                break;
            } case 0: {
                this.showMainMenu();
                break;
            }
        }
    }

    private showAllPostsPage(error?: string): void {
        postController.getAll((err, res) => {
            if (err) {
                this.showMainMenu(err.message);
                return;
            }

            const postTexts: Array<string> = res.rows.map(item => item.text)
            this.printMenuPage([...postTexts, 'Back'], 'posts');
            this.printError(error);
            let action: string = readlineSync.question('Choose which page do you want to see: ');
            const post: any = res.rows[parseInt(action) - 1];

            switch (parseInt(action)) {
                case 0: {
                    this.showPostsMenu();
                    break;
                } default: {
                    post ? this.showPostPage(post) : this.showAllPostsPage(`Post with index ${parseInt(action)} was not found`);
                    break;
                }
            }
        })
    }

    private showMyPostsPage(error?: string): void {
        if (!this.user) {
            this.showPostsMenu('You must be logged in');
            return;
        }
        postController.getUsersPosts(this.user.getId(), (err, res) => {
            if (err) {
                this.showMainMenu(err.message);
                return;
            }

            const postTexts: Array<string> = res.rows.map(item => item.text)
            this.printMenuPage([...postTexts, 'Back'], 'posts');
            this.printError(error);
            let action: string = readlineSync.question('Choose which page do you want to see: ');
            const post: any = res.rows[parseInt(action) - 1];

            switch (parseInt(action)) {
                case 0: {
                    this.showPostsMenu();
                    break;
                } default: {
                    post ? this.showPostPage(post, null, true) : this.showMyPostsPage(`Post with index ${parseInt(action)} was not found`);
                    break;
                }
            }
        })
    }

    private showPostPage(post: any, err?: string, isMyPost?: boolean): void {
        const menu: Array<string> = ['Comments', 'Leave comment'];
        if (isMyPost) {
            menu.push('Delete post');
            menu.push('Edit post');
        }
        this.printMenuPage([...menu, 'Back'], `post ${post.id}`, false, () => this.printPost(new Post(post.id, post.text, post.photo_url, post.author_id), 'Viewed post'));
        this.printError(err);
        let action: string = readlineSync.keyIn('Choose your next action: ', { limit: `$<0-${menu.length}>` });

        switch (parseInt(action)) {
            case 1: {
                this.showPostComments(post.id);
                break;
            } case 2: {
                if (!this.user) {
                    this.showPostPage(post, 'You must be logged in');
                    return;
                }
                const text: string = readlineSync.question('Enter text: ');
                commentController.add(new Comment(null, text, this.user.getId(), post.id), (err) => {
                    if (err) {
                        this.showPostPage(post, err.message);
                        return;
                    }
                    this.showPostComments(post.id);
                });
                break;
            }
            case 3: {
                if (readlineSync.keyInYN('Are tou sure you want delete this post?'))
                    postController.deleteById(post.id, (err, res) => {
                        if (err) this.showMyPostsPage(err.message);
                        else this.showMyPostsPage();
                    });
                break;
            }
            case 4: {
                this.editPostMenu(new Post(post.id, post.text, post.photo_url, post.author_id));
                break;
            }
            case 0: {
                this.showPostsMenu();
                break;
            }
        }
    }

    private editPostMenu(post: Post, err?: string): void {
        const menu: Array<string> = ['Edit text', 'Edit PhotoURL', 'Back and save']
        this.printMenuPage(menu, 'edit profile', true);
        this.printError(err);

        let action: string = readlineSync.keyIn('Choose what do you like to edit: ', { limit: `$<0-${menu.length - 1}>` });

        switch (parseInt(action)) {
            case 1: {
                const text: string = readlineSync.question('Enter text: ');
                if (readlineSync.keyInYN('Are you sure you want to edit text?'))
                    post.setText(text);
                this.editPostMenu(post);
                break;
            } case 2: {
                const photoUrl: string = readlineSync.question('Enter PhotoURL: ');
                if (readlineSync.keyInYN('Are you sure you want to edit name?'))
                    post.setPhotoUrl(photoUrl);
                this.editPostMenu(post);
                break;
            } case 0: {
                postController.updateById(post, (err) => {
                    if (err) console.log(err.message)
                    this.showPostPage({
                        id: post.getId(),
                        text: post.getText(),
                        author_id: post.getAuthorId(),
                        photo_url: post.getPhotoUrl()
                    });
                });
                break;
            } default: {
                this.editPostMenu(post);
                break;
            }
        }
    }

    private printPost(post: Post, title: string) {
        if (!post) return;
        console.log(title || 'Post');
        console.log(`ID: ${post.getId()}`);
        console.log(`Text: ${post.getText()}`);
        console.log(`PhotoUrl: ${post.getPhotoUrl()}`);
        console.log(`AuthorID: ${post.getAuthorId()}`);
        this.emptyLine();
    }

    private printChat(chat: Chat, title: string) {
        if (!chat) return;
        console.log(title || 'Post');
        console.log(`ID: ${chat.getId()}`);
        console.log(`Name: ${chat.getName()}`);
        console.log(`PhotoUrl: ${chat.getPhotoUrl()}`);

        const date: Date = chat.getCreatedAt();
        const day: any = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const month: any = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        const year: any = date.getFullYear();
        const strDate: string = `${day}.${month}.${year}`;
        console.log(`Created at: ${strDate}`);
        this.emptyLine();
    }

    private showPostComments(id: any) {
        commentController.getPostsCommentsPopulate(id, (err, res) => {
            if (err) {
                this.showPostsMenu(err.message);
                return;
            }
            const coms: Array<string> = res.rows.map(item => `${item.author}\n${item.text}`)

            this.printMenuPage([...coms, 'Back'], 'post comments');
            let action: string = readlineSync.keyIn('Press \'0\' if you want go back: ', { limit: `$<0-0>` });

            switch (parseInt(action)) {
                case 0: {
                    postController.getById(id, (err, res) => {
                        if (err) this.showMainMenu(err.message);
                        else this.showPostPage(res.rows[0]);
                    })
                    break;
                }
            }
        })
    }
}
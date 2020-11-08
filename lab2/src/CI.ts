import pool from './pool';
import User from './user';
import Post from './post';
import Comment from './comment';
import readlineSync from 'readline-sync';

export class ConsoleInterface {
    private user : User;

    private setUser(user : User) : void{
        this.user = user;
    }
    
    public init() : void {
        this.clear();
        pool.connect();
    }

    public show() : void {
        this.showMainMenu();
    }

    public close() : void {
        pool.end();
    }

    private clear() : void {
        console.clear();
    }

    private emptyLine() : void {
        console.log();
    }

    private printMenuName(name : string) : void {
        console.log(`<<<${name.toLocaleUpperCase()}>>>`)
        this.emptyLine();
    }

    private printMenu(menu : Array<string>) : void {
        menu.forEach((item, index) => this.printMenuElement(index == menu.length - 1 ? 0 : index + 1, item));
    }

    private printLongUser(user : User, title? : string) : void {
        if (!user) return;
        console.log(title || 'User');
        console.log(`ID: ${user.getId()}`);
        console.log(`Name: ${user.getName()}`);
        console.log(`Email: ${user.getEmail()}`);
        if (this.user && user.getId() === this.user.getId()) console.log(`Password: ${this.user.getPassword()}`);
        this.emptyLine();
    }

    private printShortUser() : void {
        if (!this.user) return;
        console.log('User')
        console.log(this.user.getName());
        this.emptyLine();
    }

    private printMenuPage(menu : Array<string>, name : string, long?: boolean, cb? : Function) : void {
        this.clear();
        this.printMenuName(name);
        long ? this.printLongUser(this.user) : this.printShortUser();
        if(cb) cb();
        this.printMenu(menu)
        this.emptyLine();
    }

    private printMenuElement(index : Number, name : string) : void {
        console.log(`[${index}] - ${name}`);
    }

    private printError(e : string) : void {
        console.log(`***${e}***`)
    }

    private showMainMenu(err? : string) : void {
        const menu : Array<string> = ['Users', 'Posts', 'Chats', 'Edit profile', this.user ? 'Log out' : 'Log in' , 'Exit']
        this.printMenuPage(menu, 'main menu');
        if (err) {
            this.printError(err);
            this.emptyLine();
        }

        let action : string = readlineSync.keyIn('Choose your next action: ', {limit: `$<0-${menu.length - 1}>`});

        switch (parseInt(action)) {
            case 1: {
                this.showUsersMenu();
                break;
            } case 2: {
                this.showPostsMenu();
                break;
            } case 3: {
                console.log('Chats');
                break;
            } case 4: {
                if (!this.user) this.showMainMenu('You must be logged in');
                else this.showEditProfileMenu();
                break;
            } case 5: {
                this.toggleUserState();
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

    private toggleUserState() : void {
        if (this.user) {
            if (readlineSync.keyInYN('Are you sure you want to log out?'))
                this.setUser(null);
            this.showMainMenu();
            return;
        }

        this.emptyLine();
        const email = readlineSync.question('Enter email: ');
        const password = readlineSync.question('Enter password: ', {hideEchoBack: true});
        User.getByEmailAndPassword(email, password, (err, res) => {
            let e : string;
            if (err) {
                e = err.message;
            }
            if (res.rows[0]) {
                this.setUser(new User(res.rows[0].id, res.rows[0].name, res.rows[0].email, res.rows[0].password));
            } else e = 'User was not found'
            this.showMainMenu(e);
        })
    }

    private showEditProfileMenu(err? : string) : void {
        const menu : Array<string> = ['Edit name', 'Edit email', 'Edit password', 'Delete account', 'Back and save']
        this.printMenuPage(menu, 'edit profile', true);
        if (err) {
            this.printError(err);
            this.emptyLine();
        }

        let action : string = readlineSync.keyIn('Choose what do you like to edit: ', {limit: `$<0-${menu.length - 1}>`});

        switch (parseInt(action)) {
            case 1: {
                const name : string = readlineSync.question('Enter name: ').trim();
                if (name.length <= 0) {
                    this.showEditProfileMenu('Name cannot be empty');
                    break;
                }
                if (readlineSync.keyInYN('Are you sure you want to edit name?'))
                    this.user.setName(name);
                this.showEditProfileMenu();
                break;
            } case 2: {
                const email : string = readlineSync.question('Enter email: ');
                if (readlineSync.keyInYN('Are you sure you want to edit name?'))
                    this.user.setEmail(email);
                this.showEditProfileMenu();
                break;
            } case 3: {
                const password : string = readlineSync.question('Enter password: ');
                if (readlineSync.keyInYN('Are you sure you want to edit name?'))
                    this.user.setPassword(password);
                this.showEditProfileMenu();
                break;
            } case 4: {
                if (readlineSync.keyInYN('Are you sure you want to delete account?'))
                User.deleteById(this.user.getId(), (err) => {
                    this.setUser(null);
                    this.showMainMenu(err ? err : '');
                })
            } case 0: {
                User.updateById(this.user, (err) => {
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

    private showUsersMenu() : void {
        User.getAll((err, res) => {
            if (err) {
                this.showMainMenu(err.message);
                return;
            }

            const userNames : Array<string> = res.rows.map(item => item.name)
            this.printMenuPage([...userNames, 'Back'], 'users');
            let action : string = readlineSync.keyIn('Choose which page do you want to see: ', {limit: `$<0-${res.rows.length}>`});

            switch (parseInt(action)) {
                case 0: {
                    this.showMainMenu();
                    break;
                } default: {
                    this.showUserPage(res.rows[parseInt(action) - 1]);
                    break;
                }
            }
        })
    }

    private showUserPage(user : any) : void {
        this.printMenuPage(['Back'], user.name, false, () => this.printLongUser(new User(user.id, user.name, user.email, user.password), 'Viewed user'));
        let action : string = readlineSync.keyIn('Press \'0\' if you want go back: ', {limit: `$<0-0>`});

        switch (parseInt(action)) {
            case 0: {
                this.showUsersMenu();
                break;
            }
        }
    }

    private showPostsMenu(err? : string) : void {
        const menu : Array<string> = ['All posts', 'My posts', 'Back'];
        this.printMenuPage(menu, 'posts menu');
        if (err) {
            this.printError(err);
            this.emptyLine();
        }
        let action : string = readlineSync.keyIn('Press \'0\' if you want go back: ', {limit: `$<0-${menu.length - 1}>`});

        switch (parseInt(action)) {
            case 1: {
                this.showAllPostsPage();
                break;
            } case 2: {
                this.showMyPostsPage();
                break;
            } case 0: {
                this.showMainMenu();
                break;
            }
        }
    }

    private showAllPostsPage() : void {
        Post.getAll((err, res) => {
            if (err) {
                this.showMainMenu(err.message);
                return;
            }

            const postTexts : Array<string> = res.rows.map(item => item.text)
            this.printMenuPage([...postTexts, 'Back'], 'posts');
            let action : string = readlineSync.keyIn('Choose which page do you want to see: ', {limit: `$<0-${res.rows.length}>`});

            switch (parseInt(action)) {
                case 0: {
                    this.showPostsMenu();
                    break;
                } default: {
                    this.showPostPage(res.rows[parseInt(action) - 1]);
                    break;
                }
            }
        })
    }

    private showMyPostsPage() : void {
        if (!this.user) {
            this.showPostsMenu('You must be logged in');
            return;
        }
        Post.getUsersPosts(this.user.getId(), (err, res) => {
            if (err) {
                this.showMainMenu(err.message);
                return;
            }

            const postTexts : Array<string> = res.rows.map(item => item.text)
            this.printMenuPage([...postTexts, 'Back'], 'posts');
            let action : string = readlineSync.keyIn('Choose which page do you want to see: ', {limit: `$<0-${res.rows.length}>`});

            switch (parseInt(action)) {
                case 0: {
                    this.showPostsMenu();
                    break;
                } default: {
                    this.showPostPage(res.rows[parseInt(action) - 1]);
                    break;
                }
            }
        })
    }

    private showPostPage(post : any) : void {
        const menu : Array<string> = ['Comments', 'Back'];
        this.printMenuPage(menu, `post ${post.id}`, false, () => this.printPost(new Post(post.id, post.text, post.photo_url, post.author_id), 'Viewed post'));
        let action : string = readlineSync.keyIn('Press \'0\' if you want go back: ', {limit: `$<0-${menu.length - 1}>`});

        switch (parseInt(action)) {
            case 1: {
                this.showPostComments(post.id);
                break;
            } case 0: {
                this.showPostsMenu();
                break;
            }
        }
    }

    private printPost(post : Post, title : string) {
        if (!post) return;
        console.log(title || 'Post');
        console.log(`ID: ${post.getId()}`);
        console.log(`Text: ${post.getText()}`);
        console.log(`PhotoUrl: ${post.getPhotoUrl()}`);
        console.log(`AuthorID: ${post.getAuthorId()}`);
        this.emptyLine();
    }

    private showPostComments(id : any) {
        Comment.getPostsCommentsPopulate(id, (err, res) => {
            if (err) {
                this.showPostsMenu(err.message);
                return;
            }
            const coms : Array<string> = res.rows.map(item => `${item.author}\n${item.text}`)

            this.printMenuPage([...coms, 'Back'], 'post comments');
            let action : string = readlineSync.keyIn('Press \'0\' if you want go back: ', {limit: `$<0-0>`});

            switch (parseInt(action)) {
                case 0: {
                    this.showPostsMenu();
                    break;
                }
            }
        })
    }
}
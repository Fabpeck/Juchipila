import firebase from "firebase";
import { TresLechesServices } from "./TresLechesServices";
import { User, Cookbook } from "./TresLechesModels";
import { observable, action } from "mobx";

export class TresLechesSession {
    private static instance: TresLechesSession;
    public db: firebase.database.Database;
    public services: TresLechesServices;

    @observable public user: User | undefined;
    @observable public cookbooks: Cookbook[] | undefined;

    private constructor() {
        this.db = firebase.database();  
        this.services = new TresLechesServices();  
     }

    public static getInstance(): TresLechesSession {
        if (!TresLechesSession.instance) {
            TresLechesSession.instance = new TresLechesSession();
        }
        return TresLechesSession.instance;
    }

    public async signInUser(email: string, password: string): Promise<void> {
        try {
            const user = await this.services.signInUser(email, password);
            this.setUser(user);
        } catch (error) {
            throw error;
        }
    }

    @action
    public setUser(user: User) {
        this.user = user;
        this.fetchUserCookbooks().then(action((cookbooks) => {
            this.cookbooks = cookbooks;
        }));
    }

    public async registerUser(email: string, password: string): Promise<void> {
        try {
            const user = await this.services.registerUser(email, password);
            this.setUser(user);
        } catch (error) {
            throw error;
        }
    }

    public addNewCookbook(cookbook: Cookbook): Promise<Cookbook> {
        return this.user ? this.services.addNewCookbook(cookbook, this.user) : Promise.reject("User is not defined");
    }

    public updateCookbook(cookbook: Cookbook): Promise<Cookbook> {
        return this.services.updateCookbook(cookbook);
    }

    public async fetchUserCookbooks(limit?: number): Promise<Cookbook[]> {
        if (this.user) {
            limit = limit === undefined ? this.user.cookbooksIds.length : limit;
            return Promise.all(this.user.cookbooksIds.slice(Math.max(this.user.cookbooksIds.length - limit, 0))
            .map((id) => this.services.fetchCookbook(id)));
        }
        return Promise.resolve([]);     
    }
}
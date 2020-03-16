import firebase from "firebase";
import { TresLechesServices } from "./TresLechesServices";
import { User, Cookbook } from "./TresLechesModels";
import { observable, runInAction } from "mobx";

export class TresLechesSession {
    private static instance: TresLechesSession;
    public db: firebase.database.Database;
    @observable public user: User | undefined;
    public services: TresLechesServices;

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

    public async signInUser(email: string, password: string) {
        runInAction(async () => this.user = await this.services.signInUser(email, password));
    }

    public async registerUser(email: string, password: string) {
        this.user = await this.services.registerUser(email, password);
    }

    public addNewCookbook(cookbook: Cookbook): Promise<Cookbook> {
        return this.user ? this.services.addNewCookbook(cookbook, this.user) : Promise.reject("User is not defined");
    }
}
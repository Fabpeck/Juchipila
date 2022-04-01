import { action, computed, observable, runInAction } from "mobx";
import React from "react";
import { CategoricalListProps, Category } from "../components/panels/CategoricalList";
import { ShelfLifeService } from "./ShelfLifeService";

export interface InventoryItem {name: string; exp?: string; category?: string; quantity?: string};

export interface BaseProps {parentMachine: GeneralMachine};

export enum ShelfViews {
    SHELF = "shelf",
    CART = "cart",
    CHAT = "chat",
    WARNINGS = "warnings",
    HEALTH_RISKS = "healthRisks"
}

export class GeneralMachine {
    @observable inventory: InventoryItem[] = [];
    @observable cart: InventoryItem[] = [];
    @observable view: ShelfViews = ShelfViews.SHELF;
    @observable expiredExpanded: boolean = true;
    @observable soonToExpiredExpanded: boolean = true;
    @observable restExpanded: boolean = false;

    @observable bromateProds: React.ReactElement[] = [];

    static inventoryKey = "shelf_life_inventory";
    static cartKey = "shelf_life_cart";
    static newRow = "..";
    static newField = ";;";

    public services: ShelfLifeService = new ShelfLifeService();

    constructor() {
        let inventoryString = window.localStorage.getItem(GeneralMachine.inventoryKey);
        if (inventoryString) {
            this.inventory = this.parseInventory(inventoryString);
        }
        let cartString = window.localStorage.getItem(GeneralMachine.cartKey);
        if (cartString) {
            this.cart = this.parseInventory(cartString);
        }
        this.initBromateProducts();
        console.log("Initiating machine");
    }

    @action
    parseInventory(inventoryString: string): InventoryItem[] {
        let inventory = inventoryString.split(GeneralMachine.newRow).map((item) => {
            let name = "";
            let exp = "";
            let category = "";
            let quantity = "";
            item.split(GeneralMachine.newField).forEach((field, index) => {            
            switch(index) {
                case (0):
                    name = field;
                    break;
                case (1):
                    exp = field;
                    break;
                case (2):
                    category = field;
                    break;
                case (3):
                    quantity = field;
                    break;   
            }
        });
        return {name: name, exp: exp, category: category, quantity: quantity};
    });
    return inventory;
    }

    @action
    deleteFromInventory(index: number): void {
        this.inventory.splice(index, 1);
        this.updateInventoryLocalStorage();
    }

    @action
    addToInventory(itemsToAdd: InventoryItem[]): void {
        this.inventory = this.inventory.concat(itemsToAdd);
        this.updateInventoryLocalStorage();
    }

    @action
    deleteFromCart(index: number): void {
        this.cart.splice(index, 1);
        this.updateCartLocalStorage();
    }

    @action
    addToCart(itemsToAdd: InventoryItem[]): void {
        this.cart = this.cart.concat(itemsToAdd);
        this.updateCartLocalStorage();
    }

    getWarnings(): Category[] | undefined {
        let today = new Date();
        let expired: {name: string, date?: Date}[] = []
        let soonToExpire: {name: string, date?: Date}[] = [];
        let rest: {name: string, date?: Date}[] = [];
        this.inventory.sort((item1, item2) => {
            let date1 = new Date(item1.exp||"");
            let date2 = new Date(item2.exp||"")
            if (date1 < date2) {
                return -1;
              }
              if (date1 > date2) {
                return 1;
              }
              // a must be equal to b
              return 0;
        }).forEach((item) => {
            let date = new Date(item.exp || "");
            let input = {name: item.name, date: item.exp ? new Date(item.exp) : undefined};
            if (!date || isNaN(date.getTime())) {
                rest.push(input);
                return;
            }
            if (date) { 
                if (!(date < today)) {
                    expired.push(input);
                    return;
                } if ((date.getTime() - today.getTime()) < (604800000)) {
                    soonToExpire.push(input);
                    return;
                } 
                rest.push(input)
                return;
            }});
        let categories = [];
        let funcToDisplay = (item: {name: string, date?: Date}) => item.name + " (" + item.date?.toDateString() + ")";
        expired.length > 0 && categories.push({header: <div className="expired">Expired</div>, items: expired.map(funcToDisplay), 
            expanded: this.expiredExpanded, onExpandedChange: action(() => this.expiredExpanded = !this.expiredExpanded)});
        soonToExpire.length > 0 && categories.push({header: <div className="soon-to-expire">Soon to expire</div>, 
            items: soonToExpire.map(funcToDisplay), expanded: this.soonToExpiredExpanded, onExpandedChange: action(() => this.soonToExpiredExpanded = !this.soonToExpiredExpanded)});
        rest.length > 0 && categories.push({header: <div>Rest</div>, items: rest.map(funcToDisplay), expanded: this.restExpanded, onExpandedChange: action(() => this.restExpanded = !this.restExpanded)});
        return categories;
    }

    createInventoryString(list: InventoryItem[]): string {
        return list.map((row) => [row.name, row.exp, row.category || "", row.quantity || ""].join(GeneralMachine.newField)).join(GeneralMachine.newRow);
    }

    updateInventoryLocalStorage(): void {
        window.localStorage.setItem(GeneralMachine.inventoryKey, this.createInventoryString(this.inventory))
    }

    updateCartLocalStorage(): void {
        window.localStorage.setItem(GeneralMachine.cartKey, this.createInventoryString(this.cart))
    }

    @computed
    get cartMap(): Map<string, string[]> {
        let cartMap = new Map<string, string[]>();
        this.cart.forEach((item) => {
            let match = cartMap.get(item.category?.toLowerCase() || "");
            if (match) {
                match.push(item.name)
                cartMap.set(item.category?.toLowerCase() || "", match)
            } else {
                cartMap.set(item.category?.toLowerCase() || "", [item.name])
            }
        });
        return cartMap;
    }

    async initBromateProducts(): Promise<void> {
        let data = await this.services.searchFDC("bromate");
        runInAction(() => {
            this.bromateProds = data.map((food) => {
                return <div>{food.description + " " + food.brandName}</div>
            })
        })
    }
}
import { BaseProps } from "./GeneralMachine";
import React from 'react';
import { Icon, IconSources } from "../components/Icon";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { TextInput } from "../components/inputs/TextInput";
import { CategoricalList } from "../components/panels/CategoricalList";

@observer
export class Cart extends React.Component<BaseProps> {
    @observable newValue: string = "";
    @observable newCategory: string = "";
    render() {
        let cartMap = this.props.parentMachine.cartMap;
        return <div onKeyPress={(e) => {
            if (e.key === "Enter") {
                this.props.parentMachine.cart.push({name: this.newValue, category: this.newCategory});
                this.newValue = "";
                this.newCategory = "";
            }}}>
                <div className="new-cart-item">
                <Icon source={IconSources.FONTAWESOME} name="plus" onClick={() => {
                this.props.parentMachine.addToCart([{name: this.newValue, category: this.newCategory}]);
                this.newValue = "";
                this.newCategory = "";
            }}/>
            <TextInput label="Category: " value={this.newCategory} onChange={(newValue: string) => this.newCategory = newValue}/>
        <TextInput label="Name: " value={this.newValue} onChange={(newValue: string) => this.newValue = newValue}/>
                </div>
                <CategoricalList categories={Array.from(cartMap.entries()).map((entry) => {return {header: entry[0], items: entry[1]}})}/>
        <div>
        
               </div>
        </div>
    }
}
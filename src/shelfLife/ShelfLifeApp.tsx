import React from 'react';
import { observer } from 'mobx-react';
import { IconSources, Icon } from '../components/Icon';
import "./ShelfLifeApp.css";
import { Chat } from './Chat';
import { Inventory } from './Inventory';
import { GeneralMachine, ShelfViews } from './GeneralMachine';
import { action } from 'mobx';
import { Cart } from './Cart';
import { Warnings } from './Warnings';
import { HealthRisks } from './HealthRisks';

@observer
export class ShelfLifeApp extends React.Component {
    public generalMachine?: GeneralMachine;

    componentWillMount() {
        this.generalMachine = new GeneralMachine();
    }
    
    renderMenuItem(view: ShelfViews, text: string, icon: string, iconClassName?: string, iconSource?: IconSources, count?: string): React.ReactElement {
        return <div className="navigation-bar-item">
            <div className="nav-icon-wrap"><Icon className={iconClassName || ""} source={iconSource || IconSources.FONTAWESOME} name={icon} onClick={action(() => {
            if (this.generalMachine) {
                this.generalMachine.view = view;
            }
        })}/>
        {count && <span className="nav-numbers">{count}</span>}
        </div>
             <div className="navigation-item-text">{text}</div></div>
    }

    renderMenu() {
        return <div className="navigation">
            {this.renderMenuItem(ShelfViews.SHELF, "Home", "home")}
            {this.renderMenuItem(ShelfViews.CART, "Cart", "shopping-cart", undefined, undefined, this.generalMachine?.cart.length + "")}
            {this.renderMenuItem(ShelfViews.CHAT, "Chat", "comment")}
            {this.renderMenuItem(ShelfViews.WARNINGS, "Warnings", "exclamation-triangle")}
            {this.renderMenuItem(ShelfViews.HEALTH_RISKS, "HealthRisks", "biohazard.svg", "biozahard-icon", IconSources.ASSETS)}
            </div>;
    }

    renderItems(children: React.ReactElement) {
        return <div className="App app-wrapper">
        {this.renderMenu()}
        <div className="app-content">{children}</div>
                    
    </div>;
    }

    render() {
        switch(this.generalMachine?.view) {
            case(ShelfViews.SHELF):
             return this.renderItems(<Inventory parentMachine={this.generalMachine}/>);
            case(ShelfViews.CART):
             return this.renderItems(<Cart parentMachine={this.generalMachine}/>);
            case(ShelfViews.CHAT):
             return this.renderItems(<Chat parentMachine={this.generalMachine}/>);
            case(ShelfViews.WARNINGS):
             return this.renderItems(<Warnings parentMachine={this.generalMachine}/>);
            case(ShelfViews.HEALTH_RISKS):
             return this.renderItems(<HealthRisks parentMachine={this.generalMachine}/>)
        }
    }
}

export default ShelfLifeApp;

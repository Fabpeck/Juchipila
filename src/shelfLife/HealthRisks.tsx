import { action, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Icon, IconSources } from "../components/Icon";
import { TextInput } from "../components/inputs/TextInput";
import { CategoricalList } from "../components/panels/CategoricalList";
import { BaseProps } from "./GeneralMachine";

@observer
export class HealthRisks extends React.Component<BaseProps> {
    @observable search: string = "";
    render() {
        let topics = [{header: <a href="https://www.kingarthurbaking.com/pro/reference/bromate" className="health-risk-text" target="_blank">
        BROMATE in flour: bromate in baking is its demonstrated link to cancer in laboratory animals. 
        It was first found to induce tumors in rats in 1982. 
        The FDA in 1991 encouraged bakers to voluntarily stop using it, instead of banning it.
        </a>, items: this.props.parentMachine.bromateProds || []}]
        return <div>
            <CategoricalList categories={topics}/>
            <TextInput value={this.search} onChange={action((newVal) => this.search = newVal)}/>
            <Icon name="search" source={IconSources.FONTAWESOME} onClick={() => {
                this.props.parentMachine.services.searchFDC(this.search)
            }}/>
            </div>;
    }
}
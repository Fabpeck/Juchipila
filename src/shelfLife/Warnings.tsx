import { BaseProps } from "./GeneralMachine";
import React from 'react';
import { CategoricalList } from "../components/panels/CategoricalList";
import { observer } from "mobx-react";

@observer
export class Warnings extends React.Component<BaseProps> {
    render() {
        return <CategoricalList categories={this.props.parentMachine.getWarnings()!}/>
    }
}
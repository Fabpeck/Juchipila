import React from 'react';
import { observer } from 'mobx-react';
import { BaseProps, InventoryItem } from './GeneralMachine';
import { Icon, IconSources } from '../components/Icon';
import { observable } from 'mobx';
import { TextInput } from '../components/inputs/TextInput';

@observer
export class Inventory extends React.Component<BaseProps> {   
    @observable private newRow: InventoryItem = {name: "", exp: "", category: "", quantity: ""};
    render() {
        return <div>
            <div>
            <table id="inventory" className="inventory">
              <tbody>
  <tr className="header">
    <th className="actions-column"/>
    <th className="info-column">Name</th>
    <th className="info-column">Expiration Date</th>
    <th className="info-column">Category</th>
    <th className="info-column">Quantity</th>
  </tr>
  {this.props.parentMachine.inventory.map((item, index) => {
    return <tr key={item.name + index}>
      <td className="actions-column"><Icon source={IconSources.FONTAWESOME} name="trash" onClick={() => {
                this.props.parentMachine.deleteFromInventory(index);
            }}/></td>
      <td className="info-column">{item.name}</td>
      <td className="info-column">{item.exp}</td>
      <td className="info-column">{item.category}</td>
      <td className="info-column">{item.quantity}</td>
    </tr>
  })}
  <tr key="new">
      <td className="actions-column"><Icon source={IconSources.FONTAWESOME} name="plus" onClick={() => {
                this.props.parentMachine.addToInventory([this.newRow]);
                this.newRow = {name: "", exp: "", category: "", quantity: ""};
            }}/></td>
      <td className="info-column"><TextInput value={this.newRow.name} onChange={(newValue) => this.newRow.name = newValue}/></td>
      <td className="info-column"><TextInput value={this.newRow.exp} onChange={(newValue) => this.newRow.exp = newValue}/></td>
      <td className="info-column"><TextInput value={this.newRow.category} onChange={(newValue) => this.newRow.category = newValue}/></td>
      <td className="info-column"><TextInput value={this.newRow.quantity} onChange={(newValue) => this.newRow.quantity = newValue}/></td>
    </tr>
    </tbody>
</table>
            </div>
        </div>
    }
}
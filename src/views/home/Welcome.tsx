import React from 'react';
import { Card } from '../../components/panels/Card';
import './Welcome.css';
import { EditCookbook, EditCookbookController } from '../cookbooks/EditCookbook';
import { action } from 'mobx';
import { TresLechesSession } from '../../services/TresLechesSession';
import { observer } from 'mobx-react';

@observer
export class Welcome extends React.Component {
  public static recentCookbooksCount: number = 3;

  addCookbook() {
    EditCookbook.addCookbook({
      editCookbookController: new EditCookbookController(),
      onCommit: action((cookbook) => {
        TresLechesSession.getInstance().cookbooks?.push(cookbook);
      })
    });
  }

  render() {
    let cookbooks = TresLechesSession.getInstance().cookbooks;
    return <div className="welcome">
      <div className="welcome-panel">
        <label>Most Recient Cookbooks</label>
        <ul id="cookbooks">
          {cookbooks 
          ? cookbooks.slice(cookbooks.length - Welcome.recentCookbooksCount)
          .map((cookbook) => <li><Card title={cookbook.name} image="logo" description={cookbook.code}
            onClick={() => EditCookbook.editCookbook({ editCookbookController: new EditCookbookController(cookbook), onCommit: action((updatedCB) => cookbook = updatedCB) })} /></li>)
            : null
          }
        </ul>
        <button onClick={this.addCookbook}>Add New Cookbook</button>
        <br />
        <label>Top Recipes</label>
        <ul id="recipes">
          <li><Card title="Recipes 1" /></li>
          <li><Card title="Recipes 2" /></li>
          <li><Card title="Recipes 3" /></li>
        </ul>
      </div>
    </div>
  }
}
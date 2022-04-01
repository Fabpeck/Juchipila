import { observer } from 'mobx-react';
import React from 'react';
import { Icon, IconSources } from '../Icon';
import './CategoricalList.css';

export interface Category {
    header: string|React.ReactElement;
    items: (string|React.ReactElement)[];    
    expanded?: boolean;
    onExpandedChange?: () => void;
}

export interface CategoricalListProps {
    categories: Category[];
}

@observer
export class CategoricalList extends React.Component<CategoricalListProps> {
    render() {
        return <div className="category-list">{this.props.categories.map((category, index) => <div className="category-wrapper" key={(typeof category) === "string" ? category.toString() : (index + "")}>
            <div className="category-header">
                {category.onExpandedChange && <Icon name={category.expanded ? "angle-down" : "angle-up"} source={IconSources.FONTAWESOME} onClick={category.onExpandedChange}/>}
                {category.header}
                </div>
            {!(category.expanded === false) && <div className="category-items">
                {category.items.map((item, i) => <div key={(typeof item) === "string" ? item.toString() : (i + "")} className="category-item">{item}</div>)}
                </div>}
        </div>)}</div>
    }
}
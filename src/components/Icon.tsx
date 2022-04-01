import React from 'react';

export enum IconSources {
    FONTAWESOME,
    ASSETS,
    URL
}

export interface IconProps {
    name: string;
    source: IconSources;
    className?: string;
    onClick?: () => void;
    tooltip?: string;
    style?: React.CSSProperties;
    href?: string;
}

export class Icon extends React.Component<IconProps> {
    render() {
        let icon: React.ReactElement;
        let className = (this.props.className || "") + " icon" + (this.props.onClick ? " clickable" : "")
        switch(this.props.source) {
            case IconSources.FONTAWESOME:
                icon = <i title={this.props.tooltip} onClick={this.props.onClick} className={className + " fa fa-" + this.props.name} style={this.props.style}/>;
                break;
            case IconSources.ASSETS:
                let withFileExt = this.props.name.indexOf(".") > -1;
                icon = <img {...this.props} className={className} onClick={this.props.onClick} title={this.props.tooltip} src={require("../assets/images/" + this.props.name + (withFileExt ? "" : ".png"))} alt={this.props.className}/>;
                break;
            case IconSources.URL:
                icon = <img {...this.props} className={className} onClick={this.props.onClick} title={this.props.tooltip} src={require(this.props.name)} alt={this.props.className}/>;
                break;
        }
        return this.props.href ? <a href={this.props.href} target="_blank">{icon}</a> : icon;
    }
}
import React, {Component} from 'react';
import classes from './MenuItem.module.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretRight, faCaretDown, faCog, faShare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
library.add(faCaretRight, faCaretDown, faCog, faShare);

class MenuItem extends Component {
    getInner(){
        const {horizontal, caret, config, iconsOff} = this.props;
        const {icon, disabled, url, title, type} = config;
        const {caretClass, seperator, iconClass} = classes;
        const horiCaret = horizontal ? "caret-down" : "caret-right";
        const caretIcon = caret ? <FontAwesomeIcon className={caretClass} icon={horiCaret}/> : "";
        const iconPic = icon && !iconsOff ? <FontAwesomeIcon className={iconClass} icon={icon}/> : "";
        let inner = <div>{iconPic}<a href={url}>{title}</a>{caretIcon}</div>
        if(disabled){
            inner = <div>{iconPic}<span>{title}</span></div>
        }
        if(type === "seperator"){
            inner = <div className={seperator}></div>
        }
        return inner;
    }
    
    render(){
        const {horizontal, config, onHover} = this.props;
        const {disabled, style} = config;
        const {hori, item, disabledClass} = classes;

        let className = (disabled ? disabledClass + " " : "") + item + " " + (horizontal ? hori : "");
        if(style){
            className += " " + classes["style"+style.toLowerCase()];
        }

        return <li className={className} onMouseEnter={onHover}>{this.getInner()}{this.props.getSubMenus()}</li>;
    }
}

export default MenuItem;
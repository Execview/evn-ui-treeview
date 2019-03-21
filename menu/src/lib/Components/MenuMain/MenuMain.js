import React, { Component } from 'react';
import MenuItem from '../MenuItem/MenuItem';
import classes from './MenuMain.module.css'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
library.add(faBars);

class MenuMain extends Component {
    state = {
        menu: [],
        submenus: [],
        iteration: this.props.iteration || 0,
        active: 0,
        mobileView: window.innerWidth <= 430,
        mobileShow: false
    }
    componentDidMount() {
        this.init(this.props);
        window.addEventListener("resize", this.resize);
    }
    componentWillReceiveProps(nextProps) {
        this.init(nextProps);
    }
    init = (nextProps) => {
        this.setState({
            ...this.state,
            menu: nextProps.config.menu,
            submenus: [],
            active: 0
        })
    }
    getListing = () => {
        return this.state.menu.map((res, i) => {
            const caret = res.submenus && res.submenus.length > 0;
            let menuItem = {...res};
            delete menuItem.submenus;
            return <MenuItem key={i}
                            config={menuItem}
                            caret={caret}
                            iconsOff={this.props.config.options.iconsOff}
                            onHover={() => this.onHover(res.submenus, i)}
                            horizontal={!this.props.notMain && (this.props.config.options.horizontal || this.state.mobileView)}
                            onLeave={this.onLeave}
                            getSubMenus={this.state.active === i ? this.getSubMenus : () => ""}/>
        })
    }
    onHover = (submenus, index) => {
        if (submenus) {
            this.setState({
                ...this.state,
                submenus: [...submenus],
                active: index
            })
        }
    }
    onLeave = () => {
        this.setState({
            ...this.state,
            submenus: [],
            active: 0
        })
    }
    thisOnLeave = () => {
        if(typeof this.props.onLeave === "function"){
            this.props.onLeave();
        } else {
            this.onLeave();
        }
    }
    showToggle = () =>{
        this.setState({
            ...this.state,
            mobileShow: !this.state.mobileShow
        })
    }
    getSubMenus = () => {
        const {submenus, active, iteration} = this.state;
        let config = {
            menu: submenus,
            options: {...this.props.config.options}
        };
        let subMenu = submenus.length > 0 ? <MenuMain config={config} 
                                                                 onLeave={this.onLeave} 
                                                                 active={active} 
                                                                 notMain={true} 
                                                                 iteration={iteration+1}/> : "";
        return subMenu;
    }
    resize = () =>{
        this.setState({...this.state, mobileView: window.innerWidth <= 430});
    }
    render() {
        const { notMain, config} = this.props;
        let { horizontal } = config.options;
        const {listHori, main, notMainClass, list} = classes;
        horizontal = horizontal && !this.state.mobileView;
        const horiClass = horizontal && !notMain ? " " + listHori : '';
        const mainClass = !notMain ? main : notMainClass;
        const phoneBarObj = !notMain ? <div className={classes.phoneBar} onClick={this.showToggle}><div className={classes.barsIcon}><FontAwesomeIcon icon="bars"/></div></div> : "";
        const menu = notMain || (this.state.mobileShow || !this.state.mobileView) ?<div className={mainClass} onMouseLeave={this.thisOnLeave}>
                        <ul className={list + horiClass}>
                            {this.getListing()}
                        </ul>
                    </div> : "";
        return  <div>
                    {phoneBarObj}
                    {menu}
                </div>;
    }
}

export default MenuMain;
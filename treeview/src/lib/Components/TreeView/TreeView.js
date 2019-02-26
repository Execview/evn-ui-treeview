import React, {Component} from 'react';
import classes from './TreeView.module.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Node} from '../Nodes';

library.add(faCaretDown, faCaretRight);
class TreeView extends Component {
    state = {
        settings: {
            nodenr: 0,
            path: [],
            ...this.props.settings
        }
    }
    revealHandler = () => {
        let pat = [...this.state.settings.path]
        pat.push(this.state.settings.nodenr);
        this.props.closeHandler(pat);
    }
    getCaret(isClosed, isNodes){
        const caret = isClosed ? "caret-right" : "caret-down"
        let caretIcon = "";
        const active = isClosed ? "" : classes.active;
        if(isNodes){
            caretIcon = <FontAwesomeIcon className={classes.caret + " " + active} icon={caret} onClick={this.revealHandler}/>
        }
        return caretIcon;
    }
    render(){
        let nodes = "";
        let isClosed = this.props.root.closed;
        if(isClosed === undefined){
            isClosed = false;
        }
        const isNodes = this.props.root.nodes && this.props.root.nodes.length > 0;
        if(this.props.root && isNodes && !isClosed){
            nodes = this.props.root.nodes.map((val, index) => {
                let pat = [...this.state.settings.path];
                pat.push(this.state.settings.nodenr);
                const settings = {
                    nodenr: index,
                    path: pat
                }
                return <TreeView key={index} root={val} settings={settings} closeHandler={this.props.closeHandler}/>;
            });
        }
        return (
            <div className={classes.nodeWrapper}>
                {this.getCaret(isClosed, isNodes)}
                <div className={classes.node}>
                    <Node type={this.props.root.type} data={this.props.root.data}/>
                    {nodes}
                </div>
            </div>
        );
    }
}
export default TreeView;
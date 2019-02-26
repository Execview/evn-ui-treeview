import React, {Component} from 'react';
import TreeView from '../TreeView/TreeView';
import DataTable from '../DataTable/DataTable';
import classes from './TreeViewMain.module.css';

class TreeViewMain extends Component{
    state = {
        root: this.props.root,
        editing: []
    }
    ifUnFalse(bool){
        if(bool === undefined){
            return false;
        }
        return bool;
    }
    onEditHandler = (path, nodenr, key) => {
        this.setState({
            ...this.state,
            editing: [[...path], nodenr, key]
        });
    }
    componentWillReceiveProps(nextprops){
        this.setState({
            ...this.state,
            root: nextprops.root
        })
    }
    onSaveHandler = (value) => {
        const path = [...this.state.editing[0], this.state.editing[1]];
        let rot = {...this.state.root};
        if(path.length > 1){
            let stp = rot.nodes;
            path.forEach((step,index) => {
                if(index === path.length-1){
                    stp[step].data[this.state.editing[2]] = value;
                }
                if(index !== 0){
                    stp = stp[step].nodes;
                }
            });
        } else {
            rot.data[this.state.editing[2]] = value;
        }
        this.setState({
            ...this.state,
            root: rot,
            editing: []
        });
    }
    closeHandler = (path) => {
        let rot = {...this.state.root};
        if(path.length > 1){
            let stp = rot.nodes;
            path.forEach((step,index) => {
                if(index === path.length-1){
                    stp[step].closed = !this.ifUnFalse(stp[step].closed);
                }
                if(index !== 0){
                    stp = stp[step].nodes;
                }
            });
        } else {
            rot.closed = !this.ifUnFalse(rot.closed);
        }
        this.setState({
            ...this.state,
            root: rot
        });
    }
    render(){
        return (
            <div className={classes.main}>
                <div className={classes.treeView}>
                    <TreeView root={this.state.root} 
                            closeHandler={this.closeHandler}/>
                </div>
                <DataTable root={this.state.root} 
                           onEditHandler={this.onEditHandler} 
                           editing={this.state.editing} 
                           onSaveHandler={this.onSaveHandler}/>
            </div>
        );
    }
}

export default TreeViewMain;
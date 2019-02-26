import React, {Component} from 'react'
import {TextNode, ActivityNode, ProjectNode, SubProjectNode, NoteNode} from '../';

class Node extends Component {
    getNode(type){
        switch(type){
            case "text":
                return <TextNode {...this.props}/>;
            case "activity":
                return <ActivityNode {...this.props}/>;
            case "project":
                return <ProjectNode {...this.props}/>;
            case "subproject":
                return <SubProjectNode {...this.props}/>;
            case "note":
                return <NoteNode {...this.pros}/>
            default:
                return <TextNode {...this.props}/>;
        }
    }
    render(){
        return this.getNode(this.props.type);
    }
}

export default Node;
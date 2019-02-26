import React, {Component} from 'react';
import classes from './NoteNode.module.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStickyNote } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(faStickyNote);
class NoteNode extends Component {
    render(){
        let text = `Note`;
        return  (<div className={classes.title}>
                    <FontAwesomeIcon className={classes.icon} icon="sticky-note"/>
                    {text}
                </div>);
    }
}

export default NoteNode;
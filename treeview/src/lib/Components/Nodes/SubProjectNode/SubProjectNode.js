import React, {Component} from 'react';
import classes from './SubProjectNode.module.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
library.add(faFile);

class SubProjectNode extends Component {
    render(){
        let text = `SubProject`;
        return (
            <div className={classes.title}>
                <FontAwesomeIcon className={classes.icon} icon="file"/>
                {text}
            </div>
        );
    }
}

export default SubProjectNode;
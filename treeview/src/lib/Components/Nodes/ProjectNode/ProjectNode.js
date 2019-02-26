import React, {Component} from 'react';
import classes from './ProjectNode.module.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSuitcase } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
library.add(faSuitcase);

class ProjectNode extends Component {
    render(){
        let text = `Project`;
        return (
            <div className={classes.title}>
                <FontAwesomeIcon className={classes.icon} icon="suitcase"/>
                {text}
            </div>
        );
    }
}

export default ProjectNode;
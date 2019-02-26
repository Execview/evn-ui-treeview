import React, {Component} from 'react';
import classes from './ActivityNode.module.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(faCalendarAlt);
class ActivityNode extends Component {
    render(){
        let text = `Activity`;
        return  (<div className={classes.title}>
                    <FontAwesomeIcon className={classes.icon} icon="calendar-alt"/>
                    {text}
                </div>);
    }
}

export default ActivityNode;
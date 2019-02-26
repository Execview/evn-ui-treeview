import React, {Component} from 'react';
import classes from './TextNode.module.css';

class TextNode extends Component {
    render(){
        return <span className={classes.title}>text</span>;
    }
}

export default TextNode;
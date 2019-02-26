import React, { Component } from 'react';
import classes from './TableField.module.css';
import Aux from '../hoc/Auxi/Auxi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {faCheck} from '@fortawesome/free-solid-svg-icons';
library.add(faCheck);
class TableField extends Component {
    state = {
        value: "",
        isValid: true
    };
    onChangeHandler = (event) =>{
        if(typeof this.state.value === "object"){
            let newVal = {...this.state.value};
            newVal.value = event.target.value;
            this.setState({
                ...this.state,
                value: newVal
            })
        }else{
            this.setState({
                ...this.state,
                value: event.target.value
            })
        }
    }
    isValid = () => {
        if(this.props.value.validation && this.props.value.validation instanceof RegExp){
            return this.props.value.validation.test(this.getValue());
        }
        return true;
    }
    getValue(){
        if(typeof this.state.value === "object"){
            return this.state.value.value;
        }
        return this.state.value
    }
    onSaveHandler = (value) => {
        let val = value;
        if(typeof this.state.value === "object"){
            val = {...this.state.value};
            val.value = value;
        }
        if(this.isValid()){
            if(this.props.onSaveHandler){
                this.props.onSaveHandler(typeof value === "string" ? val :this.state.value);
            } else {
                console.error("There is no save handler");
            }
        } else {
            this.setState({
                ...this.state,
                isValid: false
            })
        }
    }
    componentDidMount(){
        this.setState({...this.state, value:this.props.value});
    }
    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            this.onSaveHandler();
        }
    }
    onClickHandler = () => {
        this.setState({...this.state, value:this.props.value});
        if(this.props.onEditHandler){
            this.props.onEditHandler();
        } else {
            console.error("There is no edit handler");
        }
    }
    getInput = (type) => {
        let inputClasses = classes.inputField;
        if(!this.state.isValid){
            inputClasses += " " + classes.invalid;
        }
        if(typeof type != "object"){
            type = {type: type};
        }
        switch(type.type){
            default:
                return (<Aux>
                            <input className={inputClasses} 
                                onChange={this.onChangeHandler}
                                onKeyPress={this.handleKeyPress}
                                value={this.getValue()} 
                                autoFocus
                                style={{width: this.props.columnWidth-25}}/>
                            <FontAwesomeIcon className={classes.save} onClick={this.onSaveHandler} icon="check" style={{marginRight: "3px"}}/>
                        </Aux>);
        }
    }
    render(){
        const {editing, type, value, columnWidth} = this.props;
        let field = <span className={classes["text-cut"]} style={{width: columnWidth}} onClick={this.onClickHandler}>{typeof value === "object" ? value.value : value}</span>
        if(editing) {
            field = 
            (<Aux>
                <div className={classes.row} style={{width: columnWidth}}>
                {this.getInput(type)}
                </div>
            </Aux>);
        }
        return field;
    }
}
export default TableField;
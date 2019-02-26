import React, {Component} from 'react';
import Aux from '../hoc/Auxi/Auxi';
import TableField from '../TableField/TableField';
import classes from './DataTableField.module.css';

class DataTableField extends Component {
    state = {
        startX: 0,
        startWidth: 0
    }
    resizeColumnMove = (e) => {
        const newWidth = this.state.startWidth  + e.pageX - this.state.startX;
        this.props.changeWidth(newWidth);
    }
    
    resizeColumnStart = (e) => {
        document.addEventListener('mousemove', this.resizeColumnMove);
        document.addEventListener('mouseup', this.resizeColumnEnd);
        this.setState({
            ...this.state,
            startX: e.pageX,
            startWidth: this.props.columnWidth
        })
    }
    resizeColumnEnd = (e) => {
        document.removeEventListener('mousemove', this.resizeColumnMove);
    }
    render(){
        const {field, path, value, onEditHandler, onSaveHandler, nodenr, isEditing, empty, columnWidth, last} = this.props;
        const resizer = !last ? <td className={classes.drag+" "+classes.resizable} onMouseDown={this.resizeColumnStart} draggable></td> : <td className={classes.drag}></td>;
        if(!empty){
            return  <Aux>
                        <td>
                            <div><TableField value={value} 
                                            onEditHandler={() => onEditHandler(path, nodenr, field)} 
                                            editing={isEditing(field)}
                                            onSaveHandler={onSaveHandler}
                                            columnWidth={columnWidth}/>
                            </div>
                        </td>
                        {resizer}
                    </Aux>;
        } else {
            return <Aux>
                        <td style={{width:columnWidth}}></td>
                        {resizer}
                   </Aux>;
        }
    }
}
export default DataTableField;
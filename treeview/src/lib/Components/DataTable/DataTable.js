import React, {Component} from 'react';
import classes from './DataTable.module.css';
import DataTableRows from '../DataTableRows/DataTableRows';
import Aux from '../hoc/Auxi/Auxi';

class DataTable extends Component {
    state = {
        columnWidths: this.props.defaultColumnWidth || [],
        defaultWidth: this.props.defaultWidth || 150,
        minWidth: this.props.minColumnWidth || 50
    }
    getElements = (root, elements = []) => {
        let elem = [...elements];
        if(root.data){
            Object.keys(root.data).forEach(val => {
                if(!root.data[val].hidden){
                    elem.push(val);
                }
            })
        }
        if(!root.nodes || root.closed){
            return elem;
        }
        return this.flatten(root.nodes.map((node, index) => {
            if(index === 0){
                return this.getElements(node, elem);
            } else {
                return this.getElements(node, []);
            }
        }));
    }
  
    flatten = (arr) => {
        return arr.reduce((flat, toFlatten) => {
            return flat.concat(Array.isArray(toFlatten) ? this.flatten(toFlatten) : toFlatten);
        }, []);
    }

    changeWidth = (column, value) => {
        let widths = [...this.state.columnWidths];
        const diff = widths[column] - Math.max(value, this.state.minWidth);
        
        widths[column] = Math.min(Math.max(value, this.state.minWidth), widths[column]+widths[column+1]-this.state.minWidth);
        widths[column+1] = Math.max(widths[column+1] + diff,this.state.minWidth);
    
        this.setState({
            ...this.state,
            columnWidths: widths
        });
    }

    formatElements = (el) => {
        const elements = [...el];
        let count = {};
        elements.forEach(i => { 
            count[i] = (count[i]||0) + 1;
        });
        count = Object.keys(count).map(val => {
            return [val, count[val]];
        });
        count.sort((a, b) => {
            return a[1] < b[1];
        })
        return count;
    }
    updateWidths = (el) => {
        let widths = [...this.state.columnWidths];
        el.forEach((val,index) => {
            if(!widths[index]){
                widths[index] = this.state.defaultWidth
            }
        })
        if(!this.arrayEqual(widths, this.state.columnWidths)){
            this.setState({
                ...this.state,
                columnWidths: widths
            })
        }
    }
    componentDidMount(){    
        const elements = this.formatElements(this.getElements(this.props.root));
        this.updateWidths(elements);
    }
    arrayEqual = (ar1, ar2) => {
        let equal = true;
        ar1.forEach((val1,index) => {
            if(val1 !== ar2[index]){
                equal = false;
            }
        })
        return equal;
    }
    render(){
        const {root, onEditHandler, onSaveHandler, editing} = this.props;
        const elements = this.formatElements(this.getElements(root));
        const headers = elements.map((val,index) => {
            return <Aux key={index}>
                        <td><div style={{width: this.state.columnWidths[index]}}>{val[0]}</div></td>
                        <td></td>
                    </Aux>;
        });
        return (
            <table className={classes.table}>
                <thead>
                    <tr>
                       {headers}
                    </tr>
                </thead>
                <tbody>
                    <DataTableRows root={root} 
                                   onEditHandler={onEditHandler} 
                                   editing={editing}
                                   onSaveHandler={onSaveHandler}
                                   columnWidths={this.state.columnWidths}
                                   changeWidth={this.changeWidth}
                                   headers={elements}/>
                </tbody>
            </table>
        );
    }
}

export default DataTable;
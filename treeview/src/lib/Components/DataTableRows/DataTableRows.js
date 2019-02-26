import React, {Component} from 'react';
import Aux from '../hoc/Auxi/Auxi';
import DataTableField from '../DataTableField/DataTableField';

class DataTableRows extends Component {
    state = {
        settings: {
            nodenr: 0,
            path: [],
            ...this.props.settings
        }
    }
    arraysEqual = (arr1, arr2) => {
        if(arr1.length !== arr2.length)
            return false;
        for(var i = arr1.length; i--;) {
            if(arr1[i] !== arr2[i])
                return false;
        }
        return true;
    }
    isEditing = (key) => {
        if(this.props.editing[0] && 
           this.arraysEqual(this.props.editing[0], this.state.settings.path) && 
           this.props.editing[1] === this.state.settings.nodenr && 
           this.props.editing[2] === key){
            return true;
        }
        return false;
    }

    render(){
        const {root, onEditHandler, onSaveHandler, columnWidths, changeWidth, editing, headers} = this.props;
        let fields = headers.map((va,ind) => {
            const val = va[0];
            if(root.data && root.data[val]){
                const value = root.data[val];
                return  <DataTableField key={ind} 
                                        field={val} 
                                        value={value}
                                        onEditHandler={onEditHandler}
                                        onSaveHandler={onSaveHandler}
                                        nodenr={this.state.settings.nodenr}
                                        path={this.state.settings.path}
                                        isEditing={this.isEditing}
                                        columnWidth={columnWidths[ind]}
                                        changeWidth={(value) => changeWidth(ind, value)}
                                        last={ind === headers.length-1} />;
            } else {
                return <DataTableField key={ind} 
                        columnWidth={columnWidths[ind]}
                        changeWidth={(value) => changeWidth(ind, value)} 
                        empty
                        last={headers.length-1 === ind}/>
            }
        });
        const row =  fields ? (
            <tr>
                {fields}
            </tr>
        ) : <tr></tr>;
        let rows = root && root.nodes ? root.nodes.map((val, index) => {
            let pat = [...this.state.settings.path];
            pat.push(this.state.settings.nodenr);
            const settings = {
                nodenr: index,
                path: pat
            }
            return <DataTableRows key={index} 
                                  root={val} 
                                  settings={settings} 
                                  onEditHandler={onEditHandler} 
                                  editing={editing} 
                                  onSaveHandler={onSaveHandler}
                                  columnWidths={columnWidths}
                                  changeWidth={changeWidth}
                                  headers={headers}/>;
        }) : null;

        if(root.closed){
            rows = null;
        }

        return (
            <Aux>
                {row}
                {rows}
            </Aux>
        );
    }
}
export default DataTableRows;
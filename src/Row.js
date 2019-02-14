import React, { Component } from 'react';
import Cell from './Cell';


export default class Row extends Component {
  render() {
    return (
      this.props.columnsInfo.map((col, index) => {
        let isActive = false;
        if (this.props.rowId === this.props.activeCell[0] && col.colName === this.props.activeCell[1] && this.props.editableCells[col.colName]) {
          isActive = true;
        }
        let red = false;
        for (let i = 0; i < this.props.invalidCells.length; i++) {
          if (this.props.rowId === this.props.invalidCells[i].id && col.colName === this.props.invalidCells[i].col) {
            red = true;
          }
        }
        const onClickAction = isActive ? null : (() => this.props.onSetActive(this.props.rowId, col.colName));
        const lastOne = index === this.props.columnsInfo.length - 1;
        let style = { width: this.props.widths[col.colName] - 10 };
        if (this.props.wrap) {
          style = { ...style, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
        }
        return (
          <td key={col.colName + this.props.rowId}>
            {!lastOne && <div style={{ position: 'absolute', zIndex: 1, transform: 'translateX(7px)', top: 0, right: 0, height: '100%', width: '15px', cursor: 'w-resize' }} onMouseDown={e => this.props.onMouseDown(e, col.colName)} onClick={this.stopPr} /> }
            <div
              title={col.colName}
              className={(isActive ? 'active-cell' : 'table-label ') + (this.props.editableCells[col.colName] ? '' : 'no-edit')}
              onClick={onClickAction}
            >
              <Cell
                style={style}
                text={this.props.rowData[col.colName] === undefined ? '' : this.props.rowData[col.colName]}
                type={this.props.cellTypes[col.cellType]}
                isActive={isActive}
                onValidateSave={this.props.onValidateSave}
                errorText={red ? this.props.rules[col.rule] : null}
              />
            </div>
          </td>
        );
      })
    );
  }
}

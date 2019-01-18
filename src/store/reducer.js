// import React from 'react';
import * as actionTypes from './actionTypes';
import { priority } from './constants';
import validateInput from './validators';

const initialState = {
  data: [],
  column: '',
  order: 'desc',
  dataConfig: [
    { colName: 'company', cellType: 'text', colTitle: 'Company', labelType: 'text', rule: 0 },
    { colName: 'contact', cellType: 'text', colTitle: 'Contact', labelType: 'text' },
    { colName: 'country', cellType: 'dropdown', colTitle: 'Country', labelType: 'text' },
    { colName: 'value', cellType: 'number', colTitle: 'Value (in $M)', labelType: 'text', rule: 1 },
    { colName: 'progress', cellType: 'color', colTitle: 'Progress', labelType: 'color', rule: 1 },
    { colName: 'dueDate', cellType: 'date', colTitle: 'Due Date', labelType: 'date' }],
  rules: ['The size of the field must be of at least 6 characters', 'Field must be a number and higher than 25'],
  activeCell: [null, null],
  warning: false,
  cellText: '',
  activeRule: null,
};

const newData = [{ id: 1, company: 'McLaren', contact: 'WL', country: 'United Kingdom', value: 26, progress: 'red', dueDate: '2018-03-17T10:39:57.362Z' },
  { id: 2, company: 'Koenigsegg', contact: 'JJ', country: 'Sweden', value: 54, progress: 'amber', dueDate: '2017-08-17T10:39:57.362Z' },
  { id: 3, company: 'Porche', contact: 'ZG', country: 'Germany', value: 78, progress: 'green' },
  { id: 4, company: 'Aston Martin', contact: 'JD', country: 'United Kindom', value: 132, progress: 'amber', dueDate: '1996-09-13T10:39:57.362Z' },
  { id: 5, company: 'Lamborghini', contact: 'BB', country: 'Italy', value: 64 },
  { id: 6, company: 'Bugatti', contact: 'DT', country: 'France', progress: 'red', dueDate: '2019-01-17T10:39:57.362Z' },
  { id: 7, company: 'Mercedes-Benz', contact: 'WL', country: 'Germany', progress: 'green' }];

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_DATA:
      return {
        ...state,
        data: newData
      };

    case actionTypes.SAVE_CELL:
      return { ...state,
        data: state.data.map((el, index) => {
          if (index === action.row) {
            return { ...state.data[action.row],
              [action.col]: action.text };
          }
          return el;
        }),
        activeCell: [null, null],
        warning: false,
        activeRule: null
      };

    case actionTypes.SORT_DATA: {
      let ordering = state.order;
      let columnOrder = state.column;
      if (columnOrder === action.col) {
        ordering = state.order === 'asc' ? 'desc' : 'asc';
      } else {
        columnOrder = action.col;
        ordering = 'desc';
      }
      const orderData = JSON.parse(JSON.stringify(state.data));
      if (action.cellType === 'text' || action.cellType === 'dropdown' || action.cellType === 'date') {
        orderData.sort((a, b) => {
          const x = a[action.col] ? a[action.col].toLowerCase() : '';
          const y = b[action.col] ? b[action.col].toLowerCase() : '';
          return (x > y) ? -1 : ((x < y) ? 1 : 0);
        });
      } else if (action.cellType === 'number') {
        orderData.sort((a, b) => {
          const x = a[action.col] ? a[action.col] : 0;
          const y = b[action.col] ? b[action.col] : 0;
          return (parseFloat(x) > parseFloat(y)) ? -1 : ((parseFloat(x) < parseFloat(y)) ? 1 : 0);
        });
      } else if (action.cellType === 'color') {
        orderData.sort((a, b) => {
          const x = priority[a[action.col]] ? priority[a[action.col]] : 0;
          const y = priority[b[action.col]] ? priority[b[action.col]] : 0;
          return (x > y) ? -1 : ((x < y) ? 1 : 0);
        });
      }

      if (ordering === 'asc') {
        orderData.reverse();
      }
      return {
        ...state,
        data: orderData,
        order: ordering,
        column: columnOrder,
        activeCell: [null, null],
        warning: false,
        activeRule: null
      };
    }

    case actionTypes.SET_ACTIVE: {
      return {
        ...state,
        activeCell: [action.row, action.col],
        warning: false,
        activeRule: action.rule,
        cellText: action.text
      };
    }

    case actionTypes.CHANGE_CELL_TEXT:
      // console.log(action.text.target.value);
      if (!validateInput(state.activeRule, action.text) && action.text[action.text.length - 1] === '\n') {
        return state;
      }
      return {
        ...state,
        cellText: action.text
      };

    case actionTypes.KEY_PRESSED: {
      let finalstate = { ...state };
      if (action.key.key === 'Enter' && !(action.key.shiftKey)) {
        if (state.activeRule !== undefined) {
          if (validateInput(state.activeRule, state.cellText)) {
            finalstate = reducer(finalstate, { type: actionTypes.SAVE_CELL, row: state.activeCell[0], col: state.activeCell[1], text: state.cellText });
            return finalstate;
          }
          return {
            ...state,
            cellText: state.cellText,
            warning: true,
          };
        }
        finalstate = reducer(finalstate, { type: actionTypes.SAVE_CELL, row: state.activeCell[0], col: state.activeCell[1], text: state.cellText });
        return finalstate;
      }
      return state;
    }
    default:
      return state;
  }
};


export default reducer;

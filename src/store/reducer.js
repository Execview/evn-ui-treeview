// import React from 'react';
import * as actionTypes from './actionTypes';
import countries from './CountryList';


const initialState = {
  data: [],
  column: '',
  order: 'desc',
  countryDropdown: countries,
  activeCell: [null, null],
  dataConfig: [
    { colName: 'company', cellType: 'text', colTitle: 'Company', rule: 0 },
    { colName: 'contact', cellType: 'text', colTitle: 'Contact' },
    { colName: 'country', cellType: 'dropdown', colTitle: 'Country' },
    { colName: 'value', cellType: 'number', colTitle: 'Value (in $M)', rule: 1 }],
  rules: ['The size of the field must be of at least 6 characters', 'Field must be a number and higher than 25'],
  warning: false,
  cellText: '',
  activeRule: null,
};

const newData = [{ id: 1, company: 'McLaren', contact: 'WL', country: 'United Kingdom', value: 26 },
  { id: 2, company: 'Koenigsegg', contact: 'JJ', country: 'Sweden', value: 54 },
  { id: 3, company: 'Porche', contact: 'ZG', country: 'Germany', value: 78 },
  { id: 4, company: 'Aston Martin', contact: 'JD', country: 'United Kindom', value: 132 },
  { id: 5, company: 'Lamborghini', contact: 'BB', country: 'Italy', value: 64 },
  { id: 6, company: 'Bugatti', contact: 'DT', country: 'France' },
  { id: 7, company: 'Mercedes-Benz', contact: 'WL', country: 'Germany' }];

// <img style={{width:'100%'}} src="https://ichef.bbci.co.uk/images/ic/720x405/p0517py6.jpg" />

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

      orderData.sort((a, b) => {
        if (action.cellType === 'text' || action.cellType === 'dropdown') {
          const x = a[action.col] ? a[action.col].toLowerCase() : '';
          const y = b[action.col] ? b[action.col].toLowerCase() : '';
          return (x > y) ? -1 : ((x < y) ? 1 : 0);
        }
        return Number(b[action.col]) - Number(a[action.col]);
      });


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
    case actionTypes.SET_WARNING: {
      if (action.warning) {
        return {
          ...state,
          warning: action.warning,
          ruleToDisplay: action.rule
        };
      }
      return {
        ...state,
        warning: action.warning,
      };
    }
    case actionTypes.CHANGE_CELL_TEXT:
      // console.log(action.text.target.value);
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

const validateInput = (rule, text) => {
  switch (rule) {
    case 0:
      return validateString(text);
    case 1:
      return validateNumberInput(text);
    default:
      return false;
  }
};

const validateString = (text) => {
  if (text.length > 5) {
    return true;
  }
  return false;
};

const validateNumberInput = (text) => {
  if (text > 25) {
    return true;
  }
  return false;
};

export default reducer;

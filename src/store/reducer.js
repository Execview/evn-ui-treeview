// import React from 'react';
import * as actionTypes from './actionTypes';
import { priority } from './constants';
import { dataConfig, newData, editableCells, rules, validators } from './configs';

const initialState = {
  data: {},
  column: '',
  order: 'desc',
  orderedData: [],
  dataConfig,
  rules,
  activeCell: [null, null],
  cellText: '',
  invalidCells: [],
  editableCells
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_DATA:
      return {
        ...state,
        data: newData,
        orderedData: Object.keys(newData)
      };

    case actionTypes.SAVE_CELL:
      return { ...state,
        data: {
          ...state.data,
          [state.activeCell[0]]: {
            ...state.data[state.activeCell[0]],
            [state.activeCell[1]]: action.text
          }
        },
        activeCell: [null, null]
      };

    case actionTypes.SORT_DATA: {
      let ordering = state.order;
      let columnToOrder = state.column;
      if (columnToOrder === action.col) {
        ordering = state.order === 'asc' ? 'desc' : 'asc';
      } else {
        columnToOrder = action.col;
        ordering = 'desc';
      }
      const dataToOrder = [];
      Object.keys(state.data).map(key => dataToOrder.push({ id: key, [action.col]: state.data[key][action.col] }));
      if (action.cellType === 'text' || action.cellType === 'dropdown' || action.cellType === 'date') {
        dataToOrder.sort((a, b) => {
          const x = a[action.col] ? a[action.col].toLowerCase() : '';
          const y = b[action.col] ? b[action.col].toLowerCase() : '';
          return (x > y) ? -1 : ((x < y) ? 1 : 0);
        });
      } else if (action.cellType === 'number') {
        dataToOrder.sort((a, b) => {
          const x = a[action.col] ? a[action.col] : 0;
          const y = b[action.col] ? b[action.col] : 0;
          return (parseFloat(x) > parseFloat(y)) ? -1 : ((parseFloat(x) < parseFloat(y)) ? 1 : 0);
        });
      } else if (action.cellType === 'color') {
        dataToOrder.sort((a, b) => {
          const x = priority[a[action.col]] ? priority[a[action.col]] : 0;
          const y = priority[b[action.col]] ? priority[b[action.col]] : 0;
          return (x > y) ? -1 : ((x < y) ? 1 : 0);
        });
      }

      if (ordering === 'asc') {
        dataToOrder.reverse();
      }
      const dataToReturn = [];
      dataToOrder.map(obj => dataToReturn.push(obj.id));

      return {
        ...state,
        orderedData: dataToReturn,
        order: ordering,
        column: columnToOrder,
        activeCell: [null, null],
      };
    }

    case actionTypes.SET_ACTIVE: {
      return {
        ...state,
        activeCell: [action.id, action.col],
        cellText: action.text
      };
    }

    case actionTypes.VALIDATE: {
      if (action.rule !== undefined) {
        if (validators[action.rule](action.cellText)) {
          const newErrors = JSON.parse(JSON.stringify(state.invalidCells));
          const toRet = newErrors.filter(obj => !(obj.id === state.activeCell[0] && obj.col === state.activeCell[1]));
          return { ...state,
            data: {
              ...state.data,
              [state.activeCell[0]]: {
                ...state.data[state.activeCell[0]],
                [state.activeCell[1]]: action.cellText
              }
            },
            activeCell: [null, null],
            invalidCells: toRet
          };
        }
        const newErrors = JSON.parse(JSON.stringify(state.invalidCells));
        newErrors.push({ id: state.activeCell[0], col: state.activeCell[1] });
        return { ...state,
          data: {
            ...state.data,
            [state.activeCell[0]]: {
              ...state.data[state.activeCell[0]],
              [state.activeCell[1]]: action.cellText
            }
          },
          activeCell: [null, null],
          invalidCells: newErrors
        };
      }
      return { ...state,
        data: {
          ...state.data,
          [state.activeCell[0]]: {
            ...state.data[state.activeCell[0]],
            [state.activeCell[1]]: action.cellText
          }
        },
        activeCell: [null, null],
      };
    }
    default:
      return state;
  }
};

export default reducer;

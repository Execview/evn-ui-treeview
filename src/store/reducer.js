// import React from 'react';
import * as actionTypes from './actionTypes';
import { newData, editableCells } from './configs';

const crypto = require('crypto');

const hash = crypto.createHash('sha256');

const initialState = {
  data: {},
  orderedData: [],
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

    case actionTypes.SAVE: {
      return { ...state,
        data: {
          ...state.data,
          [action.rowId]: action.rowDetails.updatedRow,
        },
        editableCells: {
          ...state.editableCells,
          [action.rowId]: action.rowDetails.editableRow },
        // activeCell: [state.orderedData[state.orderedData.indexOf(state.activeCell[0]) + 1], state.activeCell[1]],
      };
    }
    case actionTypes.ADD_ROW: {
      const newId = '_' + hash.update(Date.now() + Math.random().toString()).digest('hex').substring(0, 5);
      return { ...state,
        data: {
          ...state.data,
          [newId]: {}
        },
        editableCells: {
          ...state.editableCells,
          [newId]: { company: true, contact: true, country: true, value: true, progress: true, dueDate: true }
        },
        orderedData: [...state.orderedData, newId]
      };
    }
    default:
      return state;
  }
};

export default reducer;

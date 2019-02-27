// import React from 'react';
import * as actionTypes from './actionTypes';
import { testData, newData2, editableCells2 } from './configs';

const initialState = {
  data: newData2,
  editableCells: editableCells2
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    // case actionTypes.GET_DATA:
    //   return {
    //     ...state,
    //     data: newData2,
    //   };

    case actionTypes.SAVE: {
      return { ...state,
        data: {
          ...state.data,
          [action.rowId]: action.rowValues,
        },
        editableCells: {
          ...state.editableCells,
          [action.rowId]: action.editableValues },
        // activeCell: [state.orderedData[state.orderedData.indexOf(state.activeCell[0]) + 1], state.activeCell[1]],
      };
    }
    default:
      return state;
  }
};

export default reducer;

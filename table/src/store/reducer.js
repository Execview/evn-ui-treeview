// import React from 'react';
import * as actionTypes from './actionTypes';
import { data, editableCells } from './configSwitch';
import { OrderedObjectAssign } from '../functions'

const initialState = {
  data: data,
  editableCells: editableCells
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SAVE: {
      let newState = state
      newState = OrderedObjectAssign(newState, 'data', OrderedObjectAssign(state.data, action.rowId, action.rowValues));
      newState = OrderedObjectAssign(newState, 'editableCells', OrderedObjectAssign(newState.editableCells, action.rowId, action.editableValues));
      return newState;
    }
    default:
      return state;
  }
};



export default reducer;

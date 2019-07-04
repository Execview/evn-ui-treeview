// import React from 'react';
import * as actionTypes from './actionTypes';
import { data, editableCells } from './configSwitch';
import { orderedObjectAssign } from '@execview/reusable'

const initialState = {
	data: data,
	editableCells: editableCells
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.SAVE: {
			let newState = state
			newState = orderedObjectAssign(newState, 'data', orderedObjectAssign(state.data, action.rowId, action.rowValues));
			newState = orderedObjectAssign(newState, 'editableCells', orderedObjectAssign(newState.editableCells, action.rowId, action.editableValues));
			return newState;
		}
		default:
			return state;
	}
};



export default reducer;

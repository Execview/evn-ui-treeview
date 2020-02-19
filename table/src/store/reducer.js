// import React from 'react';
import * as actionTypes from './actionTypes';
import { data, permissions } from './configSwitch';

const initialState = {
	data: data,
	permissions: permissions
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.SAVE: {
			return {
				...state,
				data: {
					...state.data,
					[action.row]: {
						...state.data[action.row],
						[action.col]: action.data
					}
				}
			}
		}
		case actionTypes.ADD_ROW: {
			return {
				...state,
				data: {
					...state.data,
					[action.id]: action.data
				},
				permissions: {
					...permissions,
					editableRows: [...((state.permissions && state.permissions.editableRows) || []), action.id]
				}
			}
		}
		default:
			return state;
	}
};



export default reducer;

import { data as configData, editableCells} from '../config'
import * as actionTypes from './actionTypes';

export const LOAD_FROM_CONFIG = (state,action,reducer) => {
	const translateConfigData = (data) => {
		let newData = {}
		newData = Object.keys(data).reduce((total,elkey) => {
			const el = data[elkey]
			return {
				...total,
				[elkey]: {
					...el,
					startdate: new Date(el.startdate),
					enddate: new Date(el.enddate),
					colours: {left: el.colour, right: el.colour, middle: el.colour, original: el.colour},
					shape: el.type
				}
			}
		},{})
		return newData
	}
    return reducer(state,{type:actionTypes.LOAD_DATA_DEVELOPMENT, data: translateConfigData(configData), editableCells: editableCells});
}

export const LOAD_DATA_DEVELOPMENT = (state,action,reducer) => {
	let newState = {...state, _data:action.data, editableCells:action.editableCells}

	Object.keys(newState._data).forEach(bubblekey=>{
		newState = reducer(newState,{type: actionTypes.SET_ORIGINAL_COLOUR, key:bubblekey, side: 'left'})
		newState = reducer(newState,{type: actionTypes.SET_ORIGINAL_COLOUR, key:bubblekey, side: 'middle'})
		newState = reducer(newState,{type: actionTypes.SET_ORIGINAL_COLOUR, key:bubblekey, side: 'right'})
	})
	newState = {...newState}
	return newState
}
import { data } from '../config'
import { getDisplayedTreeStructure, EventStoreSynchroniser, getParentNodes } from '../functions'
import * as actionTypes from './actionTypes';
import {objectCopierWithStringToDate} from '../../bubbleCopy';

const ess = new EventStoreSynchroniser()

export const LOAD_FROM_CONFIG = (state,action,reducer) => {
    return reducer(state,{type:actionTypes.LOAD_DATA, data:data, editableCells: state.editableCells});
}

export const LOAD_DATA = (state,action,reducer) => {
	let translateddata = action.data
	let newData = objectCopierWithStringToDate(translateddata)
	newData = Object.keys(newData).reduce((total,el)=>{return {...total,[el]:{...newData[el],colours:{left:newData[el].colour,right:newData[el].colour,middle:newData[el].colour,original:newData[el].colour}}}},{})
	let newState = {...state, _data:newData, token:action.token, editableCells:action.editableCells}

	Object.keys(newState._data).forEach(bubblekey=>{
		newState = reducer(newState,{type: actionTypes.SET_ORIGINAL_COLOUR, key:bubblekey, side: 'left'})
		newState = reducer(newState,{type: actionTypes.SET_ORIGINAL_COLOUR, key:bubblekey, side: 'middle'})
		newState = reducer(newState,{type: actionTypes.SET_ORIGINAL_COLOUR, key:bubblekey, side: 'right'})
	})

	return reducer(newState,{type:actionTypes.UPDATE_DATA, sendEvents: true})
}

export const UPDATE_DATA = (state,action,reducer) => {
if (action.sendEvents) {
		ess.sendToDB(state.token,state);
	}
	let newState = {...state}
	const displayedTreeStructure = getDisplayedTreeStructure(newState._data, getParentNodes(newState._data));
	const dataToDisplay = {}
	for (let i = 0; i < displayedTreeStructure.length; i++) {
		dataToDisplay[displayedTreeStructure[i].key] = newState._data[displayedTreeStructure[i].key];
	}

	newState = {
		...newState,
		displayedTreeStructure: displayedTreeStructure,
		displayedData: dataToDisplay,
	};
	return newState
}
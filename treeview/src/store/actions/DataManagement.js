import { data as configData} from '../config'
import * as actionTypes from './actionTypes';

export const LOAD_FROM_CONFIG = (state,action,reducer) => {
	const translateConfigData = (data) => {
		let newData = {}
		newData = Object.keys(data).reduce((total,elkey) => {
			const el = data[elkey]
			const startdate = new Date(el.startdate)
			const enddate = new Date(el.enddate)
			return {
				...total,
				[elkey]: {
					startdate:(new Date(startdate.getFullYear(),startdate.getMonth(),startdate.getDate())),
					enddate:(new Date(enddate.getFullYear(),enddate.getMonth(),enddate.getDate())),
					colours: {left: el.colour, right: el.colour, middle: el.colour, original: el.colour},
					ChildAssociatedBubbles: el.ChildAssociatedBubbles,
					ParentAssociatedBubble: el.ParentAssociatedBubble,
					ChildBubbles: el.ChildBubbles,
					ParentBubble: el.ParentBubble,
					open: el.open,
					activityTitle: el.activityTitle,
					progress: el.progress,
					shape: el.type
				}
			}
		},{})
		return newData
	}
    return reducer(state,{type:actionTypes.LOAD_DATA_DEVELOPMENT, data: translateConfigData(configData), editableCells: state.editableCells});
}

export const LOAD_DATA_DEVELOPMENT = (state,action,reducer) => {
	let newState = {...state, _data:action.data, token:action.token, editableCells:action.editableCells}

	Object.keys(newState._data).forEach(bubblekey=>{
		newState = reducer(newState,{type: actionTypes.SET_ORIGINAL_COLOUR, key:bubblekey, side: 'left'})
		newState = reducer(newState,{type: actionTypes.SET_ORIGINAL_COLOUR, key:bubblekey, side: 'middle'})
		newState = reducer(newState,{type: actionTypes.SET_ORIGINAL_COLOUR, key:bubblekey, side: 'right'})
	})
	newState = {...newState, development_token: action.token}
	return reducer(newState,{type:actionTypes.SEND_EVENTS})
}
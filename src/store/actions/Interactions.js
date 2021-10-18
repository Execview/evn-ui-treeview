import * as actionTypes from './actionTypes';

const moment = require('moment')
const crypto = require('crypto');
const hash = crypto.createHash('sha256');

export const ADD_ROW = (state,action,reducer) => {
	let newRow = action.row
	let newId = action.id
	const parent = action.parent || ''
	if(!newRow){
		newId = '_' + hash.update(Date.now() + Math.random().toString()).digest('hex').substring(0, 5);
		const shape = action.shape || 'bubble'
		let tempTitle = 'Untitled Activity';
		switch (shape) {
			case 'bubble':{
				tempTitle = 'Untitled Activity';
				break;
			}
			case 'square': {
				tempTitle = 'Untitled Task';
				break;
			}
			case 'triangle': {
				tempTitle = 'Untitled Milestone';
				break; 
			}
			default:
				tempTitle = 'Untitled Item';
				break;
		}
		const colors = ['Blue','Red', 'Green', 'Yellow', 'Purple'];
		const colorIndex = Math.floor((Math.random() * 5));
		let date = new Date()
		if(parent){
			date = state._data[parent].startdate
		} else {
			let startdates = Object.keys(state._data).map(key=>state._data[key].startdate)
			date = startdates.length > 0 && new Date(Math.min(...startdates))
		}
		
		newRow = {
				startdate: date,
				enddate: moment(date).add(2,'d').toDate(),
				colours: {left: colors[colorIndex], middle: colors[colorIndex], right: colors[colorIndex], original: colors[colorIndex]},
				open:true,
				name: tempTitle,
				progress: 'amber',
				shape: shape,
				meta: {
					permission: 4
				}
		};
	}
    let newState =  {
        ...state,
        _data: {
            ...state._data,
            [newId] : newRow
        }
    };
	if(parent){
		newState = reducer(newState, {type:actionTypes.PERFORM_ASSOCIATION, childkey:newId,parentkey:parent})
	}
    return newState
}

export const DELETE_BUBBLE = (state,action,reducer) => {
	let newState = {...state}

	//Delete all Child references to this bubble
	for(var childkey in (state._data[action.key].ChildBubbles || {})){
        newState = reducer(newState,{type: actionTypes.UNLINK_PARENT_BUBBLE,key:childkey})
    }

	//Delete all Child associates of this bubble
	for(var childkey of (state._data[action.key].ChildAssociatedBubbles || [])){
        newState = reducer(newState,{type: actionTypes.DELETE_BUBBLE, key:childkey})
    } 

 	//Delete the Parent reference from the parent
    newState = reducer(newState,{type: actionTypes.UNLINK_PARENT_BUBBLE,key:action.key})
    newState = reducer(newState,{type: actionTypes.UNLINK_PARENT_ASSOCIATED_BUBBLE,key:action.key})

    //Safely delete the bubble
    const {[action.key]:placeholder, ...rest} = newState._data
    newState = {...newState, _data: {...rest}}
    
    return newState;
}

export const MOVE_BUBBLES = (state,action,reducer) => {
	let newState = {
		...state,
        _data: action._data,
        itemChanges: action.itemChanges
    }

	return newState
}

export const SAVE_ROW = (state,action,reducer) => {
	return {
		...state,
		[action.row]: {
			...state[action.row],
			[action.col]: action.data
		}
	}
}

export const TRY_BUBBLE_TRANSFORM = (state,action,reducer) => {
    //Is dealt with in an epic
	return state
}

export const CLEAR_CHANGES = (state, action, reducer) => {
    let newState = {...state, itemChanges: null}
    return newState;
}

export const SEND_CHANGES = (state, action, reducer) => {
    //Is dealt with in an epic
    return state;
}
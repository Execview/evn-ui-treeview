import * as actionTypes from './actionTypes';
import { objectCopierWithStringToDate, recursiveDeepCopy, recursiveDeepDiffs } from '@execview/reusable';
import tryReturnValidTransformState from '../stateValidator';

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
				ChildAssociatedBubbles:[],
				ParentAssociatedBubble: '',
				ChildBubbles: {},
				ParentBubble: '',
				open:true,
				activityTitle: tempTitle,
				progress: 'amber',
				shape: shape
		};
	}
    let newState =  {
        ...state,
        _data: {
            ...state._data,
            [newId] : newRow
        },
        editableCells: {
            ...state.editableCells,
            [newId]: action.editableCells
        }
    };
	if(parent){
		newState = reducer(newState, {type:actionTypes.PERFORM_ASSOCIATION, childkey:newId,parentkey:parent})
		if(!state._data[parent].open){newState = reducer(newState, {type:actionTypes.TOGGLE_NODE, nodeKey:parent})}
		}
    return newState
}

export const DELETE_SINGLE = (state,action,reducer) => {
    let newState = {...state}
	let parentkey = state._data[action.key].ParentAssociatedBubble
    //Delete all Child references to this bubble
    for(var childkey in state._data[action.key].ChildBubbles){
        newState = reducer(newState,{type: actionTypes.UNLINK_PARENT_BUBBLE,key:childkey})
    }
    for(var childkey of state._data[action.key].ChildAssociatedBubbles){
        newState = reducer(newState,{type: actionTypes.UNLINK_PARENT_ASSOCIATED_BUBBLE,key:childkey})		
		if(parentkey){newState = reducer(newState,{type: actionTypes.PERFORM_ASSOCIATION, childkey: childkey, parentkey: parentkey })}
    }
    //Delete the Parent reference from the parent
    newState = reducer(newState,{type: actionTypes.UNLINK_PARENT_BUBBLE,key:action.key})
    newState = reducer(newState,{type: actionTypes.UNLINK_PARENT_ASSOCIATED_BUBBLE,key:action.key})

    //Safely delete the bubble
    const {[action.key]:placeholder, ...rest} = newState._data
    newState = {...newState, _data: {...rest}}
    
    return newState;
}

export const DELETE_BUBBLE = (state,action,reducer) => {
	let newState = {...state}

	//Delete all Child references to this bubble
	for(var childkey in state._data[action.key].ChildBubbles){
        newState = reducer(newState,{type: actionTypes.UNLINK_PARENT_BUBBLE,key:childkey})
    }

	//Delete all Child associates of this bubble
	for(var childkey of state._data[action.key].ChildAssociatedBubbles){
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

export const TOGGLE_NODE = (state,action,reducer) => {
    const updatedState = { ...state,
        _data: {...state._data,
            [action.nodeKey]:{...state._data[action.nodeKey],
                open: !state._data[action.nodeKey].open
            }
        }
    };
    return updatedState;
}

export const MOVE_BUBBLES = (state,action,reducer) => {
	let newState = {
		...state,
        _data: action._data,
        itemChanges: action.itemChanges
    }
	if(action.editableValues){
		newState.editableCells[action.originalAction.key] = action.editableValues 
    }
	return newState
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
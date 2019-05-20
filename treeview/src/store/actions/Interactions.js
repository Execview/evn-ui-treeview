import * as actionTypes from './actionTypes';
import { objectCopierWithStringToDate, recursiveDeepCopy, recursiveDeepDiffs } from '@execview/reusable';
import tryReturnValidTransformState from '../stateValidator';

const moment = require('moment')
const crypto = require('crypto');
const hash = crypto.createHash('sha256');

export const ADD_ROW = (state,action,reducer) => {
    const newId = '_' + hash.update(Date.now() + Math.random().toString()).digest('hex').substring(0, 5);
    const tempTitle = 'Untitled Activity';
	const shape = action.shape || 'bubble'
	const parent = action.parent || '';
    const colors = ['Blue','Red', 'Green', 'Yellow', 'Purple'];
    const colorIndex = Math.floor((Math.random() * 5));
	let date = new Date()
    if(parent){
		date = state._data[parent].startdate
	} else {
 		let startdates = Object.keys(state._data).map(key=>state._data[key].startdate)
		date = startdates.length > 0 && new Date(Math.min(...startdates))
	}
    
    const newRow = {
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
    let newState =  {
        ...state,
        _data: {
            ...state._data,
            [newId] : newRow
        },
        editableCells: {
            ...state.editableCells,
            [newId]: action.columns
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
    
    return reducer(newState,{type:actionTypes.SEND_EVENTS});
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
    
    return reducer(newState,{type:actionTypes.SEND_EVENTS});
}

export const TOGGLE_NODE = (state,action,reducer) => {
    const updatedState = { ...state,
        _data: {...state._data,
            [action.nodeKey]:{...state._data[action.nodeKey],
                open: !state._data[action.nodeKey].open
            }
        }
    };
    return reducer(updatedState, { type: actionTypes.SEND_EVENTS});
}

export const SAVE_TABLE = (state,action,reducer) => {
    const tableRowValues = Object.keys(state._data[action.rowId]).reduce((total,col)=>{return {...total,[col]:action.rowValues[col]}},{})
    let newRowValues = objectCopierWithStringToDate(tableRowValues)
    let newState = {...state,
        editableCells: {
            ...state.editableCells,
            [action.rowId]: action.editableValues
        }
    };
    let changeObject = recursiveDeepDiffs(state._data[action.rowId],newRowValues)


    return reducer(newState,{type:actionTypes.BUBBLE_TRANSFORM, key: action.rowId, changes: changeObject})
}

export const BUBBLE_TRANSFORM = (state,action,reducer) => {
    let newState = {...state}
    //apply transformation to a copy of bubble states. If valid, replace the main state.
    var oldBubbles = {}
    for (var bubblekey in newState._data){
        var bubble=newState._data[bubblekey]
        oldBubbles[bubblekey]=recursiveDeepCopy(bubble)
    }
    if(JSON.stringify(newState._data[action.key])!==JSON.stringify({...newState._data[action.key],...action.changes})){
        //newState = {...newState, _data: {...state._data,[action.key]:{...newState._data[action.key],...action.changes}}}
        var newStateBubbles = tryReturnValidTransformState(oldBubbles,action);
        if(newStateBubbles!==false){
            newState = {
                ...newState,
                _data: newStateBubbles
            }
            return reducer(newState,{type:actionTypes.SEND_EVENTS});
        }
        else { return state }
    }
    return state
}
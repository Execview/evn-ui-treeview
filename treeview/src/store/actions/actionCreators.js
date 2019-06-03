import * as actionTypes from './actionTypes';
import { objectCopierWithStringToDate, recursiveDeepDiffs, recursiveDeepCopy } from '@execview/reusable';
import tryReturnValidTransformState from '../stateValidator';

export const saveTable = (action, slice) => (dispatch, getState) => {
	const state = getStateSlice(getState(),slice) 
    const tableRowValues = Object.keys(state._data[action.rowId]).reduce((total,col)=>{return {...total,[col]:action.rowValues[col]}},{})
    let newRowValues = objectCopierWithStringToDate(tableRowValues)
    let newState = {...state,
        editableCells: {
            ...state.editableCells,
            [action.rowId]: action.editableValues
        }
    };
    let changeObject = recursiveDeepDiffs(state._data[action.rowId],newRowValues)

    // return reducer(newState,{type:actionTypes.BUBBLE_TRANSFORM, key: action.rowId, changes: changeObject})
    dispatch(bubbleTransform({key: action.rowId, changes: changeObject}, slice))
}



export const bubbleTransform = (action, slice) => (dispatch, getState) => {
	const state = getStateSlice(getState(),slice)
    let newState = {...state}
    //apply transformation to a copy of bubble states. If valid, replace the main state.
    const oldBubbles = {}
    for (const bubblekey in newState._data){
        const bubble = newState._data[bubblekey]
        oldBubbles[bubblekey]=recursiveDeepCopy(bubble)
    }
    if(JSON.stringify(newState._data[action.key])!==JSON.stringify({...newState._data[action.key],...action.changes})){
        const newStateBubbles = tryReturnValidTransformState(oldBubbles,action);
        if(newStateBubbles!==false){
            dispatch({type:actionTypes.MOVE_BUBBLES, _data: newStateBubbles, originalAction: action})
		}
	}
	return state;
}


export const tryPerformLink = (action, slice) => (dispatch, getState) => {
	const state = getStateSlice(getState(),slice)
    if ((action.parentside === 'left' || action.parentside === 'right') && action.childkey!==action.parentkey) {
        // if child doesnt have parent AND parent hasnt already linked child
        if((state._data[action.childkey]["ParentBubble"]==='')&&(state._data[action.parentkey]["ChildBubbles"][action.childkey]==null)){
            dispatch(action);
        }
    }	
}

export const tryPerformAssociation = (action, slice) => (dispatch, getState) => {
	const state = getStateSlice(getState(),slice)
	if(action.childkey && (action.childkey!==action.parentkey) && !state._data[action.parentkey]["ChildAssociatedBubbles"].includes(action.childkey) && !(state._data[action.childkey]["ParentAssociatedBubble"]===action.parentkey)){
        dispatch(action) 
	}
}

const getStateSlice = (state, slice) => {
	const sliceArray = slice || []
	return sliceArray.reduce((t,s)=>t[s],state)
}
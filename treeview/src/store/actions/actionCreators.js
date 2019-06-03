import * as actionTypes from './actionTypes';
import { objectCopierWithStringToDate, recursiveDeepDiffs, recursiveDeepCopy } from '@execview/reusable';
import tryReturnValidTransformState from '../stateValidator';

export const saveTable = (action) => (dispatch, getState) => {
	const state = getState()
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
    dispatch(bubbleTransform({key: action.rowId, changes: changeObject}))
}



export const bubbleTransform = (action) => (dispatch, getState) => {
    const state = getState();
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


export const tryPerformLink = (action) => (dispatch,getState) => {
    const state = getState() 
    if ((action.parentside === 'left' || action.parentside === 'right') && action.childkey!==action.parentkey) {
        // if child doesnt have parent AND parent hasnt already linked child
        if((state._data[action.childkey]["ParentBubble"]==='')&&(state._data[action.parentkey]["ChildBubbles"][action.childkey]==null)){
            dispatch(action);
        }
    }	
}

export const tryPerformAssociation = (action) => (dispatch,getState) => {
    const state = getState()
	if(action.childkey && (action.childkey!==action.parentkey) && !state._data[action.parentkey]["ChildAssociatedBubbles"].includes(action.childkey) && !(state._data[action.childkey]["ParentAssociatedBubble"]===action.parentkey)){
        dispatch(action) 
	}
}
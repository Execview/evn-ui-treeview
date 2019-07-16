import * as actionTypes from './actions/actionTypes'
import { combineEpics } from 'redux-observable';
import {ofType} from 'redux-observable'
import {filter, map, tap} from 'rxjs/operators'
import { recursiveDeepCopy } from '@execview/reusable';
import tryReturnValidTransformState from './stateValidator';

const voidAction = {type: 'dont care'}

export const tryBubbleTransformEpic = (action$,state$) => action$.pipe(
    ofType(actionTypes.TRY_BUBBLE_TRANSFORM),
	map(action=>{const state = {...state$.value}; return tryBubbleTransformEpicMap(action,state)})
)
export const tryBubbleTransformEpicMap = (action, state)=>{
	let newState = {...state}
	//apply transformation to a copy of bubble states. If valid, replace the main state.
	const oldBubbles = {}
	for (const bubblekey in newState._data){
		const bubble = newState._data[bubblekey]
		oldBubbles[bubblekey]=recursiveDeepCopy(bubble)
	}
	
	const newStateBubbles = tryReturnValidTransformState(oldBubbles,action);
	if(newStateBubbles!==false){
		return {type:actionTypes.MOVE_BUBBLES, originalAction: action, _data: newStateBubbles, editableValues: action.editableValues}
	}

	return voidAction;
}

export const tryPerformLinkEpic = (action$,state$) => action$.pipe(
    ofType(actionTypes.TRY_PERFORM_LINK),
	map(action=>{const state = {...state$.value}; return tryPerformLinkEpicMap(action,state)})
)
export const tryPerformLinkEpicMap = (action,state)=>{
	if ((action.parentside === 'left' || action.parentside === 'right') && action.childkey!==action.parentkey) {
		// if child doesnt have parent AND parent hasnt already linked child
		if((state._data[action.childkey]["ParentBubble"]==='')&&(state._data[action.parentkey]["ChildBubbles"][action.childkey]==null)){
			return {...action, type: actionTypes.PERFORM_LINK} 
		}
	}	
	return voidAction;
}

export const tryPerformAssociationEpic = (action$,state$) => action$.pipe(
	ofType(actionTypes.TRY_PERFORM_ASSOCIATION),
	map((action)=>{const state = {...state$.value}; return tryPerformAssociationEpicMap(action,state)})
)
export const tryPerformAssociationEpicMap = (action,state) => {
	if(action.childkey && (action.childkey!==action.parentkey) && !state._data[action.parentkey]["ChildAssociatedBubbles"].includes(action.childkey) && !(state._data[action.childkey]["ParentAssociatedBubble"]===action.parentkey)){
		return {...action, type: actionTypes.PERFORM_ASSOCIATION} 
	}
	return voidAction;
}


const rootEpic = combineEpics(
	tryBubbleTransformEpic,
	tryPerformLinkEpic,
	tryPerformAssociationEpic
);

export default rootEpic

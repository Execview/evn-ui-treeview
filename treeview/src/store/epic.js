import * as actionTypes from './actions/actionTypes'
import { combineEpics } from 'redux-observable';
import {ofType} from 'redux-observable'
import {filter, map, tap} from 'rxjs/operators'
import { recursiveDeepCopy } from '@execview/reusable';
import tryReturnValidTransformState from './stateValidator';
import { Observable } from 'rxjs';

const voidAction = {type: 'dont care'}

export const tryBubbleTransformEpic = (action$,state$) => { return (
    action$.ofType(actionTypes.TRY_BUBBLE_TRANSFORM).mergeMap(action=>{
		const state = {...state$.value};
		return tryBubbleTransformEpicMap(action,state)
	})
)}
export const tryBubbleTransformEpicMap = (action, state)=>{
	//apply transformation to a copy of bubble states. If valid, replace the main state.
	const bubbleCopies = {}
	for (const bubblekey in state._data){
		const bubble = state._data[bubblekey]
		bubbleCopies[bubblekey]=recursiveDeepCopy(bubble)
	}

	if (action.changes){
		const {startdate, enddate, ...nonDateChanges} = action.changes
		const newStateBubbles = tryReturnValidTransformState(bubbleCopies,action.key,{startdate,enddate});
		const newBubbles = newStateBubbles || state._data
		const newState = {...newBubbles,[action.key]:{...newBubbles[action.key],...nonDateChanges}}

		let itemChanges = {key: action.key, changes: {}};
		for(let x in action.changes) {
			itemChanges.changes[x] = newState[action.key][x]
		}

		const moveBubblesAction = {
			type:actionTypes.MOVE_BUBBLES,
			originalAction: action,
			_data: newState,
			itemChanges,
		}

		return Observable.of(moveBubblesAction)

	}
	return Observable.of(voidAction);
}

export const tryPerformLinkEpic = (action$,state$) => action$.pipe(
    ofType(actionTypes.TRY_PERFORM_LINK),
	map(action=>{const state = {...state$.value}; return tryPerformLinkEpicMap(action,state)})
)
export const tryPerformLinkEpicMap = (action,state)=>{
	if ((action.parentside === 'left' || action.parentside === 'right') && action.childkey!==action.parentkey) {
		// if child doesnt have parent AND parent hasnt already linked child
		if((!state._data[action.childkey].ParentBubble)&&(!(state._data[action.parentkey].ChildBubbles || {})[action.childkey])){
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
	if(action.childkey && (action.childkey!==action.parentkey) && !(state._data[action.parentkey].ChildAssociatedBubbles || []).includes(action.childkey) && !(state._data[action.childkey].ParentAssociatedBubble===action.parentkey)){
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

import * as actionTypes from './actionTypes';

export const PERFORM_LINK = (state,action,reducer) => {
	if((action.parentside === 'left' || action.parentside === 'right') && action.childkey!==action.parentkey){
		console.log(action)
		var finalstate = {...state}
		var parentpoint = 'right'===action.parentside ? "enddate" : "startdate"
		var childpoint = 'right'===action.childside ? "enddate" : "startdate"
		// if child doesnt have parent AND parent hasnt already linked child
		//TODO MORE IFS BECAUSE OF ASSOCIATION!
		if((state._data[action.childkey]["ParentBubble"]==='')&&(state._data[action.parentkey]["ChildBubbles"][action.childkey]==null)){
			var xGapDate = state._data[action.childkey][childpoint]-state._data[action.parentkey][parentpoint];
			finalstate = reducer(finalstate,{type:actionTypes.ADD_CHILD_LINK,parentkey:action.parentkey,childkey:action.childkey,parentside:action.parentside,childside:action.childside,xGapDate:xGapDate})
			finalstate = reducer(finalstate,{type:actionTypes.ADD_PARENT_LINK,childkey:action.childkey,parentkey:action.parentkey})
			return reducer(finalstate,{type:actionTypes.SEND_EVENTS});
		} else {
			console.log('already linked!');
			return state
		}
	}
	return state;
}

export const PERFORM_ASSOCIATION = (state,action,reducer) => {
	let finalstate = {...state}
	if((action.childkey!==action.parentkey)&& action.childkey &&(!state._data[action.parentkey]["ChildAssociatedBubbles"].includes(action.childkey))){
		finalstate = reducer(finalstate,{type: actionTypes.UNLINK_PARENT_ASSOCIATED_BUBBLE, key:action.childkey })
		finalstate = reducer(finalstate,{type: actionTypes.ADD_CHILD_ASSOCIATION,parentkey:action.parentkey,childkey:action.childkey})
		finalstate = reducer(finalstate,{type: actionTypes.ADD_PARENT_ASSOCIATION,childkey:action.childkey,parentkey:action.parentkey})
		return reducer(finalstate,{type:actionTypes.SEND_EVENTS});
	}
	return state
}

export const ADD_CHILD_LINK = (state,action,reducer) => {
	return {
			...state,
			_data: {...state._data,
				[action.parentkey]:{...state._data[action.parentkey],
					ChildBubbles:{...state._data[action.parentkey]["ChildBubbles"],
						[action.childkey]: {childside: action.childside, parentside: action.parentside, xGapDate: action.xGapDate}
					}
				}
			}
	}
}

export const ADD_PARENT_LINK = (state,action,reducer) => {
	return {
			...state,
			_data: {...state._data,
					[action.childkey]:{...state._data[action.childkey],
								ParentBubble: action.parentkey
								}
			}
	}
}

export const ADD_CHILD_ASSOCIATION = (state,action,reducer) => {
	return {
		...state,
		_data: {...state._data,
			[action.parentkey]:{...state._data[action.parentkey],
				ChildAssociatedBubbles:[...state._data[action.parentkey]["ChildAssociatedBubbles"], action.childkey],
			}
		}
	}
}

export const ADD_PARENT_ASSOCIATION = (state,action,reducer) => {
	return {
		...state,
		_data: {...state._data,
			[action.childkey]:{...state._data[action.childkey],
				ParentAssociatedBubble: action.parentkey
				}
			}
	}
}

export const UNLINK_PARENT_BUBBLE = (state,action,reducer) => {
	var newState = {...state}
	var parentBubbleKey = state._data[action.key].ParentBubble
	if(parentBubbleKey!==''){
		//remove ParentBubble property value
		newState = {...newState,
				_data: {...newState._data,
							[action.key]:{...newState._data[action.key],
											ParentBubble:''}}}
		//remove ChildBubble property from the parent
		const {[action.key]:value, ...rest} = newState._data[parentBubbleKey]["ChildBubbles"]
		newState = { ...newState,
			_data: {...newState._data,
							[parentBubbleKey]:{...newState._data[parentBubbleKey],
											ChildBubbles:{...rest}}}}
		
		//sort out side colours
		newState = reducer(newState,{type: actionTypes.SET_ORIGINAL_COLOUR,key:action.key,side:'left'})
		newState = reducer(newState,{type: actionTypes.SET_ORIGINAL_COLOUR,key:action.key,side:'right'})
		newState = reducer(newState,{type: actionTypes.SET_ORIGINAL_COLOUR,key:action.key,side:'middle'})
	}
	return newState
}

export const UNLINK_PARENT_ASSOCIATED_BUBBLE = (state,action,reducer) => {
	var newState = {...state}
	var parentAssociatedBubbleKey = newState._data[action.key].ParentAssociatedBubble
	if(parentAssociatedBubbleKey){
		//remove ParentAssociatedBubble property value
		newState = {...newState,
			_data: {...newState._data,
							[action.key]:{...newState._data[action.key],
											ParentAssociatedBubble:''}}}
		//remove ChildBubble property from the parent
		const ChildIndex = newState._data[parentAssociatedBubbleKey]["ChildAssociatedBubbles"].indexOf(action.key)
		var newChildAssociatedBubbles = [...newState._data[parentAssociatedBubbleKey].ChildAssociatedBubbles]
		newChildAssociatedBubbles.splice(ChildIndex,1)
		newState = { ...newState,
			_data: {...newState._data,
				[parentAssociatedBubbleKey]:{...newState._data[parentAssociatedBubbleKey],
					ChildAssociatedBubbles:newChildAssociatedBubbles
				}
			}
		}
		reducer(newState,{type:actionTypes.SEND_EVENTS});

	}
	return newState
}
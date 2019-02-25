import tryReturnValidTransformState from './stateValidator'
import {bubbleCopy} from '../functions/bubbleCopy'

const initialState = {
	bubbles:{}
}

//TODO: Add validation to prevent associating a bubble with its own child associate, or links etc...
//KNOWN BUG: Deleting bubbles doesnt redo the association movements + resizings.

const reducer = (state=initialState,action)=>{
	if (action.type === 'NEW_BUBBLE'){
		return {
			...state,
			bubbles: {...state.bubbles,
				[action.bubble.key]:action.bubble
			}
		}
	}
	if (action.type === 'ADD_MANY_BUBBLES'){
		var newState = {...state}
		for(var i=0; i<action.bubbles.length; i++){
			newState = reducer(newState,{type:'NEW_BUBBLE',bubble:action.bubbles[i]})
		}

		for (var bubblekey in newState.bubbles){
			newState = reducer(newState,{type:'SET_ORIGINAL_COLOUR',key:bubblekey,side:'left'})
			newState = reducer(newState,{type:'SET_ORIGINAL_COLOUR',key:bubblekey,side:'right'})
		}
		return newState
	}
	if (action.type === 'CHANGE_BUBBLE_DATE')
		return {
			...state,
			bubbles: {...state.bubbles,
					[action.key]:{...state.bubbles[action.key],
								[action.side]:action.date
				}
			}
		}
	if (action.type === 'ADD_CHILD_LINK'){
		return {
			...state,
			bubbles: {...state.bubbles,
					[action.parentkey]:{...state.bubbles[action.parentkey],
								ChildBubbles:{...state.bubbles[action.parentkey]["ChildBubbles"],
												[action.childkey]: {childside: action.childside, parentside: action.parentside, xGapDate: action.xGapDate}
												}
										}
					}
				}		
	}
	if (action.type === 'ADD_PARENT_LINK'){
		return {	
			...state,
			bubbles: {...state.bubbles,
					[action.childkey]:{...state.bubbles[action.childkey],
								ParentBubble: action.parentkey
								}
				}
		}
	}
	if (action.type === 'ADD_CHILD_ASSOCIATION'){
		return {
			...state,
			bubbles: {...state.bubbles,
					[action.parentkey]:{...state.bubbles[action.parentkey],
								ChildAssociatedBubbles:[...state.bubbles[action.parentkey]["ChildAssociatedBubbles"], action.childkey],
										}
					}
				}		
	}
	if (action.type === 'ADD_PARENT_ASSOCIATION'){
		return {	
			...state,
			bubbles: {...state.bubbles,
					[action.childkey]:{...state.bubbles[action.childkey],
								ParentAssociatedBubble: action.parentkey
								}
				}
		}
	}
	if (action.type === 'CLEAR_BUBBLES'){
		return {
			...state,
			bubbles: {}
		}
	}
	if (action.type === 'SET_BUBBLE_SIDE_COLOUR'){
		return {
			...state,
			bubbles: {...state.bubbles,
					[action.key]:{...state.bubbles[action.key],
						colours:{...state.bubbles[action.key].colours,
							[action.side]:action.colour}}								
					} 
		}
	}
	if (action.type === 'REPLACE_ALL_BUBBLES'){
		return {
			...state,
			bubbles: action.bubbles
		}
	}

	if (action.type === 'BUBBLE_TRANSFORM'){
		//apply transformation to a copy of bubble states. If valid, replace the main state.
		var oldBubbles = {}
		for (var bubblekey in state.bubbles){
				var bubble=state.bubbles[bubblekey]
				oldBubbles[bubble.key]=bubbleCopy(bubble)
		}
		
		//Object.assign(oldBubbles[action.key],action.changes)
		if(JSON.stringify(state.bubbles[action.key])!==JSON.stringify({...state.bubbles[action.key],...action.changes})){
			var newStateBubbles = tryReturnValidTransformState(oldBubbles,action);
			if(newStateBubbles!==false){
				return {
					...state,
					bubbles: newStateBubbles
				}
			}
			else{return state}
		}else{return state}
	}
	if (action.type === 'PERFORM_LINK'){
		console.log(action)
		var finalstate = {...state}
		var parentpoint = 'right'===action.parentside ? "enddate" : "startdate"
		var childpoint = 'right'===action.childside ? "enddate" : "startdate"
		// if not linking to self AND child doesnt have parent AND parent hasnt already linked child
		//TODO MORE IFS BECAUSE OF ASSOCIATION!
		if((action.childkey!==action.parentkey)&&(state.bubbles[action.childkey]["ParentBubble"]==='')&&(state.bubbles[action.parentkey]["ChildBubbles"][action.childkey]==null)){
			var xGapDate = state.bubbles[action.childkey][childpoint]-state.bubbles[action.parentkey][parentpoint];
			finalstate = reducer(finalstate,{type:'ADD_CHILD_LINK',parentkey:action.parentkey,childkey:action.childkey,parentside:action.parentside,childside:action.childside,xGapDate:xGapDate})
			finalstate = reducer(finalstate,{type:'ADD_PARENT_LINK',childkey:action.childkey,parentkey:action.parentkey})
			return finalstate
		}
		else{console.log('already linked!'); return state}
	}
	if (action.type==='PERFORM_ASSOCIATION'){
		var finalstate = {...state}
		// if not linking to self AND child doesnt have parent AND parent hasnt already linked child
		if((action.childkey!==action.parentkey)&&(state.bubbles[action.childkey]["ParentAssociatedBubble"]==='')&&(!state.bubbles[action.parentkey]["ChildAssociatedBubbles"].includes(action.childkey))){
			console.log(state.bubbles[action.parentkey]["ChildAssociatedBubbles"])
			finalstate = reducer(finalstate,{type:'ADD_CHILD_ASSOCIATION',parentkey:action.parentkey,childkey:action.childkey})
			finalstate = reducer(finalstate,{type:'ADD_PARENT_ASSOCIATION',childkey:action.childkey,parentkey:action.parentkey})
			return finalstate
		}
		else{return state}

	}
	if (action.type === 'DELETE_BUBBLE'){
		var newState = {...state}
		//Delete all Child references to this bubble
		for(var childkey in state.bubbles[action.key].ChildBubbles){
			newState = reducer(newState,{type:'UNLINK_PARENT_BUBBLE',key:childkey})
		}
		for(var childkeyINDEX in state.bubbles[action.key].ChildAssociatedBubbles){
			newState = reducer(newState,{type:'UNLINK_PARENT_ASSOCIATED_BUBBLE',key:state.bubbles[action.key].ChildAssociatedBubbles[childkeyINDEX]})
		}
		//Delete the Parent reference from the parent
		newState = reducer(newState,{type:'UNLINK_PARENT_BUBBLE',key:action.key})
		newState = reducer(newState,{type:'UNLINK_PARENT_ASSOCIATED_BUBBLE',key:action.key})

		//Safely delete the bubble
		const {[action.key]:placeholder, ...rest} = newState.bubbles
		newState = {...newState, bubbles: {...rest}}
		return newState
	}
	if (action.type === 'RENAME_BUBBLE'){
		return {...state,
				bubbles: {...state.bubbles,
							[action.key]:{...state.bubbles[action.key],
											text:action.text}}}
	}
	if (action.type === 'UNLINK_PARENT_BUBBLE'){
		var newState = {...state}
		var parentBubbleKey = state.bubbles[action.key].ParentBubble
		if(parentBubbleKey!==''){
			//remove ParentBubble property value
			newState = {...newState,
					bubbles: {...newState.bubbles,
								[action.key]:{...newState.bubbles[action.key],
												ParentBubble:''}}}
			//remove ChildBubble property from the parent
			const {[action.key]:value, ...rest} = newState.bubbles[parentBubbleKey]["ChildBubbles"]
			newState = { ...newState,
						bubbles: {...newState.bubbles,
								[parentBubbleKey]:{...newState.bubbles[parentBubbleKey],
												ChildBubbles:{...rest}}}}

			//sort out side colours
			newState = reducer(newState,{type:'SET_ORIGINAL_COLOUR',key:action.key,side:'left'})
			newState = reducer(newState,{type:'SET_ORIGINAL_COLOUR',key:action.key,side:'right'})
			newState = reducer(newState,{type:'SET_ORIGINAL_COLOUR',key:action.key,side:'middle'})
		}
		return newState
	}
	if (action.type === 'UNLINK_PARENT_ASSOCIATED_BUBBLE'){
		var newState = {...state}
		console.log(action)
		var parentAssociatedBubbleKey = newState.bubbles[action.key].ParentAssociatedBubble
		if(parentAssociatedBubbleKey){
			//remove ParentAssociatedBubble property value
			newState = {...newState,
					bubbles: {...newState.bubbles,
								[action.key]:{...newState.bubbles[action.key],
												ParentAssociatedBubble:''}}}
			//remove ChildBubble property from the parent
			console.log(parentAssociatedBubbleKey)
			console.log(newState.bubbles)
			const ChildIndex = newState.bubbles[parentAssociatedBubbleKey]["ChildAssociatedBubbles"].indexOf(action.key)
			var newChildAssociatedBubbles = [...newState.bubbles[parentAssociatedBubbleKey].ChildAssociatedBubbles]
			newChildAssociatedBubbles.splice(ChildIndex,1)
			console.log(ChildIndex)
			const {[action.key]:value, ...rest} = newState.bubbles[parentAssociatedBubbleKey]["ChildAssociatedBubbles"]
			newState = { ...newState,
						bubbles: {...newState.bubbles,
								[parentAssociatedBubbleKey]:{...newState.bubbles[parentAssociatedBubbleKey],
												ChildAssociatedBubbles:newChildAssociatedBubbles}}}

			//sort out side colours
			newState = reducer(newState,{type:'SET_ORIGINAL_COLOUR',key:action.key,side:'left'})
			newState = reducer(newState,{type:'SET_ORIGINAL_COLOUR',key:action.key,side:'right'})
			newState = reducer(newState,{type:'SET_ORIGINAL_COLOUR',key:action.key,side:'middle'})
			
		}
		return newState
	}
	if (action.type === 'SET_ORIGINAL_COLOUR'){
			var colourtoset=state.bubbles[action.key].colours.original
			var parentkey = state.bubbles[action.key]["ParentBubble"]
			if(parentkey){
				var thislink = state.bubbles[parentkey]["ChildBubbles"][action.key]
				if(thislink!=null){
					if(thislink.childside===action.side){
						colourtoset=state.bubbles[parentkey].colours.original}}}
			return reducer(state,{type:'SET_BUBBLE_SIDE_COLOUR',key:action.key,side:action.side,colour:colourtoset})
	}
	console.log("ERROR!!!!!!!! ATTEMPTED TO DO: "+ action.type)
	return state
}

export default reducer


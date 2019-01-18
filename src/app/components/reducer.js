import tryReturnValidTransformState from './stateValidator'

const initialState = {
	bubbles:{},
	parentbubbles:[],
}

const reducer = (state=initialState,action)=>{
	if (action.type === 'NEW_BUBBLE'){
		return {
			...state,
			bubbles: {...state.bubbles,
				[action.bubble.key]:action.bubble
			}
		}
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
	if (action.type === 'CLEAR_BUBBLES'){
		return {
			...state,
			bubbles: {}
		}
	}
	if (action.type === 'MOUSE_DOWN_ON_BUBBLE') {
		return {	
			...state,
			bubbles: {...state.bubbles,
					[action.key]:{...state.bubbles[action.key],
								mouseDownOn: {...state.bubbles[action.key].mouseDownOn,
									[action.side]: action.bool},
								} 
				}
		}
	}
	if (action.type === 'MOUSE_DOWN_POS'){
		return {
			...state,
			bubbles: {...state.bubbles,
					[action.key]:{...state.bubbles[action.key],
								mousedownpos: action.position
								},
					} 

		}
	}
	if (action.type === 'SET_DRAG_DIFF'){
		return {
			...state,
			bubbles: {...state.bubbles,
					[action.key]:{...state.bubbles[action.key],
								dragDiffs: action.diffs
								},
					} 
		}
	}
	if (action.type === 'SET_BUBBLE_SIDE_COLOUR'){
		var sides = {'right':'rightcolour','left':'leftcolour'}
		return {
			...state,
			bubbles: {...state.bubbles,
					[action.key]:{...state.bubbles[action.key],
					[sides[action.side]]:action.colour}								
					} 
		}
	}
	if (action.type === 'REPLACE_ALL_BUBBLES'){
		return {
			...state,
			bubbles: action.bubbles
		}
	}
	if (action.type === 'CLEAR_PARENT_BUBBLES'){
		return {
			...state,
			parentbubbles:[]
		}
	}
	if (action.type === 'ADD_PARENT_BUBBLE'){
		return {
			...state,
			parentbubbles: [...state.parentbubbles,action.key]
		}
	}
	if (action.type === 'TRY_REMOVE_PARENT_BUBBLE'){
		var newParentBubbles = [...state.parentbubbles]
		var newChildBubblesparentbubblesIndex = newParentBubbles.indexOf(action.key)
		if(newChildBubblesparentbubblesIndex!==-1){						
			newParentBubbles.splice(newChildBubblesparentbubblesIndex,1)
		}
		return {
			...state,
			parentbubbles: newParentBubbles
		}
	}
	if (action.type === 'BUBBLE_TRANSFORM'){
		var bubbleStateCopy = {}; //apply transformation to a copy of bubble states. If valid, replace the main state.
		for (var bubblekey in state.bubbles){var bubble=state.bubbles[bubblekey];bubbleStateCopy[bubble.key]=bubbleCopy(bubble)}
		Object.assign(bubbleStateCopy[action.key],action.changes)
		if(JSON.stringify(state.bubbles[action.key])!==JSON.stringify(bubbleStateCopy[action.key])){
			var newstate = tryReturnValidTransformState({bubbles:bubbleStateCopy,parentbubbles:state.parentbubbles});
			if(newstate!==false){
				return {
					...state,
					bubbles: newstate.bubbles
				}
			}
		}else{return state}
	}
	if (action.type === 'PERFORM_LINK'){
		var finalstate = {...state}
		var parentpoint = 'right'===action.parentside ? "enddate" : "startdate"
		var childpoint = 'right'===action.childside ? "enddate" : "startdate"
		// if not linking to self AND child doesnt have parent AND parent hasnt already linked child
		if((action.childkey!==action.parentkey)&&(state.bubbles[action.childkey]["ParentBubble"]==='')&&(state.bubbles[action.parentkey]["ChildBubbles"][action.childkey]==null)){
			var xGapDate = state.bubbles[action.childkey][childpoint]-state.bubbles[action.parentkey][parentpoint];
			console.log("[FS]: "+finalstate)
			finalstate = reducer(finalstate,{type:'ADD_CHILD_LINK',parentkey:action.parentkey,childkey:action.childkey,parentside:action.parentside,childside:action.childside,xGapDate:xGapDate})
			finalstate = reducer(finalstate,{type:'ADD_PARENT_LINK',childkey:action.childkey,parentkey:action.parentkey})
			// if parent bubble has no parent, add to main list of parents
			if(state.bubbles[action.parentkey]["ParentBubble"]===''){
				finalstate = reducer(finalstate,{type:'ADD_PARENT_BUBBLE',key:action.parentkey})
			}
			// if child bubble was in list of parents, remove.
			if(state.bubbles[action.childkey]["ParentBubble"]!==''){
				finalstate = reducer(finalstate,{type: 'TRY_REMOVE_PARENT_BUBBLE',key:action.childkeykey})
			}
			return finalstate
		}
		else{console.log('already linked!'); return state}
	}
	if (action.type === 'DELETE_BUBBLE'){
		const {[action.key]:placeholder, ...rest} = state.bubbles
		return {...state,
			bubbles: {...rest}}
	}
	if (action.type === 'CHANGE_BUBBLE_COLOUR'){
		var newState =  {...state,
				bubbles: {...state.bubbles,
							[action.key]:{...state.bubbles[action.key],
											colour:action.colour}}}
		newState = reducer(newState,{type:'SET_BUBBLE_SIDE_COLOUR',key:action.key,side:'left',colour:action.colour})
		newState = reducer(newState,{type:'SET_BUBBLE_SIDE_COLOUR',key:action.key,side:'right',colour:action.colour})
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
		if(parentBubbleKey!=''){
			//remove ParentBubble property value
			newState = {...newState,
					bubbles: {...newState.bubbles,
								[action.key]:{...newState.bubbles[action.key],
												ParentBubble:''}}}
			//remove ChildBubble property from the parent
			const {[action.key]:value, ...rest} = newState.bubbles[parentBubbleKey]["ChildBubbles"]
			console.log({...rest})
			newState = { ...newState,
						bubbles: {...newState.bubbles,
								[parentBubbleKey]:{...newState.bubbles[parentBubbleKey],
												ChildBubbles:{...rest}}}}

			//add self to list of ParentBubbles
			newState = {...newState,
						parentbubbles:[...newState.parentbubbles,action.key]}
		}
		return newState
	}
	if (action.type === 'SET_ORIGINAL_COLOUR'){
			var colourtoset=state.bubbles[action.key].colour
			var parentkey = state.bubbles[action.key]["ParentBubble"]
			if(parentkey!==''){
				var thislink = state.bubbles[parentkey]["ChildBubbles"][action.key]
				if(thislink!=null){
					if(thislink.childside===action.side){
						colourtoset=state.bubbles[parentkey].colour}}}
			return reducer(state,{type:'SET_BUBBLE_SIDE_COLOUR',key:action.key,side:action.side,colour:colourtoset})
	}
	return state
}

function bubbleCopy(bubble){
		return recursiveDeepCopy(bubble)
	}

function recursiveDeepCopy(o) {
		var newO,i;	
		if (typeof o !== 'object') {return o;}
		if (!o) {return o;}
		var str = Object.prototype.toString.apply(o)
		if ('[object Array]' === str) {
			newO = [];
			for (i = 0; i < o.length; i += 1) {newO[i] = recursiveDeepCopy(o[i]);}
			return newO;}		
		if('[object Date]' === str){return new Date(o)}	
		newO = {};
		for (i in o) {
		if (o.hasOwnProperty(i)) {newO[i] = recursiveDeepCopy(o[i]);}}
		return newO;
  	}

export default reducer


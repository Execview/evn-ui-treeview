import * as actionTypes from './actionTypes';

export const SET_ORIGINAL_COLOUR = (state,action,reducer) => {
	var colourtoset=state._data[action.key].colours.original
	var parentkey = state._data[action.key]["ParentBubble"]
	if(parentkey){
		var thislink = state._data[parentkey]["ChildBubbles"][action.key]
		if(thislink!=null){
			if(thislink.childside===action.side){
				colourtoset=state._data[parentkey].colours.original
			}
		}
	}
	return reducer(state,{type: actionTypes.SET_BUBBLE_SIDE_COLOUR, key:action.key, side:action.side, colour:colourtoset})
}

export const SET_BUBBLE_SIDE_COLOUR = (state,action,reducer) => {
	const newState = {
		...state,
		_data: {...state._data,
			[action.key]:{...state._data[action.key],
				colours:{...state._data[action.key].colours,
					[action.side]:action.colour
				}
			}
		}
	}
	return reducer(newState,{type:actionTypes.UPDATE_DATA})
}
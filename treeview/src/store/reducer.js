import { cellTypes, editableCells } from './config'
import * as actionTypes from './actions/actionTypes';
import * as BubbleLinks from './actions/BubbleLinks';
import * as ColourChanges from './actions/ColourChanges';
import * as DataManagement from './actions/DataManagement';
import * as Interactions from './actions/Interactions';

let initialState = {
	_data: {},
	cellTypes,
	editableCells,
	displayedTreeStructure: [],
	displayedData: {},
	token: ''
}

function reducer(state=initialState,action) {
	switch(action.type) {
		case actionTypes.LOAD_FROM_CONFIG: { return DataManagement.LOAD_FROM_CONFIG(state,action,reducer) }
		case actionTypes.LOAD_DATA: { return DataManagement.LOAD_DATA(state,action,reducer) }
		case actionTypes.UPDATE_DATA: { return DataManagement.UPDATE_DATA(state,action,reducer) }

		case actionTypes.ADD_ROW: { return Interactions.ADD_ROW(state,action,reducer) }
		case actionTypes.DELETE_BUBBLE: { return Interactions.DELETE_BUBBLE(state,action,reducer); }
		case actionTypes.SAVE_TABLE: { return Interactions.SAVE_TABLE(state,action,reducer); }
		case actionTypes.TOGGLE_NODE: { return Interactions.TOGGLE_NODE(state,action,reducer); }	
		case actionTypes.BUBBLE_TRANSFORM: { return Interactions.BUBBLE_TRANSFORM(state,action,reducer); }

		case actionTypes.SET_ORIGINAL_COLOUR: { return ColourChanges.SET_ORIGINAL_COLOUR(state,action,reducer) }
		case actionTypes.SET_BUBBLE_SIDE_COLOUR: { return ColourChanges.SET_BUBBLE_SIDE_COLOUR(state,action,reducer) }

		case actionTypes.PERFORM_LINK: { return BubbleLinks.PERFORM_LINK(state,action,reducer) }
		case actionTypes.PERFORM_ASSOCIATION: { return BubbleLinks.PERFORM_ASSOCIATION(state,action,reducer) }
		case actionTypes.ADD_CHILD_LINK: { return BubbleLinks.ADD_CHILD_LINK(state,action,reducer) }
		case actionTypes.ADD_PARENT_LINK :{ return BubbleLinks.ADD_PARENT_LINK(state,action,reducer) }
		case actionTypes.ADD_CHILD_ASSOCIATION: { return BubbleLinks.ADD_CHILD_ASSOCIATION(state,action,reducer) }
		case actionTypes.ADD_PARENT_ASSOCIATION: { return BubbleLinks.ADD_PARENT_ASSOCIATION(state,action,reducer) }
		case actionTypes.UNLINK_PARENT_BUBBLE: { return BubbleLinks.UNLINK_PARENT_BUBBLE(state,action,reducer) }
		case actionTypes.UNLINK_PARENT_ASSOCIATED_BUBBLE: { return BubbleLinks.UNLINK_PARENT_ASSOCIATED_BUBBLE(state,action,reducer) }
		
		default: { return state; }
	}

}

export default reducer

import { editableCells } from './config'
import * as actionTypes from './actions/actionTypes';
import * as BubbleLinks from './actions/BubbleLinks';
import * as ColourChanges from './actions/ColourChanges';
import * as DataManagement from './actions/DataManagement';
import * as Interactions from './actions/Interactions';
import { EventStoreSynchroniser } from './ess'

let initialState = {
	_data: {},
	editableCells,
	sendEvents: false
}

const ess = new EventStoreSynchroniser()

function reducer(state=initialState,action) {
	let newState = state
	switch(action.type) {
		case actionTypes.SEND_EVENTS: {	newState = {...state, sendEvents: true}; break;	}
		case actionTypes.LOAD_FROM_CONFIG: { newState = DataManagement.LOAD_FROM_CONFIG(state,action,reducer); break; }
		case actionTypes.LOAD_DATA_DEVELOPMENT: { newState = DataManagement.LOAD_DATA_DEVELOPMENT(state,action,reducer); break; }		

		case actionTypes.ADD_ROW: { newState = Interactions.ADD_ROW(state,action,reducer); break; }
		case actionTypes.DELETE_SINGLE: { newState = Interactions.DELETE_SINGLE(state,action,reducer); break; }
		case actionTypes.DELETE_BUBBLE: { newState = Interactions.DELETE_BUBBLE(state,action,reducer); break; }
		case actionTypes.SAVE_TABLE: { newState = Interactions.SAVE_TABLE(state,action,reducer); break; }
		case actionTypes.TOGGLE_NODE: { newState = Interactions.TOGGLE_NODE(state,action,reducer); break; }	
		case actionTypes.BUBBLE_TRANSFORM: { newState = Interactions.BUBBLE_TRANSFORM(state,action,reducer); break; }

		case actionTypes.SET_ORIGINAL_COLOUR: { newState = ColourChanges.SET_ORIGINAL_COLOUR(state,action,reducer); break; }
		case actionTypes.SET_BUBBLE_SIDE_COLOUR: { newState = ColourChanges.SET_BUBBLE_SIDE_COLOUR(state,action,reducer); break; }

		case actionTypes.PERFORM_LINK: { newState = BubbleLinks.PERFORM_LINK(state,action,reducer); break; }
		case actionTypes.PERFORM_ASSOCIATION: { newState = BubbleLinks.PERFORM_ASSOCIATION(state,action,reducer); break; }
		case actionTypes.ADD_CHILD_LINK: { newState = BubbleLinks.ADD_CHILD_LINK(state,action,reducer); break; }
		case actionTypes.ADD_PARENT_LINK :{ newState = BubbleLinks.ADD_PARENT_LINK(state,action,reducer); break; }
		case actionTypes.ADD_CHILD_ASSOCIATION: { newState = BubbleLinks.ADD_CHILD_ASSOCIATION(state,action,reducer); break; }
		case actionTypes.ADD_PARENT_ASSOCIATION: { newState = BubbleLinks.ADD_PARENT_ASSOCIATION(state,action,reducer); break; }
		case actionTypes.UNLINK_PARENT_BUBBLE: { newState = BubbleLinks.UNLINK_PARENT_BUBBLE(state,action,reducer); break; }
		case actionTypes.UNLINK_PARENT_ASSOCIATED_BUBBLE: { newState = BubbleLinks.UNLINK_PARENT_ASSOCIATED_BUBBLE(state,action,reducer); break; }

		default: { break; }
	}
	const ACTUALLY_SEND_TO_DB = false
	if (newState.sendEvents && newState.development_token) {
		ess.sendToDB(newState.development_token,newState,ACTUALLY_SEND_TO_DB)
		newState = {...newState, sendEvents: false}
	};
	return newState
}

export default reducer

import { treeStructure, data, columnsInfo, cellTypes, editableCells } from './config'
import { getDisplayedTreeStructure } from './functions'
import * as actionTypes from './actionTypes';

const parentNodes = ["_1235d","_m7ad1"];

const initialState = reducer({
	columnsInfo,
	cellTypes,
	editableCells,
	parentNodes: parentNodes,
	displayedTreeStructure: [],
	displayedData: {},
	tree: Object.keys(treeStructure).reduce((total, nodeKey)=>{return {...total,[nodeKey]:{...treeStructure[nodeKey], open: false}}},{})
}, { type: actionTypes.UPDATE_DATA });

function reducer(state=initialState,action) {
	switch(action.type) {
		case actionTypes.TOGGLE_NODE: {
			const updatedState = { ...state,
				tree: {...state.tree,
					[action.nodeKey]:{...state.tree[action.nodeKey],
						open: !state.tree[action.nodeKey].open
					}
				}
			};
			return reducer(updatedState, { type: actionTypes.UPDATE_DATA });
		}

		case actionTypes.UPDATE_DATA: {
			const displayedTreeStructure = getDisplayedTreeStructure(state.tree, state.parentNodes);
			const dataToDisplay = {}
			for (let i = 0; i < displayedTreeStructure.length; i++) {
				dataToDisplay[displayedTreeStructure[i].key] = data[displayedTreeStructure[i].key];
			}
			return {
				...state,
				displayedTreeStructure: displayedTreeStructure,
				displayedData: dataToDisplay,

			}; 
		}
		default:
			return state;
	}
	
}

//display rows that have no parents. ASSUME THIS LIST EXISTS FOR NOW. cycle through those and add child rows.

export default reducer

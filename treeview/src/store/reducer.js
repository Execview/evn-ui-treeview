import { columnsInfo, cellTypes, editableCells, data } from './config'
import { getDisplayedTreeStructure, getDiffs, EventStoreSynchroniser, getParentNodes } from './functions'
import * as actionTypes from './actionTypes';
import {bubbleCopy, objectCopierWithStringToDate} from '../bubbleCopy'
import tryReturnValidTransformState from './stateValidator'

const crypto = require('crypto');

const hash = crypto.createHash('sha256');

let initialState = {
	_data: {},
	cellTypes,
	editableCells,
	displayedTreeStructure: [],
	displayedData: {},
	token: ''
}

const ess = new EventStoreSynchroniser()

function reducer(state=initialState,action) {
	switch(action.type) {
		case "loadFromConfig": {return reducer(initialState,{type:actionTypes.LOAD_DATA});}

		case actionTypes.TOGGLE_NODE: {
			const updatedState = { ...state,
				_data: {...state._data,
					[action.nodeKey]:{...state._data[action.nodeKey],
						open: !state._data[action.nodeKey].open
					}
				}
			};
			return reducer(updatedState, { type: actionTypes.UPDATE_DATA, sendEvents: true});
		}

		// startdate: new Date(new Date().toDateString()),
		// enddate: new Date(new Date(new Date().setDate((new Date()).getDate() + 2)).toDateString()),


		case actionTypes.ADD_ROW: {
			const newId = '_' + hash.update(Date.now() + Math.random().toString()).digest('hex').substring(0, 5);
			const tempTitle = 'Untitled Activity';
			const colors = ['Blue','Red', 'Green', 'Yellow', 'Purple'];
			const colorIndex = Math.floor((Math.random() * 5));
			const newRow = {
					startdate: new Date('2018-12-26'),
					enddate: new Date('2018-12-28'),
					colours: {left: colors[colorIndex], middle: colors[colorIndex], right: colors[colorIndex], original: colors[colorIndex]},
					ChildAssociatedBubbles:[],
					ParentAssociatedBubble: '',
					ChildBubbles: {},
					ParentBubble: '',
					open:true,
					activityTitle: tempTitle,
					progress: 'amber'
			};
			const newState =  {
				...state,
				_data: {
					...state._data,
					[newId] : newRow
				},
				editableCells: {
					...state.editableCells,
					[newId]: action.columns
				}
			};
			return reducer(newState,{type:actionTypes.UPDATE_DATA})
		}

		case actionTypes.SAVE_TABLE: {
			const tableRowValues = Object.keys(state._data[action.rowId]).reduce((total,col)=>{return {...total,[col]:action.rowValues[col]}},{})
			let newRowValues = objectCopierWithStringToDate(tableRowValues)
			let newState = {...state,
				editableCells: {
					...state.editableCells,
					[action.rowId]: action.editableValues
				}
			};
			let changeObject = getDiffs(state._data[action.rowId],newRowValues)


			return reducer(newState,{type:actionTypes.BUBBLE_TRANSFORM, key: action.rowId, changes: changeObject})
		}
		case actionTypes.LOAD_DATA: {
			let translateddata = data;
			translateddata = action.data
			// translateddata = data
			let newData = objectCopierWithStringToDate(translateddata)
			newData = Object.keys(newData).reduce((total,el)=>{return {...total,[el]:{...newData[el],colours:{left:newData[el].colour,right:newData[el].colour,middle:newData[el].colour,original:newData[el].colour}}}},{})

			let newState = {...state, _data:newData, token:action.token, editableCells:action.editableCells}

			Object.keys(newState._data).forEach(bubblekey=>{
				newState = reducer(newState,{type: actionTypes.SET_ORIGINAL_COLOUR, key:bubblekey, side: 'left'})
				newState = reducer(newState,{type: actionTypes.SET_ORIGINAL_COLOUR, key:bubblekey, side: 'middle'})
				newState = reducer(newState,{type: actionTypes.SET_ORIGINAL_COLOUR, key:bubblekey, side: 'right'})
			})

			// newData = Object.keys(newData).reduce((total,el)=>{return {...total,[el]:{...newData[el],colour:null}}},{})
			// ess.sendToDB(state.token,newState) //This just sets the initial state for the EventStoreSynchroniser
			return reducer(newState,{type:actionTypes.UPDATE_DATA, sendEvents: true})
		}
		case actionTypes.UPDATE_DATA: {
			if (action.sendEvents) {
				ess.sendToDB(state.token,state);
			}

			let newState = {...state}
			const displayedTreeStructure = getDisplayedTreeStructure(newState._data, getParentNodes(newState._data));
			const dataToDisplay = {}
			for (let i = 0; i < displayedTreeStructure.length; i++) {
				dataToDisplay[displayedTreeStructure[i].key] = newState._data[displayedTreeStructure[i].key];
			}

			newState = {
				...newState,
				displayedTreeStructure: displayedTreeStructure,
				displayedData: dataToDisplay,
			};
			return newState
		}

		case actionTypes.BUBBLE_TRANSFORM: {
			let newState = {...state}
			//apply transformation to a copy of bubble states. If valid, replace the main state.
			var oldBubbles = {}
			for (var bubblekey in newState._data){
				var bubble=newState._data[bubblekey]
				oldBubbles[bubblekey]=bubbleCopy(bubble)
			}
			if(JSON.stringify(newState._data[action.key])!==JSON.stringify({...newState._data[action.key],...action.changes})){
				//newState = {...newState, _data: {...state._data,[action.key]:{...newState._data[action.key],...action.changes}}}
				var newStateBubbles = tryReturnValidTransformState(oldBubbles,action);
				if(newStateBubbles!==false){
					newState = {
						...newState,
						_data: newStateBubbles
					}
					return reducer(newState,{type:actionTypes.UPDATE_DATA, sendEvents:true });
				}
				else { return state }
			}
			return state
		}

		case actionTypes.SET_ORIGINAL_COLOUR: {
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

		case actionTypes.SET_BUBBLE_SIDE_COLOUR: {
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

		case actionTypes.PERFORM_LINK: {
			console.log("performing link")
			if((action.parentside === 'left' || action.parentside === 'right') && action.childkey!==action.parentkey){
				var finalstate = {...state}
				var parentpoint = 'right'===action.parentside ? "enddate" : "startdate"
				var childpoint = 'right'===action.childside ? "enddate" : "startdate"
				// if child doesnt have parent AND parent hasnt already linked child
				//TODO MORE IFS BECAUSE OF ASSOCIATION!
				if((state._data[action.childkey]["ParentBubble"]==='')&&(state._data[action.parentkey]["ChildBubbles"][action.childkey]==null)){
					var xGapDate = state._data[action.childkey][childpoint]-state._data[action.parentkey][parentpoint];
					finalstate = reducer(finalstate,{type:actionTypes.ADD_CHILD_LINK,parentkey:action.parentkey,childkey:action.childkey,parentside:action.parentside,childside:action.childside,xGapDate:xGapDate})
					finalstate = reducer(finalstate,{type:actionTypes.ADD_PARENT_LINK,childkey:action.childkey,parentkey:action.parentkey})
					return reducer(finalstate,{type:actionTypes.UPDATE_DATA, sendEvents:true});
				} else {
					console.log('already linked!');
					return state
				}
			}
			return state;
		}

		case actionTypes.ADD_CHILD_LINK: {
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

		case actionTypes.ADD_PARENT_LINK :{
			return {
				...state,
				_data: {...state._data,
						[action.childkey]:{...state._data[action.childkey],
									ParentBubble: action.parentkey
									}
					}
			}
	}

		case actionTypes.PERFORM_ASSOCIATION: {
			let finalstate = {...state}
			if((action.childkey!==action.parentkey)&& action.childkey &&(!state._data[action.parentkey]["ChildAssociatedBubbles"].includes(action.childkey))){
				finalstate = reducer(finalstate,{type: actionTypes.UNLINK_PARENT_ASSOCIATED_BUBBLE, key:action.childkey })
				finalstate = reducer(finalstate,{type: actionTypes.ADD_CHILD_ASSOCIATION,parentkey:action.parentkey,childkey:action.childkey})
				finalstate = reducer(finalstate,{type: actionTypes.ADD_PARENT_ASSOCIATION,childkey:action.childkey,parentkey:action.parentkey})
				return reducer(finalstate,{type:actionTypes.UPDATE_DATA, sendEvents: true});
			}
			return state
		}

		case actionTypes.ADD_CHILD_ASSOCIATION: {
			return {
				...state,
				_data: {...state._data,
					[action.parentkey]:{...state._data[action.parentkey],
						ChildAssociatedBubbles:[...state._data[action.parentkey]["ChildAssociatedBubbles"], action.childkey],
					}
				}
			}
		}
		case actionTypes.ADD_PARENT_ASSOCIATION: {
			return {
				...state,
				_data: {...state._data,
					[action.childkey]:{...state._data[action.childkey],
						ParentAssociatedBubble: action.parentkey
						}
					}
			}
		}

		case actionTypes.UNLINK_PARENT_ASSOCIATED_BUBBLE: {
		var newState = {...state}
		var parentAssociatedBubbleKey = newState._data[action.key].ParentAssociatedBubble
		if(parentAssociatedBubbleKey){
			//remove ParentAssociatedBubble property value
			newState = {...newState,
				_data: {...newState._data,
								[action.key]:{...newState._data[action.key],
												ParentAssociatedBubble:''}}}
			//remove ChildBubble property from the parent
			console.log(parentAssociatedBubbleKey)
			console.log(newState._data)
			const ChildIndex = newState._data[parentAssociatedBubbleKey]["ChildAssociatedBubbles"].indexOf(action.key)
			var newChildAssociatedBubbles = [...newState._data[parentAssociatedBubbleKey].ChildAssociatedBubbles]
			newChildAssociatedBubbles.splice(ChildIndex,1)
			console.log(ChildIndex)
			newState = { ...newState,
				_data: {...newState._data,
					[parentAssociatedBubbleKey]:{...newState._data[parentAssociatedBubbleKey],
						ChildAssociatedBubbles:newChildAssociatedBubbles
					}
				}
			}
			reducer(newState,{type:actionTypes.UPDATE_DATA, sendEvents: true });

		}
		return newState
	}


		default:
			return state;
	}

}

export default reducer

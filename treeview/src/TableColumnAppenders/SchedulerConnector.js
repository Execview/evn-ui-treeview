import React from 'react';
import SchedulerAppender from './SchedulerAppender';
import { connect } from 'react-redux';
import * as actionTypes from '../store/actions/actionTypes';

const SchedulerConnector = (props) => {
	return (
		<SchedulerAppender 
			{...props}
		/>
	);
}

const mapStateToProps = state => {
	return {
	}
}

const mapDispatchToProps = dispatch => {
	return {
		tryBubbleTransform: (key,changes,editableValues,sendChanges) => dispatch({type: actionTypes.TRY_BUBBLE_TRANSFORM, key, changes,editableValues, sendChanges}),
		setBubbleSideColour: (key,colour,side) => dispatch({type: actionTypes.SET_BUBBLE_SIDE_COLOUR, key:key, colour:colour, side:side}),
		setOriginalColour: (key,side) => dispatch({type: actionTypes.SET_ORIGINAL_COLOUR, key:key, side:side}),  
		tryPerformLink: (childkey,parentkey,childside,parentside) => dispatch({type: actionTypes.TRY_PERFORM_LINK,parentkey,childkey,parentside,childside}),
		tryPerformAssociation: (parentkey,childkey) => dispatch({type: actionTypes.TRY_PERFORM_ASSOCIATION,childkey,parentkey}),
		onRemoveLink: (key) => dispatch({type: actionTypes.UNLINK_PARENT_BUBBLE, key}),
		deleteBubble: (key) => dispatch({type: actionTypes.DELETE_BUBBLE, key}),
		clearChanges: () => dispatch({type: actionTypes.CLEAR_CHANGES}),
		sendChanges: (changes) => dispatch({type: actionTypes.SEND_CHANGES, itemChanges:changes})
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(SchedulerConnector);
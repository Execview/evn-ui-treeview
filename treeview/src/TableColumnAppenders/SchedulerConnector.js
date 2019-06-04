import React, { Component } from 'react';
import { connect } from 'react-redux';
import SchedulerAppender from './SchedulerAppender';
import * as actionTypes from '../store/actions/actionTypes';

class SchedulerConnector extends Component {
  	render() {
    	return (
			<SchedulerAppender 
				{...this.props}
			/>
		);
  	}
}

const mapStateToProps = state => {
	return {
	}
}

const mapDispatchToProps = dispatch => {
	return {
		tryBubbleTransform: (key,changes,editableValues) => dispatch({type: actionTypes.TRY_BUBBLE_TRANSFORM, key, changes,editableValues}),
		setBubbleSideColour: (key,colour,side) => dispatch({type: actionTypes.SET_BUBBLE_SIDE_COLOUR, key:key, colour:colour, side:side}),
		setOriginalColour: (key,side) => dispatch({type: actionTypes.SET_ORIGINAL_COLOUR, key:key, side:side}),  
		tryPerformLink: (childkey,parentkey,childside,parentside) => dispatch({type: actionTypes.TRY_PERFORM_LINK,parentkey,childkey,parentside,childside}),
		tryPerformAssociation: (parentkey,childkey) => dispatch({type: actionTypes.TRY_PERFORM_ASSOCIATION,childkey,parentkey}),
		onRemoveLink: (key) => dispatch({type: actionTypes.UNLINK_PARENT_BUBBLE, key}),
		deleteSingle: (key) => dispatch({type: actionTypes.DELETE_SINGLE, key}),
		deleteBubble: (key) => dispatch({type: actionTypes.DELETE_BUBBLE, key}),
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(SchedulerConnector);
import React, { Component } from 'react';
import SchedulerAppender from './SchedulerAppender';
import * as actionTypes from '../store/actionTypes';
import { connect } from 'react-redux';

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
		bubbleTransform: (key,changes) => dispatch({type: actionTypes.BUBBLE_TRANSFORM ,key:key, changes:changes}),
		setBubbleSideColour: (key,colour,side) => dispatch({type: actionTypes.SET_BUBBLE_SIDE_COLOUR, key:key, colour:colour, side:side}),
		setOriginalColour: (key,side) => dispatch({type: actionTypes.SET_ORIGINAL_COLOUR, key:key, side:side}),  
		tryToPerformLink: (childkey,parentkey,childside,parentside) => dispatch({type: actionTypes.PERFORM_LINK, parentkey:parentkey,childkey:childkey,parentside:parentside,childside:childside}),
		tryToPerformAssociation: (parentkey,childkey) => dispatch({type: actionTypes.PERFORM_ASSOCIATION, childkey:childkey,parentkey:parentkey}),  
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(SchedulerConnector);
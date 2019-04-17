import React, { Component } from 'react';
import TreeAppender from './TreeAppender';
import { connect } from 'react-redux';
import * as actionTypes from '../store/actions/actionTypes'


class TreeConector extends Component {
	
  	render() {
    	return (
		<TreeAppender
			{...this.props}
		/>
		);
  	}
}

const mapStateToProps = state => {
	return {
        displayedTreeStructure: state.displayedTreeStructure
	}
}

const mapDispatchToProps = dispatch => {
	return {
        onToggleNode: (nodeKey) => dispatch({ type: actionTypes.TOGGLE_NODE, nodeKey })
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TreeConector);
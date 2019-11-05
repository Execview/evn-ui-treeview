import React from 'react';
import TreeAppender from './TreeAppender';
import { connect } from 'react-redux';
import * as actionTypes from '../store/actions/actionTypes'

const TreeConector = (props) => {
	return (
		<TreeAppender
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
        onToggleNode: (nodeKey) => dispatch({ type: actionTypes.TOGGLE_NODE, nodeKey })
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TreeConector);
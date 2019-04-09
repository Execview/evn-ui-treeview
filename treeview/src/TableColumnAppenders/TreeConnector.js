import React, { Component } from 'react';
import TreeAppender from './TreeAppender';
import { connect } from 'react-redux';
import * as actionTypes from '../store/actionTypes'


class TreeConector extends Component {
	
  	render() {
    	return (
			<div>
				<TreeAppender
					{...this.props}
					onToggleNode={this.props.onToggleNode}
					displayedTreeStructure={this.props.displayedTreeStructure}
				/>
			</div>
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
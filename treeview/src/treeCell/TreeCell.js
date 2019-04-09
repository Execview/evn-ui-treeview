import React, { Component } from 'react';

class TreeCell extends Component {	
  	render() {
		let arrow = <i className="fas fa-caret-down" style={{width:'10px', opacity:'0'}}/>;

		// var closestElement = element.closest(selectors); 

		let showPointerStyle = {};
		if (this.props.data.nodeStatus === 'open') {
			arrow = <i className="fas fa-caret-down" style={{width:'10px'}}/>
			showPointerStyle = {cursor: 'pointer'};
		} else if (this.props.data.nodeStatus === 'closed') {
			arrow = <i className="fas fa-caret-right" style={{width:'10px'}}/>
			showPointerStyle = {cursor: 'pointer'};
		}
    	return (
			<div className="cell-container" onClick={this.props.data.toggleNode} style={showPointerStyle}>
				<div style={this.props.style} className="cell-text">										
					<p className="tree-text" style={{marginLeft: 5 + 20 * this.props.data.depth}}>{arrow} {this.props.data.text}</p>					
				</div>
			</div>
		);
  	}
}

export default TreeCell;

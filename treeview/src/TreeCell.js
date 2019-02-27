import React, { Component } from 'react';

class TreeCell extends Component {	
  	render() {
		let arrow = <i className="fas fa-caret-down" style={{width:'10px', opacity:'0'}}/>;
		if (this.props.data.nodeStatus === 'open') {
			arrow = <i className="fas fa-caret-down" style={{width:'10px'}}/>
		} else if (this.props.data.nodeStatus === 'closed') {
			arrow = <i className="fas fa-caret-right" style={{width:'10px'}}/>
		}
    	return (
			<div className="cell-container">
				<div style={this.props.style} onClick={this.props.data.toggleNode} className="cell-text">										
					<p className="tree-text" style={{marginLeft: 5 + 20 * this.props.data.depth}}>{arrow} {this.props.data.text}</p>					
				</div>
			</div>
		);
  	}
}

export default TreeCell;

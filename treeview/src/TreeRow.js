import React, { Component } from 'react';

class TreeRow extends Component {
  	render() {
		let arrow = <div className="arrow-container" onClick={this.props.toggleNode}> </div>;
		if (this.props.nodeStatus === 'open') {
			arrow = <div className="arrow-container" onClick={this.props.toggleNode}><i className="fas fa-caret-down"></i></div>
		} else if (this.props.nodeStatus === 'closed') {
			arrow = <div className="arrow-container" onClick={this.props.toggleNode}><i className="fas fa-caret-right"></i></div>
		}
    	return (
			<tr>
				<td style={{paddingLeft: 20 * this.props.depth}}>
					{arrow}
					{this.props.rowData.activityTitle}
				</td>
			</tr>
		);
  	}
}

export default TreeRow;

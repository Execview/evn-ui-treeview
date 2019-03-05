import React, { Component } from 'react';
import Bubble from './TEMP-SCHEDULER/components/Bubble'

class SchedulerCell extends Component {	
	cellHeight = 40;
  	render() {
		const bubbleX = {start:50,end:300}
    	return (
			<div className="cell-container">
				<svg height={this.cellHeight} width='100%'>
					<Bubble
					startpoint={[bubbleX.start,0]}
					endpoint={[bubbleX.end,this.cellHeight]}
					colour={'rgb(190,230,240)'}
					leftcolour={'rgb(190,230,240)'}
					rightcolour={'rgb(190,230,240)'}
					middleclickdown={this.props.data.middleclickdown}
					text={this.props.data.text}
					/>
				</svg>
			</div>
		);
  	}
}

export default SchedulerCell;

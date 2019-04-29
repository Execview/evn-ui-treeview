import React, { Component } from 'react';
import Bubble from './Bubble';
import './SchedulerCell.css';

class SchedulerCell extends Component {	
  	render() {
		const touchAction = this.props.data.shadow ? 'none' : 'pan-y'
    	return (
			<div className="cell-container" style={{touchAction:touchAction, userSelect: 'none'}}>
				<svg onPointerDown={this.props.data.mouseOnScheduler} style={{position:'absolute', height:'100%', width: '100%', filter: this.props.data.shadow?"drop-shadow(-2px -2px 13px "+this.props.data.colour+")":""}}>
					<Bubble
						{...this.props.data}
					/>
				</svg>
			</div>
		);
  	}
}

export default SchedulerCell;

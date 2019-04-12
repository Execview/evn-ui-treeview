import React, { Component } from 'react';
import SchedulerOverlay from './SchedulerOverlay'

class SchedulerHeader extends Component {
  	render() {
		let days = this.props.data.snaps.map((snap,index)=>{return <tspan alignmentBaseline="middle" key={index} x={snap[1]} y={'50%'}>{snap[0].getDate()+"/"+(snap[0].getMonth()+1)}</tspan>})
    	return (
			<div className="header-cell no-select" style={{width:this.props.style.width, touchAction: 'pan-y' }} onPointerDown={this.props.data.mouseOnScheduler}>
				<svg height='100%' width='100%'>
					<text style={{fill:'white'}} >{days}</text>
				</svg>
				<SchedulerOverlay tableHeight={this.props.data.tableHeight} links={this.props.data.links}/>		
			</div>
		);
  	}
	
	componentDidMount(){
		this.props.data.getWidth && this.props.data.getWidth(this.props.style.width)
	}
	componentDidUpdate(){
		this.props.data.getWidth && this.props.data.getWidth(this.props.style.width)
	}
}

export default SchedulerHeader;
